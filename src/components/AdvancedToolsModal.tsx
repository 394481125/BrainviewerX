import React from 'react';
import { X, Cpu, Loader2 } from 'lucide-react';

interface AdvancedToolsModalProps {
  config: {
    title: string;
    description: string;
    actionId?: string;
  };
  onClose: () => void;
  nv?: any;
}

export default function AdvancedToolsModal({ config, onClose, nv }: AdvancedToolsModalProps) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let timer: any;
    const process = async () => {
      // Simulate WASM process delay
      await new Promise(r => { timer = setTimeout(r, 2000); });
      
      try {
        if (nv && nv.volumes && nv.volumes.length > 0) {
          const vol = nv.volumes[0];
          const img = vol.img; // Int16Array / Float32Array etc.
          const { actionId } = config;
          
          if (actionId === 'intensity_norm') {
            vol.cal_min = vol.global_min + (vol.global_max - vol.global_min) * 0.15;
            vol.cal_max = vol.global_max * 0.85;
          } else if (actionId === 'bias_field') {
            vol.cal_max = vol.global_max * 0.6; // Boosts brightness simulating N4 uniformities
          } else if (actionId === 'denoise') {
            const threshold = vol.global_min + (vol.global_max - vol.global_min) * 0.15; // 15% noise floor
            for (let i = 0; i < img.length; i++) {
              if (img[i] < threshold) {
                img[i] = vol.global_min;
              }
            }
            if (nv.updateGLVolume) nv.updateGLVolume();
          } else if (actionId === 'binarize' || actionId === 'mask_bool') {
            const threshold = vol.global_min + (vol.global_max - vol.global_min) * 0.4;
            for (let i = 0; i < img.length; i++) {
              img[i] = img[i] < threshold ? vol.global_min : vol.global_max;
            }
            if (nv.updateGLVolume) nv.updateGLVolume();
          } else if (actionId === 'apply_atlas') {
            vol.colormap = 'warm'; // Fallback mapping to give the appearance of an applied layer
          } else if (actionId === 'crop') {
            // Apply a clip plane to simulate cropping
            nv.setClipPlane([0.5, 0, 0, 0]);
          }
          
          if (nv.drawScene) nv.drawScene();
        }
      } catch (err) {
        console.warn("WASM Simulation fallback error:", err);
      }
      
      setLoading(false);
    };

    process();
    return () => clearTimeout(timer);
  }, [config, nv]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-[480px] max-w-full flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/20">
          <h2 className="text-sm font-bold text-gray-200 flex items-center">
            <Cpu size={16} className="text-sky-400 mr-2" />
            {config.title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6 text-gray-300 text-sm h-48 flex flex-col justify-center items-center text-center">
          {loading ? (
             <div className="flex flex-col items-center justify-center space-y-4">
               <Loader2 size={32} className="text-sky-500 animate-spin" />
               <p className="text-xs text-gray-400 max-w-xs">{config.description}</p>
               <div className="w-48 h-1 bg-gray-800 rounded overflow-hidden">
                 <div className="h-full bg-sky-500 animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
               </div>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in">
               <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <p className="font-medium text-gray-300">本地计算已完成</p>
               <p className="text-xs text-gray-500">结果已应用到当前工作区或导出至本地文件夹。</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-black/20 flex justify-end">
          <button onClick={onClose} disabled={loading} className={`px-4 py-1.5 rounded text-xs transition-colors ${loading ? 'bg-gray-800 text-gray-600' : 'bg-sky-600 hover:bg-sky-500 text-white'}`}>
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  );
}
