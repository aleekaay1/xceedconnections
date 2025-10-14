import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MorphingElementProps {
  scrollProgress: number;
}

export default function MorphingElement({ scrollProgress }: MorphingElementProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const totalSections = 7;
  const particleCount = 800; // More particles for smoother shapes

  // Circular sprite texture
  const circleTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2);
      ctx.closePath();
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size*0.45);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }, []);

  // INTRO: Fibonacci Sphere
  const makeFibonacciSphere = (radius: number): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const offset = 2 / particleCount;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < particleCount; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      arr[i * 3] = x * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = z * radius;
    }
    return arr;
  };

  // MEDICAL: Clean DNA Double Helix (like the reference image)
  const makeDNA = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const length = 4.5; // Shorter vertical strand
    const turns = 3; // Number of complete helical turns
    const radius = 0.65; // Distance from center axis
    
    // All particles go to the two helixes - no base pairs
    const particlesPerStrand = Math.floor(particleCount / 2);
    
    let idx = 0;
    
    // First strand (helix 1)
    for (let i = 0; i < particlesPerStrand && idx < particleCount; i++) {
      const t = i / particlesPerStrand;
      const y = (t - 0.5) * length;
      const angle = t * turns * Math.PI * 2;
      
      // Smooth taper (wider in middle, narrower at ends)
      const taper = 0.8 + 0.2 * Math.sin(t * Math.PI);
      const r = radius * taper;
      
      arr[idx * 3] = Math.cos(angle) * r;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = Math.sin(angle) * r;
      idx++;
    }
    
    // Second strand (helix 2) - 180 degrees out of phase
    for (let i = 0; i < particlesPerStrand && idx < particleCount; i++) {
      const t = i / particlesPerStrand;
      const y = (t - 0.5) * length;
      const angle = t * turns * Math.PI * 2 + Math.PI; // Opposite side
      
      // Smooth taper (wider in middle, narrower at ends)
      const taper = 0.8 + 0.2 * Math.sin(t * Math.PI);
      const r = radius * taper;
      
      arr[idx * 3] = Math.cos(angle) * r;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = Math.sin(angle) * r;
      idx++;
    }
    
    // Fill any remaining
    for (; idx < particleCount; idx++) {
      arr[idx * 3] = 0;
      arr[idx * 3 + 1] = 0;
      arr[idx * 3 + 2] = 0;
    }
    
    return arr;
  };

  // WEB DEV: Computer Monitor with Stand and Desktop Icons
  const makeWebScreen = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.5, h = 2.2; // Screen dimensions
    const standW = 0.4, standH = 1.0; // Stand dimensions
    const baseW = 1.2, baseH = 0.15; // Base dimensions
    
    let idx = 0;
    
    // Screen border (40% of particles)
    const borderCount = Math.floor(particleCount * 0.4);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < borderCount && idx < particleCount; i++) {
      const t = i / borderCount;
      const dist = t * perimeter;
      let x = 0, y = 0;
      
      if (dist < w) {
        x = -w/2 + dist;
        y = h/2;
      } else if (dist < w + h) {
        x = w/2;
        y = h/2 - (dist - w);
      } else if (dist < 2*w + h) {
        x = w/2 - (dist - w - h);
        y = -h/2;
      } else {
        x = -w/2;
        y = -h/2 + (dist - 2*w - h);
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y + 0.5; // Lift screen up
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Desktop icons (grid inside screen) (30% of particles)
    const iconCount = Math.floor(particleCount * 0.3);
    const cols = 6, rows = 4;
    for (let i = 0; i < iconCount && idx < particleCount; i++) {
      const iconIdx = Math.floor((i / iconCount) * (cols * rows));
      const row = Math.floor(iconIdx / cols);
      const col = iconIdx % cols;
      
      const x = -w/2 + 0.4 + (col / (cols - 1)) * (w - 0.8);
      const y = h/2 - 0.4 - (row / (rows - 1)) * (h - 0.8);
      
      // Deterministic offset based on particle index (no random)
      const offsetX = ((i % 5) - 2) * 0.03; // -0.06 to 0.06
      const offsetY = (Math.floor(i / 5) % 5 - 2) * 0.03;
      
      arr[idx * 3] = x + offsetX;
      arr[idx * 3 + 1] = y + 0.5 + offsetY;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Stand (20% of particles)
    const standCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < standCount && idx < particleCount; i++) {
      const t = i / standCount;
      // Deterministic x position based on index
      const x = ((i % 7) - 3) * (standW / 6);
      const y = -h/2 + 0.5 - (t * standH);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Base (10% of particles)
    const baseStart = idx;
    for (; idx < particleCount; idx++) {
      const localIdx = idx - baseStart;
      // Deterministic x position
      const x = ((localIdx % 9) - 4) * (baseW / 8);
      const y = -h/2 + 0.5 - standH - baseH/2;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
    }
    
    return arr;
  };

  // ROBOTICS: Classic Robot Shape
  const makeRobot = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const bodyW = 1.0, bodyH = 1.2; // Body (rectangle)
    const headR = 0.4; // Head (circle)
    const limbW = 0.15, limbH = 0.8; // Limbs
    
    let idx = 0;
    
    // Body rectangle (30% of particles)
    const bodyCount = Math.floor(particleCount * 0.3);
    const bodyPerimeter = (bodyW + bodyH) * 2;
    for (let i = 0; i < bodyCount && idx < particleCount; i++) {
      const t = i / bodyCount;
      const dist = t * bodyPerimeter;
      let x = 0, y = 0;
      
      if (dist < bodyW) {
        x = -bodyW/2 + dist;
        y = bodyH/2;
      } else if (dist < bodyW + bodyH) {
        x = bodyW/2;
        y = bodyH/2 - (dist - bodyW);
      } else if (dist < 2*bodyW + bodyH) {
        x = bodyW/2 - (dist - bodyW - bodyH);
        y = -bodyH/2;
      } else {
        x = -bodyW/2;
        y = -bodyH/2 + (dist - 2*bodyW - bodyH);
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Head circle (20% of particles)
    const headCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < headCount && idx < particleCount; i++) {
      const angle = (i / headCount) * Math.PI * 2;
      const x = Math.cos(angle) * headR;
      const y = bodyH/2 + 0.2 + headR + Math.sin(angle) * headR;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Arms - left and right (15% each = 30% total)
    const armCount = Math.floor(particleCount * 0.15);
    for (let i = 0; i < armCount && idx < particleCount; i++) {
      const t = i / armCount;
      const x = -bodyW/2 - limbW/2;
      const y = bodyH/2 - 0.2 - (t * limbH);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    for (let i = 0; i < armCount && idx < particleCount; i++) {
      const t = i / armCount;
      const x = bodyW/2 + limbW/2;
      const y = bodyH/2 - 0.2 - (t * limbH);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Legs - left and right (10% each = 20% total)
    const legCount = Math.floor(particleCount * 0.1);
    for (let i = 0; i < legCount && idx < particleCount; i++) {
      const t = i / legCount;
      const x = -bodyW/3;
      const y = -bodyH/2 - (t * limbH);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    for (let i = 0; i < legCount && idx < particleCount; i++) {
      const t = i / legCount;
      const x = bodyW/3;
      const y = -bodyH/2 - (t * limbH);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Antennas (remaining particles)
    for (; idx < particleCount; idx++) {
      const side = (idx % 2) ? 1 : -1;
      const t = Math.random();
      const x = side * headR * 0.6;
      const y = bodyH/2 + 0.2 + headR * 2 + (t * 0.4);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
    }
    
    return arr;
  };

  // GAMING: Game Controller (PS4 style)
  const makeController = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.2, h = 1.6;
    const gripW = 0.6, gripH = 1.2;
    
    let idx = 0;
    
    // Main body outline (40% of particles)
    const bodyCount = Math.floor(particleCount * 0.4);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < bodyCount && idx < particleCount; i++) {
      const t = i / bodyCount;
      const dist = t * perimeter;
      let x = 0, y = 0;
      
      if (dist < w) {
        x = -w/2 + dist;
        y = h/2;
      } else if (dist < w + h) {
        x = w/2;
        y = h/2 - (dist - w);
      } else if (dist < 2*w + h) {
        x = w/2 - (dist - w - h);
        y = -h/2;
      } else {
        x = -w/2;
        y = -h/2 + (dist - 2*w - h);
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // D-Pad (left side) - Plus shape (20% of particles)
    const dpadCount = Math.floor(particleCount * 0.2);
    const dpadSize = 0.5;
    for (let i = 0; i < dpadCount && idx < particleCount; i++) {
      const t = i / dpadCount;
      let x = 0, y = 0;
      
      if (t < 0.25) {
        // Up
        x = -w/3;
        y = 0.1 + (t / 0.25) * dpadSize;
      } else if (t < 0.5) {
        // Down
        x = -w/3;
        y = 0.1 - ((t - 0.25) / 0.25) * dpadSize;
      } else if (t < 0.75) {
        // Left
        x = -w/3 - ((t - 0.5) / 0.25) * dpadSize;
        y = 0.1;
      } else {
        // Right
        x = -w/3 + ((t - 0.75) / 0.25) * dpadSize;
        y = 0.1;
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Action buttons (right side) - 4 circles (20% of particles)
    const buttonCount = Math.floor(particleCount * 0.05);
    const buttonPositions = [
      { x: w/3, y: 0.5 }, // Triangle/Y
      { x: w/3, y: -0.3 }, // Cross/A
      { x: w/3 - 0.4, y: 0.1 }, // Square/X
      { x: w/3 + 0.4, y: 0.1 }, // Circle/B
    ];
    
    for (let b = 0; b < 4; b++) {
      for (let i = 0; i < buttonCount && idx < particleCount; i++) {
        const angle = (i / buttonCount) * Math.PI * 2;
        const r = 0.2;
        const x = buttonPositions[b].x + Math.cos(angle) * r;
        const y = buttonPositions[b].y + Math.sin(angle) * r;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Fill remaining with grip details
    for (; idx < particleCount; idx++) {
      const side = (idx % 2) ? 1 : -1;
      const x = side * (w/2 + (Math.random() * gripW));
      const y = -h/2 - (Math.random() * gripH);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
    }
    
    return arr;
  };

  // BLOCKCHAIN: Chain of Connected Blocks
  const makeBlockchain = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const blocks = 5;
    const blockSize = 1.1;
    const spacing = 1.6;
    const particlesPerBlock = Math.floor(particleCount * 0.85 / blocks);
    const particlesPerLink = Math.floor(particleCount * 0.15 / (blocks - 1));
    
    let idx = 0;
    
    // Create blocks along a diagonal
    for (let b = 0; b < blocks && idx < particleCount; b++) {
      const cx = (b - (blocks - 1) / 2) * spacing;
      const cy = (b - (blocks - 1) / 2) * 0.6;
      const half = blockSize / 2;
      const perimeter = blockSize * 4;
      
      // Block perimeter
      for (let i = 0; i < particlesPerBlock && idx < particleCount; i++) {
        const t = i / particlesPerBlock;
        const dist = t * perimeter;
        let x = 0, y = 0;
        
        if (dist < blockSize) {
          x = -half + dist;
          y = half;
        } else if (dist < 2 * blockSize) {
          x = half;
          y = half - (dist - blockSize);
        } else if (dist < 3 * blockSize) {
          x = half - (dist - 2 * blockSize);
          y = -half;
        } else {
          x = -half;
          y = -half + (dist - 3 * blockSize);
        }
        
        arr[idx * 3] = cx + x;
        arr[idx * 3 + 1] = cy + y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
      
      // Link to next block (diagonal line)
      if (b < blocks - 1) {
        const nextCx = ((b + 1) - (blocks - 1) / 2) * spacing;
        const nextCy = ((b + 1) - (blocks - 1) / 2) * 0.6;
        
        for (let i = 0; i < particlesPerLink && idx < particleCount; i++) {
          const t = i / particlesPerLink;
          const x = THREE.MathUtils.lerp(cx + half, nextCx - half, t);
          const y = THREE.MathUtils.lerp(cy - half, nextCy + half, t);
          
          arr[idx * 3] = x;
          arr[idx * 3 + 1] = y;
          arr[idx * 3 + 2] = 0;
          idx++;
        }
      }
    }
    
    // Fill any remaining
    for (; idx < particleCount; idx++) {
      arr[idx * 3] = 0;
      arr[idx * 3 + 1] = 0;
      arr[idx * 3 + 2] = 0;
    }
    
    return arr;
  };

  // Precompute all shapes
  const sectionShapes = useMemo(() => [
    makeFibonacciSphere(1.8), // Intro
    makeDNA(),                // Medical
    makeWebScreen(),          // Web Dev
    makeRobot(),              // Robotics
    makeController(),         // Gaming
    makeBlockchain(),         // Blockchain
    makeFibonacciSphere(1.6), // Outro
  ], [particleCount]);

  // Detect mobile
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Section positions (alternating left/right on desktop, centered on mobile)
  const sectionOffsets = useMemo(() => {
    if (isMobile) {
      // Mobile: all centered
      return [
        new THREE.Vector3(0, 0, 0),  // Intro
        new THREE.Vector3(0, 0, 0),  // Medical
        new THREE.Vector3(0, 0, 0),  // Web
        new THREE.Vector3(0, 0, 0),  // Robotics
        new THREE.Vector3(0, 0, 0),  // Gaming
        new THREE.Vector3(0, 0, 0),  // Blockchain
        new THREE.Vector3(0, 0, 0),  // Outro
      ];
    }
    
    // Desktop: alternating left/right
    return [
      new THREE.Vector3(-2.4, 0.0, 0),  // Intro: far left
      new THREE.Vector3(1.8, 0.0, 0),   // Medical: right
      new THREE.Vector3(-1.8, 0.0, 0),  // Web: left
      new THREE.Vector3(1.8, 0.0, 0),   // Robotics: right
      new THREE.Vector3(-1.5, 0.0, 0),  // Gaming: left
      new THREE.Vector3(1.6, 0.0, 0),   // Blockchain: right
      new THREE.Vector3(0.0, 0.0, 0),   // Outro: center
    ];
  }, [isMobile]);

  // Colors per section
  const sectionColors = [
    new THREE.Color('#ffffff'), // Intro
    new THREE.Color('#9bd7ff'), // Medical (blue)
    new THREE.Color('#9ffcf0'), // Web (cyan)
    new THREE.Color('#e0e0e0'), // Robotics (silver)
    new THREE.Color('#d6b6ff'), // Gaming (purple)
    new THREE.Color('#a8ffe8'), // Blockchain (mint)
    new THREE.Color('#ffffff'), // Outro
  ];

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Calculate scroll progress based on actual page structure
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const heroHeight = viewportHeight; // 100vh
    const sectionHeight = viewportHeight; // 100vh per section now
    
    // Total page: Hero (100vh) + 6 sections (100vh each) = 700vh
    const totalPageHeight = heroHeight + (sectionHeight * 6);
    
    // Calculate normalized scroll (0 to 1 across entire page)
    let normalizedScroll = scrollY / totalPageHeight;
    normalizedScroll = Math.min(0.9999, Math.max(0, normalizedScroll));
    
    // Map to 7 morph sections (hero→medical→web→robotics→gaming→blockchain→outro)
    const morphSections = 7;
    const sectionIndex = normalizedScroll * morphSections;
    let currentMorphIndex = Math.floor(sectionIndex);
    let nextMorphIndex = Math.min(currentMorphIndex + 1, morphSections - 1);
    let rawProgress = sectionIndex % 1;

    // HIDE MORPH ON HERO SECTION - no particles at all
    if (currentMorphIndex === 0) {
      // Make particles invisible by setting size to 0
      materialRef.current.size = 0;
      materialRef.current.opacity = 0;
      return;
    }
    
    // Restore visibility for other sections
    materialRef.current.opacity = 1.0;

    // Timing: Keep shapes LOCKED until very end of section
    // Only morph in the transition zone between sections (last 20%)
    let morphProgress = 0;
    
    if (isMobile) {
      // Mobile: Hold shape for 80%, morph in last 20%
      if (rawProgress < 0.8) {
        // Hold current shape
        morphProgress = 0;
      } else {
        // Morph to next shape in last 20%
        morphProgress = (rawProgress - 0.8) / 0.2;
      }
    } else {
      // Desktop: Hold shape for 75%, morph in last 25%
      if (rawProgress < 0.75) {
        // Hold current shape fully formed
        morphProgress = 0;
      } else {
        // Morph to next shape in last 25%
        morphProgress = (rawProgress - 0.75) / 0.25;
      }
    }

    // Smooth easing for visible transitions
    const easedProgress = morphProgress * morphProgress * (3 - 2 * morphProgress);

    // Interpolate positions with 1:1 particle mapping
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const currentShape = sectionShapes[currentMorphIndex];
    const nextShape = sectionShapes[nextMorphIndex];
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = THREE.MathUtils.lerp(currentShape[i3], nextShape[i3], easedProgress);
      positions[i3 + 1] = THREE.MathUtils.lerp(currentShape[i3 + 1], nextShape[i3 + 1], easedProgress);
      positions[i3 + 2] = THREE.MathUtils.lerp(currentShape[i3 + 2], nextShape[i3 + 2], easedProgress);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Position: move shape in sync with morph progress
    const offsetA = sectionOffsets[currentMorphIndex];
    const offsetB = sectionOffsets[nextMorphIndex];
    
    // Push shapes UP (positive Y) to appear in gap above text
    const verticalOffset = isMobile ? 1.3 : 1.8; // Slightly higher lift
    
    pointsRef.current.position.set(
      THREE.MathUtils.lerp(offsetA.x, offsetB.x, easedProgress),
      THREE.MathUtils.lerp(offsetA.y, offsetB.y, easedProgress) + verticalOffset,
      0
    );

    // Scale: smaller on mobile (0.5x), normal on desktop
    const mobileScale = isMobile ? 0.5 : 1.0;
    pointsRef.current.scale.set(mobileScale, mobileScale, mobileScale);

    // Rotation: constant spin on Y-axis
    pointsRef.current.rotation.set(0, 0, 0);
    pointsRef.current.rotation.y = time * 0.6;
    pointsRef.current.rotation.x = Math.sin(time * 0.9) * 0.08;

    // Color transition
    const colorA = sectionColors[currentMorphIndex];
    const colorB = sectionColors[nextMorphIndex];
    const color = colorA.clone().lerp(colorB, easedProgress);
    materialRef.current.color.copy(color);

    // Size: subtle pulse during transitions
    const pulse = 0.9 + Math.sin(easedProgress * Math.PI) * 0.2;
    materialRef.current.size = 0.06 * pulse;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={sectionShapes[0]}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        color="#ffffff"
        transparent
        opacity={1.0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        map={circleTexture as any}
        alphaTest={0.3}
      />
    </points>
  );
}
