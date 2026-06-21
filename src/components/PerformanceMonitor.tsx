import { useEffect, useState } from "react";

export default function PerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const loop = (currentTime: number) => {
      frameCount++;
      const timeDiff = currentTime - lastTime;

      if (timeDiff >= 1000) {
        setFps(Math.round((frameCount * 1000) / timeDiff));
        frameCount = 0;
        lastTime = currentTime;

        // Check memory if available (Chrome/Edge only)
        const perf = performance as any;
        if (perf.memory && perf.memory.usedJSHeapSize) {
          setMemory(perf.memory.usedJSHeapSize / (1024 * 1024)); // MB
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex items-center space-x-3 text-[10px] font-mono">
      <span className="text-gray-400">
        FPS: <span className={fps >= 30 ? "text-green-500" : "text-yellow-500"}>{fps}</span>
      </span>
      {memory !== null && (
        <>
          <span className="text-gray-700">|</span>
          <span className="text-gray-400">
            Mem: <span className="text-blue-400">{memory.toFixed(1)} MB</span>
          </span>
        </>
      )}
    </div>
  );
}
