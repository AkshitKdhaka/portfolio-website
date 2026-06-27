'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  ShieldCheck, 
  Home,
  User,
  History,
  Briefcase,
  Layers,
  Sparkles,
  Menu,
  X,
  ArrowUp
} from 'lucide-react';
import dynamic from 'next/dynamic';

const WaterBackground = dynamic(() => import('./components/WaterBackground'), {
  ssr: false,
});

const CustomCursor = dynamic(() => import('./components/CustomCursor'), {
  ssr: false,
});

import HeroSect from './components/HeroSect';
import JourneySect from './components/JourneySect';
import WorkshopSect from './components/WorkshopSect';
import FoundationSect from './components/FoundationSect';
import AiCopilotSect from './components/AiCopilotSect';
import InteractiveFooter from './components/InteractiveFooter';
import { contactInfo } from './data';
import { ambientSynth } from './lib/ambientSynth';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localHours, setLocalHours] = useState(0);
  const [localTimeStr, setLocalTimeStr] = useState('');
  const [timeProfile, setTimeProfile] = useState('MIDNIGHT_NEBULA');

  // Unified clock mechanism for real-time local time tracking and theme alignment
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const hour = date.getHours();
      setLocalHours(hour);

      const formatField = (num: number) => num.toString().padStart(2, '0');
      const timeString = `${formatField(hour)}:${formatField(date.getMinutes())}:${formatField(date.getSeconds())}`;
      setLocalTimeStr(timeString);

      if (hour >= 5 && hour < 11) {
        setTimeProfile('DAWN_SUNRISE');
      } else if (hour >= 11 && hour < 17) {
        setTimeProfile('OCEAN_OCEANIC');
      } else if (hour >= 17 && hour < 21) {
        setTimeProfile('SUNSET_TWILIGHT');
      } else {
        setTimeProfile('MIDNIGHT_NEBULA');
      }
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Ref tracking previous scroll position to selectively trigger sound transitions
  const prevSectionRef = useRef<number>(0);

  useEffect(() => {
    if (activeSection !== prevSectionRef.current) {
      ambientSynth.playTransitionSound();
      ambientSynth.playClickPingSound();
      prevSectionRef.current = activeSection;
    }
  }, [activeSection]);

  const toggleAmbientSynth = () => {
    if (isSynthPlaying) {
      ambientSynth.stop();
      setIsSynthPlaying(false);
    } else {
      ambientSynth.start();
      setIsSynthPlaying(true);
    }
  };

  // Turn off ambient synth automatically on unmount to assure memory release
  useEffect(() => {
    return () => {
      ambientSynth.stop();
    };
  }, []);

  // Permanently force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.remove('light');
  }, []);

  // Always open at the top: disable the browser's automatic scroll
  // restoration and reset the scroll position on (re)load.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
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

  // Modern, high-performance IntersectionObserver for section detection without forced layouts
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
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.find(s => s.ref.current === entry.target)?.index;
          if (index !== undefined) {
            setActiveSection((prev) => prev !== index ? index : prev);
          }
        }
      });
    };

    const spectator = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      if (section.ref.current) {
        spectator.observe(section.ref.current);
      }
    });

    const handleBottomCheck = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 15;
      if (isAtBottom) {
        setActiveSection((prev) => prev !== 6 ? 6 : prev);
      }
    };
    window.addEventListener('scroll', handleBottomCheck, { passive: true });

    return () => {
      spectator.disconnect();
      window.removeEventListener('scroll', handleBottomCheck);
    };
  }, []);

  // Custom eased smooth-scroll engine. Native scrollIntoView/scroll-behavior
  // is browser-controlled and feels inconsistent; this gives buttery, uniform
  // easing with a distance-aware duration and cancels cleanly if interrupted.
  const scrollAnimRef = useRef<number | null>(null);

  const smoothScrollTo = (targetY: number) => {
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    // Scale duration with distance, clamped for snappy-yet-smooth feel.
    const duration = Math.min(Math.max(Math.abs(distance) / 2.2, 550), 1150);
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let startTime: number | null = null;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
      }
    };
    scrollAnimRef.current = requestAnimationFrame(step);
  };

  // Smooth scroll helper
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(top);
    }
  };

  // Intercept in-page hash links (e.g. footer "Top / Journey / Workshop")
  // so they use the same eased smooth-scroll instead of an instant jump.
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(top);
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const navItems = [
    { label: 'Water Portal', index: 0, ref: portalRef, icon: Home },
    { label: 'Introduction', index: 1, ref: heroRef, icon: User },
    { label: 'Journey Timeline', index: 2, ref: journeyRef, icon: History },
    { label: 'Project Workshop', index: 3, ref: workshopRef, icon: Briefcase },
    { label: 'System Foundation', index: 4, ref: foundationRef, icon: Layers },
    { label: 'AI Co-pilot', index: 5, ref: aiCopilotRef, icon: Sparkles },
    { label: 'Secure Handshake', index: 6, ref: contactRef, icon: ShieldCheck }
  ];

  // Listen for Up / Down Arrow keys to smoothly navigate between portfolio sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if the user is typing in interactive input fields or textareas (e.g., AI chat/form)
      const targetElement = e.target as HTMLElement;
      if (
        targetElement &&
        (targetElement.tagName === 'INPUT' ||
         targetElement.tagName === 'TEXTAREA' ||
         targetElement.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(activeSection + 1, navItems.length - 1);
        scrollToRef(navItems[nextIndex].ref);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(activeSection - 1, 0);
        scrollToRef(navItems[prevIndex].ref);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);

  return (
    <div className="relative bg-[#040406] text-on-background selection:bg-primary-container selection:text-black md:cursor-none">
      
      {/* 3D Tech Glow background with grids removed per user request */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial atmospheric spotlight glows from Immersive UI theme */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1a3a3a] rounded-full blur-[140px] opacity-15" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00d1ff] rounded-full blur-[150px] opacity-8" />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-[#7000ff] rounded-full blur-[110px] opacity-10" />
      </div>

      {/* Floating Tactical Top Navigation Header - Elevated status bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center select-none transition-all duration-700 ease-in-out opacity-100 translate-y-0 pointer-events-auto">
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
          <span className="font-mono text-[9px] text-[#00d1ff] tracking-wider uppercase">
            Developer Active
          </span>
        </div>

        <div className="flex gap-2 sm:gap-3 items-center">
          <button
            onClick={toggleAmbientSynth}
            className={`flex items-center gap-2 px-2.5 py-1.5 border transition-all cursor-pointer text-[10px] font-mono rounded-none ${
              isSynthPlaying 
                ? 'bg-[#00d1ff]/15 border-[#00d1ff] text-[#00d1ff] shadow-[0_0_15px_rgba(0,209,255,0.25)] font-semibold'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30'
            }`}
            title="Toggle Immersive Ambient Drone Pad"
          >
            {isSynthPlaying ? (
              <>
                <div className="flex items-end gap-0.5 h-3">
                  <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#00d1ff] inline-block" />
                  <motion.span animate={{ height: [8, 3, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#00d1ff] inline-block" />
                  <motion.span animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-[#00d1ff] inline-block" />
                </div>
                <span className="uppercase tracking-wider text-[9px]">Ambient Live</span>
              </>
            ) : (
              <>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1 bg-white/40 inline-block" />
                  <span className="w-0.5 h-1 bg-white/40 inline-block" />
                  <span className="w-0.5 h-1 bg-white/40 inline-block" />
                </div>
                <span className="uppercase tracking-wider text-[9px]">Ambient Off</span>
              </>
            )}
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
              
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                {/* Smoothly sliding glow ring that animates between dots */}
                {isActive && (
                  <motion.span
                    layoutId="hud-active-indicator"
                    className="absolute inset-[-5px] rounded-full border border-[#00d1ff]/70 bg-[#00d1ff]/15 shadow-[0_0_12px_rgba(0,209,255,0.7)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
                  />
                )}
                <motion.span
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    isActive
                      ? 'bg-[#00d1ff]'
                      : 'bg-white/10 group-hover:bg-white/40'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Floating Tactical Bottom 'Jump to Section' Dock Navigation Bar - Fades/slides in past portal screen */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] sm:max-w-max hidden sm:block transition-all duration-700 ease-in-out ${
        activeSection > 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}>
        <div className="flex items-center gap-1 p-1 bg-[#050505]/75 backdrop-blur-lg border border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85),_inset_0_1px_0_rgba(255,255,255,0.08)] relative">
          {navItems.map((item) => {
            const isActive = activeSection === item.index;
            const Icon = item.icon;

            return (
              <button
                key={item.index}
                onClick={() => scrollToRef(item.ref)}
                className={`flex items-center justify-center p-2.5 rounded-full transition-all relative group cursor-pointer focus:outline-none ${
                  isActive ? 'text-[#00d1ff]' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active-pill"
                    className="absolute inset-0 bg-[#00d1ff]/10 border border-[#00d1ff]/30 rounded-full -z-10 shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
                  />
                )}
                
                <motion.div
                  animate={{ scale: isActive ? 1.12 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                  className="group-hover:scale-110 transition-transform duration-300"
                >
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-[#00d1ff] drop-shadow-[0_0_8px_rgba(0,209,255,0.5)]' : 'text-white/45 group-hover:text-white/85'
                  }`} />
                </motion.div>

                {/* Cyberpunk style small elegant floating tooltip bubble */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 px-2.5 py-1.5 bg-[#07070a]/95 border border-[#00d1ff]/20 text-[9px] uppercase tracking-wider text-[#00d1ff] rounded-none opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.6)] whitespace-nowrap font-mono">
                  {item.label}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#07070a]/95" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation FAB Trigger */}
      <div className={`fixed bottom-6 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-6 z-45 sm:hidden transition-all duration-500 pb-2 ${
        activeSection > 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="h-10 px-4 rounded-full bg-[#050505]/95 border border-[#00d1ff]/50 text-[#00d1ff] flex items-center gap-2 shadow-[0_4px_20px_rgba(0,209,255,0.4)] cursor-pointer hover:bg-[#00d1ff]/10 focus:outline-none font-mono text-[10px] uppercase font-bold tracking-wider"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-3.5 h-3.5 animate-pulse" />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay Portal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 sm:hidden"
            />
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-[#07070a]/95 border-l border-white/10 z-50 sm:hidden p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-[#00d1ff] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#00d1ff] rounded-sm rotate-45" />
                    </div>
                    <span className="font-mono text-xs text-[#00d1ff] uppercase tracking-wider font-bold">AKD.DOCK</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-white/50 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.index;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.index}
                        onClick={() => {
                          scrollToRef(item.ref);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-4 px-4 py-3 border transition-all cursor-pointer text-left focus:outline-none ${
                          isActive 
                            ? 'bg-[#00d1ff]/10 border-[#00d1ff]/30 text-[#00d1ff] shadow-[inset_0_0_10px_rgba(0,209,255,0.15)] font-semibold' 
                            : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#00d1ff] drop-shadow-[0_0_6px_#00d1ff]' : 'text-white/45'}`} />
                        <div className="flex flex-col select-none">
                          <span className="font-mono text-[9px] text-[#00d1ff]/60 leading-none">0{item.index}</span>
                          <span className="font-sans text-xs tracking-wide uppercase mt-0.5">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer bottom info */}
              <div className="border-t border-white/5 pt-4">
                <p className="font-mono text-[8px] text-white/30 uppercase tracking-[0.1em]">Target Session Profile</p>
                <p className="font-mono text-[9px] text-white/50 tracking-wider">akshitkumardhaka99@gmail.com</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Interactive 2D/3D Hybrid Water Ripples Background */}
      <WaterBackground activeSection={activeSection} localHours={localHours} />

      {/* Main Single Screen Layout Narrative */}
      <main className="relative z-10 w-full overflow-hidden">
        
        {/* Section 0: Immersive Water Portal */}
        <div 
          id="portal" 
          ref={portalRef} 
          className="h-screen w-full flex flex-col justify-between items-center relative z-20 pt-28 pb-16 px-4 md:px-8 overflow-hidden select-none snap-section"
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
          </div>

          {/* Bottom Activation Controls: Flow trigger enter + Bounce bounce */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
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
        <div id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center snap-section">
          <HeroSect 
            onExplore={() => scrollToRef(journeyRef)} 
          />
        </div>

        {/* Section 1: Journey (Career Timeline) */}
        <motion.div 
          id="journey" 
          ref={journeyRef} 
          className="min-h-screen flex items-center justify-center py-20 snap-section"
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
          className="min-h-screen flex items-center justify-center py-20 snap-section"
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
          className="min-h-screen flex items-center justify-center py-20 snap-section"
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
          className="min-h-screen flex items-center justify-center py-20 snap-section"
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
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-[#010f1f]/80 py-20 snap-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <InteractiveFooter />
        </motion.div>
      </main>

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {activeSection > 0 && (
          <motion.button
            key="scroll-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            onClick={() => scrollToRef(portalRef)}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-[#050508]/85 backdrop-blur-md border border-white/10 hover:border-[#00d1ff] text-white/50 hover:text-[#00d1ff] hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] flex items-center justify-center rounded-lg transition-all focus:outline-none cursor-pointer group active:scale-95"
            title="Return to Home Portal"
          >
            <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* High-performance, magnetically-interactive custom cursor */}
      <CustomCursor />

    </div>
  );
}
