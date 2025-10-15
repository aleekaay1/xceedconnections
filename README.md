# Xceed Connections - Cinematic Scroll Website

A futuristic, immersive scroll-based React website showcasing Xceed Connections' comprehensive IT services and solutions: Hosting, Business Consultation, Web Development, Configuration, Cloud Support, UI/UX Design, Business Planning, Project Management, Cyber Security, Internet Solutions, and Digital Marketing.

![Xceed Connections](https://img.shields.io/badge/Xceed-Connections-00F5D4?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js)

## ✨ Features

### 🎨 Visual Excellence
- **3D Particle Morphing**: Smooth transitions between shapes representing each technology domain
- **Parallax Scrolling**: Multi-layer depth effects for immersive storytelling
- **Custom Cursor**: Elegant dot-and-chaser cursor for enhanced interactivity
- **Cyberpunk HUD**: Futuristic heads-up display on hero section with live system status

### 🚀 IT Services & Solutions

1. **Hosting Services** 🖥️
   - Realistic server rack with LED indicators
   - 99.99% uptime guarantee
   - Secure hosting solutions

2. **Business Consultation** 💼
   - Professional briefcase with locks
   - Strategic IT consulting
   - Business optimization

3. **Web Development** 💻
   - Laptop with code screen
   - Modern tech stack (React, Next.js, TypeScript)
   - Custom web applications

4. **Configuration Services** ⚙️
   - Detailed gear with center hub
   - System configuration & optimization
   - Infrastructure setup

5. **Cloud Support** ☁️
   - Incognito cloud with security lock
   - Cloud migration & management
   - Secure cloud solutions

6. **UI/UX Design** 🎨
   - Incognito design interface
   - User experience optimization
   - Interface design

7. **Business Planning** 📊
   - Business strategy dashboard
   - KPI indicators and charts
   - Strategic planning

8. **Project Management** 📋
   - Kanban board with task cards
   - Project coordination
   - Team management

9. **Cyber Security** 🛡️
   - Stealth security system
   - Advanced security solutions
   - Data protection

10. **Internet Solutions** 🌐
    - Global network infrastructure
    - Connectivity solutions
    - Network optimization

11. **Digital Marketing** 📱
    - Social media newsfeed with ads
    - Marketing campaigns
    - Online presence management

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
git clone https://github.com/aleekaay1/xceedconnections.git

# Navigate to project directory
cd xceedconnections

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
xceedconnections/
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

**Phone**: [+92 335 5819282](tel:+923355819282)

**Website**: [xceedconnections.com](https://xceedconnections.com)

**Location**: Islamabad, Pakistan

## 📄 License

© 2025 Xceed Connections. All rights reserved.

Registered from Pakistan Software Export Board (Z-25-12428/24)

## 🙏 Acknowledgments

- Inspired by [quietcubes.com](https://quietcubes.com), [bigstudio-tw.com](https://bigstudio-tw.com), and [alche.studio](https://alche.studio)
- Built with modern web technologies and a passion for immersive experiences
- Logos provided by [Simple Icons](https://simpleicons.org)

---

**Built with ❤️ by Xceed Connections**
