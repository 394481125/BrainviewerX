import React, { useMemo } from 'react';
import { X, Info, Activity, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

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

  // Heuristic Preprocessing Analysis
  const analysis = useMemo(() => {
    const results = [];

    // 1. File Format
    let format = "未知 (Unknown)";
    const name = layer.name?.toLowerCase() || '';
    if (name.endsWith('.nii.gz')) format = "NIfTI 压缩格式 (.nii.gz)";
    else if (name.endsWith('.nii')) format = "NIfTI 标准格式 (.nii)";
    else if (name.endsWith('.mgz')) format = "FreeSurfer 格式 (.mgz)";
    else if (name.endsWith('.nrrd')) format = "NRRD 格式 (.nrrd)";
    
    results.push({ name: "文件格式 (File Format)", value: format, status: 'info' });

    // 2. Isotropic Voxel
    const p = hdr.pixDims || [1,1,1,1,1,1,1,1];
    const px = Math.abs(p[1]) || 1, py = Math.abs(p[2]) || 1, pz = Math.abs(p[3]) || 1;
    const isIsotropic = Math.abs(px - py) < 0.01 && Math.abs(px - pz) < 0.01;
    results.push({
      name: "体素各向同性重采样 (Isotropic Voxel)",
      value: isIsotropic ? `是 (${px.toFixed(2)} × ${py.toFixed(2)} × ${pz.toFixed(2)} mm)` : `否 (${px.toFixed(2)} × ${py.toFixed(2)} × ${pz.toFixed(2)} mm)`,
      status: isIsotropic ? 'pass' : 'warn'
    });

    // 3. Standard Registration
    const d = hdr.dims || [1,1,1,1];
    const dx = d[1], dy = d[2], dz = d[3];
    let isStandard = false;
    let template = "未发现典型匹配 (可能是 Native 空间)";
    if ((dx === 91 && dy === 109 && dz === 91) || (dx === 193 && dy === 229 && dz === 193) || (dx === 182 && dy === 218 && dz === 182)) {
      isStandard = true;
      template = "匹配 MNI152 标准空间特征矩阵";
    } else if (dx === 256 && dy === 256 && dz === 256) {
      isStandard = true;
      template = "匹配 FreeSurfer Conformed 空间特征";
    }

    results.push({
      name: "模板空间配准 (Standard Template Registration)",
      value: isStandard ? `是 (${template})` : `否 (${template})`,
      status: isStandard ? 'pass' : 'warn'
    });

    // 4. Intensity Normalization
    const cmin = layer.cal_min || 0;
    const cmax = layer.cal_max || 0;
    const isNormalized01 = (cmin >= -0.5 && cmax <= 1.5) && (cmax - cmin > 0);
    const isZScored = (cmin < -1 && cmax > 1 && Math.abs(cmin + cmax) < 10) && (cmax - cmin > 0);
    
    let normStr = "未检测到典型信号归一化区间 (Raw Intensity)";
    let normStatus = 'warn';
    if (Math.round(cmin) === 0 && Math.round(cmax) === 255) {
       normStr = "已量化 (8-bit 0-255)";
       normStatus = 'info';
    } else if (isNormalized01) {
       normStr = "疑似已做 0~1 强度范围归一化";
       normStatus = 'pass';
    } else if (isZScored) {
       normStr = "疑似 Z-score 统计标准化度量";
       normStatus = 'pass';
    }
    
    // Check if it's statistically discrete mask
    const isMask = [0, 1, 2, 3].includes(cmax - cmin) || name.includes("mask");
    if (isMask) {
      normStr = "二值化或离散 Label 图谱屏蔽区";
      normStatus = 'info';
    }

    results.push({
      name: "信号强度归一化 (Intensity Normalization)",
      value: normStr,
      status: normStatus
    });

    // 5. Skull Stripping (BET)
    let skullStripStr = isStandard ? "极可能已剥离 (伴随标准空间发现)" : (isMask ? "作为掩膜，不存在头皮" : "不确定 (非标准空间，依赖肉眼鉴别)");
    results.push({
      name: "脑组织提取/颅骨剥离 (Skull Stripping / BET)",
      value: skullStripStr,
      status: isStandard || isMask ? 'pass' : 'warn'
    });

    // 6. N4 Bias Field
    let n4Str = isStandard ? "极可能已校正 (常规预处理管线标准)" : "无法仅通过矩阵判定，需结合日志";
    results.push({
      name: "N4 偏置场校正 (Bias Field Correction)",
      value: n4Str,
      status: 'info'
    });

    return results;
  }, [layer, hdr]);

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'pass') return <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 min-w-[14px]" />;
    if (status === 'warn') return <AlertTriangle size={14} className="text-amber-400 mt-0.5 min-w-[14px]" />;
    return <HelpCircle size={14} className="text-sky-400 mt-0.5 min-w-[14px]" />;
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[600px] max-w-full m-4 max-h-[85vh] flex flex-col font-sans text-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold flex items-center">
            <Info size={16} className="mr-2 text-sky-400" />
            图层详细信息与预处理推断
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-5 text-xs font-mono">
          
          <div className="flex items-center text-gray-500 uppercase tracking-widest text-[10px] pb-1 border-b border-gray-800/50">
            <Activity size={12} className="mr-1.5" /> 智能预处理检测报告状态 (Heuristics)
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {analysis.map((item, idx) => (
              <div key={idx} className="bg-black/50 border border-gray-800 p-2.5 rounded flex items-start space-x-3">
                <StatusIcon status={item.status} />
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block mb-0.5">{item.name}</span>
                  <span className={`${item.status === 'warn' ? 'text-amber-300' : 'text-gray-300'}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center text-gray-500 uppercase tracking-widest text-[10px] pb-1 border-b border-gray-800/50 pt-2">
            原生维度矩阵 (Matrix)
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-2 rounded">
              <span className="text-gray-500 block mb-1">Dimensions (尺寸)</span>
              <span>{dims}</span>
            </div>
            <div className="bg-gray-800/50 p-2 rounded">
              <span className="text-gray-500 block mb-1">Voxel Sizes (体素大小)</span>
              <span>{pixDims}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500 uppercase tracking-widest text-[10px]">视觉渲染属性</h3>
            <div className="bg-gray-800/20 p-2 rounded border border-gray-800/50 flex flex-col space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">图层标识符 (ID)</span> <span>{layer.id || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">源文件名 (Name)</span> <span className="truncate max-w-[200px]">{layer.name || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">窗位下限 (Cal Min)</span> <span>{layer.cal_min?.toFixed(2) || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">窗位上限 (Cal Max)</span> <span>{layer.cal_max?.toFixed(2) || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">色彩映射表 (Colormap)</span> <span>{layer.colormap || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">不透明度 (Opacity)</span> <span>{layer.opacity?.toFixed(2) || 'N/A'}</span></div>
            </div>
          </div>
          
          {Object.keys(hdr).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-gray-500 uppercase tracking-widest text-[10px]">完整 Header 映射池 (NIfTI/MGZ)</h3>
              <div className="bg-gray-800/50 p-2 rounded overflow-x-auto border border-gray-800/50 h-40 overflow-y-auto custom-scrollbar">
                <pre className="text-[10px] leading-relaxed text-gray-400 whitespace-pre-wrap">
                  {JSON.stringify(hdr, (key, value) => {
                    // Truncate giant arrays
                    if (Array.isArray(value) && value.length > 32) return `[Array(${value.length})]`;
                    return value;
                  }, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
