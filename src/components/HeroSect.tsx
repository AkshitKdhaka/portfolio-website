'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onViewSource: () => void;
}

export default function HeroSect({ onExplore, onViewSource }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center w-full px-4 sm:px-8 md:px-16 overflow-hidden z-20">
      <div className="w-full max-w-5xl text-center flex flex-col items-center select-none pt-24 md:pt-12">
        
        {/* Animated label */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-mono text-sm text-[#00d1ff] uppercase tracking-[0.3em] mb-4 md:mb-6 leading-none select-none"
        >
          Creative Developer & Architect
        </motion.p>

        {/* Dynamic header - Massive styled stroke font mimicking prompt design */}
        <div className="relative mb-6 md:mb-8">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="font-display font-black text-5xl sm:text-7xl md:text-[84px] lg:text-[110px] leading-[0.85] tracking-tighter text-white uppercase"
          >
            AKSHIT
            <br />
            KUMAR
            <br />
            <span 
              className="text-transparent" 
              style={{ WebkitTextStroke: '1.5px #ffffff' }}
            >
              DHAKA
            </span>
          </motion.h1>
        </div>

        {/* Deep custom Glassmorphic Narrative Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 md:p-12 mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-700"
        >
          {/* Internal neon ambient lighting indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00d1ff]/50 to-transparent"></div>

          <p className="font-sans text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 select-all">
            Engineering high-performance digital solutions with absolute structural integrity, automated developer operations pipelines, and immersive aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Explore scroll button - sharp rectangular custom styling */}
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-[#00d1ff] hover:text-black transition-colors duration-300 flex items-center justify-center gap-2 group/btn transform active:scale-95 cursor-pointer rounded-none"
            >
              Explore Archive
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            {/* Source preview button */}
            <button
              onClick={onViewSource}
              className="w-full sm:w-auto px-8 py-3.5 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer rounded-none"
            >
              <Code className="w-4 h-4 text-[#00d1ff]" />
              Read Payload
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator pointing down */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          onClick={onExplore}
          className="cursor-pointer group flex flex-col items-center gap-2 text-outline/50 hover:text-primary-container transition-colors py-4 mt-auto mb-4"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-75 group-hover:opacity-100 transition-opacity">Scroll to Unfurl</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary-container/60 to-transparent"></div>
        </motion.div>

      </div>
    </section>
  );
}
