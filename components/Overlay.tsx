
import React, { useRef, useEffect, useState } from 'react';
import { SECTIONS, SectionData } from '../constants';
import { SocialIcons } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import HeroHUD from './HeroHUD';

gsap.registerPlugin(ScrollTrigger);

// Tech logos for each section
const sectionLogos: Record<string, string[]> = {
    medical: [
        'https://cdn.simpleicons.org/epic/FFFFFF',
        'https://cdn.simpleicons.org/oracle/FFFFFF',
        'https://cdn.simpleicons.org/sap/FFFFFF',
        'https://cdn.simpleicons.org/microsoft/FFFFFF',
        'https://cdn.simpleicons.org/postgresql/FFFFFF',
    ],
    web: [
        'https://cdn.simpleicons.org/react/FFFFFF',
        'https://cdn.simpleicons.org/nextdotjs/FFFFFF',
        'https://cdn.simpleicons.org/typescript/FFFFFF',
        'https://cdn.simpleicons.org/tailwindcss/FFFFFF',
        'https://cdn.simpleicons.org/nodedotjs/FFFFFF',
        'https://cdn.simpleicons.org/mongodb/FFFFFF',
    ],
    robotics: [
        'https://cdn.simpleicons.org/python/FFFFFF',
        'https://cdn.simpleicons.org/tensorflow/FFFFFF',
        'https://cdn.simpleicons.org/ros/FFFFFF',
        'https://cdn.simpleicons.org/arduino/FFFFFF',
        'https://cdn.simpleicons.org/raspberrypi/FFFFFF',
    ],
    gaming: [
        'https://cdn.simpleicons.org/unity/FFFFFF',
        'https://cdn.simpleicons.org/unrealengine/FFFFFF',
        'https://cdn.simpleicons.org/blender/FFFFFF',
        'https://cdn.simpleicons.org/cplusplus/FFFFFF',
        'https://cdn.simpleicons.org/steam/FFFFFF',
    ],
    blockchain: [
        'https://cdn.simpleicons.org/ethereum/FFFFFF',
        'https://cdn.simpleicons.org/bitcoin/FFFFFF',
        'https://cdn.simpleicons.org/solidity/FFFFFF',
        'https://cdn.simpleicons.org/web3dotjs/FFFFFF',
        'https://cdn.simpleicons.org/ipfs/FFFFFF',
    ],
};

const SectionUI: React.FC<{ section: SectionData, index: number }> = ({ section, index }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    
    useEffect(() => {
        if (!titleRef.current || !textRef.current || !containerRef.current) return;

        const titleChars = new SplitType(titleRef.current, { types: 'chars' });
        const textLines = new SplitType(textRef.current, { types: 'lines' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none',
            },
        });
        
        tl.from(titleChars.chars, {
            y: 50,
            opacity: 0,
            stagger: 0.02,
            duration: 0.5,
            ease: 'power2.out',
        }).from(textLines.lines, {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
        }, "-=0.3");

    }, []);

    // Determine side: odd index => morph right, text left. even index => morph left, text right
    const morphRight = (index % 2) === 1;
    const textAlign = morphRight ? 'left' : 'right';
    const marginClass = morphRight ? 'mr-auto ml-24' : 'ml-auto mr-24';
    
    // Get logos for this section
    const logos = sectionLogos[section.id] || [];

    return (
        <section
            ref={containerRef}
            className="w-full flex flex-col justify-end p-8 pb-16 pointer-events-none"
            style={{ color: section.textColor, minHeight: '100vh', height: 'auto' }}
        >
            {/* Desktop: side-aligned, Mobile: centered - Positioned in lower 30% of viewport */}
            <div 
                className="max-w-3xl mx-auto text-center md:text-left md:mx-0"
                style={{ 
                    marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (morphRight ? 'auto' : '6rem') : undefined,
                    marginRight: typeof window !== 'undefined' && window.innerWidth >= 768 ? (morphRight ? '6rem' : 'auto') : undefined,
                }}
            >
                <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-3" style={{ color: section.accentColor }}>{section.title}</h2>
                <p ref={textRef} className="text-base md:text-xl font-light leading-relaxed opacity-90">{section.text}</p>
                <p className="mt-5 text-sm md:text-base font-light opacity-80">
                    We deliver end-to-end solutions with precision, performance, and polish. From discovery and design to deployment and beyond, our teams craft reliable systems that scale.
                </p>
                
                {/* Tech Stack Logos */}
                {logos.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-4 items-center justify-center md:justify-start" style={{ justifyContent: typeof window !== 'undefined' && window.innerWidth >= 768 ? textAlign as any : 'center' }}>
                        {logos.map((logoUrl, i) => (
                            <div 
                                key={i} 
                                className="w-10 h-10 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            >
                                <img 
                                    src={logoUrl} 
                                    alt={`Tech logo ${i + 1}`}
                                    className="w-full h-full object-contain"
                                    style={{ imageRendering: 'crisp-edges' }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-6">
                    <a className="inline-block pointer-events-auto px-6 py-3 border border-white/60 text-white rounded-lg hover:bg-white hover:text-black transition" href="#contact">Start a project</a>
                </div>
            </div>
        </section>
    );
};

const OutroUI: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
         if (!containerRef.current) return;
         gsap.fromTo(containerRef.current, { opacity: 0 }, {
             opacity: 1,
             scrollTrigger: {
                 trigger: containerRef.current,
                 start: 'top 80%',
                 end: 'bottom center',
                 scrub: true,
             }
         })
    }, []);

    return (
        <section ref={containerRef} className="w-full flex flex-col justify-end items-center p-8 pb-16 text-center" style={{ minHeight: '100vh', height: 'auto' }}>
            <h2 className="text-5xl md:text-8xl font-bold mb-6">Welcome to the Future.</h2>
            <p className="text-xl md:text-2xl mb-8">Let's build it together.</p>
            <div className="pointer-events-auto flex flex-col items-center gap-6">
                <div className="flex space-x-6">
                    <SocialIcons />
                </div>
                <a 
                    href="mailto:dev@veksol.com" 
                    className="text-lg font-light opacity-80 hover:opacity-100 transition-opacity"
                    style={{ letterSpacing: '0.05em' }}
                >
                    dev@veksol.com
                </a>
                <p className="text-sm opacity-60 mt-4">
                    © {new Date().getFullYear()} Vektor Solutions. All rights reserved.
                </p>
            </div>
        </section>
    );
}

export default function Overlay() {
    const [showHUD, setShowHUD] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            setShowHUD(window.scrollY < window.innerHeight * 0.9);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {showHUD && <HeroHUD />}
            <div className="pointer-events-none" style={{ position: 'relative', zIndex: 95 }}>
            <div style={{ height: '100vh' }}></div>
            {SECTIONS.slice(1, -1).map((section, index) => (
                <div key={section.id}>
                    <SectionUI section={section} index={index + 1} />
                    <style>{`
                        .section-container h2 { font-size: clamp(2rem, 6vw, 4rem); }
                        .section-container p { font-size: clamp(1rem, 2.2vw, 1.25rem); }
                    `}</style>
                </div>
            ))}
                <OutroUI />
            </div>
        </>
    );
}
