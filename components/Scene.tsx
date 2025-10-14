import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Import scene components
import IntroScene from './scenes/IntroScene';
import MedicalScene from './scenes/MedicalScene';
import WebScene from './scenes/WebScene';
import RoboticsScene from './scenes/RoboticsScene';
import GamingScene from './scenes/GamingScene';
import BlockchainScene from './scenes/BlockchainScene';
import OutroScene from './scenes/OutroScene';
import MorphingElement from './MorphingElement';

export default function Scene() {
  const { camera, scene, gl } = useThree();
  const cameraGroupRef = useRef<THREE.Group>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  
  const totalSections = 7; // Intro + 5 domains + Outro
  
  // Detect mobile devices and performance level
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const detectPerformance = () => {
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 4;
      const isLowEnd = cores <= 4 || memory <= 4 || window.innerWidth < 768;
      const isMediumEnd = cores <= 8 || memory <= 8;
      
      if (isLowEnd) {
        setPerformanceLevel('low');
      } else if (isMediumEnd) {
        setPerformanceLevel('medium');
      } else {
        setPerformanceLevel('high');
      }
    };
    
    checkMobile();
    detectPerformance();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimize for performance level
  useEffect(() => {
    if (performanceLevel === 'low') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    } else if (performanceLevel === 'medium') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, [performanceLevel, gl]);
  
  useEffect(() => {
    // Initialize scene background - dark but not pure black
    scene.background = new THREE.Color('#0a0a0a');
    scene.fog = new THREE.Fog('#0a0a0a', 10, 30);
  }, [scene]);
  
  // Listen to native scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    // Use native scroll progress
    const scrollOffset = scrollProgress;
    const currentSectionIndex = Math.floor(scrollOffset * totalSections);
    
    if (currentSectionIndex !== currentSection) {
      setCurrentSection(currentSectionIndex);
    }
    
    // Calculate section progress (0-1 within current section)
    const sectionProgress = (scrollOffset * totalSections) % 1;
    
    // Smooth camera movement
    if (cameraGroupRef.current) {
      const targetY = -scrollOffset * (totalSections - 1) * 12;
      cameraGroupRef.current.position.y = THREE.MathUtils.lerp(
        cameraGroupRef.current.position.y,
        targetY,
        0.15
      );
      
      // Add subtle camera rotation based on scroll
      cameraGroupRef.current.rotation.x = Math.sin(scrollOffset * Math.PI * 2) * 0.015;
      cameraGroupRef.current.rotation.y = Math.cos(scrollOffset * Math.PI * 2) * 0.015;
    }
    
        // Dynamic background color based on section - subtle tints
        const colors = [
          '#0a0a0a', // Intro
          '#0a1215', // Medical (blue tint)
          '#0a1512', // Web (cyan tint)
          '#0f0f0f', // Robotics (grey)
          '#120a15', // Gaming (purple tint)
          '#0a1512', // Blockchain (green tint)
          '#0a0a0a', // Outro
        ];
        
        // Make background more visible on mobile
        if (isMobile) {
          colors[0] = '#0f0f0f'; // Slightly lighter intro
          colors[1] = '#0f1518'; // Slightly lighter medical
          colors[2] = '#0f1815'; // Slightly lighter web
          colors[3] = '#141414'; // Slightly lighter robotics
          colors[4] = '#151015'; // Slightly lighter gaming
          colors[5] = '#0f1815'; // Slightly lighter blockchain
          colors[6] = '#0f0f0f'; // Slightly lighter outro
        }
    
    const currentColor = new THREE.Color(colors[currentSectionIndex] || '#000000');
    const nextColor = new THREE.Color(colors[Math.min(currentSectionIndex + 1, colors.length - 1)]);
    
    if (scene.background instanceof THREE.Color) {
      scene.background.lerpColors(currentColor, nextColor, sectionProgress);
    }
    
    // Update fog color to match background
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(scene.background as THREE.Color);
    }
    
    // Keep camera fixed - no floating motion
    camera.position.x = 0;
    camera.position.z = 5;
  });
  
  // Calculate progress for each scene
  const getSceneProgress = (sectionIndex: number) => {
    const scrollOffset = scrollProgress;
    const sectionSize = 1 / totalSections;
    const sectionStart = sectionIndex * sectionSize;
    const sectionEnd = (sectionIndex + 1) * sectionSize;
    
    if (scrollOffset < sectionStart) return 0;
    if (scrollOffset > sectionEnd) return 1;
    
    return (scrollOffset - sectionStart) / sectionSize;
  };

  return (
    <>
      {/* Main Camera Group */}
      <group ref={cameraGroupRef}>
        {/* Minimal Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
      </group>
      
      {/* Grid Floor - Subtle dark green lines */}
      <gridHelper 
        args={[100, 50, '#003320', '#001a10']} 
        position={[0, -5, 0]} 
        rotation={[0, 0, 0]}
      />
      
      {/* Continuous Morphing Element - Always centered in camera view */}
      <group position={[0, 0, 0]}>
        <MorphingElement scrollProgress={scrollProgress} />
      </group>
      
      
      
          {/* Post Processing Effects - Adaptive based on performance */}
          {performanceLevel !== 'low' && (
            <EffectComposer multisampling={performanceLevel === 'high' ? 8 : 4}>
              {/* Bloom for glowing elements - reduced on medium performance */}
              <Bloom
                intensity={performanceLevel === 'high' ? 1.2 : 0.8}
                luminanceThreshold={0.85}
                luminanceSmoothing={0.9}
                height={performanceLevel === 'high' ? 300 : 200}
                mipmapBlur={performanceLevel === 'high'}
              />
              
              {/* Chromatic Aberration - only on high performance */}
              {performanceLevel === 'high' && (
                <ChromaticAberration
                  blendFunction={BlendFunction.NORMAL}
                  offset={new THREE.Vector2(0.0005, 0.0005)}
                />
              )}
              
              {/* Vignette for cinematic feel */}
              <Vignette
                offset={0.4}
                darkness={0.6}
                eskil={false}
                blendFunction={BlendFunction.NORMAL}
              />
      </EffectComposer>
          )}
    </>
  );
}
