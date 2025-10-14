import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!ring || !dot || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const show = () => {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    };
    const hide = () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      show();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      show();
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      // trailing chaser (slower)
      const tx = parseFloat(trail.dataset.x || '0');
      const ty = parseFloat(trail.dataset.y || '0');
      const nx = tx + (mouseX - tx) * 0.08;
      const ny = ty + (mouseY - ty) * 0.08;
      trail.dataset.x = String(nx);
      trail.dataset.y = String(ny);
      trail.style.transform = `translate3d(${nx - 6}px, ${ny - 6}px, 0)`;
      requestAnimationFrame(animate);
    };

    // Hide system cursor on fine pointers; ensure body isn't overriding
    // Never force-hide system cursor; let our custom cursor overlay instead
    document.body.style.cursor = '';

    // Ensure visible initially on desktop
    show();
    trail.style.opacity = '0.6';

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', hide as any, { passive: true });
    document.addEventListener('pointerleave', hide as any, { passive: true });
    // On touch, keep cursor hidden but don't toggle layout
    document.addEventListener('touchstart', hide as any, { passive: true });
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('pointermove', onPointerMove as any);
      document.removeEventListener('mouseleave', hide as any);
      document.removeEventListener('pointerleave', hide as any);
      document.removeEventListener('touchstart', hide as any);
    };
  }, []);

  const root = typeof document !== 'undefined' ? document.body : null;
  if (!root) return null;
  return createPortal((
    <>
      <div ref={ringRef} className="cursor" style={{ position: 'fixed' }} />
      <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed' }} />
      <div ref={trailRef} className="cursor-dot" style={{ width: 12, height: 12, opacity: 0.6, filter: 'blur(2px)', position: 'fixed' }} />
    </>
  ), root);
}


