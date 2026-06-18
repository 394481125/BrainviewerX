import React, { useEffect, useRef, useCallback } from 'react';
import { Niivue } from '@niivue/niivue';
import { useViewer } from '../context';

export default function NiivueCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInitialized = useRef(false);
  const { setNv, viewMode, toolMode, setLayers, setIsLoaded, nv, setHoverText } = useViewer();

  // Initialize NiiVue
  useEffect(() => {
    if (!canvasRef.current || isInitialized.current) return;
    isInitialized.current = true;

    const nvInstance = new Niivue({
      dragAndDropEnabled: true,
      backColor: [0, 0, 0, 1],
      isColorbar: true,
      show3Dcrosshair: true,
      clipPlaneColor: [1, 1, 1, 0.5],
      isClipAllVolumes: true,
      isClipPlanesCutaway: true,
    });

    // attachTo accepts the ID of the canvas
    nvInstance.attachTo('gl1');
    
    nvInstance.onLocationChange = (data: any) => {
      let rawString = data.string || "";
      const match = rawString.match(/=([\-\d\.]+)/);
      if (match && rawString.toLowerCase().includes('fs_seg')) {
        const val = parseInt(match[1]);
        const dict: Record<number, string> = {
          2: "左半球: 大脑白质 (Left Cerebral White Matter)",
          3: "左半球: 大脑皮层 (Left Cerebral Cortex)",
          4: "左半球: 侧脑室 (Left Lateral Ventricle)",
          10: "左半球: 丘脑 (Left Thalamus, Tha)",
          11: "左半球: 尾状核 (Left Caudate, Cau)",
          12: "左半球: 壳核 (Left Putamen, Put)",
          13: "左半球: 苍白球 (Left Pallidum, Pal)",
          17: "左半球: 海马 (Left Hippocampus, Hip)",
          18: "左半球: 杏仁核 (Left Amygdala, Amy)",
          41: "右半球: 大脑白质 (Right Cerebral White Matter)",
          42: "右半球: 大脑皮层 (Right Cerebral Cortex)",
          43: "右半球: 侧脑室 (Right Lateral Ventricle)",
          49: "右半球: 丘脑 (Right Thalamus, Tha)",
          50: "右半球: 尾状核 (Right Caudate, Cau)",
          51: "右半球: 壳核 (Right Putamen, Put)",
          52: "右半球: 苍白球 (Right Pallidum, Pal)",
          53: "右半球: 海马 (Right Hippocampus, Hip)",
          54: "右半球: 杏仁核 (Right Amygdala, Amy)",
        };
        const desc = dict[val];
        if (desc) {
          rawString += ` -> ${desc}`;
        }
      }
      setHoverText(rawString);
    };
    
    // Listen for image loads to update layers panel
    nvInstance.onImageLoaded = () => {
      setIsLoaded(true);
      const newLayers = nvInstance.volumes.map((v: any, i: number) => ({
        id: v.id || `vol-${i}`,
        name: v.name || `Volume ${i + 1}`,
        colormap: v.colormap,
        opacity: v.opacity,
        cal_min: v.cal_min,
        cal_max: v.cal_max,
        visible: true,
        isVolume: true,
        isMesh: false,
      }));
      
      const meshLayers = nvInstance.meshes.map((m: any, i: number) => ({
        id: m.id || `mesh-${i}`,
        name: m.name || `Mesh ${i + 1}`,
        colormap: 'gray',
        opacity: m.opacity || 1.0,
        cal_min: 0,
        cal_max: 255,
        visible: m.visible,
        isVolume: false,
        isMesh: true,
      }));

      setLayers([...newLayers, ...meshLayers]);
    };

    setNv(nvInstance);

    return () => {
      // Cleanup? niivue doesn't have a strict destroy method sometimes, just nullify
      setNv(null);
    };
  }, []);

  // Update view mode
  useEffect(() => {
    if (!nv) return;
    switch (viewMode) {
      case 'axial':
        nv.setSliceType(nv.sliceTypeAxial);
        break;
      case 'coronal':
        nv.setSliceType(nv.sliceTypeCoronal);
        break;
      case 'sagittal':
        nv.setSliceType(nv.sliceTypeSagittal);
        break;
      case 'multi':
        nv.setSliceType(nv.sliceTypeMultiplanar);
        break;
      case '3d':
        nv.setSliceType(nv.sliceTypeRender);
        break;
    }
  }, [nv, viewMode]);

  // Update tool mode
  useEffect(() => {
    if (!nv) return;
    
    // Reset defaults first
    nv.setDragMode(nv.dragModes.none);
    nv.setDrawingEnabled(false);
    
    switch (toolMode) {
      case 'pan':
        nv.setDragMode(nv.dragModes.pan);
        break;
      case 'contrast':
        nv.setDragMode(nv.dragModes.contrast);
        break;
      case 'measure':
        nv.setDragMode(nv.dragModes.measurement);
        break;
      case 'crosshair':
        nv.setDragMode(nv.dragModes.none);
        break;
      case 'draw':
        nv.setDrawingEnabled(true);
        nv.setPenValue(1, true); // id 1, solid color
        break;
    }
    nv.drawScene();
  }, [nv, toolMode]);

  // Handle window resize dynamically to fit parent precisely
  useEffect(() => {
    if (!nv || !canvasRef.current) return;
    const observer = new ResizeObserver(() => {
      nv.resizeListener();
    });
    
    if (canvasRef.current.parentElement) {
      observer.observe(canvasRef.current.parentElement);
    }
    
    return () => observer.disconnect();
  }, [nv]);

  const { clipPlane } = useViewer();

  // Apply Clip plane
  useEffect(() => {
    if (!nv) return;
    
    // Explicitly enforce that clipping affects all volumes and cuts away
    if (nv.opts) {
      nv.opts.isClipAllVolumes = true;
      nv.opts.isClipPlanesCutaway = true;
    }

    // ensure clip planes are enabled or disabled correctly.
    if (clipPlane.mode === 'none') {
      // disable clip planes
      nv.setClipPlane([2, 0, 0]); // depth = 2 is max distance? usually distance > bounds causes no clipping
    } else {
      let az = clipPlane.azimuth;
      let el = clipPlane.elevation;
      
      switch(clipPlane.mode) {
        case 'axial':
          el = 90; az = 0; break;
        case 'coronal':
          el = 0; az = 180; break; // depends on orientation, 180 or 0
        case 'sagittal':
          el = 0; az = 90; break;
      }
      
      nv.setClipPlane([clipPlane.depth, az, el]);
    }
    nv.drawScene();
  }, [nv, clipPlane]);

  return (
    <div className="w-full h-full relative bg-black no-select overflow-hidden flex flex-col items-center justify-center">
      <canvas id="gl1" ref={canvasRef} className="absolute inset-0 outline-none flex-1 max-h-full max-w-full" />
    </div>
  );
}
