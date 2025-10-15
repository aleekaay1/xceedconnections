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

  // HOSTING: Server Rack
  const makeServerRack = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 2.5, h = 3.5;
    const servers = 4;
    const serverH = h / servers;
    
    let idx = 0;
    
    // Server rack frame (30% of particles)
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
    
    // Individual servers (60% of particles)
    const serverCount = Math.floor(particleCount * 0.6 / servers);
    for (let s = 0; s < servers; s++) {
      const serverY = h/2 - (s + 0.5) * serverH;
      for (let i = 0; i < serverCount && idx < particleCount; i++) {
        const t = i / serverCount;
        const x = -w/2 + 0.1 + (t * (w - 0.2));
        const y = serverY;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Fill remaining
    for (; idx < particleCount; idx++) {
      arr[idx * 3] = 0;
      arr[idx * 3 + 1] = 0;
      arr[idx * 3 + 2] = 0;
    }
    
    return arr;
  };

  // CONSULTATION: Briefcase
  const makeBriefcase = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.0, h = 2.0, d = 0.8;
    
    let idx = 0;
    
    // Briefcase body (60% of particles)
    const bodyCount = Math.floor(particleCount * 0.6);
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
    
    // Handle (20% of particles)
    const handleCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < handleCount && idx < particleCount; i++) {
      const t = i / handleCount;
      const x = -w/3 + (t * (2*w/3));
      const y = h/2 + 0.3;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Locks (20% of particles)
    const lockCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < lockCount && idx < particleCount; i++) {
      const side = (i % 2) ? 1 : -1;
      const x = side * w/4;
      const y = h/2 - 0.3;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // WEB DEV: Code Brackets
  const makeCodeBrackets = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 2.5, h = 3.0;
    
    let idx = 0;
    
    // Left bracket (50% of particles)
    const leftCount = Math.floor(particleCount * 0.5);
    for (let i = 0; i < leftCount && idx < particleCount; i++) {
      const t = i / leftCount;
      const x = -w/2;
      const y = h/2 - (t * h);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Right bracket (50% of particles)
    const rightCount = Math.floor(particleCount * 0.5);
    for (let i = 0; i < rightCount && idx < particleCount; i++) {
      const t = i / rightCount;
      const x = w/2;
      const y = h/2 - (t * h);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // CONFIGURATION: Gear/Cog
  const makeGear = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const radius = 1.5;
    const teeth = 12;
    const toothLength = 0.4;
    
    let idx = 0;
    
    // Main gear circle (60% of particles)
    const circleCount = Math.floor(particleCount * 0.6);
    for (let i = 0; i < circleCount && idx < particleCount; i++) {
      const angle = (i / circleCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Gear teeth (40% of particles)
    const toothCount = Math.floor(particleCount * 0.4);
    for (let i = 0; i < toothCount && idx < particleCount; i++) {
      const toothIdx = Math.floor((i / toothCount) * teeth);
      const angle = (toothIdx / teeth) * Math.PI * 2;
      const x = Math.cos(angle) * (radius + toothLength);
      const y = Math.sin(angle) * (radius + toothLength);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // CLOUD: Cloud Shape
  const makeCloud = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const centerRadius = 1.2;
    const sideRadius = 0.8;
    const topRadius = 1.0;
    
    let idx = 0;
    
    // Main cloud body (80% of particles)
    const bodyCount = Math.floor(particleCount * 0.8);
    for (let i = 0; i < bodyCount && idx < particleCount; i++) {
      const t = i / bodyCount;
      const angle = t * Math.PI * 2;
      
      // Create cloud-like shape with multiple circles
      let x = 0, y = 0;
      if (t < 0.3) {
        // Left side
        x = -0.8 + Math.cos(angle * 0.3) * sideRadius;
        y = Math.sin(angle * 0.3) * sideRadius;
      } else if (t < 0.7) {
        // Center
        x = Math.cos(angle * 0.4) * centerRadius;
        y = Math.sin(angle * 0.4) * centerRadius;
      } else {
        // Right side
        x = 0.8 + Math.cos(angle * 0.3) * sideRadius;
        y = Math.sin(angle * 0.3) * sideRadius;
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Top cloud puff (20% of particles)
    const topCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < topCount && idx < particleCount; i++) {
      const angle = (i / topCount) * Math.PI * 2;
      const x = Math.cos(angle) * topRadius;
      const y = 1.0 + Math.sin(angle) * topRadius;
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    return arr;
  };

  // UI/UX: Design Palette
  const makeDesignPalette = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 2.5, h = 3.0;
    
    let idx = 0;
    
    // Palette outline (40% of particles)
    const outlineCount = Math.floor(particleCount * 0.4);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < outlineCount && idx < particleCount; i++) {
      const t = i / outlineCount;
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
    
    // Color circles (60% of particles)
    const colorCount = Math.floor(particleCount * 0.6);
    const colors = 6;
    for (let c = 0; c < colors; c++) {
      const circleCount = Math.floor(colorCount / colors);
      const angle = (c / colors) * Math.PI * 2;
      const radius = 0.3;
      const centerX = Math.cos(angle) * 0.8;
      const centerY = Math.sin(angle) * 0.8;
      
      for (let i = 0; i < circleCount && idx < particleCount; i++) {
        const t = i / circleCount;
        const circleAngle = t * Math.PI * 2;
        const x = centerX + Math.cos(circleAngle) * radius;
        const y = centerY + Math.sin(circleAngle) * radius;
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // PLANNING: Chart/Graph
  const makeChart = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.0, h = 2.5;
    
    let idx = 0;
    
    // Chart axes (30% of particles)
    const axisCount = Math.floor(particleCount * 0.3);
    for (let i = 0; i < axisCount && idx < particleCount; i++) {
      const t = i / axisCount;
      if (t < 0.5) {
        // X-axis
        const x = -w/2 + (t * 2) * w;
        const y = -h/2;
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
      } else {
        // Y-axis
        const x = -w/2;
        const y = -h/2 + ((t - 0.5) * 2) * h;
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
      }
      idx++;
    }
    
    // Chart bars (70% of particles)
    const barCount = Math.floor(particleCount * 0.7);
    const bars = 5;
    for (let b = 0; b < bars; b++) {
      const barParticles = Math.floor(barCount / bars);
      const x = -w/2 + 0.3 + (b * (w - 0.6) / (bars - 1));
      const barHeight = 0.3 + (b * 0.4);
      
      for (let i = 0; i < barParticles && idx < particleCount; i++) {
        const t = i / barParticles;
        const y = -h/2 + (t * barHeight);
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    return arr;
  };

  // PROJECT: Project Management Board
  const makeProjectBoard = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 3.5, h = 2.5;
    const columns = 3;
    
    let idx = 0;
    
    // Board outline (30% of particles)
    const outlineCount = Math.floor(particleCount * 0.3);
    const perimeter = (w + h) * 2;
    for (let i = 0; i < outlineCount && idx < particleCount; i++) {
      const t = i / outlineCount;
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
    
    // Column dividers (20% of particles)
    const dividerCount = Math.floor(particleCount * 0.2);
    for (let c = 1; c < columns; c++) {
      const x = -w/2 + (c * w / columns);
      for (let i = 0; i < dividerCount / (columns - 1) && idx < particleCount; i++) {
        const t = i / (dividerCount / (columns - 1));
        const y = -h/2 + (t * h);
        
        arr[idx * 3] = x;
        arr[idx * 3 + 1] = y;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Task cards (50% of particles)
    const cardCount = Math.floor(particleCount * 0.5);
    const cardsPerColumn = 3;
    for (let col = 0; col < columns; col++) {
      for (let card = 0; card < cardsPerColumn; card++) {
        const cardParticles = Math.floor(cardCount / (columns * cardsPerColumn));
        const x = -w/2 + (col + 0.5) * (w / columns);
        const y = h/2 - 0.3 - (card * 0.6);
        
        for (let i = 0; i < cardParticles && idx < particleCount; i++) {
          const t = i / cardParticles;
          const cardX = x + ((t % 2) - 0.5) * 0.4;
          const cardY = y + (Math.floor(t / 2) - 0.5) * 0.2;
          
          arr[idx * 3] = cardX;
          arr[idx * 3 + 1] = cardY;
          arr[idx * 3 + 2] = 0;
          idx++;
        }
      }
    }
    
    return arr;
  };

  // SECURITY: Shield
  const makeShield = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const w = 2.0, h = 3.0;
    
    let idx = 0;
    
    // Shield outline (60% of particles)
    const outlineCount = Math.floor(particleCount * 0.6);
    for (let i = 0; i < outlineCount && idx < particleCount; i++) {
      const t = i / outlineCount;
      let x = 0, y = 0;
      
      if (t < 0.3) {
        // Top curve
        const angle = (t / 0.3) * Math.PI;
        x = Math.sin(angle) * (w / 2);
        y = h/2 - Math.cos(angle) * (h / 2);
      } else if (t < 0.7) {
        // Sides
        const sideT = (t - 0.3) / 0.4;
        const side = sideT < 0.5 ? -1 : 1;
        const sideProgress = sideT < 0.5 ? sideT * 2 : (sideT - 0.5) * 2;
        x = side * (w / 2);
        y = h/2 - sideProgress * h;
      } else {
        // Bottom point
        const bottomT = (t - 0.7) / 0.3;
        x = (1 - bottomT) * (w / 2);
        y = -h/2 + bottomT * 0.2;
      }
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Lock symbol (40% of particles)
    const lockCount = Math.floor(particleCount * 0.4);
    for (let i = 0; i < lockCount && idx < particleCount; i++) {
      const t = i / lockCount;
      const angle = t * Math.PI * 2;
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

  // INTERNET: Network Nodes
  const makeNetwork = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const nodes = 6;
    const radius = 1.5;
    
    let idx = 0;
    
    // Network nodes (50% of particles)
    const nodeCount = Math.floor(particleCount * 0.5);
    for (let n = 0; n < nodes; n++) {
      const nodeParticles = Math.floor(nodeCount / nodes);
      const angle = (n / nodes) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      for (let i = 0; i < nodeParticles && idx < particleCount; i++) {
        const t = i / nodeParticles;
        const nodeAngle = t * Math.PI * 2;
        const nodeRadius = 0.2;
        const nodeX = x + Math.cos(nodeAngle) * nodeRadius;
        const nodeY = y + Math.sin(nodeAngle) * nodeRadius;
        
        arr[idx * 3] = nodeX;
        arr[idx * 3 + 1] = nodeY;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    
    // Connection lines (50% of particles)
    const lineCount = Math.floor(particleCount * 0.5);
    for (let n = 0; n < nodes; n++) {
      const nextN = (n + 1) % nodes;
      const angle1 = (n / nodes) * Math.PI * 2;
      const angle2 = (nextN / nodes) * Math.PI * 2;
      const x1 = Math.cos(angle1) * radius;
      const y1 = Math.sin(angle1) * radius;
      const x2 = Math.cos(angle2) * radius;
      const y2 = Math.sin(angle2) * radius;
      
      const lineParticles = Math.floor(lineCount / nodes);
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

  // MARKETING: Megaphone
  const makeMegaphone = (): Float32Array => {
    const arr = new Float32Array(particleCount * 3);
    const length = 3.0;
    const startRadius = 0.3;
    const endRadius = 1.2;
    
    let idx = 0;
    
    // Megaphone body (80% of particles)
    const bodyCount = Math.floor(particleCount * 0.8);
    for (let i = 0; i < bodyCount && idx < particleCount; i++) {
      const t = i / bodyCount;
      const angle = t * Math.PI * 2;
      const currentRadius = startRadius + (t * (endRadius - startRadius));
      const x = Math.cos(angle) * currentRadius;
      const y = -length/2 + (t * length);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
    }
    
    // Handle (20% of particles)
    const handleCount = Math.floor(particleCount * 0.2);
    for (let i = 0; i < handleCount && idx < particleCount; i++) {
      const t = i / handleCount;
      const x = -startRadius - 0.2;
      const y = -length/2 + (t * 0.8);
      
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = 0;
      idx++;
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
        new THREE.Vector3(0, 0, 0),  // Medical
        new THREE.Vector3(0, 0, 0),  // Web
        new THREE.Vector3(0, 0, 0),  // Robotics
        new THREE.Vector3(0, 0, 0),  // Gaming
        new THREE.Vector3(0, 0, 0),  // Blockchain
        new THREE.Vector3(0, 0, 0),  // Outro
      ];
    }
    
    // Desktop: morph OPPOSITE of text side (INVERTED)
    return [
      new THREE.Vector3(-2.4, 0.0, 0),  // Intro: far left
      new THREE.Vector3(-2.2, 0.0, 0),  // Medical (index 1): morph LEFT
      new THREE.Vector3(2.2, 0.0, 0),   // Web (index 2): morph RIGHT
      new THREE.Vector3(-2.2, 0.0, 0),  // Robotics (index 3): morph LEFT
      new THREE.Vector3(2.2, 0.0, 0),   // Gaming (index 4): morph RIGHT
      new THREE.Vector3(-2.2, 0.0, 0),  // Blockchain (index 5): morph LEFT
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
