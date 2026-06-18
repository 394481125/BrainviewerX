import { createContext, useContext, useState, ReactNode } from 'react';
import { Niivue } from '@niivue/niivue';
import { ViewMode, ToolMode, Layer, ClipPlaneConfig } from './types';

interface ViewerContextType {
  nv: Niivue | null;
  setNv: (nv: Niivue | null) => void;
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  clipPlane: ClipPlaneConfig;
  setClipPlane: (config: ClipPlaneConfig) => void;
  hoverText: string;
  setHoverText: (text: string) => void;
  showTeachingPanel: boolean;
  setShowTeachingPanel: (show: boolean) => void;
}

const ViewerContext = createContext<ViewerContextType | undefined>(undefined);

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [nv, setNv] = useState<Niivue | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('multi');
  const [toolMode, setToolMode] = useState<ToolMode>('crosshair');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [showTeachingPanel, setShowTeachingPanel] = useState(false);
  const [clipPlane, setClipPlane] = useState<ClipPlaneConfig>({
    mode: 'none',
    depth: 1, // typically 1 to 2? or 0 to 2? We'll test with 0 to 2.
    azimuth: 0,
    elevation: 0
  });

  return (
    <ViewerContext.Provider value={{
      nv, setNv,
      layers, setLayers,
      viewMode, setViewMode,
      toolMode, setToolMode,
      isLoaded, setIsLoaded,
      clipPlane, setClipPlane,
      hoverText, setHoverText,
      showTeachingPanel, setShowTeachingPanel
    }}>
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }
  return context;
}
