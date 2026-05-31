'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Terminal, ShieldCheck, Compass, Code, Layout, Github, Linkedin, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';

const WaterBackground = dynamic(() => import('./components/WaterBackground'), {
  ssr: false,
});

import HeroSect from './components/HeroSect';
import JourneySect from './components/JourneySect';
import WorkshopSect from './components/WorkshopSect';
import FoundationSect from './components/FoundationSect';
import AiCopilotSect from './components/AiCopilotSect';
import InteractiveFooter from './components/InteractiveFooter';
import SourceOverlay from './components/SourceOverlay';
import { contactInfo } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  // Permanently force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.remove('light');
  }, []);

  // Section Refs for scroll targeting and Intersection Observing
  const portalRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const workshopRef = useRef<HTMLDivElement>(null);
  const foundationRef = useRef<HTMLDivElement>(null);
  const aiCopilotRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Track WebGL tolerance on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGlSupported(supported);
    } catch (e) {
      setWebGlSupported(false);
    }
  }, []);

  // Track scroll section entries using standard Intersection Observer
  useEffect(() => {
    const sections = [
      { ref: portalRef, index: 0 },
      { ref: heroRef, index: 1 },
      { ref: journeyRef, index: 2 },
      { ref: workshopRef, index: 3 },
      { ref: foundationRef, index: 4 },
      { ref: aiCopilotRef, index: 5 },
      { ref: contactRef, index: 6 }
    ];

    const observerOptions = {
      root: null, // viewport
      threshold: 0.35, // Trigger when 35% of the section is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matching = sections.find(s => s.ref.current === entry.target);
          if (matching !== undefined) {
            setActiveSection(matching.index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // Capture normalized mouse coordinates for interactive parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth scroll helper
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Water Portal', index: 0, ref: portalRef },
    { label: 'Introduction', index: 1, ref: heroRef },
    { label: 'Journey Timeline', index: 2, ref: journeyRef },
    { label: 'Project Workshop', index: 3, ref: workshopRef },
    { label: 'System Foundation', index: 4, ref: foundationRef },
    { label: 'AI Co-pilot', index: 5, ref: aiCopilotRef },
    { label: 'Secure Handshake', index: 6, ref: contactRef }
  ];

  return (
    <div className="relative bg-[#040406] text-on-background selection:bg-primary-container selection:text-black">
      
      {/* 3D Tech Glow background with grids removed per user request */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial atmospheric spotlight glows from Immersive UI theme */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1a3a3a] rounded-full blur-[140px] opacity-15" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00d1ff] rounded-full blur-[150px] opacity-8" />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-[#7000ff] rounded-full blur-[110px] opacity-10" />
      </div>

      {/* Floating Tactical Top Navigation Header - Fades in past portal screen */}
      <header className={`fixed top-0 left-0 right-0 z-40 bg-[#050505]/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center select-none transition-all duration-700 ease-in-out ${
        activeSection > 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#00d1ff] flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-[#00d1ff] rounded-sm rotate-45 shadow-[0_0_10px_#00d1ff]"></div>
          </div>
          <div>
            <span className="font-mono text-[9px] text-[#00d1ff] uppercase block tracking-widest leading-none font-bold">AKD.PORTFOLIO</span>
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-[0.1em] leading-normal font-light">Akshit Kumar Dhaka</span>
          </div>
        </div>

        {/* Tactical status badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#0f0f0f]/80 border border-white/5 rounded-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d1ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d1ff]"></span>
          </span>
          <span className="font-mono text-[9px] text-[#00d1ff] tracking-wider uppercase">Active Dispatch: Noida</span>
        </div>

        <div className="flex gap-3 sm:gap-4 items-center">
          <button
            onClick={() => setIsSourceOpen(true)}
            className="px-4 py-1.5 bg-[#00d1ff]/10 border border-[#00d1ff]/20 text-xs font-mono text-[#00d1ff] rounded-none hover:bg-[#00d1ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all cursor-pointer"
          >
            Payload JSON
          </button>
        </div>
      </header>

      {/* Floating Storyline HUD Progress Sidebar Dashboard - Fades in past portal screen */}
      <nav className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 select-none bg-[#0f0f0f]/35 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-2xl transition-all duration-700 ease-in-out ${
        activeSection > 0 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}>
        {navItems.map((item) => {
          const isActive = activeSection === item.index;

          return (
            <button
              key={item.label}
              onClick={() => scrollToRef(item.ref)}
              className="group flex items-center gap-3 text-right justify-end cursor-pointer focus:outline-none"
            >
              <span className={`font-mono text-[10px] tracking-wider uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                isActive ? '!opacity-100 text-[#00d1ff] font-semibold' : 'text-on-surface-variant'
              }`}>
                {item.label}
              </span>
              
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#00d1ff] scale-125 shadow-[0_0_10px_rgba(0,209,255,1)]' 
                    : 'bg-white/10 group-hover:bg-white/40'
                }`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Floating Interactive 2D/3D Hybrid Water Ripples Background */}
      <WaterBackground activeSection={activeSection} />

      {/* Main Single Screen Layout Narrative */}
      <main className="relative z-10 w-full overflow-hidden">
        
        {/* Section 0: Immersive Water Portal */}
        <div 
          id="portal" 
          ref={portalRef} 
          className="h-screen w-full flex flex-col justify-between items-center relative z-20 pt-28 pb-16 px-4 md:px-8 overflow-hidden select-none"
        >
          {/* Spacer to shift weights down */}
          <div />

          {/* Central Elegant Brand Identification */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#00d1ff] flex items-center justify-center animate-pulse">
                <div className="w-4.5 h-4.5 bg-[#00d1ff] rounded-sm rotate-45 shadow-[0_0_15px_#00d1ff]"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 space-y-3"
            >
              <h2 className="font-mono text-[10px] sm:text-xs text-[#00d1ff] uppercase tracking-[0.45em] animate-pulse font-semibold">
                Tactical Developer Archive
              </h2>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-7xl text-white tracking-widest uppercase leading-none">
                AKSHIT KUMAR DHAKA
              </h1>
              <p className="font-mono text-[9px] sm:text-[10px] text-white/40 tracking-[0.2em] uppercase font-light">
                Systems Engineer &bull; Noida, IN
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 2.0, delay: 1.0 }}
              className="font-sans text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed"
            >
              Interactive fluid canvas active. Tap or click anywhere on the dark surface to generate physical wave ripples.
            </motion.p>
          </div>

          {/* Bottom Activation Controls: Flow trigger enter + Bounce bounce */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <button
              onClick={() => scrollToRef(heroRef)}
              className="px-6 py-3 bg-[#00d1ff]/10 border border-[#00d1ff]/40 text-xs font-mono text-[#00d1ff] uppercase tracking-[0.25em] hover:bg-[#00d1ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] hover:border-transparent transition-all rounded-none cursor-pointer"
            >
              Enter Archive
            </button>
            
            <div 
              onClick={() => scrollToRef(heroRef)}
              className="cursor-pointer group flex flex-col items-center gap-2 text-white/30 hover:text-[#00d1ff] transition-colors"
            >
              <span className="font-mono text-[8px] uppercase tracking-[0.3em]">Scroll down to enter</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-1.5 h-1.5 border-b border-r border-current rotate-45"
              />
            </div>
          </motion.div>
        </div>

        {/* Section 1: Hero */}
        <div id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center">
          <HeroSect 
            onExplore={() => scrollToRef(journeyRef)} 
            onViewSource={() => setIsSourceOpen(true)} 
          />
        </div>

        {/* Section 1: Journey (Career Timeline) */}
        <motion.div 
          id="journey" 
          ref={journeyRef} 
          className="min-h-screen flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <JourneySect />
        </motion.div>

        {/* Section 2: Workshop (Projects Portfolio) */}
        <motion.div 
          id="projects" 
          ref={workshopRef} 
          className="min-h-screen flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <WorkshopSect />
        </motion.div>

        {/* Section 3: Foundation (Skills & Credentials Bento Box) */}
        <motion.div 
          id="foundation" 
          ref={foundationRef} 
          className="min-h-screen flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <FoundationSect />
        </motion.div>

        {/* Section 4: AI Co-pilot & Recruiter Suite */}
        <motion.div 
          id="ai-copilot" 
          ref={aiCopilotRef} 
          className="min-h-screen flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <AiCopilotSect />
        </motion.div>

        {/* Section 5: Secure Handshake & Footer */}
        <motion.div 
          id="contact" 
          ref={contactRef} 
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-[#010f1f]/80 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <InteractiveFooter />
        </motion.div>
      </main>

      {/* Interactive JSON Source Code IDE Overlay modal */}
      <AnimatePresence>
        {isSourceOpen && (
          <SourceOverlay onClose={() => setIsSourceOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
