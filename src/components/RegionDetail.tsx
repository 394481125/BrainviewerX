import React from 'react';
import translations from '../translations.json';

export function RegionDetail({ region, onBack }: { region: { url: string; title: string; color: string; type: string }; onBack: () => void }) {
  const [content, setContent] = React.useState('<div class="p-8 text-gray-500 text-center animate-pulse">正在加载远程数据 (Loading)...</div>');

  React.useEffect(() => {
    let baseUrl = '';
    if (region.type === 'yeo') baseUrl = 'https://masilab.github.io/SPINS/Yeo17_renders/';
    else if (region.type === 'braincolor') baseUrl = 'https://masilab.github.io/SPINS/brainCOLOR_cortical/';
    else baseUrl = 'https://masilab.github.io/SPINS/Pandora_renders/';
    
    fetch(`${baseUrl}${region.url}/`)
      .then(r => r.text())
      .then(html => {
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, 'text/html');
         const markdownBody = doc.querySelector('.markdown-body');
         if (markdownBody) {
             // Fix image src to be absolute
             const imgs = markdownBody.querySelectorAll('img');
             imgs.forEach(img => {
                 const src = img.getAttribute('src');
                 if (src?.startsWith('/')) {
                     img.src = 'https://masilab.github.io' + src;
                 } else if (src && !src.startsWith('http')) {
                     const isVideo = src.endsWith('.mp4');
                     if (isVideo) {
                         const video = document.createElement('video');
                         video.src = `${baseUrl}${region.url}/` + src;
                         video.className = "rounded-lg border border-gray-800 my-4 max-w-full block shadow-lg shadow-black/50 mx-auto";
                         video.autoPlay = true;
                         video.loop = true;
                         video.muted = true;
                         video.playsInline = true;
                         img.replaceWith(video);
                     } else {
                         img.src = `${baseUrl}${region.url}/` + src;
                         img.className = "rounded-lg border border-gray-800 my-4 max-w-full block shadow-lg shadow-black/50 mx-auto";
                     }
                 }
                 if(img.parentNode) {
                   img.className = "rounded-lg border border-gray-800 my-4 max-w-full block shadow-lg shadow-black/50 mx-auto";
                 }
             });
             // Remove headers or links that go back
             const h1s = markdownBody.querySelectorAll('h1');
             h1s.forEach(h => {
                 if(h.textContent?.includes('SPINS') && !h.textContent.includes('_')) h.remove();
             });
             
             // Extract text content and structure it with tailwind
             const as = markdownBody.querySelectorAll('a');
             as.forEach(a => {
                const href = a.getAttribute('href');
                if(!href?.startsWith('http') && href) {
                   a.href = baseUrl + region.url + '/' + href;
                }
                a.target = '_blank';
                a.className = "text-sky-400 hover:text-sky-300 font-medium underline underline-offset-2";
             });
             
             const hrs = markdownBody.querySelectorAll('hr');
             hrs.forEach(hr => hr.className = "border-gray-800 my-8");

             // Apply translations if available
             if ((translations as Record<string, any>)[region.url]) {
                 const trans = (translations as Record<string, any>)[region.url];
                 const h2s = Array.from(markdownBody.querySelectorAll('h2'));
                 const overviewH2 = h2s.find(h => h.id === 'overview' || h.textContent?.toLowerCase().includes('overview'));
                 if (overviewH2) {
                     overviewH2.textContent = '概览 (Overview)';
                     let n1 = overviewH2.nextElementSibling;
                     if (n1 && n1.tagName === 'P') {
                         n1.textContent = trans.p1;
                         let n2 = n1.nextElementSibling;
                         if (n2 && n2.tagName === 'P') {
                             n2.textContent = trans.p2;
                         }
                     }
                 }
             }

             setContent(markdownBody.innerHTML);
         } else {
             setContent('<div class="p-8 text-red-500 border border-red-900 bg-red-950/20 rounded-lg">Failed to parse region content. Could not find markdown-body.</div>');
         }
      })
      .catch(e => {
         setContent('<div class="p-8 text-red-500 border border-red-900 bg-red-950/20 rounded-lg">Error loading region data: ' + e.message + '</div>');
      });
  }, [region]);

  return (
    <div className="absolute inset-0 bg-black/95 backdrop-blur z-20 flex flex-col animate-in fade-in slide-in-from-right-4">
      <div className="h-14 border-b border-gray-800 flex items-center px-6 shrink-0 bg-gray-950/80 sticky top-0 z-10 w-full">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center text-sm font-bold transition-colors uppercase tracking-wider bg-gray-800/50 hover:bg-gray-800 px-4 py-1.5 rounded-full">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          返回目录册 ({region.type.toUpperCase()} 级)
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="h-2 w-full" style={{backgroundColor: region.color}}></div>
            <div className="p-6 md:p-10">
                <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-100 prose-p:text-gray-400 prose-a:text-sky-400 prose-img:rounded-md prose-img:border prose-img:border-gray-800" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
      </div>
    </div>
  );
}
