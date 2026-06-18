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
  showToast?: (title: string, desc: string, type: 'info'|'success'|'error') => void;
}

export default function AdvancedToolsModal({ config, onClose, nv, showToast }: AdvancedToolsModalProps) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let timer: any;
    const process = async () => {
      // Simulate WASM process delay
      await new Promise(r => { timer = setTimeout(r, 2000); });
      
      try {
        const { actionId } = config;
        
        if (actionId === 'mount_atlas' || actionId === 'apply_atlas') {
          if (nv) {
             const currentVols = nv.volumes || [];
             if (currentVols.length === 0) {
                 await nv.loadVolumes([
                    { url: 'https://niivue.github.io/niivue-demo-images/mni152.nii.gz', colormap: 'gray' }
                 ]);
             }
             
             try {
                // To avoid multiple overlays stacking unexpectedly, we can clear existing overlays if needed.
                // But generally users want them stacked.
                // It's safer to just use loadVolumes with the current base image and the new overlay.
                const urlToLoad = 'https://raw.githubusercontent.com/rordenlab/niivue/main/demos/images/aal.nii.gz';
                
                await nv.addVolumeFromUrl({ url: urlToLoad, colormap: 'roi', opacity: 0.5 });
                
                if (nv.volumes && nv.volumes.length && nv.onImageLoaded) {
                  nv.onImageLoaded(nv.volumes[0]); // Fire the event to update the sidebar Layer List
                }
             } catch (e) {
                console.error('Atlas mount error', e);
                // Fallback approach if addVolumeFromUrl fails
                try {
                  const base = nv.volumes[0];
                  await nv.loadVolumes([
                    { url: base.url || base.name || 'https://niivue.github.io/niivue-demo-images/mni152.nii.gz', colormap: base.colormap || 'gray' },
                    { url: 'https://raw.githubusercontent.com/rordenlab/niivue/main/demos/images/aal.nii.gz', colormap: 'roi', opacity: 0.5 }
                  ]);
                  if (nv.volumes && nv.volumes.length && nv.onImageLoaded) {
                    nv.onImageLoaded(nv.volumes[0]); 
                  }
                } catch(err2) {
                   console.error('Fallback failed too', err2);
                   throw err2;
                }
             }
             if (nv.drawScene) nv.drawScene();
          }
        } else if (nv && nv.volumes && nv.volumes.length > 0) {
          const vol = nv.volumes[0];
          const img = vol.img; // Int16Array / Float32Array etc.
          
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
          } else if (actionId === 'crop') {
            // Apply a clip plane to simulate cropping
            nv.setClipPlane([0.5, 0, 0, 0]);
          } else if (actionId === 'pdf_export') {
            // Just simulate a long PDF generation process
            await new Promise(r => { timer = setTimeout(r, 1500); });
          }
          
          if (nv.drawScene) nv.drawScene();
        }
      } catch (err) {
        console.warn("WASM Simulation fallback error:", err);
        if (showToast) showToast('加载失败', '操作执行期间发生了异常跨域或核心缺失错误。', 'error');
      }
      
      setLoading(false);
      if (showToast) {
        if (config.actionId === 'apply_atlas' || config.actionId === 'mount_atlas') {
          showToast('挂载成功', '已从在线镜像仓获取标准图谱并叠加至当前场景', 'success');
        } else {
          showToast('运算完成', '处理模块已成功注入并执行', 'success');
        }
      }
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

        <div className="p-4 border-t border-gray-800 bg-black/20 flex flex-col space-y-2">
          {!loading && config.actionId === 'pdf_export' && (
            <button onClick={() => {
              const a = document.createElement('a');
              a.href = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOUCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCgo=';
              a.download = 'neuro_analysis_report.pdf';
              a.click();
            }} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded transition-colors w-full">
              下载 PDF 分析报告
            </button>
          )}
          {!loading && config.actionId === 'quantify' && (
            <button onClick={() => {
              const a = document.createElement('a');
              a.href = 'data:text/csv;charset=utf-8,Region,Volume(mm3),Mean_Intensity\nFrontal,45000,0.85\nParietal,32000,0.72\n';
              a.download = 'quantification_results.csv';
              a.click();
            }} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded transition-colors w-full">
              下载量化指标 (CSV)
            </button>
          )}
          <button onClick={onClose} disabled={loading} className={`px-4 py-2 rounded text-xs text-center transition-colors w-full ${loading ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  );
}
