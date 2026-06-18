import React from 'react';
import { X, Info } from 'lucide-react';

interface LayerInfoModalProps {
  layer: any;
  onClose: () => void;
}

export default function LayerInfoModal({ layer, onClose }: LayerInfoModalProps) {
  if (!layer) return null;

  const hdr = layer.hdr || {};
  
  // Format dims and pixdims
  const dims = hdr.dims ? `[${hdr.dims.join(', ')}]` : 'N/A';
  const pixDims = hdr.pixDims ? `[${hdr.pixDims.map((n: number) => n.toFixed(3)).join(', ')}]` : 'N/A';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[500px] max-w-full m-4 max-h-[80vh] flex flex-col font-sans text-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold flex items-center">
            <Info size={16} className="mr-2 text-sky-400" />
            图层详细信息 - {layer.name}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-2 rounded">
              <span className="text-gray-500 block mb-1">Dimensions (尺寸)</span>
              <span>{dims}</span>
            </div>
            <div className="bg-gray-800/50 p-2 rounded">
              <span className="text-gray-500 block mb-1">Voxel Sizes (体素大小/层厚)</span>
              <span>{pixDims}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500 uppercase tracking-widest text-[10px]">基础属性</h3>
            <div className="bg-gray-800/20 p-2 rounded border border-gray-800/50 flex flex-col space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">ID</span> <span>{layer.id || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">窗位下限 (Cal Min)</span> <span>{layer.cal_min?.toFixed(2) || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">窗位上限 (Cal Max)</span> <span>{layer.cal_max?.toFixed(2) || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">色彩映射表 (Colormap)</span> <span>{layer.colormap || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">不透明度 (Opacity)</span> <span>{layer.opacity?.toFixed(2) || 'N/A'}</span></div>
            </div>
          </div>
          
          {Object.keys(hdr).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-gray-500 uppercase tracking-widest text-[10px]">Header 信息</h3>
              <div className="bg-gray-800/50 p-2 rounded overflow-x-auto border border-gray-800/50 h-48 overflow-y-auto">
                <pre className="text-[10px] leading-relaxed text-gray-400 whitespace-pre-wrap">
                  {JSON.stringify(hdr, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
