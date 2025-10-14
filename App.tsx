
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import Cursor from './components/Cursor';
import { SECTIONS } from './constants';

export default function App() {
  // Hero (100vh) + 5 content sections (100vh each) + Outro (100vh) = 700vh
  const totalHeight = 100 + (5 * 100) + 100; // vh

  return (
    <div className="relative w-full" style={{ height: `${totalHeight}vh` }}>
      {/* 3D Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none">
        <Canvas
          shadows={false}
          dpr={[1, 2]}
          performance={{ min: 0.3 }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay Content */}
      <Overlay />

      {/* Custom Cursor */}
      <Cursor />
    </div>
  );
}
