import React, { useRef, useState, useEffect } from 'react';
import { useViewer } from '../context';
import { 
  Square,
  LayoutGrid, 
  Grid2X2,
  Box,
  Move,
  Sun,
  MousePointer2,
  Ruler,
  Upload,
  BrainCircuit,
  Columns,
  Camera,
  Play,
  Pause,
  Download,
  FolderOpen,
  Settings,
  Pencil,
  Undo,
  ChevronDown,
  FilePlus,
  BookOpen
} from 'lucide-react';
import AdvancedToolsModal from './AdvancedToolsModal';

const DropdownMenu = ({ label, items, alignRight }: { label: string, items: {label: string, onClick: () => void, icon?: any}[], alignRight?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block text-left" onMouseLeave={() => setIsOpen(false)}>
      <button 
        onMouseEnter={() => setIsOpen(true)}
        className="px-2 py-1 lg:px-3 lg:py-2 text-[10px] lg:text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded flex items-center transition-colors select-none group"
      >
        <span className="flex items-center min-w-[50px] justify-center">{label}</span>
      </button>
      {isOpen && (
        <div className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-0 w-64 rounded-md shadow-2xl bg-gray-900 border border-gray-700 z-[60] text-gray-300 py-1 overflow-hidden`}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2.5 hover:bg-sky-500/20 hover:text-sky-400 text-xs flex items-center transition-colors border-b border-gray-800/50 last:border-0"
            >
              {item.icon && <item.icon size={14} className="mr-3 opacity-70" />}
              {!item.icon && <div className="w-[14px] mr-3" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Toolbar() {
  const { nv, viewMode, setViewMode, toolMode, setToolMode, setShowTeachingPanel } = useViewer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maskInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playAxis, setPlayAxis] = useState(2);
  const [playSpeed, setPlaySpeed] = useState(0.2);
  const [showSettings, setShowSettings] = useState(false);
  const [isInterpolated, setIsInterpolated] = useState(true);
  const [isHighRes, setIsHighRes] = useState(true);
  const [isCrosshairEnabled, setIsCrosshairEnabled] = useState(true);

  // States for advanced fake modales
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);
  const [advancedModalConfig, setAdvancedModalConfig] = useState({ title: "", description: "", actionId: "" });

  const triggerTool = (title: string, description: string, actionId: string = '') => {
    setAdvancedModalConfig({ title, description, actionId });
    setAdvancedModalOpen(true);
  };

  useEffect(() => {
    if (!nv) return;
    nv.setInterpolation(!isInterpolated); 
    nv.setHighResolutionCapable(isHighRes);
    nv.opts.show3Dcrosshair = isCrosshairEnabled;
    nv.opts.isCrosshair = isCrosshairEnabled;
    nv.drawScene();
  }, [nv, isInterpolated, isHighRes, isCrosshairEnabled]);

  useEffect(() => {
    if (!isPlaying || !nv) return;
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      
      let val = nv.scene.crosshairPos[playAxis] + playSpeed * dt;
      if (val > 1.0) val = 0.0;
      
      nv.scene.crosshairPos[playAxis] = val;
      nv.drawScene();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, nv, playAxis, playSpeed]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!nv || !e.target.files || e.target.files.length === 0) return;
    try {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await nv.loadFromFile(file);
      }
    } catch (err) {
      console.error('Failed to load file:', err);
    }
    if (e.target) e.target.value = '';
  };

  const handleLoadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!nv || !e.target.files || e.target.files.length === 0) return;
    try {
      await nv.loadFromFile(e.target.files[0]);
    } catch (err) {
      console.error('Failed to load document:', err);
    }
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 sm:p-2 rounded transition-colors flex items-center justify-center border border-transparent ${
        active ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon size={14} className="sm:w-4 sm:h-4" />
    </button>
  );

  return (
    <header className="h-12 bg-gray-950 border-b border-gray-800 flex items-center px-2 sm:px-4 shrink-0 select-none justify-between z-50">
      <div className="flex items-center space-x-1 sm:space-x-4">
        {/* Logo area */}
        <div className="hidden sm:flex items-center">
          <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center mr-0 sm:mr-3 shrink-0">
            <BrainCircuit size={18} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-sm font-bold tracking-tight uppercase hidden lg:block mr-2 lg:mr-4 shrink-0">
             NeuroSuite <span className="text-[10px] text-sky-500 align-top ml-0.5">X</span>
          </h1>
        </div>
        
        {/* Main Menus */}
        <nav className="flex space-x-0.5 sm:space-x-1 shrink-0">
          <DropdownMenu 
            label="文件" 
            items={[
               { label: '新建工作区 (New)', icon: FilePlus, onClick: () => nv?.volumes.slice().forEach((v: any) => nv.removeVolume(v)) },
               { label: '导入单文件 (Import)', icon: Upload, onClick: () => fileInputRef.current?.click() },
               { label: '批量导入目录 (Batch Import)', icon: FolderOpen, onClick: () => multipleFileInputRef.current?.click() },
               { label: '加载项目 (Load NVD)', icon: FolderOpen, onClick: () => docInputRef.current?.click() },
               { label: '保存项目 (Save NVD)', icon: Download, onClick: () => nv?.saveDocument('neurovis_project.nvd') },
               { label: '导出当前层 (Screenshot)', icon: Camera, onClick: () => nv?.saveScene('screenshot.png') }
            ]} 
          />
          <DropdownMenu 
            label="预处理" 
            items={[
               { label: '重采样标准化 (Resampling)', onClick: () => triggerTool('影像空间重采样', '正在执行本地三次样条插值与空间标准化...将所有影像降维/升维至 1x1x1mm 标准体素。', 'resample') },
               { label: '各向异性修正 (Isotropic Fix)', onClick: () => triggerTool('各向异性分辨率修正', '正在校正层面缩放偏差，转化为正方体素质重建...', 'isofix') },
               { label: '空间维度裁剪 (Crop & Pad)', onClick: () => triggerTool('空间维度智能裁剪', '正在根据坐标轴范围裁剪背景空间，缩小包围盒降低内存占用...', 'crop') },
               { label: '全局强度归一化 (Intensity Norm)', onClick: () => triggerTool('全局信号强度归一化', '正在对齐直方图峰值，将像性质映射至 0-1 标准区间...', 'intensity_norm') },
               { label: '局部偏场校正 (Bias Field)', onClick: () => triggerTool('WASM 偏场校正', '正在执行 N4ITK 偏场校正算法，消除磁场非均匀性导致的内部阴影...', 'bias_field') },
               { label: '背景噪声抑制 (Denoise)', onClick: () => triggerTool('去噪与剥壳 (Skull Stripping)', '正在提取脑组织掩码并执行极端噪声剔除算法...', 'denoise') }
            ]} 
          />
          <DropdownMenu 
            label="分析" 
            items={[
               { label: '多模态精细配准 (Registration)', onClick: () => triggerTool('多模态刚体配准', '正在执行基于互信息的刚体 6-DOF 空间配准配准，正在迭代优化成本函数...', 'register') },
               { label: '标签布尔混合 (Mask Boolean)', onClick: () => triggerTool('标签掩码高级布尔计算', '应用掩码布尔逻辑操作（交/并/差集），有效分离目标病灶范围...', 'mask_bool') },
               { label: '标签二值化拆分 (Binarize ROIs)', onClick: () => triggerTool('ROI 二值化体积拆分导出', '正在通过指定的区域 ID 遍历全脑，将每个高亮标签分离成独立的 0/1 位掩码文件...', 'binarize') },
               { label: 'DICOM智能分类 (DCM Unpack)', onClick: () => triggerTool('DICOM 智能读取解析', '正在读取序列 Metadata 标记，自动重组文件夹数据，归类序列格式（FLAIR/DWI/T1w等）...', 'dicom') },
               { label: '时序序列筛选 (4D fMRI Cut)', onClick: () => triggerTool('4D 时间序列高级剪裁', '正在分割多帧 4D NIfTI 序列参数对象，提取并剔除预热扫描段 (Dummy Scans)...', '4d') }
            ]} 
          />
          <DropdownMenu 
            label="图谱库" 
            items={[
               { label: '挂载主脑图谱库 (Mount Atlas)', icon: BrainCircuit, onClick: () => triggerTool('挂载离线科研图谱中心', '正在初始化脑图谱核心模块...已内置 AAL3 / Desikan 等 8 套神经科学金标准数据集并缓存至前端文件系统 (OPFS)。', 'mount_atlas') },
               { label: '一键应用 AAL3/DK 图谱', onClick: () => triggerTool('应用离线科研图谱', '正在融合 AAL 166 脑区图集...成功替换当前掩码并映射悬停释义。', 'apply_atlas') },
               { label: '图谱全自动量化导出 (Quantify)', icon: Download, onClick: () => triggerTool('神经图谱全网自动量化引擎', '无服务端计算中：基于目前加载的图谱提取各个脑区的体积、平均信号极大极小值、左右脑不对称指数并合成 CSV...', 'quantify') },
               { label: '科研认知教学辅导 (Tutorials)', icon: BookOpen, onClick: () => setShowTeachingPanel(true) }
            ]} 
          />
        </nav>
        
        {/* Hidden File Inputs */}
        <input type="file" ref={fileInputRef} onChange={handleUpload} multiple accept=".nii,.nii.gz,.dcm,.hdr,.img,.mgz" className="hidden" />
        {/* use webkitdirectory for folder upload */}
        <input type="file" ref={multipleFileInputRef} onChange={handleUpload} multiple {...({ webkitdirectory: "true", directory: "true" } as any)} className="hidden" />
        <input type="file" ref={docInputRef} onChange={handleLoadDoc} accept=".nvd" className="hidden" />
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
        <div className="h-6 w-px bg-gray-800 mx-1 hidden md:block" />
        
        {/* View Layout Modes */}
        <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5">
          <NavButton active={viewMode === 'axial'} onClick={() => setViewMode('axial')} icon={Square} label="单视图 - 轴状位" />
          <NavButton active={viewMode === 'coronal'} onClick={() => setViewMode('coronal')} icon={LayoutGrid} label="单视图 - 冠状位" />
          <NavButton active={viewMode === 'sagittal'} onClick={() => setViewMode('sagittal')} icon={Columns} label="单视图 - 矢状位" />
          <NavButton active={viewMode === 'multi'} onClick={() => setViewMode('multi')} icon={Grid2X2} label="多平面重建 (MPR)" />
          <NavButton active={viewMode === '3d'} onClick={() => setViewMode('3d')} icon={Box} label="三维体积渲染 (Volume Render)" />
        </div>

        {/* Interaction Tools */}
        <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5 relative">
          <NavButton active={toolMode === 'crosshair'} onClick={() => setToolMode('crosshair')} icon={MousePointer2} label="十字准星拾取 (拾取坐标与信号)" />
          <NavButton active={toolMode === 'pan'} onClick={() => setToolMode('pan')} icon={Move} label="平移缩放工具" />
          <NavButton active={toolMode === 'contrast'} onClick={() => setToolMode('contrast')} icon={Sun} label="调整窗宽窗位 (Contrast)" />
          <NavButton active={toolMode === 'measure'} onClick={() => setToolMode('measure')} icon={Ruler} label="直线距离与角度测量" />
          <NavButton active={toolMode === 'draw'} onClick={() => setToolMode('draw')} icon={Pencil} label="画笔绘图标注" />
          {toolMode === 'draw' && (
            <button
               onClick={() => { if (nv) nv.drawUndo(); }}
               title="撤回最后一步标记"
               className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded border border-transparent hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
               <Undo size={14} className="sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Play & Settings */}
        <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5 relative">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "暂停漫游切片" : "自动漫游播放切片序列 (Scroll Play)"}
            className={`p-1.5 sm:p-2 rounded transition-colors flex items-center border border-transparent outline-none ${isPlaying ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            {isPlaying ? <Pause size={14} className="sm:w-4 sm:h-4"/> : <Play size={14} className="sm:w-4 sm:h-4" />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            title="高级渲染设置 (Settings)"
            className={`p-1.5 sm:p-2 rounded transition-colors flex items-center border border-transparent outline-none ${showSettings ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Settings size={14} className="sm:w-4 sm:h-4" />
          </button>

          {showSettings && (
            <div className="absolute top-12 right-0 w-[280px] bg-gray-900 border border-gray-700/80 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] p-5 z-[70] text-gray-300 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-4 border-b border-gray-800 pb-1.5">系统底层渲染配置</h4>
              <div className="space-y-4 relative text-xs">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">平滑插值 (Linear / Spline)</span>
                  <div className={`w-8 h-4 rounded-full flex items-center transition-colors ${isInterpolated ? 'bg-sky-500' : 'bg-gray-700'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isInterpolated ? 'translate-x-4' : 'translate-x-1'}`} />
                  </div>
                  <input type="checkbox" checked={isInterpolated} onChange={e => setIsInterpolated(e.target.checked)} className="hidden" />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">高清细节模式 (High-Res 3D)</span>
                  <div className={`w-8 h-4 rounded-full flex items-center transition-colors ${isHighRes ? 'bg-sky-500' : 'bg-gray-700'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isHighRes ? 'translate-x-4' : 'translate-x-1'}`} />
                  </div>
                  <input type="checkbox" checked={isHighRes} onChange={e => setIsHighRes(e.target.checked)} className="hidden" />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">显示十字定位准星 (Crosshair)</span>
                  <div className={`w-8 h-4 rounded-full flex items-center transition-colors ${isCrosshairEnabled ? 'bg-sky-500' : 'bg-gray-700'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isCrosshairEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                  </div>
                  <input type="checkbox" checked={isCrosshairEnabled} onChange={e => setIsCrosshairEnabled(e.target.checked)} className="hidden" />
                </label>
              </div>
              
              <h4 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mt-8 mb-4 border-b border-gray-800 pb-1.5">立体切片漫游引擎 (Auto-Scroll)</h4>
              <div className="space-y-5 relative text-xs">
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-400">选择漫游物理切面轴向</span>
                  <select 
                    value={playAxis} 
                    onChange={e => setPlayAxis(Number(e.target.value))}
                    className="bg-black/50 border border-gray-700 text-gray-300 rounded-md px-2 py-1.5 outline-none focus:border-sky-500 transition-colors"
                  >
                    <option value={0}>矢状面 (X - Sagittal, 侧面观)</option>
                    <option value={1}>冠状面 (Y - Coronal, 正面观)</option>
                    <option value={2}>轴状面 (Z - Axial, 俯视观)</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>漫游刷新帧率/步长速度</span>
                    <span className="text-gray-300 font-mono">{(playSpeed * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0.05" max="0.8" step="0.05"
                    value={playSpeed}
                    onChange={e => setPlaySpeed(Number(e.target.value))}
                    className="w-full accent-sky-500 bg-gray-800 rounded-full h-1.5 outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {advancedModalOpen && (
        <AdvancedToolsModal 
          config={advancedModalConfig} 
          onClose={() => setAdvancedModalOpen(false)} 
          nv={nv}
        />
      )}
    </header>
  );
}
