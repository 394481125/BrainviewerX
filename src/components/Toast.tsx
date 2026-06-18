import React from 'react';
import { useViewer } from '../context';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toastMsg, setToastMsg } = useViewer();

  if (!toastMsg) return null;

  const Icon = toastMsg.type === 'error' ? AlertCircle 
             : toastMsg.type === 'success' ? CheckCircle 
             : Info;

  const borderColor = toastMsg.type === 'error' ? 'border-red-500/50' 
                    : toastMsg.type === 'success' ? 'border-green-500/50' 
                    : 'border-sky-500/50';

  const iconColor = toastMsg.type === 'error' ? 'text-red-400' 
                  : toastMsg.type === 'success' ? 'text-green-400' 
                  : 'text-sky-400';

  const bgColor = toastMsg.type === 'error' ? 'bg-red-950/40' 
                : toastMsg.type === 'success' ? 'bg-green-950/40' 
                : 'bg-sky-950/40';

  return (
    <div className="fixed top-16 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-lg border ${borderColor} ${bgColor} backdrop-blur-md shadow-2xl w-80 max-w-full flex items-start space-x-3`}>
        <Icon className={`${iconColor} shrink-0 mt-0.5`} size={18} />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-200 mb-1">{toastMsg.title}</h4>
          <p className="text-xs text-gray-400 leading-tight">{toastMsg.description}</p>
        </div>
        <button onClick={() => setToastMsg(null)} className="text-gray-500 hover:text-gray-300 transition-colors shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
