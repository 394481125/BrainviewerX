# BrainviewerX - 神经影像与脑图谱全能可视化系统

## 项目简介 (Introduction)

**BrainviewerX** 是一个功能强大、专注于**医学神经影像 (Neuroimaging)** 领域的高级纯前端在线三维与二维复合可视化平台系统。该应用旨在解决临床医生与神经科学研究人员在脱离重量级专属桌面软件 (如 FSL, SPM, FreeSurfer) 时，无法在移动端和网页端便利进行脑网络解剖区域查询、可视化计算与高定出版级科研图表渲染的问题。

特别的，本项目深度集成了由 Vanderbilt 大学 MASILab 推出的 **SPINS (Shared Public Visualization Library of Neuroanatomical Structures)** 规范框架系列图谱数据，实现了**全动态本地化中文全译制响应**。包含：

1. **brainCOLOR** (宏观皮层与皮下核团 - 121 分区灰质图谱)
2. **Yeo 17-Networks** (静息态脑功能网络分布)
3. **Pandora TractSeg** (大脑神经纤维束连接 - 72 条核心网络通信线路白质图谱)

## 核心功能 (Core Features)

- 🧠 **内置学术级标准模板与图谱库**: 无需手动下载或装载庞大的 NIfTI 离线文件。内置包括 MNI152 模板与上述 SPINS 全套空间配准解剖图谱，提供中英双语图谱详细百科讲解与三维脑结构全景流展。
- 🖥️ **三面解剖视图与 3D 骨架渲染**: 提供类似于传统医疗 PACS 软件的正交截面交互视图 (Coronal / Sagittal / Axial) 以及炫酷直观的 Glass Brain 3D 透明皮层模型套件。全面赋能医学报告与绘图展示。
- 📊 **图层管理**: 支持同时混合多层蒙版影像叠加，支持通过勾选框便捷控制多图层的显示与隐藏。
- ⚡ **实时性能监控**: 页脚集成了极简的性能监控组件，实时显示 WebGL 渲染帧率 (FPS) 与内存占用，帮助用户直观评估大文件加载性能与系统压力。
- 🛠️ **轻量化图像预处理与定量分析**: 突破纯前端无后端运算的瓶颈，实现真正的轻量化本地内存处理！在低配无服务器及不使用 WebAssembly 的情况下纯粹依赖浏览器运算流完成了核心的影像计算与预处理管道：
    1. **图像归一化/标准化**：实现 Min/Max 线性向 [0, 1] 映射与 Z-Score 统计算法强度重分配。
    2. **基础降噪与去背景**：实现了高效的 3D Box Blur 均值滤波近似平滑，以及一键执行基于均值的极简脑壳剔除背景过滤 (Simplified BET)。
    3. **分析与形态学掩码**：一键实施均值阈值分割二值化、色彩反转交互。
    4. **本地定量计算提取 (ROI Stats)**：实现纯客户端像素遍历引擎，瞬间解算选中体素影像的标准差、极值、均值与非零体积分布，结果通过弹窗立等可见。

> **⚠️ 深入算法能力界限申明 (Limitations):**
> 本应用致力于成为一款轻量化静态零依赖前端。因而在技术上严格剔除了对运行资源有灾难性要求的高阶模块功能（包括完整流线渲染的 DTI 高阶计算、非线性微分同胚变形的 ANTs 级高精度配准、海量相关性计算的网络拓扑建立，以及时序漂移 GLM 功能磁共振建模）。所有这些功能在真实环境下需要强大的后端容器算力。由于我们选择了轻装上阵、纯网页托管即点即开的产品形态，仅保留上述在纯净前端 `JS` 引擎即时响应的“轻量分析模块”。

## 教程与操作指南 (Tutorials & Guide)

### 1. 查阅结构性图谱与学习百科词典
在顶栏的配置菜单中选择**图谱库 -> 科研认知教学辅导 (Tutorials)** 即可进入结构百科的专属大屏沉浸阅读室。该区域会自动聚合底层翻译词库对最新的 SPINS 图谱提供中文导读与释义。

### 2. 交互与坐标分析
1. **十字准星探测**: 鼠标点击任意视图切片，游标将直接跟随。如果当前启用了具备解析能力的图谱层，系统侧边栏会实时显示悬停位置的大脑精确分区的中文及标准英文解剖学百科释义反馈。
2. **切换渲染布局**: 提供多种灵活版式：包括 MPR平铺、单 3D 视图等。顶部快捷交互栏可切换剪裁与画笔标定模式。

## 架构与技术栈声明 (Attribution)

- NiiVue 渲染核心组件支持：`@niivue/niivue`
- 图谱规范范式引用至 MASILab SPINS Pipeline
- 框架底层：React + Vite + Tailwind CSS

> **部分学术与结构词库引用格式声明**: 
> *Wali Sidiqyar, Gaurav Rudravaram, Elyssa M. McMaster, Trent M. Schwartz, Adam M. Saunders, Kurt G. Schilling, Bennett A. Landman "Introducing SPINS: A Shared Public Visualization Library of Neuroanatomical Structures."*
> *This resource is licensed under CC0 1.0 Universal (Public Domain).*
