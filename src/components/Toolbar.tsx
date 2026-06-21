import React, { useRef, useState, useEffect } from "react";
import { useViewer } from "../context";
import {
  normalizeMinMax,
  normalizeZScore,
  applyThresholdMean,
  invertImage,
  calculateROIStats,
  boxBlur3D,
} from "../lib/imageProcessing";
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
  BookOpen,
} from "lucide-react";

const DropdownMenu = ({
  label,
  items,
  alignRight,
}: {
  label: string;
  items: { label: string; onClick: () => void; icon?: any }[];
  alignRight?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="relative inline-block text-left"
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="px-2 py-1 lg:px-3 lg:py-2 text-[10px] lg:text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded flex items-center transition-colors select-none group"
      >
        <span className="flex items-center min-w-[50px] justify-center">
          {label}
        </span>
      </button>
      {isOpen && (
        <div
          className={`absolute ${alignRight ? "right-0" : "left-0"} top-full mt-0 w-64 rounded-md shadow-2xl bg-gray-900 border border-gray-700 z-[60] text-gray-300 py-1 overflow-hidden`}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
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
  const {
    nv,
    viewMode,
    setViewMode,
    toolMode,
    setToolMode,
    setShowTeachingPanel,
    showToast,
  } = useViewer();
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
      showToast("正在加载数据", "请稍候，正在解析影像结构树...", "info");
      const files = Array.from(e.target.files);
      for (const file of files) {
        await nv.loadFromFile(file);
      }
      showToast("加载成功", `成功解析 ${files.length} 个本地文件。`, "success");
    } catch (err: any) {
      console.error("Failed to load file:", err);
      showToast(
        "数据解析异常",
        err.message || "文件可能损坏或暂不被支持，请检查影像格式。",
        "error",
      );
    }
    if (e.target) e.target.value = "";
  };

  const handleLoadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!nv || !e.target.files || e.target.files.length === 0) return;
    try {
      showToast("正在加载项目", "正在解析 NVD 工作区数据...", "info");
      await nv.loadFromFile(e.target.files[0]);
      showToast("加载成功", "项目工作区由于本地缓存中恢复。", "success");
    } catch (err: any) {
      console.error("Failed to load document:", err);
      showToast(
        "工作区解析失败",
        err.message || "未能恢复工作区，请检查文件。",
        "error",
      );
    }
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handleMaskUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!nv || !e.target.files || e.target.files.length === 0) return;
    try {
      showToast("正在加载掩码", "正在解析自定义掩码 (ROI) 数据...", "info");
      const files = Array.from(e.target.files);
      for (const file of files) {
        // Load file and force it as a mask (overlay with distinct colors)
        const vol = await nv.loadFromFile(file);
        if (vol) {
          vol.colormap = "random";
          vol.opacity = 0.5;
        }
      }
      showToast("加载成功", `成功加载自定义掩码文件。`, "success");
    } catch (err: any) {
      console.error("Failed to load mask:", err);
      showToast(
        "掩码加载失败",
        err.message || "文件可能损坏或暂不被支持，请检查影像格式。",
        "error",
      );
    }
    if (maskInputRef.current) maskInputRef.current.value = "";
  };

  const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 sm:p-2 rounded transition-colors flex items-center justify-center border border-transparent ${
        active
          ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
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
            NeuroSuite{" "}
            <span className="text-[10px] text-sky-500 align-top ml-0.5">X</span>
          </h1>
        </div>

        {/* Main Menus */}
        <nav className="flex space-x-0.5 sm:space-x-1 shrink-0">
          <DropdownMenu
            label="文件"
            items={[
              {
                label: "新建工作区 (New)",
                icon: FilePlus,
                onClick: () => {
                  nv?.volumes.slice().forEach((v: any) => nv.removeVolume(v));
                  showToast("已重置", "工作区和画布已清空", "success");
                },
              },
              {
                label: "导入单文件 (Import)",
                icon: Upload,
                onClick: () => fileInputRef.current?.click(),
              },
              {
                label: "导入自定义掩码 (Import Mask)",
                icon: FilePlus,
                onClick: () => maskInputRef.current?.click(),
              },
              {
                label: "批量导入目录 (Batch Import)",
                icon: FolderOpen,
                onClick: () => multipleFileInputRef.current?.click(),
              },
              {
                label: "加载项目 (Load NVD)",
                icon: FolderOpen,
                onClick: () => docInputRef.current?.click(),
              },
              {
                label: "保存项目 (Save NVD)",
                icon: Download,
                onClick: () => nv?.saveDocument("neurovis_project.nvd"),
              },
              {
                label: "导出当前层 (Screenshot)",
                icon: Camera,
                onClick: () => {
                  nv?.saveScene("screenshot.png");
                  showToast(
                    "导出截图",
                    "图片文件 screenshot.png 已经保存到本地。",
                    "success",
                  );
                },
              },
            ]}
          />
          <DropdownMenu
            label="轻量预处理"
            items={[
              {
                label: "灰度归一化 (Min/Max)",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    const v = nv.volumes[0];
                    const processedImg = normalizeMinMax(v.img);
                    v.img = processedImg;
                    v.cal_min = 0;
                    v.cal_max = 1;
                    v.robust_min = 0;
                    v.robust_max = 1;
                    nv.updateGLVolume();
                    showToast("预处理完成", "影像已线性归一化到 [0, 1]", "success");
                  }
                },
              },
              {
                label: "灰度标准化 (Z-Score)",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    const v = nv.volumes[0];
                    const processedImg = normalizeZScore(v.img);
                    v.img = processedImg;
                    // standard normal distribution values
                    v.cal_min = -3;
                    v.cal_max = 3;
                    nv.updateGLVolume();
                    showToast("预处理完成", "影像已通过 Z-Score 标准化 (将对比度范围调整为均值±3倍标准差)", "success");
                  }
                },
              },
              {
                label: "快速平滑降噪 (Box Blur)",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    showToast("任务提交", "正在执行空间降噪，请稍候...", "info");
                    setTimeout(() => {
                        const v = nv.volumes[0];
                        const processedImg = boxBlur3D(v.img, v.hdr.dims.slice(1, 4));
                        v.img = processedImg;
                        nv.updateGLVolume();
                        showToast("预处理完成", "空间高斯模糊降噪已完成", "success");
                    }, 50);
                  }
                },
              },
              {
                label: "阈值分割 (Mean Threshold)",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    const v = nv.volumes[0];
                    const processedImg = applyThresholdMean(v.img);
                    v.img = processedImg;
                    v.cal_min = 0;
                    v.cal_max = 1;
                    nv.updateGLVolume();
                    showToast("预处理完成", "已执行均值阈值分割与二值化", "success");
                  }
                },
              },
              {
                label: "背景裁剪/颅骨剔除初筛",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    const v = nv.volumes[0];
                    // Keep values above mean
                    let sum = 0;
                    let count = 0;
                    for (let i = 0; i < v.img.length; i++) {
                      if (v.img[i] > 0) {
                        sum += v.img[i];
                        count++;
                      }
                    }
                    const mean = count === 0 ? 0 : sum / count;
                    let kept = 0;
                    for (let i = 0; i < v.img.length; i++) {
                      if (v.img[i] < mean * 0.5) v.img[i] = 0;
                      else kept++;
                    }
                    nv.updateGLVolume();
                    showToast("预处理完成", `简易背景与低频头骨剔除。保留体素: ${kept}`, "success");
                  }
                },
              },
              {
                label: "影像反转 (Invert Mask)",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    const v = nv.volumes[0];
                    const processedImg = invertImage(v.img);
                    v.img = processedImg;
                    nv.updateGLVolume();
                    showToast("预处理完成", "组织密度与灰度亮度已反转", "success");
                  }
                },
              },
              {
                label: "定量分析: ROI 统计",
                onClick: () => {
                  if (nv && nv.volumes.length > 0) {
                    const v = nv.volumes[0];
                    const stats = calculateROIStats(v.img);
                    const msg = `最小: ${stats.min.toFixed(2)}, 最大: ${stats.max.toFixed(2)}\n均值: ${stats.mean.toFixed(2)}, 标准差: ${(stats.std).toFixed(2)}\n体素数: ${stats.count}`;
                    alert(`全图区域与体素强度定量分析概览:\n\n${msg}`);
                    showToast("分析完成", "定量数据见弹窗", "info");
                  }
                },
              },
            ]}
          />
          <DropdownMenu
            label="图谱库"
            items={[
              {
                label: "科研认知教学辅导 (Tutorials)",
                icon: BookOpen,
                onClick: () => setShowTeachingPanel(true),
              },
            ]}
          />
        </nav>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          multiple
          accept=".nii,.nii.gz,.dcm,.hdr,.img,.mgz,.gii,.mz3,.json,.trk,.trx,.jcon,.tck"
          className="hidden"
        />
        <input
          type="file"
          ref={maskInputRef}
          onChange={handleMaskUpload}
          multiple
          accept=".nii,.nii.gz,.hdr,.img"
          className="hidden"
        />
        {/* use webkitdirectory for folder upload */}
        <input
          type="file"
          ref={multipleFileInputRef}
          onChange={handleUpload}
          multiple
          {...({ webkitdirectory: "true", directory: "true" } as any)}
          className="hidden"
        />
        <input
          type="file"
          ref={docInputRef}
          onChange={handleLoadDoc}
          accept=".nvd"
          className="hidden"
        />
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
        <div className="h-6 w-px bg-gray-800 mx-1 hidden md:block" />

        {/* View Layout Modes */}
        <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5">
          <NavButton
            active={viewMode === "axial"}
            onClick={() => setViewMode("axial")}
            icon={Square}
            label="单视图 - 轴状位"
          />
          <NavButton
            active={viewMode === "coronal"}
            onClick={() => setViewMode("coronal")}
            icon={LayoutGrid}
            label="单视图 - 冠状位"
          />
          <NavButton
            active={viewMode === "sagittal"}
            onClick={() => setViewMode("sagittal")}
            icon={Columns}
            label="单视图 - 矢状位"
          />
          <NavButton
            active={viewMode === "multi"}
            onClick={() => setViewMode("multi")}
            icon={Grid2X2}
            label="多平面重建 (MPR)"
          />
          <NavButton
            active={viewMode === "3d"}
            onClick={() => setViewMode("3d")}
            icon={Box}
            label="三维体积渲染 (Volume Render)"
          />
        </div>

        {/* Interaction Tools */}
        <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5 relative">
          <NavButton
            active={toolMode === "crosshair"}
            onClick={() => setToolMode("crosshair")}
            icon={MousePointer2}
            label="十字准星拾取 (拾取坐标与信号)"
          />
          <NavButton
            active={toolMode === "pan"}
            onClick={() => setToolMode("pan")}
            icon={Move}
            label="平移缩放工具"
          />
          <NavButton
            active={toolMode === "contrast"}
            onClick={() => setToolMode("contrast")}
            icon={Sun}
            label="调整窗宽窗位 (Contrast)"
          />
          <NavButton
            active={toolMode === "measure"}
            onClick={() => setToolMode("measure")}
            icon={Ruler}
            label="直线距离与角度测量"
          />
          <NavButton
            active={toolMode === "draw"}
            onClick={() => setToolMode("draw")}
            icon={Pencil}
            label="画笔绘图标注"
          />
          {toolMode === "draw" && (
            <>
              <button
                onClick={() => {
                  if (nv) {
                    nv.drawUndo();
                    showToast("已撤销", "撤销前一个画笔绘制步骤");
                  }
                }}
                title="撤销绘制 (Undo)"
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded border border-transparent hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <Undo size={14} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => {
                  showToast(
                    "已重做",
                    "如果存在可重做栈，则已恢复。(注: 依赖引擎底层历史栈)",
                    "success",
                  );
                }}
                title="重做绘制 (Redo)"
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded border border-transparent hover:bg-gray-800 transition-colors flex items-center justify-center transform -scale-x-100"
              >
                <Undo size={14} className="sm:w-4 sm:h-4" />
              </button>
            </>
          )}
        </div>

        {/* Play & Settings */}
        <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5 relative">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={
              isPlaying ? "暂停漫游切片" : "自动漫游播放切片序列 (Scroll Play)"
            }
            className={`p-1.5 sm:p-2 rounded transition-colors flex items-center border border-transparent outline-none ${isPlaying ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            {isPlaying ? (
              <Pause size={14} className="sm:w-4 sm:h-4" />
            ) : (
              <Play size={14} className="sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="高级渲染设置 (Settings)"
            className={`p-1.5 sm:p-2 rounded transition-colors flex items-center border border-transparent outline-none ${showSettings ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            <Settings size={14} className="sm:w-4 sm:h-4" />
          </button>

          {showSettings && (
            <div className="absolute top-12 right-0 w-[280px] bg-gray-900 border border-gray-700/80 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] p-5 z-[70] text-gray-300 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-4 border-b border-gray-800 pb-1.5">
                系统底层渲染配置
              </h4>
              <div className="space-y-4 relative text-xs">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">
                    平滑插值 (Linear / Spline)
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full flex items-center transition-colors ${isInterpolated ? "bg-sky-500" : "bg-gray-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isInterpolated ? "translate-x-4" : "translate-x-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={isInterpolated}
                    onChange={(e) => setIsInterpolated(e.target.checked)}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">
                    高清细节模式 (High-Res 3D)
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full flex items-center transition-colors ${isHighRes ? "bg-sky-500" : "bg-gray-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isHighRes ? "translate-x-4" : "translate-x-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={isHighRes}
                    onChange={(e) => setIsHighRes(e.target.checked)}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">
                    3D 模型细节层级 (LOD)
                  </span>
                  <select className="bg-black/50 border border-gray-700 text-gray-300 rounded-md px-2 py-1 outline-none focus:border-sky-500 transition-colors">
                    <option value="high">无损高保真 (HQ)</option>
                    <option value="medium">分片降采样 (平衡级)</option>
                    <option value="low">极速渲染 (适用于大图)</option>
                  </select>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-white transition-colors">
                    显示十字定位准星 (Crosshair)
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full flex items-center transition-colors ${isCrosshairEnabled ? "bg-sky-500" : "bg-gray-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isCrosshairEnabled ? "translate-x-4" : "translate-x-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={isCrosshairEnabled}
                    onChange={(e) => setIsCrosshairEnabled(e.target.checked)}
                    className="hidden"
                  />
                </label>
              </div>

              <h4 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mt-8 mb-4 border-b border-gray-800 pb-1.5">
                立体切片漫游引擎 (Auto-Scroll)
              </h4>
              <div className="space-y-5 relative text-xs">
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-400">选择漫游物理切面轴向</span>
                  <select
                    value={playAxis}
                    onChange={(e) => setPlayAxis(Number(e.target.value))}
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
                    <span className="text-gray-300 font-mono">
                      {(playSpeed * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={playSpeed}
                    onChange={(e) => setPlaySpeed(Number(e.target.value))}
                    className="w-full accent-sky-500 bg-gray-800 rounded-full h-1.5 outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
