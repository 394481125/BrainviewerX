/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViewerProvider, useViewer } from './context';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import NiivueCanvas from './components/NiivueCanvas';
import TeachingPanel from './components/TeachingPanel';
import ToastContainer from './components/Toast';

function InnerApp() {
  const { showTeachingPanel, setShowTeachingPanel } = useViewer();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 text-[#E2E8F0] font-sans overflow-hidden">
      <Toolbar />
      <ToastContainer />
      <main className="flex flex-row flex-1 overflow-hidden relative">
        <section className="flex-1 shrink flex bg-gray-900 p-1 relative">
          <div className="flex-1 w-full h-full pane-border bg-black relative">
            <NiivueCanvas />
          </div>
        </section>
        <Sidebar />
        
        {showTeachingPanel && (
          <TeachingPanel onClose={() => setShowTeachingPanel(false)} />
        )}
      </main>
      <footer className="h-6 bg-gray-950 border-t border-gray-800 px-3 flex items-center justify-between text-[10px] shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 tracking-wider">工作区</span>
          <span className="text-sky-500 font-mono">WEBGL 2.0 引擎</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-500 opacity-80">纯前端离线渲染</span>
          <span className="text-gray-700 font-bold px-1">|</span>
          <span className="font-mono text-gray-400">v4.2.0稳定版</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ViewerProvider>
      <InnerApp />
    </ViewerProvider>
  );
}

