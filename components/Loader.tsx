
import React, { useState, useEffect, useRef } from 'react';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide loader after a short delay to allow assets to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center" style={{ background: '#050505' }}>
      <div className="text-center text-white">
        <div ref={spinnerRef} className="mx-auto mb-6" style={{ width: 72, height: 72 }}>
          <img src="/favicon.png" alt="logo" className="w-full h-full" style={{ animation: 'spin 1.8s linear infinite', filter: 'drop-shadow(0 0 12px #00F5D4)' }} />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] opacity-80">Initializing Systems</p>
        <div className="mt-3 text-xs opacity-60">Loading shaders • Preparing particles • Syncing HUD</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
