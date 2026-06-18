import React from 'react';
import { BookOpen, X, BrainCircuit, Search, Database } from 'lucide-react';

export default function TeachingPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = React.useState('intro');

  return (
    <div className="absolute inset-0 z-[80] bg-gray-950 flex flex-col text-gray-300 animate-in fade-in zoom-in-95 duration-200">
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 bg-gray-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">科研级脑图谱全库与解剖教学系统</h2>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 bg-gray-900/30 flex flex-col shrink-0">
          <div className="p-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="检索图谱或脑区..." className="w-full bg-black border border-gray-800 rounded-md py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-sky-500 text-gray-300" />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide text-sm">
            <button onClick={() => setActiveTab('intro')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'intro' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              全脑图谱导论指南
            </button>
            <button onClick={() => setActiveTab('aal')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'aal' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <Database size={12} className="inline mr-2 opacity-60" /> AAL / AAL3 图谱详解
            </button>
            <button onClick={() => setActiveTab('dk')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'dk' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <Database size={12} className="inline mr-2 opacity-60" /> Desikan-Killiany 皮层分区
            </button>
            <button onClick={() => setActiveTab('ho')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'ho' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <Database size={12} className="inline mr-2 opacity-60" /> Harvard-Oxford 皮下核团
            </button>
            <button onClick={() => setActiveTab('ba')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'ba' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <Database size={12} className="inline mr-2 opacity-60" /> Brodmann 细胞构筑图谱
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-gray-950">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {activeTab === 'intro' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-2xl font-bold text-white mb-2">欢迎使用离线脑图谱库</h1>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    NeuroSuiteX 内置了神经科学研究中最核心的标准脑图谱，无需依赖 FSL、SPM 或 FreeSurfer 等桌面端庞大软件即可在纯前端离线环境中完成图谱加载、叠加、释义查阅与 ROI 提取量化。这解决了初学者在多模板间切换困难的核心痛点。
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                    <h3 className="text-sky-400 font-bold mb-2">如何使用图谱？</h3>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-2">
                      <li>在左侧工具栏，点击「导入功能」，选择挂载内置图谱。</li>
                      <li>在下方图层管理内调整图谱的透明度，混合底层 T1 结构像。</li>
                      <li>开启光标探测模式后，鼠标悬浮至脑区，右下角将实时展示该区域所属左右脑、中文解剖名称及标准简写。</li>
                    </ul>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                    <h3 className="text-sky-400 font-bold mb-2">ROI 量化导出</h3>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-2">
                      <li>系统自动在底层通过 WebAssembly 提取每个图谱区域。</li>
                      <li>针对底层功能像序列（fMRI/PET），可自动计算对应 ROI 区间内的平均信号、标准差极值。</li>
                      <li>一键式导出为 CSV 纯文本文件，立刻介入 SPSS、Python 统计流程。</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 bg-gray-900/50 border border-sky-900/50 rounded-lg p-5">
                  <h3 className="text-sm font-bold text-sky-400 mb-3 flex items-center">
                    <BrainCircuit size={16} className="mr-2" />
                    多模态研究推荐方案
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div className="flex border-b border-gray-800 pb-2">
                      <div className="w-32 text-gray-300 font-medium">结构形态/灰质体积</div>
                      <div className="flex-1 text-gray-500">首选 AAL3 或 Desikan-Killiany 获取经典的皮层厚度与表面积；Destrieux 适合沟回级超深精细研究。</div>
                    </div>
                    <div className="flex border-b border-gray-800 pb-2">
                      <div className="w-32 text-gray-300 font-medium">功能连接 fMRI</div>
                      <div className="flex-1 text-gray-500">首选 AAL 经典 90 区，或者考虑使用功能连通性独立划分的大规模网络模板 (如 Yeo 7/17 Networks)。</div>
                    </div>
                    <div className="flex pb-2">
                      <div className="w-32 text-gray-300 font-medium">认知/细胞机制机制</div>
                      <div className="flex-1 text-gray-500">选用 Brodmann 分区，对应皮层独特的神经元排布差异，具有极强的生理学意义佐证。</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'aal' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Automated Anatomical Labeling (AAL)</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  AAL 模板最初由 Tzourio-Mazoyer (2002) 构建，是目前全球引用次数最高的神经影像宏观解剖学分图谱。它根据 MNI 单被试（柯林斯脑）的解剖特征划分为最初的 90 个脑区（排除小脑）或 116 个区域（含小脑）。
                </p>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">区域分类及常见释义表 (局部预览)</h4>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-800">
                        <th className="pb-2">区域 ID</th>
                        <th className="pb-2">英文简写</th>
                        <th className="pb-2">中文对应标准名称</th>
                        <th className="pb-2">大致功能定位</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-gray-900 hover:bg-gray-900 transition-colors">
                        <td className="py-2">1, 2</td><td className="font-mono text-sky-400">Precentral_L / R</td><td>中央前回</td><td className="text-gray-500">初级运动皮层，控制对侧随意运动。</td>
                      </tr>
                      <tr className="border-b border-gray-900 hover:bg-gray-900 transition-colors">
                        <td className="py-2">11, 12</td><td className="font-mono text-sky-400">Frontal_Inf_Oper_L / R</td><td>额下回岛盖部</td><td className="text-gray-500">左侧对应 Broca 运动性语言中枢。</td>
                      </tr>
                      <tr className="border-b border-gray-900 hover:bg-gray-900 transition-colors">
                        <td className="py-2">37, 38</td><td className="font-mono text-sky-400">Hippocampus_L / R</td><td>海马体</td><td className="text-gray-500">长期记忆巩固与情景记忆提取，AD重点病变区。</td>
                      </tr>
                      <tr className="border-b border-gray-900 hover:bg-gray-900 transition-colors">
                        <td className="py-2">41, 42</td><td className="font-mono text-sky-400">Amygdala_L / R</td><td>杏仁核</td><td className="text-gray-500">情绪加工、恐惧评估与奖赏学习网络核心。</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4 text-center">
                    <button className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded transition-colors">
                      本地全量导出完整对照 CSV (含 166 个脑区)
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'dk' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Desikan-Killiany (DK) 皮层图谱</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  基于 FreeSurfer 默认皮层分割流程生成的经典骨架，包含 68 个皮层解剖区域（左右半球各 34 个区域）。它是神经影像形态学研究中极具代表性的模板，专用于皮层厚度、表面积、灰质容积的自动化提取与测量。
                </p>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">DK 模板典型脑区及关联功能</h4>
                  <table className="w-full text-xs text-left">
                    <thead>
                       <tr className="text-gray-500 border-b border-gray-800">
                          <th className="pb-2">区域 ID (L/R)</th><th className="pb-2">标准名称</th><th className="pb-2">对应重要脑区与功能</th>
                       </tr>
                    </thead>
                    <tbody className="text-gray-300">
                       <tr className="border-b border-gray-900"><td className="py-2">1012, 2012</td><td className="font-mono text-sky-400">LateralOrbitofrontal</td><td>外侧眶额皮层，涉及奖赏评估机制与高级决策。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">1014, 2014</td><td className="font-mono text-sky-400">MedialOrbitofrontal</td><td>内侧眶额皮层，自我指涉与情绪调节核心网络。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">1024, 2024</td><td className="font-mono text-sky-400">Precentral</td><td>中央前回（初级运动皮层 M1），精细运动输出。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">1022, 2022</td><td className="font-mono text-sky-400">Postcentral</td><td>中央后回（初级体感皮层 S1），所有外周感觉输入。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">1028, 2028</td><td className="font-mono text-sky-400">SuperiorFrontal</td><td>额上回，负责持续注意力分配、工作记忆与认知控制。</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'ho' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Harvard-Oxford (HO) 图谱</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  由哈佛麻省总医院与牛津大学联合发布，是 FSL (FMRIB Software Library) 的主要默认图谱。其最著名的特性是出色的<strong className="text-white">边缘系统及皮下深部核团划分</strong>，在深部脑刺激（DBS）以及神经系统退行性疾病的研究中非常关键。
                </p>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">HO 核心皮下核团分区表</h4>
                  <table className="w-full text-xs text-left">
                    <thead>
                       <tr className="text-gray-500 border-b border-gray-800">
                          <th className="pb-2">区域名称</th><th className="pb-2">标准缩写</th><th className="pb-2">核心作用与临床意义</th>
                       </tr>
                    </thead>
                    <tbody className="text-gray-300">
                       <tr className="border-b border-gray-900"><td className="py-2">Thalamus</td><td className="font-mono text-sky-400">Tha</td><td>丘脑：全脑感觉运动信息的超级中继站与滤波网。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">Caudate</td><td className="font-mono text-sky-400">Cau</td><td>尾状核：基底神经节首端，多巴胺相关运动与习惯控制。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">Putamen</td><td className="font-mono text-sky-400">Put</td><td>壳核：运动学习与执行模块，帕金森病（PD）关键受损区。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">Pallidum</td><td className="font-mono text-sky-400">Pal</td><td>苍白球：抑制性运动控制，调节运动网络兴奋性。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">Hippocampus</td><td className="font-mono text-sky-400">Hip</td><td>海马体：陈述性记忆固化、空间导航，AD核心标志性萎缩区。</td></tr>
                       <tr className="border-b border-gray-900"><td className="py-2">Amygdala</td><td className="font-mono text-sky-400">Amy</td><td>杏仁核：恐惧、焦虑情绪处理中心与威胁感知评价网络。</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'ba' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Brodmann Areas (BA) 细胞图谱</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                   布罗德曼分区法是大脑皮层最经典的细胞构筑学分区标准。通过尼氏染色显微技术，Korbinian Brodmann 观察了皮层神经元的细胞层级排列差异，进而划分了 BA1 到 BA52 的各个功能小单元。该图谱至今在临床功能定位上依然拥有崇高地位。
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-900 border border-gray-800 rounded p-4 text-xs space-y-2">
                      <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800">运动与体感系统</h4>
                      <p><strong className="text-white">BA 4:</strong> 初级运动皮层 (M1)，控制对侧躯体随意与精细运动。</p>
                      <p><strong className="text-white">BA 6:</strong> 前运动区与 SMA，负责复杂动作的序列规划与准备。</p>
                      <p><strong className="text-white">BA 1,2,3:</strong> 初级躯体感觉皮层 (S1)，处理触压觉、本体感觉。</p>
                   </div>
                   <div className="bg-gray-900 border border-gray-800 rounded p-4 text-xs space-y-2">
                      <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800">视觉与听觉中枢</h4>
                      <p><strong className="text-white">BA 17:</strong> 初级视觉皮层 (V1)，位于枕叶距状沟，接收视网膜初级映射。</p>
                      <p><strong className="text-white">BA 18,19:</strong> 面与运动视觉联合皮层 (V2/V3/V4/V5)，特征提取网络。</p>
                      <p><strong className="text-white">BA 41,42:</strong> 初级听觉皮层与联合皮层，位于颞横回深部。</p>
                   </div>
                   <div className="bg-gray-900 border border-gray-800 rounded p-4 text-xs space-y-2">
                      <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800">语言与语义网络</h4>
                      <p><strong className="text-white">BA 44,45:</strong> Broca区 (运动性语言中枢)，损伤将导致表达性失语症。</p>
                      <p><strong className="text-white">BA 22:</strong> Wernicke区 (听觉性语言中枢)，损伤将导致感受性/胡言语失语。</p>
                   </div>
                   <div className="bg-gray-900 border border-gray-800 rounded p-4 text-xs space-y-2">
                      <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800">高级认知与前额叶</h4>
                      <p><strong className="text-white">BA 9,46:</strong> 背外侧前额叶背外侧 (dlPFC)，强认知负荷、工作记忆运算核心。</p>
                      <p><strong className="text-white">BA 10:</strong> 极前额叶 (Frontal Pole)，最高级目标管理与意图维持区。</p>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
