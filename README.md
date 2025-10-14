# Vektor Solutions - Cinematic Scroll Website

A futuristic, immersive scroll-based React website showcasing Vektor Solutions' expertise across multiple technological domains: Medical Billing, Web Development, Robotics, Gaming, and Blockchain Innovation.

![Vektor Solutions](https://img.shields.io/badge/Vektor-Solutions-00F5D4?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js)

## ✨ Features

### 🎨 Visual Excellence
- **3D Particle Morphing**: Smooth transitions between shapes representing each technology domain
- **Parallax Scrolling**: Multi-layer depth effects for immersive storytelling
- **Custom Cursor**: Elegant dot-and-chaser cursor for enhanced interactivity
- **Cyberpunk HUD**: Futuristic heads-up display on hero section with live system status

### 🚀 Technology Domains

1. **Medical Billing** 💊
   - DNA helix particle animation
   - EHR system integration expertise
   - Revenue cycle management

2. **Web Development** 🌐
   - Computer screen morph with desktop icons
   - Modern tech stack (React, Next.js, TypeScript)
   - Full-stack solutions

3. **Robotics** 🤖
   - Robot-shaped particle formation
   - AI/ML integration
   - Industrial automation

4. **Gaming** 🎮
   - Game controller particle shape
   - Unity & Unreal Engine expertise
   - Immersive experiences

5. **Blockchain** ⛓️
   - Chain of connected blocks animation
   - Smart contract development
   - Web3 solutions

### 🎭 Animations & Effects
- Kinetic typography with GSAP ScrollTrigger
- Smooth morphing particles (800+ particles)
- Dynamic lighting and camera motion
- Adaptive performance based on device capabilities
- Post-processing effects (Bloom, Vignette, Chromatic Aberration)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Three.js / React Three Fiber** - 3D graphics
- **@react-three/drei** - Three.js helpers
- **@react-three/postprocessing** - Visual effects

### Animation
- **GSAP** - Animation library
- **ScrollTrigger** - Scroll-based animations
- **SplitType** - Text animation utilities

### Styling
- **Tailwind CSS** - Utility-first CSS
- Custom CSS for advanced effects

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vektor-solutions.git

# Navigate to project directory
cd vektor-solutions

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Development

```bash
# Development server (with hot reload)
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
vektor-solutions/
├── components/
│   ├── Cursor.tsx          # Custom cursor component
│   ├── HeroHUD.tsx         # Cyberpunk HUD overlay
│   ├── Icons.tsx           # Social media icons
│   ├── MorphingElement.tsx # 3D particle morphing system
│   ├── Overlay.tsx         # Text content & sections
│   └── Scene.tsx           # Three.js scene setup
├── constants.ts            # Section data & configuration
├── index.tsx              # React entry point
├── index.html             # HTML template
├── App.tsx                # Main app component
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## ⚙️ Configuration

### Performance Optimization
The app automatically adapts rendering quality based on:
- Device hardware (CPU cores, memory)
- Screen size (mobile vs desktop)
- Frame rate performance

### Particle Count
Adaptive particle count:
- Low-end: 300 particles
- Mid-range: 400 particles
- High-end: 600-800 particles

## 🎨 Customization

### Adding New Sections
Edit `constants.ts`:

```typescript
export const SECTIONS: SectionData[] = [
  {
    id: 'your-section',
    title: 'Your Title',
    text: 'Your description',
    accentColor: '#yourcolor',
    textColor: '#ffffff',
  },
  // ...
];
```

### Adding New Morph Shapes
Add shape generator in `components/MorphingElement.tsx`:

```typescript
const makeYourShape = (): Float32Array => {
  const arr = new Float32Array(particleCount * 3);
  // Your shape logic here
  return arr;
};
```

### Tech Stack Logos
Update logo URLs in `components/Overlay.tsx`:

```typescript
const sectionLogos: Record<string, string[]> = {
  'your-section': [
    'https://cdn.simpleicons.org/yourlogo/FFFFFF',
    // More logos...
  ],
};
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
# Build
npm run build

# Push dist/ to gh-pages branch
```

## 📧 Contact

**Email**: [dev@veksol.com](mailto:dev@veksol.com)

**Website**: [Coming Soon]

## 📄 License

© 2025 Vektor Solutions. All rights reserved.

## 🙏 Acknowledgments

- Inspired by [quietcubes.com](https://quietcubes.com), [bigstudio-tw.com](https://bigstudio-tw.com), and [alche.studio](https://alche.studio)
- Built with modern web technologies and a passion for immersive experiences
- Logos provided by [Simple Icons](https://simpleicons.org)

---

**Built with ❤️ by Vektor Solutions**
