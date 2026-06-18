export type ViewMode = 'axial' | 'coronal' | 'sagittal' | 'multi' | '3d';
export type ToolMode = 'pan' | 'contrast' | 'measure' | 'crosshair' | 'draw';

export interface Layer {
  id: string;
  name: string;
  colormap: string;
  opacity: number;
  cal_min: number;
  cal_max: number;
  visible: boolean;
  isVolume: boolean;
  isMesh: boolean;
}

export interface ClipPlaneConfig {
  mode: 'none' | 'axial' | 'coronal' | 'sagittal' | 'custom';
  depth: number;
  azimuth: number;
  elevation: number;
}

