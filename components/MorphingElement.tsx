import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MorphingElementProps {
  scrollProgress: number;
}

export default function MorphingElement({ scrollProgress }: MorphingElementProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const totalSections = 13;
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

  // HOSTING: Realistic Server Rack with LED indicators
  const makeServerRack = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 2.8, h = 3.8;
    const servers = 5;
    const serverH = h / servers;
    
    let idx = 0;
    
    // Server rack frame (25% of particles)
    const frameCount = Math.floor(particleCount * 0.25);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < frameCount && idx < particleCount; i++) {
      const t = i / frameCount;
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
    
    // Individual server units (50% of particles)
    const serverCount = Math.floor(particleCount * 0.5 / servers);
    for (let s = 0; s < servers; s++) {
      const serverY = h/2 - (s + 0.5) * serverH;
      const serverW = w - 0.3;
      
      for (let i = 0; i < serverCount && idx < particleCount; i++) {
        const t = i / serverCount;
        const x = -serverW/2 + (t * serverW);
        const y = serverY;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // LED indicators (15% of particles)
    const ledCount = Math.floor(particleCount * 0.15);
    for (let s = 0; s < servers; s++) {
      const serverY = h/2 - (s + 0.5) * serverH;
      const ledsPerServer = Math.floor(ledCount / servers);
      
      for (let i = 0; i < ledsPerServer && idx < particleCount; i++) {
        const ledX = w/2 - 0.2;
        const ledY = serverY + ((i % 3) - 1) * 0.15;
        
        arr[idx * 3] = ledX;
        arr[idx * 3 + 1] = ledY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Network cables (10% of particles)
    const cableCount = Math.floor(particleCount * 0.1);
    for (let i = 0; i < cableCount && idx < particleCount; i++) {
      const t = i / cableCount;
      const x = -w/2 - 0.3;
      const y = h/2 - (t * h);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // CONSULTATION: Professional Briefcase with details
  const makeBriefcase = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.2, h = 2.2;
    
    let idx = 0;
    
    // Briefcase body (50% of particles)
    const bodyCount = Math.floor(particleCount * 0.5);
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
    
    // Handle (15% of particles)
    const handleCount = Math.floor(particleCount * 0.15);
    for (let i = 0; i < handleCount && idx < particleCount; i++) {
      const t = i / handleCount;
      const x = -w/3 + (t * (2*w/3));
      const y = h/2 + 0.4;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Combination locks (20% of particles)
    const lockCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < lockCount && idx < particleCount; i++) {
      const side = (i % 2) ? 1 : -1;
      const x = side * w/4;
      const y = h/2 - 0.4;
      
      // Create circular lock shape
      const lockAngle = (i / lockCount) * Math.PI * 2;
      const lockRadius = 0.15;
      const lockX = x + Math.cos(lockAngle) * lockRadius;
      const lockY = y + Math.sin(lockAngle) * lockRadius;
      
      arr[idx * 3] = lockX;
      arr[idx * 3 + 1] = lockY;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Corner reinforcements (15% of particles)
    const cornerCount = Math.floor(particleCount * 0.15);
    const corners = [
      { x: -w/2 + 0.2, y: h/2 - 0.2 },
      { x: w/2 - 0.2, y: h/2 - 0.2 },
      { x: -w/2 + 0.2, y: -h/2 + 0.2 },
      { x: w/2 - 0.2, y: -h/2 + 0.2 }
    ];
    
    for (let c = 0; c < 4; c++) {
      const cornerParticles = Math.floor(cornerCount / 4);
      for (let i = 0; i < cornerParticles && idx < particleCount; i++) {
        const angle = (i / cornerParticles) * Math.PI * 2;
        const radius = 0.1;
        const x = corners[c].x + Math.cos(angle) * radius;
        const y = corners[c].y + Math.sin(angle) * radius;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // WEB DEV: Laptop with Code Screen
  const makeCodeBrackets = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const screenW = 3.0, screenH = 2.0;
    const baseW = 3.2, baseH = 0.3;
    
    let idx = 0;
    
    // Laptop screen (40% of particles)
    const screenCount = Math.floor(particleCount * 0.4);
    const screenPerimeter = (screenW + screenH) * 2;
    for (let i = 0; i < screenCount && idx < particleCount; i++) {
      const t = i / screenCount;
      const dist = t * screenPerimeter;
      let x = 0, y = 0;
      
      if (dist < screenW) {
        x = -screenW/2 + dist;
        y = screenH/2 + 0.5;
      } else if (dist < screenW + screenH) {
        x = screenW/2;
        y = screenH/2 + 0.5 - (dist - screenW);
      } else if (dist < 2*screenW + screenH) {
        x = screenW/2 - (dist - screenW - screenH);
        y = -screenH/2 + 0.5;
      } else {
        x = -screenW/2;
        y = -screenH/2 + 0.5 + (dist - 2*screenW - screenH);
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Code lines on screen (35% of particles)
    const codeCount = Math.floor(particleCount * 0.35);
    const lines = 8;
    for (let line = 0; line < lines; line++) {
      const lineParticles = Math.floor(codeCount / lines);
      const lineY = screenH/2 + 0.5 - 0.2 - (line * 0.2);
      
      for (let i = 0; i < lineParticles && idx < particleCount; i++) {
        const t = i / lineParticles;
        const x = -screenW/2 + 0.3 + (t * (screenW - 0.6));
        const y = lineY;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Laptop base (15% of particles)
    const baseCount = Math.floor(particleCount * 0.15);
    for (let i = 0; i < baseCount && idx < particleCount; i++) {
      const t = i / baseCount;
      const x = -baseW/2 + (t * baseW);
      const y = -screenH/2 + 0.5 - baseH/2;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Trackpad (10% of particles)
    const trackpadCount = Math.floor(particleCount * 0.1);
    for (let i = 0; i < trackpadCount && idx < particleCount; i++) {
      const t = i / trackpadCount;
      const angle = t * Math.PI * 2;
      const radius = 0.3;
      const x = Math.cos(angle) * radius;
      const y = -screenH/2 + 0.5 - baseH - 0.2;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // CONFIGURATION: Detailed Gear with Center Hub
  const makeGear = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const outerRadius = 1.8;
    const innerRadius = 0.8;
    const teeth = 16;
    const toothLength = 0.5;
    
    let idx = 0;
    
    // Outer gear teeth (40% of particles)
    const toothCount = Math.floor(particleCount * 0.4);
    for (let i = 0; i < toothCount && idx < particleCount; i++) {
      const toothIdx = Math.floor((i / toothCount) * teeth);
      const angle = (toothIdx / teeth) * Math.PI * 2;
      const x = Math.cos(angle) * (outerRadius + toothLength);
      const y = Math.sin(angle) * (outerRadius + toothLength);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Main gear body (35% of particles)
    const bodyCount = Math.floor(particleCount * 0.35);
    for (let i = 0; i < bodyCount && idx < particleCount; i++) {
      const angle = (i / bodyCount) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Center hub (15% of particles)
    const hubCount = Math.floor(particleCount * 0.15);
    for (let i = 0; i < hubCount && idx < particleCount; i++) {
      const angle = (i / hubCount) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Center hole (10% of particles)
    const holeCount = Math.floor(particleCount * 0.1);
    for (let i = 0; i < holeCount && idx < particleCount; i++) {
      const angle = (i / holeCount) * Math.PI * 2;
      const radius = 0.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // CLOUD: Incognito/Private Cloud with Lock
  const makeCloud = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    
    let idx = 0;
    
    // Main cloud body (50% of particles)
    const bodyCount = Math.floor(particleCount * 0.5);
    for (let i = 0; i < bodyCount && idx < particleCount; i++) {
      const t = i / bodyCount;
      const angle = t * Math.PI * 2;
      
      // Create realistic cloud shape with multiple overlapping circles
      let x = 0, y = 0;
      if (t < 0.2) {
        // Left puff
        x = -1.2 + Math.cos(angle * 0.2) * 0.9;
        y = 0.3 + Math.sin(angle * 0.2) * 0.9;
      } else if (t < 0.4) {
        // Left-center
        x = -0.4 + Math.cos(angle * 0.2) * 1.1;
        y = 0.2 + Math.sin(angle * 0.2) * 1.1;
      } else if (t < 0.6) {
        // Center
        x = Math.cos(angle * 0.2) * 1.4;
        y = Math.sin(angle * 0.2) * 1.4;
      } else if (t < 0.8) {
        // Right-center
        x = 0.4 + Math.cos(angle * 0.2) * 1.1;
        y = 0.2 + Math.sin(angle * 0.2) * 1.1;
      } else {
        // Right puff
        x = 1.2 + Math.cos(angle * 0.2) * 0.9;
        y = 0.3 + Math.sin(angle * 0.2) * 0.9;
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Lock symbol in center (25% of particles)
    const lockCount = Math.floor(particleCount * 0.25);
    for (let i = 0; i < lockCount && idx < particleCount; i++) {
      const t = i / lockCount;
      const angle = t * Math.PI * 2;
      const radius = 0.4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Security indicators around cloud (15% of particles)
    const securityCount = Math.floor(particleCount * 0.15);
    const indicators = 6;
    for (let ind = 0; ind < indicators; ind++) {
      const indParticles = Math.floor(securityCount / indicators);
      const angle = (ind / indicators) * Math.PI * 2;
      const radius = 1.8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      for (let i = 0; i < indParticles && idx < particleCount; i++) {
        const t = i / indParticles;
        const indAngle = t * Math.PI * 2;
        const indRadius = 0.15;
        const indX = x + Math.cos(indAngle) * indRadius;
        const indY = y + Math.sin(indAngle) * indRadius;
        
        arr[idx * 3] = indX;
        arr[idx * 3 + 1] = indY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Connection lines (10% of particles)
    const lineCount = Math.floor(particleCount * 0.1);
    for (let i = 0; i < lineCount && idx < particleCount; i++) {
      const t = i / lineCount;
      const x = -1.8 + (t * 3.6);
      const y = -1.0 + Math.sin(t * Math.PI * 3) * 0.2;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // UI/UX: Incognito Design Interface
  const makeDesignPalette = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.5, h = 3.0;
    
    let idx = 0;
    
    // Main interface frame (25% of particles)
    const frameCount = Math.floor(particleCount * 0.25);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < frameCount && idx < particleCount; i++) {
      const t = i / frameCount;
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
    
    // Incognito mask icon (30% of particles)
    const maskCount = Math.floor(particleCount * 0.3);
    for (let i = 0; i < maskCount && idx < particleCount; i++) {
      const t = i / maskCount;
      const angle = t * Math.PI * 2;
      const radius = 0.6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Design canvas area (25% of particles)
    const canvasCount = Math.floor(particleCount * 0.25);
    const canvasW = w - 0.8, canvasH = h - 0.8;
    for (let i = 0; i < canvasCount && idx < particleCount; i++) {
      const t = i / canvasCount;
      const angle = t * Math.PI * 2;
      const radius = 0.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Privacy indicators (20% of particles)
    const privacyCount = Math.floor(particleCount * 0.2);
    const indicators = 4;
    const positions = [
      { x: -w/2 + 0.3, y: h/2 - 0.3 },
      { x: w/2 - 0.3, y: h/2 - 0.3 },
      { x: -w/2 + 0.3, y: -h/2 + 0.3 },
      { x: w/2 - 0.3, y: -h/2 + 0.3 }
    ];
    
    for (let p = 0; p < positions.length; p++) {
      const posParticles = Math.floor(privacyCount / positions.length);
      for (let i = 0; i < posParticles && idx < particleCount; i++) {
        const angle = (i / posParticles) * Math.PI * 2;
        const radius = 0.12;
        const x = positions[p].x + Math.cos(angle) * radius;
        const y = positions[p].y + Math.sin(angle) * radius;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // PLANNING: Business Strategy Dashboard
  const makeChart = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.5, h = 3.0;
    
    let idx = 0;
    
    // Dashboard frame (25% of particles)
    const frameCount = Math.floor(particleCount * 0.25);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < frameCount && idx < particleCount; i++) {
      const t = i / frameCount;
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
    
    // Chart axes (20% of particles)
    const axisCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < axisCount && idx < particleCount; i++) {
      const t = i / axisCount;
      if (t < 0.5) {
        // X-axis
        const x = -w/2 + 0.3 + (t * 2) * (w - 0.6);
        const y = -h/2 + 0.3;
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
      } else {
        // Y-axis
        const x = -w/2 + 0.3;
        const y = -h/2 + 0.3 + ((t - 0.5) * 2) * (h - 0.6);
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
      }
      idx++;
    }
    
    // Chart bars (35% of particles)
    const barCount = Math.floor(particleCount * 0.35);
    const bars = 6;
    for (let b = 0; b < bars; b++) {
      const barParticles = Math.floor(barCount / bars);
      const x = -w/2 + 0.4 + (b * (w - 0.8) / (bars - 1));
      const barHeight = 0.2 + (b * 0.3);
      
      for (let i = 0; i < barParticles && idx < particleCount; i++) {
        const t = i / barParticles;
        const y = -h/2 + 0.3 + (t * barHeight);
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // KPI indicators (20% of particles)
    const kpiCount = Math.floor(particleCount * 0.2);
    const kpis = 4;
    for (let k = 0; k < kpis; k++) {
      const kpiParticles = Math.floor(kpiCount / kpis);
      const kpiX = -w/2 + 0.3 + (k * (w - 0.6) / (kpis - 1));
      const kpiY = h/2 - 0.3;
      
      for (let i = 0; i < kpiParticles && idx < particleCount; i++) {
        const angle = (i / kpiParticles) * Math.PI * 2;
        const radius = 0.2;
        const x = kpiX + Math.cos(angle) * radius;
        const y = kpiY + Math.sin(angle) * radius;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // PROJECT: Kanban Board with Realistic Cards
  const makeProjectBoard = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 4.0, h = 3.0;
    const columns = 4;
    
    let idx = 0;
    
    // Board frame (20% of particles)
    const frameCount = Math.floor(particleCount * 0.2);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < frameCount && idx < particleCount; i++) {
      const t = i / frameCount;
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
    
    // Column headers (15% of particles)
    const headerCount = Math.floor(particleCount * 0.15);
    for (let c = 0; c < columns; c++) {
      const headerParticles = Math.floor(headerCount / columns);
      const x = -w/2 + (c + 0.5) * (w / columns);
      const y = h/2 - 0.2;
      
      for (let i = 0; i < headerParticles && idx < particleCount; i++) {
        const t = i / headerParticles;
        const headerX = x + ((t % 2) - 0.5) * 0.3;
        const headerY = y + (Math.floor(t / 2) - 0.5) * 0.1;
        
        arr[idx * 3] = headerX;
        arr[idx * 3 + 1] = headerY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Column dividers (10% of particles)
    const dividerCount = Math.floor(particleCount * 0.1);
    for (let c = 1; c < columns; c++) {
      const x = -w/2 + (c * w / columns);
      for (let i = 0; i < dividerCount / (columns - 1) && idx < particleCount; i++) {
        const t = i / (dividerCount / (columns - 1));
        const y = -h/2 + 0.3 + (t * (h - 0.6));
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Task cards (55% of particles)
    const cardCount = Math.floor(particleCount * 0.55);
    const cardsPerColumn = 4;
    for (let col = 0; col < columns; col++) {
      for (let card = 0; card < cardsPerColumn; card++) {
        const cardParticles = Math.floor(cardCount / (columns * cardsPerColumn));
        const x = -w/2 + (col + 0.5) * (w / columns);
        const y = h/2 - 0.4 - (card * 0.5);
        
        for (let i = 0; i < cardParticles && idx < particleCount; i++) {
          const t = i / cardParticles;
          const cardX = x + ((t % 3) - 1) * 0.25;
          const cardY = y + (Math.floor(t / 3) - 1) * 0.15;
          
          arr[idx * 3] = cardX;
          arr[idx * 3 + 1] = cardY;
          arr[idx * 3 + 2] = 0;
          idx++;
        }
      }
    }
    
    return arr;
  };

  // SECURITY: Stealth/Incognito Security System
  const makeShield = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.0, h = 3.5;
    
    let idx = 0;
    
    // Main stealth frame (30% of particles)
    const frameCount = Math.floor(particleCount * 0.3);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < frameCount && idx < particleCount; i++) {
      const t = i / frameCount;
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
    
    // Central stealth eye/monitor (25% of particles)
    const eyeCount = Math.floor(particleCount * 0.25);
    for (let i = 0; i < eyeCount && idx < particleCount; i++) {
      const t = i / eyeCount;
      const angle = t * Math.PI * 2;
      const radius = 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Stealth indicators around perimeter (25% of particles)
    const stealthCount = Math.floor(particleCount * 0.25);
    const indicators = 8;
    for (let ind = 0; ind < indicators; ind++) {
      const indParticles = Math.floor(stealthCount / indicators);
      const angle = (ind / indicators) * Math.PI * 2;
      const radius = 1.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      for (let i = 0; i < indParticles && idx < particleCount; i++) {
        const t = i / indParticles;
        const indAngle = t * Math.PI * 2;
        const indRadius = 0.12;
        const indX = x + Math.cos(indAngle) * indRadius;
        const indY = y + Math.sin(indAngle) * indRadius;
        
        arr[idx * 3] = indX;
        arr[idx * 3 + 1] = indY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Encryption lines (20% of particles)
    const encryptionCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < encryptionCount && idx < particleCount; i++) {
      const t = i / encryptionCount;
      const x = -w/2 + 0.3 + (t * (w - 0.6));
      const y = -h/2 + 0.3 + Math.sin(t * Math.PI * 6) * 0.2;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // INTERNET: Global Network Infrastructure
  const makeNetwork = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const nodes = 8;
    const outerRadius = 2.0;
    const innerRadius = 1.0;
    
    let idx = 0;
    
    // Outer network nodes (40% of particles)
    const outerNodeCount = Math.floor(particleCount * 0.4);
    for (let n = 0; n < nodes; n++) {
      const nodeParticles = Math.floor(outerNodeCount / nodes);
      const angle = (n / nodes) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      
      for (let i = 0; i < nodeParticles && idx < particleCount; i++) {
        const t = i / nodeParticles;
        const nodeAngle = t * Math.PI * 2;
        const nodeRadius = 0.25;
        const nodeX = x + Math.cos(nodeAngle) * nodeRadius;
        const nodeY = y + Math.sin(nodeAngle) * nodeRadius;
        
        arr[idx * 3] = nodeX;
        arr[idx * 3 + 1] = nodeY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Inner hub (20% of particles)
    const hubCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < hubCount && idx < particleCount; i++) {
      const t = i / hubCount;
      const angle = t * Math.PI * 2;
      const radius = 0.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Connection lines to hub (25% of particles)
    const hubLineCount = Math.floor(particleCount * 0.25);
    for (let n = 0; n < nodes; n++) {
      const angle = (n / nodes) * Math.PI * 2;
      const x1 = Math.cos(angle) * outerRadius;
      const y1 = Math.sin(angle) * outerRadius;
      
      const lineParticles = Math.floor(hubLineCount / nodes);
      for (let i = 0; i < lineParticles && idx < particleCount; i++) {
        const t = i / lineParticles;
        const x = x1 + (0 - x1) * t;
        const y = y1 + (0 - y1) * t;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Inter-node connections (15% of particles)
    const interLineCount = Math.floor(particleCount * 0.15);
    for (let n = 0; n < nodes; n += 2) {
      const nextN = (n + 2) % nodes;
      const angle1 = (n / nodes) * Math.PI * 2;
      const angle2 = (nextN / nodes) * Math.PI * 2;
      const x1 = Math.cos(angle1) * outerRadius;
      const y1 = Math.sin(angle1) * outerRadius;
      const x2 = Math.cos(angle2) * outerRadius;
      const y2 = Math.sin(angle2) * outerRadius;
      
      const lineParticles = Math.floor(interLineCount / (nodes / 2));
      for (let i = 0; i < lineParticles && idx < particleCount; i++) {
        const t = i / lineParticles;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // MARKETING: Social Media Newsfeed with Ads
  const makeMegaphone = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.5, h = 3.5;
    
    let idx = 0;
    
    // Newsfeed frame (20% of particles)
    const frameCount = Math.floor(particleCount * 0.2);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < frameCount && idx < particleCount; i++) {
      const t = i / frameCount;
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
    
    // Newsfeed posts (40% of particles)
    const postCount = Math.floor(particleCount * 0.4);
    const posts = 5;
    for (let p = 0; p < posts; p++) {
      const postParticles = Math.floor(postCount / posts);
      const postY = h/2 - 0.4 - (p * 0.6);
      const postW = w - 0.6;
      
      for (let i = 0; i < postParticles && idx < particleCount; i++) {
        const t = i / postParticles;
        const x = -postW/2 + (t * postW);
        const y = postY;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Ad dashlines (25% of particles)
    const adCount = Math.floor(particleCount * 0.25);
    const ads = 3;
    for (let a = 0; a < ads; a++) {
      const adParticles = Math.floor(adCount / ads);
      const adY = h/2 - 0.7 - (a * 0.6);
      const adW = w - 0.8;
      
      for (let i = 0; i < adParticles && idx < particleCount; i++) {
        const t = i / adParticles;
        const x = -adW/2 + (t * adW);
        const y = adY + Math.sin(t * Math.PI * 8) * 0.05; // Dashed line effect
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Social media icons (15% of particles)
    const socialCount = Math.floor(particleCount * 0.15);
    const platforms = 4;
    for (let p = 0; p < platforms; p++) {
      const platformParticles = Math.floor(socialCount / platforms);
      const x = -w/2 + 0.3 + (p * (w - 0.6) / (platforms - 1));
      const y = -h/2 + 0.3;
      
      for (let i = 0; i < platformParticles && idx < particleCount; i++) {
        const angle = (i / platformParticles) * Math.PI * 2;
        const radius = 0.15;
        const platformX = x + Math.cos(angle) * radius;
        const platformY = y + Math.sin(angle) * radius;
        
        arr[idx * 3] = platformX;
        arr[idx * 3 + 1] = platformY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // Precompute all shapes
  const sectionShapes = useMemo(() => [
    makeFibonacciSphere(1.8), // Intro
    makeServerRack(),         // Hosting
    makeBriefcase(),          // Consultation
    makeCodeBrackets(),       // Web Dev
    makeGear(),               // Configuration
    makeCloud(),              // Cloud Support
    makeDesignPalette(),      // UI/UX Design
    makeChart(),              // Business Planning
    makeProjectBoard(),       // Project Management
    makeShield(),             // Cyber Security
    makeNetwork(),            // Internet Thinking
    makeMegaphone(),          // Digital Marketing
    makeFibonacciSphere(1.6), // Outro
  ], [particleCount]);

  // Detect mobile - initialize with actual window width to avoid flicker
  const [isMobile, setIsMobile] = React.useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Section positions (alternating left/right on desktop, centered on mobile)
  // IMPORTANT: Morph should be OPPOSITE of text side
  // Overlay index 1,3,5 (odd): text LEFT → morph RIGHT
  // Overlay index 2,4 (even): text RIGHT → morph LEFT
  const sectionOffsets = useMemo(() => {
    if (isMobile) {
      // Mobile: all centered
      return [
        new THREE.Vector3(0, 0, 0),  // Intro
        new THREE.Vector3(0, 0, 0),  // Hosting
        new THREE.Vector3(0, 0, 0),  // Consultation
        new THREE.Vector3(0, 0, 0),  // Web Dev
        new THREE.Vector3(0, 0, 0),  // Configuration
        new THREE.Vector3(0, 0, 0),  // Cloud
        new THREE.Vector3(0, 0, 0),  // UI/UX
        new THREE.Vector3(0, 0, 0),  // Planning
        new THREE.Vector3(0, 0, 0),  // Project
        new THREE.Vector3(0, 0, 0),  // Security
        new THREE.Vector3(0, 0, 0),  // Internet
        new THREE.Vector3(0, 0, 0),  // Marketing
        new THREE.Vector3(0, 0, 0),  // Outro
      ];
    }
    
    // Desktop: morph OPPOSITE of text side (INVERTED) - alternating pattern
    return [
      new THREE.Vector3(-2.4, 0.0, 0),  // Intro: far left
      new THREE.Vector3(-2.2, 0.0, 0),  // Hosting (index 1): morph LEFT, text RIGHT
      new THREE.Vector3(2.2, 0.0, 0),   // Consultation (index 2): morph RIGHT, text LEFT
      new THREE.Vector3(-2.2, 0.0, 0),  // Web Dev (index 3): morph LEFT, text RIGHT
      new THREE.Vector3(2.2, 0.0, 0),   // Configuration (index 4): morph RIGHT, text LEFT
      new THREE.Vector3(-2.2, 0.0, 0),  // Cloud (index 5): morph LEFT, text RIGHT
      new THREE.Vector3(2.2, 0.0, 0),   // UI/UX (index 6): morph RIGHT, text LEFT
      new THREE.Vector3(-2.2, 0.0, 0),  // Planning (index 7): morph LEFT, text RIGHT
      new THREE.Vector3(2.2, 0.0, 0),   // Project (index 8): morph RIGHT, text LEFT
      new THREE.Vector3(-2.2, 0.0, 0),  // Security (index 9): morph LEFT, text RIGHT
      new THREE.Vector3(2.2, 0.0, 0),   // Internet (index 10): morph RIGHT, text LEFT
      new THREE.Vector3(-2.2, 0.0, 0),  // Marketing (index 11): morph LEFT, text RIGHT
      new THREE.Vector3(0.0, 0.0, 0),   // Outro: center
    ];
  }, [isMobile]);

  // Colors per section
  const sectionColors = [
    new THREE.Color('#ffffff'), // Intro
    new THREE.Color('#9bd7ff'), // Hosting (blue)
    new THREE.Color('#9ffcf0'), // Consultation (cyan)
    new THREE.Color('#e0e0e0'), // Web Dev (silver)
    new THREE.Color('#d6b6ff'), // Configuration (purple)
    new THREE.Color('#a8ffe8'), // Cloud (mint)
    new THREE.Color('#ff9b9b'), // UI/UX (coral)
    new THREE.Color('#4ecdc4'), // Planning (teal)
    new THREE.Color('#45b7d1'), // Project (blue)
    new THREE.Color('#96ceb4'), // Security (mint)
    new THREE.Color('#ffeaa7'), // Internet (yellow)
    new THREE.Color('#dda0dd'), // Marketing (plum)
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
    
    // Total page: Hero (100vh) + 11 sections (100vh each) + Outro (100vh) = 1300vh
    const totalPageHeight = heroHeight + (sectionHeight * 11) + heroHeight;
    
    // Calculate normalized scroll (0 to 1 across entire page)
    let normalizedScroll = scrollY / totalPageHeight;
    normalizedScroll = Math.min(0.9999, Math.max(0, normalizedScroll));
    
    // Map to 13 morph sections (intro→hosting→consultation→webdev→config→cloud→uiux→planning→project→security→internet→marketing→outro)
    const morphSections = 13;
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
    // Desktop: much lower position (0.2), Mobile: higher to avoid overlapping text (1.3)
    const verticalOffset = isMobile ? 1.3 : 0.2;
    
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
