# NeuroSuiteX - SPINS 脑图谱可视化系统

## 项目简介 (Introduction)

NeuroSuiteX 是一个专注于**医学神经影像 (Neuroimaging)** 领域的高级纯前端在线三维与二维复合图谱可视化平台系统。该应用旨在解决临床医生与神经科学研究人员在脱离重量级专属桌面软件 (如 FSL, SPM, FreeSurfer) 时，无法在移动端和网页端便利进行脑网络解剖区域查询与可视化的问题。

特别的，本项目系统地集成了由 Vanderbilt 大学 MASILab 推出的 **SPINS (Shared Public Visualization Library of Neuroanatomical Structures)** 规范框架系列图谱数据。包含：

1. **brainCOLOR** (宏观皮层与皮下核团 - 121 分区)
2. **Yeo 17-Networks** (静息态脑功能网络分布)
3. **Pandora TractSeg** (大脑神经纤维束连接 - 72 条核心网络通信线路)

![平台总览预览](./assets/overview.png)

## 核心功能 (Core Features)

- 🧠 **内置学术级标准模板与图谱库**: 无需手动下载或装载庞大的 NIfTI 离线文件。内置包括 MNI152 模板与上述 SPINS 全套空间配准解剖图谱。
- 🖥️ **三面解剖视图与 3D 骨架渲染**: 提供类似于传统医疗 PACS 软件的正交截面交互视图 (Coronal / Sagittal / Axial) 以及炫酷直接的 Glass Brain 3D 透明皮层模型套件。全面赋能医学报告与 PPT 绘图展示。
- 📋 **脑区图谱百科与术语解析词典**: 侧边栏包含各向性图谱百科词条体系。从传统的 AAL 到前沿的 SPINS 白质微观图谱均提供完整的术语表、网络功能描述甚至结构对应的病灶意义分析。
- 📊 **图层管理与 ROI 量化**: 支持同时混合多层蒙版影像叠加，一键直方图 (Histogram) 分析不同 ROI 的强度概览，同时支持导出 `.csv` 做下半场统计分析。
- 📷 **一键导出 SPINS 流水线视图规范快照**: 为论文写作提供学术规范格式的解剖三面图与透明骨架快照。

## 教程与操作指南 (Tutorials & Guide)

### 1. 挂载与查阅 SPINS 系统图谱

![侧边栏挂载图谱](./assets/tutorial_1.png)
1. 在界面的左侧**侧边栏控制面板**中，找到 `图谱与模板 (Atlas / Templates)` 选择框。
2. 在下拉菜单内可见底层结构模板 (`MNI152 T1 Template`) 等基准空间图。
3. 随后，你可以引入对应的 SPINS 蒙版或者其他自定义本地 NIfTI 文件来覆盖查看各区域。
4. **透明度调控**: 在图层管理部分，滑动 `Opacity` 将脑图谱进行半透明化处理，可透视观察到底层 MNI152 的皮层回沟和深部灰质情况。

### 2. 交互与坐标分析

![十字游标探测功能](./assets/tutorial_2.png)
1. **十字准星探测**: 鼠标点击任意视图切片，游标将直接跟随。如果当前启用了具备解析能力的图谱层，那么鼠标右上角会自动弹出类似于："Left Precentral Gyrus" (左侧中央前回) 的中文及标准英文解剖学释义反馈。
2. **切换渲染布局**: 提供多种灵活版式：包括标准的 `Auto` (平铺)、单 3D 视图、单独矢状面等快速操作。配合滚动鼠标滚轮快速穿行层级。

### 3. 一键学术报告导出与规范阅读

![SPINS 文档阅读器](./assets/tutorial_3.png)
1. **学术图谱导出**: 在左侧面板的最底部有 `一键生成 SPINS 视图快照` 特性。这将静默在后台为当前画布建立超高清渲染缓存流，并提供下载，这是严格根据 SPINS 期刊论文要求的排版范式产生的。
2. **内置百科全书全时离线陪伴**: 点击 `离线脑图谱管理 (Atlas)`。页面正中将弹出覆盖式学术教育面板。在此面版末尾，您可以查阅 SPINS 开发团队的最新动态，以及 brainCOLOR、Yeo、Pandora 等字典表的详情参数及医学意义。

## 开发与资源引用 (Attribution)

- NiiVue 渲染核心组件支持：`@niivue/niivue`
- 图谱规范范式引用至 MASILab SPINS Pipeline
- 框架底层：React + Vite + Tailwind CSS

> 引用格式声明: 
> *Wali Sidiqyar, Gaurav Rudravaram, Elyssa M. McMaster, Trent M. Schwartz, Adam M. Saunders, Kurt G. Schilling, Bennett A. Landman "Introducing SPINS: A Shared Public Visualization Library of Neuroanatomical Structures."*
> *This resource is licensed under CC0 1.0 Universal (Public Domain).*
