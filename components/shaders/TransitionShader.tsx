import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader for scene transitions
export const TransitionMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uColor1: new THREE.Color('#00F5D4'),
    uColor2: new THREE.Color('#9B5DE5'),
    uResolution: new THREE.Vector2(1, 1),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Animated noise
      float n = noise(uv * 10.0 + uTime * 0.5);
      
      // Wave distortion
      float wave = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime) * 0.5 + 0.5;
      
      // Mix colors based on position and time
      vec3 color = mix(uColor1, uColor2, uv.y + wave * 0.2);
      
      // Add glow
      float glow = 1.0 - length(uv - 0.5) * 2.0;
      glow = pow(glow, 3.0);
      color += glow * 0.5;
      
      // Apply noise
      color += n * 0.1;
      
      // Fade based on progress
      float alpha = 1.0 - uProgress;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

// Glitch shader for transitions
export const GlitchMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1.0,
    uColor: new THREE.Color('#00F5D4'),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uIntensity;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Glitch displacement
      float glitch = sin(uTime * 10.0 + position.y * 50.0) * uIntensity * 0.1;
      pos.x += glitch;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // RGB split effect
      float offset = sin(uTime * 5.0) * uIntensity * 0.02;
      
      vec3 color = uColor;
      
      // Scan lines
      float scanline = sin(uv.y * 800.0 + uTime * 10.0) * 0.5 + 0.5;
      color *= 0.8 + scanline * 0.2;
      
      // Random glitch blocks
      float block = step(0.98, sin(uv.y * 50.0 + uTime * 20.0));
      color = mix(color, vec3(1.0), block * uIntensity);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Hologram shader
export const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00F5D4'),
    uAlpha: 0.8,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uAlpha;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Fresnel effect
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
      
      // Scan lines
      float scanline = sin(vUv.y * 100.0 + uTime * 2.0) * 0.5 + 0.5;
      
      // Glitch effect
      float glitch = step(0.95, sin(vPosition.y * 50.0 + uTime * 10.0));
      
      vec3 color = uColor;
      color *= (0.5 + scanline * 0.5);
      color += fresnel * 0.5;
      color = mix(color, vec3(1.0), glitch * 0.3);
      
      float alpha = uAlpha * (0.5 + fresnel * 0.5);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);




