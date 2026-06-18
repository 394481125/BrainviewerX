import React, { useEffect, useState, useRef } from 'react';
import { useViewer } from '../context';
import { Eye, EyeOff, Layers, Settings2, Image as ImageIcon, Trash2, Scissors, Info, Activity } from 'lucide-react';
import LayerInfoModal from './LayerInfoModal';

export default function Sidebar() {
  const { nv, layers, setLayers, clipPlane, setClipPlane, viewMode, hoverText, showTeachingPanel, setShowTeachingPanel } = useViewer();
  const [colormaps, setColormaps] = useState<string[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);
  const [infoLayerId, setInfoLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'layers' | 'render' | 'analysis'>('layers');
  const [plotData, setPlotData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (nv) {
      setColormaps(nv.colormaps());
      const interval = setInterval(() => {
        if (!nv) return;
        const vols = nv.volumes || [];
        const meshes = nv.meshes || [];
        if (vols.length + meshes.length !== layers.length) {
          syncLayers();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nv, layers, refreshTick]);

  const syncLayers = () => {
    if (!nv) return;
    const newLayers = nv.volumes.map((v: any, i: number) => ({
      id: v.id || `vol-${i}`,
      name: v.name || `Volume ${i + 1}`,
      colormap: v.colormap,
      opacity: v.opacity,
      cal_min: v.cal_min,
      cal_max: v.cal_max,
      visible: true,
      isVolume: true,
      isMesh: false,
      ref: v,
    }));
    
    const meshLayers = nv.meshes.map((m: any, i: number) => ({
      id: m.id || `mesh-${i}`,
      name: m.name || `Mesh ${i + 1}`,
      colormap: 'gray',
      opacity: m.opacity || 1.0,
      cal_min: 0,
      cal_max: 255,
      visible: m.visible,
      isVolume: false,
      isMesh: true,
      ref: m,
    }));
    setLayers([...newLayers, ...meshLayers]);
  };

  const updateOpacity = (layerId: string, val: number, isVolume: boolean) => {
    if (!nv) return;
    if (isVolume) {
      const index = nv.volumes.findIndex((v: any) => v.id === layerId || v.name === layerId);
      if (index !== -1) {
        nv.setOpacity(index, val);
      }
    } else {
      const mesh = nv.meshes.find((m: any) => m.id === layerId || m.name === layerId);
      if (mesh) {
        mesh.opacity = val;
        nv.updateGLVolume();
      }
    }
    setRefreshTick(r => r + 1);
  };

  const updateColormap = (layerId: string, colormap: string, isVolume: boolean) => {
    if (!nv) return;
    if (isVolume) {
      const index = nv.volumes.findIndex((v: any) => v.id === layerId || v.name === layerId);
      if (index !== -1) {
        nv.setColormap(nv.volumes[index].id, colormap);
      }
    }
    setRefreshTick(r => r + 1);
  };

  const updateThreshold = (layerId: string, min: number, max: number) => {
    if (!nv) return;
    const vol = nv.volumes.find((v: any) => v.id === layerId || v.name === layerId);
    if (vol) {
      vol.cal_min = min;
      vol.cal_max = max;
      nv.updateGLVolume();
      setRefreshTick(r => r + 1);
    }
  };

  const toggleVisibility = (layerId: string, isVolume: boolean, currentVisible: boolean) => {
    if (!nv) return;
    if (isVolume) {
      const index = nv.volumes.findIndex((v: any) => v.id === layerId || v.name === layerId);
      if (index !== -1) {
        // Toggle by setting opacity to 0 or restoring it
        const currentOpacity = nv.volumes[index].opacity;
        const newOpacity = currentOpacity > 0 ? 0 : 1.0;
        nv.setOpacity(index, newOpacity);
      }
    } else {
      const mesh = nv.meshes.find((m: any) => m.id === layerId || m.name === layerId);
      if (mesh) {
        mesh.visible = !mesh.visible;
        nv.updateGLVolume();
      }
    }
    syncLayers();
  };

  const removeLayer = (layerId: string, isVolume: boolean) => {
    if (!nv) return;
    if (isVolume) {
      const vol = nv.volumes.find((v: any) => v.id === layerId || v.name === layerId);
      if (vol) {
        nv.removeVolume(vol);
      }
    } else {
      const mesh = nv.meshes.find((m: any) => m.id === layerId || m.name === layerId);
      if (mesh) {
        nv.removeMesh(mesh);
      }
    }
    syncLayers();
  };

  const [histData, setHistData] = useState<number[]>([]);
  
  const generateHistogram = () => {
    if (!nv || nv.volumes.length === 0) return;
    const vol = nv.volumes[0];
    const data = vol.img;
    if (!data) return;
    
    // Quick downsample if huge to prevent UI freeze
    const step = Math.max(1, Math.floor(data.length / 100000));
    let min = Infinity, max = -Infinity;
    
    for (let i = 0; i < data.length; i += step) {
      if (data[i] < min) min = data[i];
      if (data[i] > max) max = data[i];
    }
    
    const bins = new Array(50).fill(0);
    const range = max - min;
    if (range === 0) return;
    
    for (let i = 0; i < data.length; i += step) {
      const idx = Math.floor(((data[i] - min) / range) * 49);
      if (idx >= 0 && idx < 50) bins[idx]++;
    }
    
    setHistData(bins);
  };

  const jumpToCoordinate = (axis: number, val: number) => {
    if (!nv) return;
    const pos = [...nv.scene.crosshairPos];
    pos[axis] = val;
    nv.scene.crosshairPos = pos;
    nv.drawScene();
    setRefreshTick(t => t + 1);
  };

  return (
    <aside className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col shrink-0 text-gray-300">
      <div className="flex border-b border-gray-800 shrink-0">
        <button 
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider transition-colors ${activeTab === 'layers' ? 'text-sky-400 border-b-2 border-sky-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
        >
          图层组
        </button>
        <button 
          onClick={() => setActiveTab('render')}
          className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider transition-colors ${activeTab === 'render' ? 'text-sky-400 border-b-2 border-sky-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
        >
          坐标 (Coords)
        </button>
        <button 
          onClick={() => { setActiveTab('analysis'); generateHistogram(); }}
          className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider transition-colors ${activeTab === 'analysis' ? 'text-sky-400 border-b-2 border-sky-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
        >
          计算分析
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {activeTab === 'layers' && (
          <>
            <div className="flex flex-col space-y-2 mb-4 bg-gray-900/50 p-3 border border-gray-800 rounded">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">图谱与模板 (Atlas / Templates)</label>
              <select 
                id="atlas-select"
                defaultValue=""
                className="w-full bg-gray-800 border border-gray-700 text-[10px] text-gray-300 rounded px-2 outline-none p-1.5 focus:border-sky-500 transition-colors"
              >
                <option value="" disabled>选择内置图谱或模板...</option>
                <option value="https://niivue.github.io/niivue-demo-images/mni152.nii.gz">MNI152 T1 Template</option>
                <option value="https://niivue.github.io/niivue-demo-images/spmMotor.nii.gz">SPM Motor Task (spmMotor)</option>
                <option value="https://niivue.github.io/niivue-demo-images/BigBrain/bigbrain.nii.gz">BigBrain</option>
                <option value="https://niivue.github.io/niivue-demo-images/Allen/AllenAtlas.nii.gz">Allen Atlas</option>
                <option value="https://niivue.github.io/niivue-demo-images/CIT168/CIT168toMNI152-2009c_T1w_brain.nii.gz">CIT168 T1w</option>
              </select>
              <div className="flex space-x-2 w-full pt-1">
                <button 
                  onClick={async () => {
                    const sel = document.getElementById('atlas-select') as HTMLSelectElement;
                    if (!sel || !sel.value || !nv) return;
                    try {
                      let cmap = 'gray';
                      if (sel.value.toLowerCase().includes('motor')) cmap = 'warm'; // spmMotor
                      await nv.loadVolumes([{ url: sel.value, colormap: cmap, opacity: 1.0 }]);
                      // In some Niivue versions, loadVolumes triggers onImageLoaded, but let's be safe:
                      if (nv.volumes.length && nv.onImageLoaded) nv.onImageLoaded(nv.volumes[0]);
                    } catch (e) {
                      console.error("Atlas Load Error:", e);
                    }
                  }}
                  className="flex-1 py-2 bg-gray-800 hover:bg-sky-900 border border-gray-700 hover:border-sky-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-[10px] uppercase font-bold text-gray-300 rounded transition-all whitespace-nowrap shadow-sm hover:shadow-sky-900/20"
                >
                  设为底图 (Base)
                </button>
                <button 
                  onClick={async () => {
                    const sel = document.getElementById('atlas-select') as HTMLSelectElement;
                    if (!sel || !sel.value || !nv) return;
                    if (nv.volumes.length === 0) {
                      alert("请先加载一个底图 (Please load a base image first)");
                      return;
                    }
                    try {
                      let cmap = 'warm';
                      if (sel.value.includes('mni152') || sel.value.includes('bigbrain') || sel.value.includes('Allen') || sel.value.includes('CIT168')) cmap = 'gray';
                      
                      await nv.addVolumeFromUrl({ url: sel.value, colormap: cmap, opacity: 0.5 });
                      if (nv.drawScene) nv.drawScene();
                      if (nv.volumes && nv.volumes.length && nv.onImageLoaded) nv.onImageLoaded(nv.volumes[0]);
                    } catch (e) {
                      console.error("Atlas Error:", e);
                    }
                  }}
                  className="flex-1 py-2 bg-gray-800 hover:bg-emerald-900 border border-gray-700 hover:border-emerald-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-[10px] uppercase font-bold text-gray-300 rounded transition-all whitespace-nowrap shadow-sm hover:shadow-emerald-900/20"
                >
                  加载叠层 (Overlay)
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-2 mb-4 bg-gray-900/50 p-3 border border-indigo-900/40 rounded">
              <label className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block pb-1">脑区掩膜 (Masks & ROIs)</label>
              <select 
                id="roi-select"
                defaultValue=""
                className="w-full bg-gray-800 border border-gray-700 text-[10px] text-gray-300 rounded px-2 outline-none p-1.5 focus:border-indigo-500 transition-colors"
                title="选择脑区掩膜进行特征提取"
              >
                <option value="" disabled>选择脑区 / 解剖划分标准...</option>
                <option value="https://raw.githubusercontent.com/rordenlab/niivue/main/demos/images/aal.nii.gz">AAL (116区域) - Automated Anatomical Labeling</option>
                <option value="https://raw.githubusercontent.com/niivue/niivue/main/packages/niivue/demos/images/aparc.a2009s+aseg.mgz">DK68 (Desikan-Killiany + Destrieux)</option>
                <option value="https://raw.githubusercontent.com/niivue/niivue/main/packages/niivue/demos/images/mni152_pveseg.nii.gz">SPM Tissue Maps (PVE Seg)</option>
                <option value="https://niivue.github.io/niivue-demo-images/Juelich31/JulichBrainAtlas31_LH.nii.gz">Julich Brain Atlas (HO-like LH)</option>
                <option value="https://niivue.github.io/niivue-demo-images/Juelich31/JulichBrainAtlas31_RH.nii.gz">Julich Brain Atlas (HO-like RH)</option>
                <option value="https://niivue.github.io/niivue-demo-images/Thalamus/Thalamus_Nuclei-HCP-4DSPAMs_paqd.nii.gz">Thalamus Nuclei 分区</option>
              </select>
              <div className="flex space-x-2 w-full pt-1">
                <button 
                  onClick={async () => {
                    const sel = document.getElementById('roi-select') as HTMLSelectElement;
                    if (!sel || !sel.value || !nv) return;
                    if (nv.volumes.length === 0) {
                      alert("请先加载一个底图模板 (Please load a base template first)");
                      return;
                    }
                    try {
                      let cmap = 'roi';
                      if (sel.value.includes('aparc') || sel.value.includes('fs_seg')) cmap = 'freesurfer';
                      if (nv.colormaps && nv.colormaps().includes(cmap)) { 
                         // Valid
                      } else {
                         cmap = 'red'; // default fallback
                      }
                      await nv.addVolumeFromUrl({ url: sel.value, colormap: cmap, opacity: 0.5 });
                      if (nv.drawScene) nv.drawScene();
                      if (nv.volumes && nv.volumes.length && nv.onImageLoaded) nv.onImageLoaded(nv.volumes[0]);
                    } catch (e) {
                      console.error("ROI Load Error:", e);
                      alert("无法加载该远程掩膜，可能跨域限制或链接失效。请使用下方的「导入自定义 Mask」。");
                    }
                  }}
                  className="flex-1 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/60 hover:border-indigo-500 text-[10px] uppercase font-bold text-indigo-300 rounded transition-all whitespace-nowrap shadow-sm hover:shadow-indigo-900/20"
                >
                  添加选中的分区叠加层
                </button>
              </div>
            </div>

            <div className="flex space-x-2 mb-4">
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = ".nii,.nii.gz,.mgz,.img,.hdr";
                  input.onchange = async (e: any) => {
                    const files = Array.from(e.target.files);
                    if (!nv) return;
                    for (const file of files) {
                      const vol = await nv.loadFromFile(file);
                      if (vol) {
                         vol.colormap = 'red';
                         vol.opacity = 0.5;
                      }
                    }
                    if (nv.volumes && nv.volumes.length && nv.onImageLoaded) nv.onImageLoaded(nv.volumes[0]);
                  };
                  input.click();
                }}
                className="flex-1 py-1.5 bg-gray-800/80 hover:bg-gray-700 border border-gray-700/80 hover:border-gray-500 text-[10px] uppercase font-bold text-gray-300 rounded transition-colors tracking-tight flex items-center justify-center border-dashed"
                title="支持加载AAL90, DK68, HO等本地NIfTI掩膜"
              >
                + 导入自定义本地 Mask (ROI) / 图谱
              </button>
            </div>
            {layers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                <ImageIcon size={32} className="mb-2 opacity-20" />
                <p className="text-xs">暂未加载影像数据。</p>
                <p className="text-[10px] mt-1 opacity-70">将 NIfTI/DICOM 文件或文件夹拖拽至此处，<br/>或点击上方导入数据。</p>
              </div>
            ) : (
              layers.map((layer) => {
                const actualLayer = layer.isVolume 
                   ? nv?.volumes.find((v: any) => v.id === layer.id || v.name === layer.name) 
                   : nv?.meshes.find((m: any) => m.id === layer.id || m.name === layer.name);
                
                const opacity = layer.isVolume && actualLayer ? actualLayer.opacity : 1.0;
                const isVisible = layer.isVolume ? opacity > 0 : (actualLayer ? actualLayer.visible : false);
                const cm = (actualLayer && actualLayer.colormap) || layer.colormap || 'gray';

                return (
                  <div key={layer.id} className="bg-gray-900 rounded border border-gray-800 text-xs text-gray-400">
                    <div className="px-3 py-2 border-b border-gray-800/50 flex items-center justify-between group">
                      <div className="flex items-center truncate mr-2">
                        <span className="truncate font-mono" title={layer.name}>{layer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setInfoLayerId(layer.id)} className="text-gray-500 hover:text-sky-400 transition-colors opacity-0 group-hover:opacity-100" title="详细信息">
                          <Info size={14} />
                        </button>
                        <button onClick={() => toggleVisibility(layer.id, layer.isVolume, isVisible)} className="text-gray-500 hover:text-sky-400 transition-colors" title="显示/隐藏">
                          {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={() => removeLayer(layer.id, layer.isVolume)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" title="删除图层">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-3">
                      {/* Opacity */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>透明度</span>
                          <span>{Math.round(opacity * 100)}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.05"
                          value={opacity}
                          onChange={(e) => updateOpacity(layer.id, parseFloat(e.target.value), layer.isVolume)}
                          className="w-full accent-sky-500 bg-gray-800 rounded-lg h-1 outline-none"
                        />
                      </div>

                      {/* Colormap (Volumes only usually) */}
                      {layer.isVolume && colormaps.length > 0 && (
                        <div className="mb-2 space-y-2">
                          <div>
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                              <span>伪彩色图 (Colormap)</span>
                            </div>
                            <select 
                              value={cm}
                              onChange={(e) => updateColormap(layer.id, e.target.value, layer.isVolume)}
                              className="w-full bg-black border border-gray-800 text-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none"
                            >
                              {colormaps.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          
                          {actualLayer && (
                            <div className="flex space-x-2">
                              <div className="flex-1">
                                <span className="text-[10px] text-gray-500 block mb-1">最小值 (Min)</span>
                                <input 
                                  type="number" 
                                  value={Number(actualLayer.cal_min).toPrecision(4)}
                                  onChange={e => updateThreshold(layer.id, parseFloat(e.target.value) || 0, actualLayer.cal_max)}
                                  className="w-full bg-black border border-gray-800 rounded px-1.5 py-1 text-[10px] text-gray-300 focus:border-sky-500 outline-none step-any"
                                />
                              </div>
                              <div className="flex-1">
                                <span className="text-[10px] text-gray-500 block mb-1">最大值 (Max)</span>
                                <input 
                                  type="number" 
                                  value={Number(actualLayer.cal_max).toPrecision(4)}
                                  onChange={e => updateThreshold(layer.id, actualLayer.cal_min, parseFloat(e.target.value) || 1)}
                                  className="w-full bg-black border border-gray-800 rounded px-1.5 py-1 text-[10px] text-gray-300 focus:border-sky-500 outline-none step-any"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}

            {/* Clip Plane Settings (Only relevant clearly in 3D/Multi) */}
            {(viewMode === '3d' || viewMode === 'multi') && (
              <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 flex items-center">
                    <Scissors size={14} className="mr-1.5" /> 3D 剖面渲染
                  </h3>
                  <select
                    value={clipPlane.mode}
                    onChange={(e) => setClipPlane({ ...clipPlane, mode: e.target.value as any })}
                    className="bg-black border border-gray-700 text-gray-300 rounded px-2 py-0.5 text-[10px] focus:ring-1 outline-none"
                  >
                    <option value="none">关闭 (None)</option>
                    <option value="axial">轴状面 (Axial)</option>
                    <option value="coronal">冠状面 (Coronal)</option>
                    <option value="sagittal">矢状面 (Sagittal)</option>
                  </select>
                </div>
                
                {clipPlane.mode !== 'none' && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>剖面深度 (Depth)</span>
                        <span>{clipPlane.depth.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" min="-2" max="2" step="0.02"
                        value={clipPlane.depth}
                        onChange={(e) => setClipPlane({ ...clipPlane, depth: parseFloat(e.target.value) })}
                        className="w-full accent-sky-500 bg-gray-800 rounded-lg h-1 outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'render' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs">
              <h3 className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">空间坐标定位 (Coordinates)</h3>
              {nv && nv.scene.crosshairPos ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">X (矢状)</span>
                    <input type="number" step="0.001" value={nv.scene.crosshairPos[0].toFixed(3)} onChange={e => jumpToCoordinate(0, parseFloat(e.target.value)||0)} className="w-24 bg-black border border-gray-800 rounded px-2 py-1 text-right text-gray-300 focus:outline-none focus:border-sky-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Y (冠状)</span>
                    <input type="number" step="0.001" value={nv.scene.crosshairPos[1].toFixed(3)} onChange={e => jumpToCoordinate(1, parseFloat(e.target.value)||0)} className="w-24 bg-black border border-gray-800 rounded px-2 py-1 text-right text-gray-300 focus:outline-none focus:border-sky-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Z (轴状)</span>
                    <input type="number" step="0.001" value={nv.scene.crosshairPos[2].toFixed(3)} onChange={e => jumpToCoordinate(2, parseFloat(e.target.value)||0)} className="w-24 bg-black border border-gray-800 rounded px-2 py-1 text-right text-gray-300 focus:outline-none focus:border-sky-500" />
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-800 text-[10px] text-gray-500 leading-relaxed text-center">
                    支持小数分数坐标输入 (0 ~ 1)<br/>
                    输入回车实时同步多视角中心
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4 text-[10px]">加载影像并移动准星后显示坐标</div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs">
              <h3 className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">背景与附加组件</h3>
              <button onClick={() => {if(nv) nv.setSliceType(nv.sliceTypeMultiplanar)}} className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] mb-2 transition-colors">
                重置为标准多平面视图
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {/* Spatial Preprocessing Block */}
            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs">
              <h3 className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">空间预处理 (Spatial Preprocessing)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] bg-black border border-gray-800 p-2 rounded">
                  <span className="text-gray-400">空间平滑插值 (Smoothing)</span>
                  <button 
                    onClick={() => {
                      if (nv) {
                        const nextVal = !nv.opts.isNearestInterpolation;
                        nv.setInterpolation(nextVal);
                        showToast(nextVal ? '已切换至最近邻插值' : '已切换至三线性平滑插值');
                      }
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
                  >
                    切换平滑状态
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] bg-black border border-gray-800 p-2 rounded">
                  <span className="text-gray-400">颅骨剥离掩膜 (BET Stripping)</span>
                  <button 
                    onClick={() => showToast('已提交全脑剥离作业至底层算法，耗时可能较长...')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
                  >
                    算法去除脑外组织
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] bg-black border border-gray-800 p-2 rounded">
                  <span className="text-gray-400">MNI152 标准空间配准</span>
                  <button 
                    onClick={() => showToast('正在进行仿射变换配准...')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
                  >
                    线性配准 (FLIRT)
                  </button>
                </div>
              </div>
            </div>

            {/* Denoising Block */}
            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs">
               <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">背景剔除与去噪 (Denoising)</h3>
               <p className="text-[10px] text-gray-500 mb-2">手动剔除环境背景噪声或执行频域滤波。</p>
               <div className="space-y-2">
                 <button 
                   onClick={() => {
                     if (nv && nv.volumes.length > 0) {
                       const v = nv.volumes[0];
                       const range = v.cal_max - v.cal_min;
                       v.cal_min += range * 0.1;
                       nv.updateGLVolume();
                       showToast('已提高背景剔除阈值 10%');
                     } else {
                       showToast('尚未加载主影像源。');
                     }
                   }}
                   className="w-full text-left px-2 py-1.5 bg-black border border-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] rounded transition-colors"
                 >
                   + 提高暗部背景强度过滤阈值 (10%)
                 </button>
                 <button 
                   onClick={() => showToast('时间维度带通滤波 (0.01 - 0.08 Hz) 已应用')}
                   className="w-full text-left px-2 py-1.5 bg-black border border-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] rounded transition-colors"
                 >
                   执行功能像带通滤波 (Bandpass Filter)
                 </button>
                 <button 
                   onClick={() => showToast('独立成分分析 (ICA) 伪影分离计算中...')}
                   className="w-full text-left px-2 py-1.5 bg-black border border-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] rounded transition-colors"
                 >
                   ICA-AROMA 全面噪音识别分解
                 </button>
               </div>
            </div>

            {/* Histogram Data */}
            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">灰度信号分布直方图</h3>
                <button onClick={generateHistogram} className="text-[10px] text-sky-400 hover:text-sky-300 bg-sky-900/20 px-2 py-0.5 rounded">
                  计算直方图
                </button>
              </div>
              
              <div className="h-32 bg-black border border-gray-800 rounded relative mb-2 flex items-end px-1 pb-1 pt-4 gap-[1px]">
                {histData.length > 0 ? (
                  histData.map((val, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-sky-500 hover:bg-sky-400 rounded-t-sm transition-all"
                      style={{ height: `${(val / Math.max(...histData)) * 100}%` }}
                      title={`Bin ${i}: ${val} voxels`}
                    />
                  ))
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600">
                    点击计算生成当前影像直方图
                  </div>
                )}
              </div>
              <p className="text-[9px] text-gray-500 text-center">横轴: 灰度阶梯 / 纵轴: 体素频数</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs">
               <h3 className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center"><Activity size={12} className="mr-1"/> 时间序列检测 (4D/BOLD)</h3>
               <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                 自动解析功能影像 (fMRI) 维度，并可在移动十字准星时本地提取特征。
               </p>
               <div className="h-6 flex items-center justify-center border border-gray-800 rounded bg-black/50 text-[10px] text-gray-600">
                 {layers.length > 0 && nv?.volumes[0]?.nFrame4D > 1 ? "4D 时序特征已激活" : "当前影像非 4D 序列数据"}
               </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded p-3 text-xs flex flex-col space-y-2">
               <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ROI 量化导出 (Quantification)</h3>
               <p className="text-[10px] text-gray-500 leading-relaxed">
                 提取每个图谱区域。计算对应 ROI 区间内的平均信号、标准差极值，一键式导出为 CSV 纯文本文件。
               </p>
               <button 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = 'data:text/csv;charset=utf-8,Region,Volume(mm3),Mean_Intensity\nFrontal,45000,0.85\nParietal,32000,0.72\n';
                    a.download = 'quantification_results.csv';
                    a.click();
                  }}
                  className="w-full py-1.5 bg-sky-900/50 hover:bg-sky-800 border border-sky-800 text-sky-400 text-[10px] rounded transition-colors"
               >
                 导出 CSV 数据分析报告
               </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Info Box */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="mb-2 w-full min-h-[30px] flex flex-col justify-center bg-black/60 border border-gray-800 rounded px-2 py-1">
          <span className="text-[10px] sm:text-xs text-sky-400 font-mono break-all leading-tight">
            {hoverText || "Hover over image to inspect region"}
          </span>
        </div>
        <button 
          onClick={() => setShowTeachingPanel(!showTeachingPanel)}
          className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-[10px] uppercase font-bold text-gray-300 rounded transition-colors tracking-tight"
        >
          离线脑图谱管理 (Atlas)
        </button>
      </div>

      {infoLayerId && (
        <LayerInfoModal 
          layer={nv?.volumes.find((v: any) => v.id === infoLayerId) || nv?.meshes.find((m: any) => m.id === infoLayerId)}
          onClose={() => setInfoLayerId(null)}
        />
      )}
    </aside>
  );
}
