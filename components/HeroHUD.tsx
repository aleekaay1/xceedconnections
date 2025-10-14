import React, { useEffect, useRef, useState } from 'react';

export default function HeroHUD() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / window.innerHeight);
      setY(p * -80);
      const root = document.documentElement;
      root.style.setProperty('--hud-opacity', String(1 - Math.min(1, p * 1.6)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 200, pointerEvents: 'none', transform: `translateY(${y}px)` }}
    >
      {/* Logo above title */}
      <img
        src="/favicon.png"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/favicon.svg'; }}
        alt="Vektor Logo"
        className="mb-4"
        style={{ width: 80, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(42,242,209,0.8))', opacity: 'var(--hud-opacity, 1)' }}
      />
      <h1
        className="text-[10vw] md:text-[8vw] font-light text-center px-4"
        style={{ 
          color: '#ffffff', 
          textShadow: '0 4px 80px rgba(255,255,255,0.35)', 
          opacity: 'var(--hud-opacity, 1)',
          letterSpacing: '0.3em',
          textIndent: '0.3em' // Compensate for letter-spacing pushing text right
        }}
      >
        VEKTOR SOLUTIONS
      </h1>
      <div 
        className="mt-6 text-xl md:text-2xl text-center px-8" 
        style={{ 
          color: '#e0e0e0', 
          opacity: 'var(--hud-opacity, 1)',
          letterSpacing: '0.35em',
          textIndent: '0.35em' // Compensate for letter-spacing
        }}
      >
        BUILDING THE FUTURE — ONE SYSTEM AT A TIME
      </div>

      {/* Subtle HUD corners */}
      <div className="absolute top-6 left-6 w-12 h-12" style={{ borderTop: '2px solid #2af2d1', borderLeft: '2px solid #2af2d1', opacity: 'var(--hud-opacity, 1)' }} />
      <div className="absolute top-6 right-6 w-12 h-12" style={{ borderTop: '2px solid #2af2d1', borderRight: '2px solid #2af2d1', opacity: 'var(--hud-opacity, 1)' }} />
      <div className="absolute bottom-6 left-6 w-12 h-12" style={{ borderBottom: '2px solid #2af2d1', borderLeft: '2px solid #2af2d1', opacity: 'var(--hud-opacity, 1)' }} />
      <div className="absolute bottom-6 right-6 w-12 h-12" style={{ borderBottom: '2px solid #2af2d1', borderRight: '2px solid #2af2d1', opacity: 'var(--hud-opacity, 1)' }} />

      {/* System status and live time */}
      <div className="absolute top-12 left-10 text-xs md:text-sm tracking-widest" style={{ color: '#99ffe8', opacity: 'var(--hud-opacity, 1)' }}>
        SYSTEM STATUS: ONLINE
      </div>
      <LiveClock />

      {/* Dull scanline overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(to bottom, rgba(42,242,209,0.05) 0, rgba(42,242,209,0.05) 1px, transparent 2px)', opacity: 'var(--hud-opacity, 1)' }} />
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const update = () => setNow(new Date().toLocaleTimeString());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute top-12 right-10 text-xs md:text-sm tracking-widest" style={{ color: '#99ffe8' }}>
      {now}
    </div>
  );
}


