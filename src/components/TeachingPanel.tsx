import React from 'react';
import { BookOpen, X, BrainCircuit, Search, Database, ExternalLink } from 'lucide-react';
import { spinsData } from '../spins_data';
import { RegionDetail } from './RegionDetail';

export default function TeachingPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = React.useState('intro');
  const [selectedRegion, setSelectedRegion] = React.useState<{ url: string; title: string, color: string, type: string } | null>(null);

  return (
    <div className="flex-1 w-full bg-gray-950 flex flex-col text-gray-300 animate-in fade-in zoom-in-95 duration-200">
      {selectedRegion && <RegionDetail region={selectedRegion} onBack={() => setSelectedRegion(null)} />}
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
            
            <div className="pt-4 pb-1">
               <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">SPINS 在线图谱库</span>
            </div>
            <button onClick={() => setActiveTab('spins')} className={`w-full text-left px-4 py-2 rounded-md transition-colors border border-sky-500/30 ${activeTab === 'spins' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-sky-200 hover:text-sky-100 hover:bg-gray-800/50'}`}>
              <BrainCircuit size={12} className="inline mr-2 opacity-60" /> SPINS 系统导论
            </button>
            <button onClick={() => setActiveTab('spins_braincolor')} className={`w-full text-left px-4 py-2 rounded-md transition-colors pl-8 ${activeTab === 'spins_braincolor' ? 'bg-sky-500/10 text-sky-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block mr-2"></span> brainCOLOR (121)
            </button>
            <button onClick={() => setActiveTab('spins_yeo')} className={`w-full text-left px-4 py-2 rounded-md transition-colors pl-8 ${activeTab === 'spins_yeo' ? 'bg-sky-500/10 text-teal-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 inline-block mr-2"></span> Yeo 17-Networks
            </button>
            <button onClick={() => setActiveTab('spins_pandora')} className={`w-full text-left px-4 py-2 rounded-md transition-colors pl-8 ${activeTab === 'spins_pandora' ? 'bg-sky-500/10 text-amber-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block mr-2"></span> Pandora TractSeg (72)
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
                    <h3 className="text-sky-400 font-bold mb-2">ROI 量化分析与查询</h3>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-2">
                      <li>系统自动在底层通过 WebAssembly 提取每个图谱区域。</li>
                      <li>支持实时查看不同层级和横截面的高维重构与量化。</li>
                      <li>本面板已完整展示上述图谱的所有区域定义，无需额外查询或导出。</li>
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
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Automated Anatomical Labeling (AAL / AAL3)</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  AAL 模板最初由 Tzourio-Mazoyer (2002) 构建，是目前全球引用次数最高的神经影像宏观解剖学分图谱。它根据 MNI 单被试（柯林斯脑）的解剖特征划分为最初的 90 个脑区（排除小脑）或 116 个区域（含小脑）。最新的 AAL3 补充了极具科研价值的细分核团与亚区。
                </p>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">AAL / AAL3 完整分区体系 (涵盖 166+ 脑区分类)</h4>
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800 sticky top-0 bg-black">
                          <th className="pb-2 w-16">区域 ID</th>
                          <th className="pb-2 w-48">英文简写</th>
                          <th className="pb-2 w-32">中文对应标准名称</th>
                          <th className="pb-2">大致功能定位</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {/* 额叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={4} className="py-1 font-bold text-sky-500">额叶皮层 (Frontal Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1, 2</td><td className="font-mono text-sky-400">Precentral_L/R</td><td>中央前回</td><td className="text-gray-500">初级运动皮层</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">3, 4, 19, 20</td><td className="font-mono text-sky-400">Frontal_Sup_L/R/Medial</td><td>额上回(含内侧)</td><td className="text-gray-500">运动规划、高级认知</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">7, 8</td><td className="font-mono text-sky-400">Frontal_Mid_L/R</td><td>额中回</td><td className="text-gray-500">背外侧前额叶核心(dlPFC)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">11-16</td><td className="font-mono text-sky-400">Frontal_Inf (Oper/Tri/Orb)</td><td>额下回(盖/三角/眶)</td><td className="text-gray-500">Broca语言区及情绪调节</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">17, 18, 21-26</td><td className="font-mono text-sky-400">Olf / Rectus / Orbital</td><td>嗅皮层/直回/眶回</td><td className="text-gray-500">初级嗅觉与眶额抑制反馈</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">67, 68</td><td className="font-mono text-sky-400">Paracentral_Lobule_L/R</td><td>旁中央小叶</td><td className="text-gray-500">下肢运动与排泄控制</td></tr>

                        {/* 顶叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={4} className="py-1 font-bold text-sky-500">顶叶皮层 (Parietal Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">57, 58</td><td className="font-mono text-sky-400">Postcentral_L/R</td><td>中央后回</td><td className="text-gray-500">初级躯体感觉皮层</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">59, 60</td><td className="font-mono text-sky-400">Parietal_Sup_L/R</td><td>顶上小叶</td><td className="text-gray-500">视觉运动协调追踪</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">61, 62</td><td className="font-mono text-sky-400">Parietal_Inf_L/R</td><td>顶下小叶</td><td className="text-gray-500">多感觉跨模态联合加工</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">63, 64</td><td className="font-mono text-sky-400">SupraMarginal_L/R</td><td>缘上回</td><td className="text-gray-500">语音工作记忆核心</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">65, 66</td><td className="font-mono text-sky-400">Angular_L/R</td><td>角回</td><td className="text-gray-500">计算、阅读与跨感官转换</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">67, 68</td><td className="font-mono text-sky-400">Precuneus_L/R</td><td>楔前叶</td><td className="text-gray-500">默认网络系统核心</td></tr>

                        {/* 颞叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={4} className="py-1 font-bold text-sky-500">颞叶皮层 (Temporal Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">79-82</td><td className="font-mono text-sky-400">Temporal_Sup_L/R (Pole)</td><td>颞上回(含极)</td><td className="text-gray-500">听觉与Wernicke语言区</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">83-86</td><td className="font-mono text-sky-400">Temporal_Mid_L/R (Pole)</td><td>颞中回(含极)</td><td className="text-gray-500">语义表征与网络</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">87, 88</td><td className="font-mono text-sky-400">Temporal_Inf_L/R</td><td>颞下回</td><td className="text-gray-500">视觉物体识别腹侧通路</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">79, 80</td><td className="font-mono text-sky-400">Heschl_L/R</td><td>颞横回</td><td className="text-gray-500">初级听觉皮层</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">53, 54</td><td className="font-mono text-sky-400">Fusiform_L/R</td><td>梭状回</td><td className="text-gray-500">面孔和视觉词汇识别</td></tr>

                        {/* 枕叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={4} className="py-1 font-bold text-sky-500">枕叶皮层 (Occipital Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">43, 44</td><td className="font-mono text-sky-400">Calcarine_L/R</td><td>距状沟周皮层</td><td className="text-gray-500">初级视觉皮层</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">45, 46</td><td className="font-mono text-sky-400">Cuneus_L/R</td><td>楔叶</td><td className="text-gray-500">初级视觉上视场</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">47, 48</td><td className="font-mono text-sky-400">Lingual_L/R</td><td>舌回</td><td className="text-gray-500">视觉辅助与字母识别</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">49-52</td><td className="font-mono text-sky-400">Occipital_Sup/Mid/Inf</td><td>枕上/中/下回</td><td className="text-gray-500">视觉联合皮层</td></tr>

                        {/* 边缘系统及大脑深部 */}
                        <tr className="bg-gray-900/50"><td colSpan={4} className="py-1 font-bold text-sky-500">边缘系统与基底核 (Limbic & Basal Ganglia)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">27, 28</td><td className="font-mono text-sky-400">Insula_L/R</td><td>岛叶</td><td className="text-gray-500">内感受、共情觉痛痛</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">29-34</td><td className="font-mono text-sky-400">Cingulum_Ant/Mid/Post</td><td>前/中/后扣带回</td><td className="text-gray-500">冲突调节/感觉驱动/DMN</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">35, 36</td><td className="font-mono text-sky-400">Hippocampus_L/R</td><td>海马体</td><td className="text-gray-500">长期情景记忆</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">37, 38</td><td className="font-mono text-sky-400">ParaHippocampal_L/R</td><td>海马旁回</td><td className="text-gray-500">环境视觉记忆整合</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">39, 40</td><td className="font-mono text-sky-400">Amygdala_L/R</td><td>杏仁核</td><td className="text-gray-500">恐惧与威胁加工</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">71, 72</td><td className="font-mono text-sky-400">Caudate_L/R</td><td>尾状核</td><td className="text-gray-500">运动学习与动作抑制</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">73, 74</td><td className="font-mono text-sky-400">Putamen_L/R</td><td>壳核</td><td className="text-gray-500">复杂运动协调</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">75, 76</td><td className="font-mono text-sky-400">Pallidum_L/R</td><td>苍白球</td><td className="text-gray-500">基底节输出控制</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">77, 78</td><td className="font-mono text-sky-400">Thalamus_L/R</td><td>丘脑总区</td><td className="text-gray-500">上行网状激活与感觉中继</td></tr>

                        {/* AAL3 补充核团 */}
                        <tr className="bg-gray-900/50"><td colSpan={4} className="py-1 font-bold text-sky-500">AAL3 新增深部核团与小脑 (AAL3 Specific Additions)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">121-144</td><td className="font-mono text-sky-400">Thalamus_subnuclei</td><td>丘脑各精细亚核团</td><td className="text-gray-500">AV, LP, VA, VL, VPL, MD等细分功能对应</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">145-148</td><td className="font-mono text-sky-400">Locus_Coeruleus / Raphe</td><td>蓝斑 / 中缝核</td><td className="text-gray-500">去甲肾上腺素 / 5-HT 核心源区</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">149-152</td><td className="font-mono text-sky-400">VTA / Subst_Nigra</td><td>中脑腹侧被盖区/黑质</td><td className="text-gray-500">多巴胺奖赏回路与帕金森病变区</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">153-156</td><td className="font-mono text-sky-400">Red_Nuc / Subthalamic</td><td>红核 / 丘脑底核</td><td className="text-gray-500">锥体外系运动及DBS常选靶点</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">157-160</td><td className="font-mono text-sky-400">Hypothal / Mammillary</td><td>下丘脑 / 乳头体</td><td className="text-gray-500">内分泌调控中枢与记忆回路转移站</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">161-164</td><td className="font-mono text-sky-400">Septal / NAc</td><td>隔核 / 伏隔核(核/壳)</td><td className="text-gray-500">边缘系统快感惩罚反馈</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">165-170</td><td className="font-mono text-sky-400">Tubercle / BNST / Habenula / Claustrum</td><td>终纹床核/缰核/屏状核</td><td className="text-gray-500">应激情绪、抑郁关联与全脑意识同步</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">89-120</td><td className="font-mono text-sky-400">Cerebellum 1-10 & Vermis</td><td>小脑各叶与蚓部</td><td className="text-gray-500">共济运动与平衡/平滑追随眼动</td></tr>
                      </tbody>
                    </table>
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
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">DK 图谱完整分区体系 (68 个皮层解剖区域)</h4>
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-[11px] text-left mb-6">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800 sticky top-0 bg-black">
                          <th className="pb-2 w-20">区域 ID</th>
                          <th className="pb-2 w-48">标准名称</th>
                          <th className="pb-2">对应重要脑区与功能</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {/* 额叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={3} className="py-1 font-bold text-sky-500">额叶 (Frontal Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1028, 2028</td><td className="font-mono text-sky-400">superiorfrontal</td><td>额上回，负责持续注意力分配、工作记忆与认知控制。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1027, 2027</td><td className="font-mono text-sky-400">rostralmiddlefrontal</td><td>吻侧额中回，高级执行功能。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1003, 2003</td><td className="font-mono text-sky-400">caudalmiddlefrontal</td><td>尾侧额中回，眼动控制及空间记忆。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1018, 2018</td><td className="font-mono text-sky-400">parsopercularis</td><td>额下回盖部，Broca区的一部分。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1020, 2020</td><td className="font-mono text-sky-400">parstriangularis</td><td>额下回三角部，Broca区的一部分，语义理解。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1019, 2019</td><td className="font-mono text-sky-400">parsorbitalis</td><td>额下回眶部，情绪处理。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1012, 2012</td><td className="font-mono text-sky-400">lateralorbitofrontal</td><td>外侧眶额皮层，涉及奖赏评估机制与高级决策。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1014, 2014</td><td className="font-mono text-sky-400">medialorbitofrontal</td><td>内侧眶额皮层，自我指涉与情绪调节核心网络。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1024, 2024</td><td className="font-mono text-sky-400">precentral</td><td>中央前回（初级运动皮层 M1），精细运动输出。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1017, 2017</td><td className="font-mono text-sky-400">paracentral</td><td>旁中央小叶，下肢运动控制及感觉。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1032, 2032</td><td className="font-mono text-sky-400">frontalpole</td><td>极前额叶皮层，最高级目标规划。</td></tr>

                        {/* 顶叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={3} className="py-1 font-bold text-sky-500">顶叶 (Parietal Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1022, 2022</td><td className="font-mono text-sky-400">postcentral</td><td>中央后回（初级体感皮层 S1），所有外周感觉输入。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1029, 2029</td><td className="font-mono text-sky-400">supramarginal</td><td>缘上回，语言回路及语音加工储存库。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1008, 2008</td><td className="font-mono text-sky-400">inferiorparietal</td><td>顶下小叶，空间感知及数字加工。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1028, 2028</td><td className="font-mono text-sky-400">superiorparietal</td><td>顶上小叶，躯体感觉信息高级整合。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1025, 2025</td><td className="font-mono text-sky-400">precuneus</td><td>楔前叶，情景记忆检索与意象。</td></tr>

                        {/* 颞叶 */}
                        <tr className="bg-gray-900/50"><td colSpan={3} className="py-1 font-bold text-sky-500">颞叶 (Temporal Lobe)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1030, 2030</td><td className="font-mono text-sky-400">superiortemporal</td><td>颞上回，高级听觉区域与语音识别。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1015, 2015</td><td className="font-mono text-sky-400">middletemporal</td><td>颞中回，视觉及听觉跨模态整合，语义网络。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1009, 2009</td><td className="font-mono text-sky-400">inferiortemporal</td><td>颞下回，高级视觉形态处理。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1033, 2033</td><td className="font-mono text-sky-400">transversetemporal</td><td>颞横回，即初级听觉中枢皮层区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1001, 2001</td><td className="font-mono text-sky-400">bankssts</td><td>颞上沟后岸区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1007, 2007</td><td className="font-mono text-sky-400">fusiform</td><td>梭状回，包括面孔识别区 (FFA)。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1006, 2006</td><td className="font-mono text-sky-400">entorhinal</td><td>内嗅皮层，海马体的门控接口，AD最早期原发区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1016, 2016</td><td className="font-mono text-sky-400">parahippocampal</td><td>海马旁回，主要处理场所视觉与记忆映射。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1034, 2034</td><td className="font-mono text-sky-400">temporalpole</td><td>极颞叶皮层，社交情感与高度语义总结。</td></tr>

                        {/* 枕叶及边缘扣带 */}
                        <tr className="bg-gray-900/50"><td colSpan={3} className="py-1 font-bold text-sky-500">枕叶及扣带皮层 (Occipital & Cingulate)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1026, 2026</td><td className="font-mono text-sky-400">rostralanteriorcingulate</td><td>吻侧前扣带回，情绪调节及冲突解决监控。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1002, 2002</td><td className="font-mono text-sky-400">caudalanteriorcingulate</td><td>尾侧前扣带回。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1023, 2023</td><td className="font-mono text-sky-400">posteriorcingulate</td><td>后扣带回，DMN核心节点，调控认知内向关注。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1010, 2010</td><td className="font-mono text-sky-400">isthmuscingulate</td><td>扣带回峡部。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1011, 2011</td><td className="font-mono text-sky-400">lateraloccipital</td><td>外侧枕叶皮层，形状感知及高级视觉处理。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1013, 2013</td><td className="font-mono text-sky-400">lingual</td><td>舌回，视觉词形区域边缘及低级视觉处理。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1005, 2005</td><td className="font-mono text-sky-400">cuneus</td><td>楔叶，视觉初级映射(上半侧视野)。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1021, 2021</td><td className="font-mono text-sky-400">pericalcarine</td><td>距状沟周皮层，初级视觉输入核心带。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">1035, 2035</td><td className="font-mono text-sky-400">insula</td><td>岛叶皮层，疼痛及内感受网络的核心枢纽。</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ho' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Harvard-Oxford (HO) 图谱</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  由哈佛麻省总医院与牛津大学联合发布，是 FSL (FMRIB Software Library) 的主要默认图谱。其包含完整的皮层与皮下核团概率图谱。最著名的特性是其极其出色的<strong className="text-white">边缘系统及皮下深部核团划分</strong>，在深部脑刺激（DBS）以及神经系统退行性疾病的研究中非常关键。
                </p>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">HO 全套深部核团与皮层精细概率分布</h4>
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-[11px] text-left mb-6">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800 sticky top-0 bg-black">
                          <th className="pb-2 w-28">区域名称</th>
                          <th className="pb-2 w-20">标准缩写</th>
                          <th className="pb-2">核心作用与临床意义</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {/* 皮下深部核团区 */}
                        <tr className="bg-gray-900/50"><td colSpan={3} className="py-1 font-bold text-sky-500">边缘与皮下深部核团 (Subcortical Nuclei)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Thalamus</td><td className="font-mono text-sky-400">Tha</td><td>丘脑：全脑感觉运动信息的超级中继站与滤波网。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Caudate</td><td className="font-mono text-sky-400">Cau</td><td>尾状核：基底神经节首端，多巴胺相关运动与习惯控制。纹状体的重要组成。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Putamen</td><td className="font-mono text-sky-400">Put</td><td>壳核：持续运动学习与执行模块，帕金森病（PD）关键受损区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Pallidum</td><td className="font-mono text-sky-400">Pal</td><td>苍白球：抑制性运动控制，调节运动网络兴奋性。DBS 常见靶点。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Hippocampus</td><td className="font-mono text-sky-400">Hip</td><td>海马体：陈述性记忆固化、空间导航，AD核心标志性萎缩区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Amygdala</td><td className="font-mono text-sky-400">Amy</td><td>杏仁核：恐惧、焦虑情绪处理中心与威胁感知评价网络。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Accumbens</td><td className="font-mono text-sky-400">Acc</td><td>伏隔核：大脑奖赏回馈与成瘾网络的核心部位。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Brain-Stem</td><td className="font-mono text-sky-400">BS</td><td>脑干：维持基本生命体征（呼吸、心跳、觉醒状态）。</td></tr>

                        {/* 皮层概率区 */}
                        <tr className="bg-gray-900/50"><td colSpan={3} className="py-1 font-bold text-sky-500">代表性皮层概率分区 (Selected Cortical Areas)</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Frontal Pole</td><td className="font-mono text-sky-400">FP</td><td>位于前额叶极前端区域，负责顶层未来规划。HO的概率图能很好地涵盖群体差异极大的极区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Insular Cortex</td><td className="font-mono text-sky-400">IC</td><td>岛叶被高度精确地划分为多个子概率区，便于探讨内部情绪及自我觉察。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Cingulate Gyrus (Ant/Post)</td><td className="font-mono text-sky-400">CG</td><td>前扣带回和后扣带回有明确分离，对于静息态网络 (如 DMN 及突显网络) 有极高匹配度。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Paracingulate Gyrus</td><td className="font-mono text-sky-400">PCG</td><td>旁扣带回，社会认知网络的重要组成。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Subcallosal Cortex</td><td className="font-mono text-sky-400">SC</td><td>胼胝体下皮质，与重度抑郁症(MDD)治疗高度关联靶区。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Temporal Fusiform Cort</td><td className="font-mono text-sky-400">TFC</td><td>分为前/后/枕侧极，极为细致的面容与复杂图型加工模型带。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Planum Temporale/Polare</td><td className="font-mono text-sky-400">PT/PP</td><td>听觉处理高阶辅助，存在显著的左右半球不对称。</td></tr>
                        <tr className="border-b border-gray-900"><td className="py-1.5">Juxtapositional Lobule Cortex</td><td className="font-mono text-sky-400">SMA</td><td>即过去的辅助运动区(SMA)，主要控制多重动作的衔接。</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ba' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">Brodmann Areas (BA) 细胞图谱</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                   布罗德曼分区法是大脑皮层最经典的细胞构筑学分区标准。通过尼氏染色显微技术，Korbinian Brodmann 观察了皮层神经元的细胞层级排列差异，进而划分了 BA1 到 BA52 的各个功能小单元。该图谱至今在临床功能定位上依然拥有崇高地位。
                </p>
                <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-gray-900 border border-gray-800 rounded p-4 text-[11px] space-y-2">
                        <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800 text-xs text-center">初级运动与体感系统</h4>
                        <p><strong className="text-white inline-block w-16">BA 1,2,3:</strong> 初级躯体感觉皮层 (S1)，处理触压觉、本体感觉。位于中央后回。</p>
                        <p><strong className="text-white inline-block w-16">BA 4:</strong> 初级运动皮层 (M1)，控制对侧躯体随意与精细运动。位于中央前回。</p>
                        <p><strong className="text-white inline-block w-16">BA 5:</strong> 躯体感觉联合皮层，参与立体几何物体辨识。</p>
                        <p><strong className="text-white inline-block w-16">BA 6:</strong> 前运动区与 SMA，负责复杂动作的序列规划与准备。</p>
                        <p><strong className="text-white inline-block w-16">BA 7:</strong> 顶上小叶，负责视觉与运动的高级协调追踪。</p>
                        <p><strong className="text-white inline-block w-16">BA 8:</strong> 额叶眼动区 (FEF)，控制眼球自主扫视与追随运动。</p>
                        <p><strong className="text-white inline-block w-16">BA 43:</strong> 下顶盖区 (味觉初级皮层)，感受味觉传入核心区。</p>
                     </div>
                     <div className="bg-gray-900 border border-gray-800 rounded p-4 text-[11px] space-y-2">
                        <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800 text-xs text-center">视觉皮层网络</h4>
                        <p><strong className="text-white inline-block w-16">BA 17:</strong> 初级视觉皮层 (V1)，位于枕叶距状沟周围，处理物体基本方向轮廓与光场。</p>
                        <p><strong className="text-white inline-block w-16">BA 18:</strong> 次级视觉联合皮层 (V2)，视觉信息的深度与特征初级整合。</p>
                        <p><strong className="text-white inline-block w-16">BA 19:</strong> 联合视觉皮层 (V3, V4, V5)，发往背侧运动通路与腹侧颜色通路分流极站。</p>
                        <p><strong className="text-white inline-block w-16">BA 20:</strong> 下颞回皮层，腹侧视觉流端站，高阶物体全局识别处理区。</p>
                        <p><strong className="text-white inline-block w-16">BA 21:</strong> 中颞回特征区，参与语言及视觉记忆语义关联。</p>
                        <p><strong className="text-white inline-block w-16">BA 37:</strong> 梭状回复合区，包含著名的面孔识别区 (FFA) 及视觉词形识别带。</p>
                     </div>
                     <div className="bg-gray-900 border border-gray-800 rounded p-4 text-[11px] space-y-2">
                        <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800 text-xs text-center">听觉、语言与多感觉中枢</h4>
                        <p><strong className="text-white inline-block w-16">BA 41,42:</strong> 初级听觉皮层 (A1) 及关联区，位于颞横回深部，精确判定音阶及频率输入。</p>
                        <p><strong className="text-white inline-block w-16">BA 22:</strong> 包含 Wernicke 区带核心，极度特化于人类口头听觉语言的感受性语义理解。</p>
                        <p><strong className="text-white inline-block w-16">BA 39:</strong> 角回 (Angular gyrus)，语言的视觉及听觉跨模态转换枢纽、阅读及隐喻处理中心。</p>
                        <p><strong className="text-white inline-block w-16">BA 40:</strong> 缘上回皮层区，负责语音工作记忆的在线缓存与提取复述通路支持。</p>
                        <p><strong className="text-white inline-block w-16">BA 44,45:</strong> 经典的 Broca 运动性语言区核心带。损伤会导致说话语法重构严重受阻现象。</p>
                        <p><strong className="text-white inline-block w-16">BA 52:</strong> 听觉与外侧岛盖区交界的辅助联合区网络。</p>
                     </div>
                     <div className="bg-gray-900 border border-gray-800 rounded p-4 text-[11px] space-y-2">
                        <h4 className="text-sky-400 font-bold mb-2 pb-1 border-b border-gray-800 text-xs text-center">前额叶执行及边缘驱动系</h4>
                        <p><strong className="text-white inline-block w-16">BA 9,46:</strong> 背外侧前额叶关键区 (dlPFC)，支持极强的工作记忆认知负荷计算核心。</p>
                        <p><strong className="text-white inline-block w-16">BA 10:</strong> 极前额叶皮层区 (Frontal Pole)，全脑顶线行动目标监控及长程规划执行器。</p>
                        <p><strong className="text-white inline-block w-16">BA 11,12:</strong> 腹正中眶额皮层带 (vmPFC)，内化社会规范价值、抑制冲突冲动行为。</p>
                        <p><strong className="text-white inline-block w-16">BA 47:</strong> 额下回眶部特化区段，参与长句解构解析处理功能。</p>
                        <p><strong className="text-white inline-block w-[72px]">BA 23-33:</strong> 扣带回复合系统：前扣带 (24/32) 处理痛觉与认知冲突监测，后扣带 (23/31) 为 DMN 主节点枢纽。</p>
                        <p><strong className="text-white inline-block w-16">BA 28,34:</strong> 内嗅皮层特发区域，通往海马体长期记忆大门的咽喉通道。</p>
                        <p><strong className="text-white inline-block w-16">BA 38:</strong> 颞极复合区，极特殊的具有个人标签属性记忆融合存储区域网络。</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spins' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-2xl font-bold text-white mb-2 pb-4 border-b border-gray-800">MASILab SPINS 图谱平台库 (SPINS Atlas Visualization Library)</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  SPINS (A shared public library for brain atlas visualization) 是由 Vanderbilt 大学的 MASILab 创建的一个脑图谱公用项目。脑图谱对于理解解剖学至关重要，而 SPINS 构建了一个全自动的规范化流水线，利用 AI 与 3D 渲染器对脑区的灰质 (Gray matter), 白质 (White matter) 和静息态功能网络 (Functional labels) 进行批量可交互式重构。
                </p>
                
                <div className="bg-black border border-gray-800 rounded-lg p-5">
                  <h4 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-800">SPINS 系统涵盖的三大核心图谱类型</h4>
                  
                  <div className="space-y-5">
                    {/* brainCOLOR */}
                    <div className="bg-gray-900 border-l-4 border-l-gray-500 rounded p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-gray-800 text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded tracking-wider uppercase">Gray Matter</span>
                        <h5 className="font-bold text-white text-sm">brainCOLOR 皮层与皮下结构图谱</h5>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-1">
                        基于经典的形态学边界划分，涵盖 <strong className="text-gray-200">121 个脑区域</strong>。该模板实现了从大脑皮层表面到深部底节区域（如丘脑、尾状核等）的无缝拼接，是进行形态学容积测算和常规结构像（T1）标注的最佳普适性基础选择。
                      </p>
                    </div>

                    {/* Yeo 17 */}
                    <div className="bg-gray-900 border-l-4 border-l-teal-600 rounded p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-teal-900/30 text-teal-400 text-[10px] font-mono px-2 py-0.5 rounded tracking-wider uppercase">Functional</span>
                        <h5 className="font-bold text-white text-sm">Yeo 17-Network 静息态功能网络图谱</h5>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-1">
                        由 Yeo 等人基于大规模 fMRI 静息态数据聚类计算生成。包含 <strong className="text-gray-200">17 个全脑同步网络</strong> (例如: 默认模式网络 DMN, 额顶注意网络 FPN, 突显网络 SN, 腹侧注意网络 VAN 等)。这是神经功能网络分析 (FC) 研究中认知功能划分的黄金规范标准模板之一。
                      </p>
                    </div>

                    {/* Pandora TractSeg */}
                    <div className="bg-gray-900 border-l-4 border-l-amber-600 rounded p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-amber-900/30 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded tracking-wider uppercase">White Matter</span>
                        <h5 className="font-bold text-white text-sm">Pandora TractSeg 神经纤维束白质图谱</h5>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-1">
                        专门面向弥散张量成像 (DTI / DWI) 与白质高信号处理。包含 <strong className="text-gray-200">72 个标准化微结构神经纤维束</strong>（如上纵束、皮质脊髓束、穹窿等）。在脑网络通信（Connectome）、大脑外伤（TBI）、中风（Stroke）引起的解剖学断连研究中起确凿诊断作用。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/60 border border-sky-900/30 rounded-lg p-5">
                   <h4 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">SPINS 规范化可视化处理流水线与知识点总结</h4>
                   <ul className="list-decimal list-inside text-[11px] text-gray-400 space-y-2 mb-4 cursor-default">
                     <li><strong>Standard Space Registration:</strong> 首先将原空间 NIfTI 图谱向 MNI 模板空间完成线性配准，确保提取时的原点与网格间距标准化。</li>
                     <li><strong>Extraction & Masks:</strong> 穷举所有标签 (Label)，以单文件方式隔离提取每个脑区。这在 WebGL 端通常可转化为位运算符实现实时剥离。</li>
                     <li><strong>Glass Brain Rendering:</strong> 透明骨架 (Glass brain) 通过透明表面混合技术（Alpha-Blending, Ray-casting）投射在屏幕空间，这正是当前可视化模块正在计算的过程。</li>
                     <li><strong>LLM Auto-documentation:</strong> SPINS 利用大语言模型 (GPT-4o) 结合神经科学医学百科词条，自动化生成了所有大区段的功能详述——这也完美体现在了现在侧边栏的功能扩展和查询体系之中。</li>
                   </ul>

                   <div className="border-t border-sky-900/40 pt-4 mt-2">
                     <h5 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">SPINS 收录的重要图谱条目 (Atlas Items)</h5>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="bg-black/50 border border-gray-800 p-3 rounded">
                         <h6 className="text-[10px] font-bold text-gray-400 border-b border-gray-800 pb-1 mb-2">Yeo 17-Networks (部分功能网络)</h6>
                         <ul className="text-[10px] text-gray-500 space-y-1">
                           <li>Visual A/B (视觉网络)</li>
                           <li>Somatomotor A/B (体感运动网络)</li>
                           <li>Dorsal Attention A/B (背侧注意)</li>
                           <li>Salience/Ventral Attention (突显网络)</li>
                           <li>Control A/B/C (认知控制网络)</li>
                           <li>Default Mode A/B/C (默认模式网络 DMN)</li>
                           <li>Limbic A/B (边缘网络)</li>
                           <li>TempPar (颞顶网络)</li>
                         </ul>
                       </div>

                       <div className="bg-black/50 border border-gray-800 p-3 rounded">
                         <h6 className="text-[10px] font-bold text-gray-400 border-b border-gray-800 pb-1 mb-2">Pandora TractSeg (部分白质纤维束)</h6>
                         <ul className="text-[10px] text-gray-500 space-y-1">
                           <li>Arcuate Fasciculus (弓状束)</li>
                           <li>Cingulum (扣带束)</li>
                           <li>Corpus Callosum (胼胝体)</li>
                           <li>Corticospinal Tract (皮质脊髓束)</li>
                           <li>Fornix (穹窿)</li>
                           <li>Inferior Fronto-Occipital Fasciculus</li>
                           <li>Optic Radiation (视辐射)</li>
                           <li>Superior Longitudinal Fasciculus (上纵束)</li>
                         </ul>
                       </div>

                       <div className="bg-black/50 border border-gray-800 p-3 rounded">
                         <h6 className="text-[10px] font-bold text-gray-400 border-b border-gray-800 pb-1 mb-2">brainCOLOR (宏观皮层代表)</h6>
                         <ul className="text-[10px] text-gray-500 space-y-1">
                           <li>Frontal Pole (额极)</li>
                           <li>Precentral Gyrus (中央前回)</li>
                           <li>Superior Temporal Gyrus (颞上回)</li>
                           <li>Cingulate Cortex (扣带皮层)</li>
                           <li>Calcarine Cortex (距状沟皮层)</li>
                           <li>Insula (脑岛)</li>
                           <li>Thalamus (丘脑 - 皮下)</li>
                           <li>Putamen / Caudate (壳核/尾状核)</li>
                         </ul>
                       </div>
                     </div>
                   </div>

                   <div className="mt-4 bg-black/40 border border-gray-800 p-3 rounded flex flex-col text-[10px] text-gray-500 border-l-2 border-l-blue-500">
                     <span className="font-bold text-gray-400 mb-1">学术引用 (Citation):</span>
                     <em>Wali Sidiqyar, Gaurav Rudravaram, Elyssa M. McMaster, Trent M. Schwartz, Adam M. Saunders, Kurt G. Schilling, Bennett A. Landman "Introducing SPINS: A Shared Public Visualization Library of Neuroanatomical Structures."</em>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'spins_braincolor' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                  <h1 className="text-2xl font-bold text-white">brainCOLOR (灰质图谱)</h1>
                  <a href="https://masilab.github.io/SPINS/brainCOLOR_cortical/" target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-bold text-sky-400 hover:text-sky-300">
                    <ExternalLink size={14} className="mr-1" /> 原站对照
                  </a>
                </div>
                <div className="prose prose-invert prose-sm">
                  <p className="text-gray-400 leading-relaxed">
                    brainCOLOR 图谱是一个手工标注的人类神经解剖学分区方案，专家评分员在高分辨率 MRI 扫描上勾画了数百个皮质和皮层下结构，为全脑的灰质和白质区域分配了一致的、颜色编码的标签。
                  </p>
                  <img src="https://masilab.github.io/SPINS/brainCOLOR_cortical/exploding_glass_brain.gif" alt="brainCOLOR glass brain" className="w-full rounded-lg border border-gray-800 shadow-xl" />
                </div>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">区域列表 (Regions Index) - 点击查看详情 (Click for details)</h4>
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-[11px] text-left mb-6">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800 sticky top-0 bg-black">
                          <th className="pb-2 w-16">ID</th>
                          <th className="pb-2 w-48">解剖区域名称 (Anatomy)</th>
                          <th className="pb-2">原始链接映射 (Link Path)</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {spinsData.brainCOLOR.map((row) => (
                          <tr key={row[0]} onClick={() => setSelectedRegion({ url: row[2], title: row[1], color: '#38bdf8', type: 'braincolor' })} className="border-b border-gray-800/50 hover:bg-gray-800/80 transition-colors cursor-pointer group">
                            <td className="py-2 text-gray-500">{row[0]}</td>
                            <td className="py-2 text-sky-200 group-hover:text-sky-300 font-medium underline underline-offset-2">{row[1]}</td>
                            <td className="py-2 text-gray-400">{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spins_yeo' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                  <h1 className="text-2xl font-bold text-teal-400">Yeo 17 脑网络 (功能图谱)</h1>
                  <a href="https://masilab.github.io/SPINS/Yeo17_renders/" target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-bold text-teal-400 hover:text-teal-300">
                    <ExternalLink size={14} className="mr-1" /> 原站对照
                  </a>
                </div>
                <div className="prose prose-invert prose-sm">
                  <p className="text-gray-400 leading-relaxed">
                    Yeo-17 脑图谱是一个大规模皮层分区，它基于静息态功能 MRI (rs-fMRI) 连接模式将人类大脑皮层划分为 17 个固有的功能网络，捕捉了更广泛系统（如视觉、躯体运动、背侧和腹侧注意力、边缘系统、额顶叶控制和默认模式网络）中更细粒度的子网络。
                  </p>
                  <video src="https://masilab.github.io/SPINS/Yeo17_renders/yeo17.mp4" autoPlay loop muted playsInline className="w-full rounded-lg border border-gray-800 shadow-xl" />
                </div>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">网络列表 (Networks Index) - 点击查看详情 (Click for details)</h4>
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-[11px] text-left mb-6">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800 sticky top-0 bg-black">
                          <th className="pb-2 w-16">ID</th>
                          <th className="pb-2 w-48">网络区域名称 (Function)</th>
                          <th className="pb-2">原始链接映射 (Link Path)</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {spinsData.Yeo17.map((row) => (
                          <tr key={row[0]} onClick={() => setSelectedRegion({ url: row[2], title: row[1], color: '#2dd4bf', type: 'yeo' })} className="border-b border-gray-800/50 hover:bg-gray-800/80 transition-colors cursor-pointer group">
                            <td className="py-2 text-gray-500">{row[0]}</td>
                            <td className="py-2 font-bold text-teal-200 group-hover:text-teal-300 underline underline-offset-2">{row[1]}</td>
                            <td className="py-2 text-gray-400">{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spins_pandora' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                  <h1 className="text-2xl font-bold text-amber-500">Pandora TractSeg (白质图谱)</h1>
                  <a href="https://masilab.github.io/SPINS/Pandora_renders/" target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-bold text-amber-500 hover:text-amber-400">
                    <ExternalLink size={14} className="mr-1" /> 原站对照
                  </a>
                </div>
                <div className="prose prose-invert prose-sm">
                  <p className="text-gray-400 leading-relaxed">
                    Pandora-TractSeg 脑图谱是源自 Pandora 数据集的白质纤维束分区，该数据集聚合了使用 TractSeg 框架处理的多队列、多扫描仪扩散 MRI，以产生大脑中主要纤维束的一致的、数据驱动的轮廓。
                  </p>
                  <video src="https://masilab.github.io/SPINS/Pandora_renders/spinning_bundles_2.mp4" autoPlay loop muted playsInline className="w-full rounded-lg border border-gray-800 shadow-xl" />
                </div>
                <div className="bg-black border border-gray-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">纤维束列表 (Tracts Index) - 点击查看详情 (Click for details)</h4>
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-[11px] text-left mb-6">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800 sticky top-0 bg-black">
                          <th className="pb-2 w-16">ID</th>
                          <th className="pb-2 w-48">纤维束名称 (Tract Name)</th>
                          <th className="pb-2">原始链接映射 (Link Path)</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {spinsData.Pandora.map((row) => (
                          <tr key={row[0]} onClick={() => setSelectedRegion({ url: row[2], title: row[1], color: '#f59e0b', type: 'pandora' })} className="border-b border-gray-800/50 hover:bg-gray-800/80 transition-colors cursor-pointer group">
                            <td className="py-2 text-gray-500">{row[0]}</td>
                            <td className="py-2 text-amber-200 group-hover:text-amber-300 font-medium underline underline-offset-2">{row[1]}</td>
                            <td className="py-2 text-gray-400">{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

// Rebuild trigger
// Rebuild trigger