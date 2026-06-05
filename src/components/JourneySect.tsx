'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle, Cpu } from 'lucide-react';
import { experiences } from '../data';
import { Experience } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardEntryVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 110,
      damping: 16,
      mass: 0.8,
    },
  },
};

export default function JourneySect() {
  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full"
      >
        {/* Narrative Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.div 
            variants={headerVariants}
            className="font-mono text-xs text-[#00d1ff] tracking-[0.4em] uppercase mb-3"
          >
            // CHAPTER I
          </motion.div>
          <motion.h2 
            variants={headerVariants}
            className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-wider"
          >
            Professional Journey
          </motion.h2>
          <motion.p 
            variants={headerVariants}
            className="font-sans text-base sm:text-lg text-gray-400 max-w-2xl mt-4"
          >
            A narrative of engineering milestones—bringing robust database scaling, server efficiency audits, and Next.js frontends to production.
          </motion.p>
          <motion.div 
            variants={headerVariants}
            className="w-16 h-1 bg-[#00d1ff] mt-6 rounded-full shadow-[0_0_15px_rgba(0,209,255,0.6)]"
          />
        </div>

        <div className="relative pl-2 sm:pl-8 md:pl-0 mt-16 max-w-5xl mx-auto">
          {/* Glowing vertical 3D timeline track */}
          <div className="absolute left-2.5 sm:left-8 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#00d1ff]/40 via-[#151515]/10 to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-16">
            {experiences.map((exp: Experience, idx: number) => {
              const isLatest = idx === 0;
              const isLeft = idx % 2 === 0;

              return (
                <motion.div 
                  key={`${exp.company}-${idx}`}
                  className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} justify-between items-stretch w-full`}
                  variants={cardEntryVariants}
                >
                
                {/* Meta details column */}
                <div className={`w-full md:w-[46%] flex flex-col justify-center ${isLeft ? 'md:text-left md:items-start' : 'md:text-right md:items-end'} mb-4 md:mb-0`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isLatest && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d1ff] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00d1ff]"></span>
                      </span>
                    )}
                    <span className="font-mono text-xs text-[#00d1ff] tracking-widest uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.start} — {exp.end}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-white tracking-wide uppercase hover:text-[#00d1ff] transition-colors">
                    {exp.title}
                  </h3>
                  <div className="font-sans text-base text-cyan-200/80 mb-3 flex items-center gap-1.5 mt-1">
                    <span>{exp.company}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-gray-400 flex items-center text-xs">
                      <MapPin className="w-3 h-3 mr-0.5" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Skills tags embedded */}
                  <div className={`flex flex-wrap gap-2 mt-4 ${isLeft ? 'justify-start' : 'md:justify-end'}`}>
                    {exp.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-[#151515]/80 border border-white/5 rounded-full font-mono text-[10px] text-cyan-100 uppercase tracking-wider hover:border-[#00d1ff]/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vertical Central Nodes with rotation animations */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[#050505] border border-white/10 rounded-xl items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 self-center group-hover:border-[#00d1ff] transition-all">
                  <Briefcase className={`w-5 h-5 ${isLatest ? 'text-[#00d1ff] animate-pulse' : 'text-gray-500'}`} />
                </div>

                {/* Content Glass Panel Card */}
                <div className="w-full md:w-[46%] pointer-events-auto">
                  <div
                    className="relative bg-[#050608] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 rounded-xl p-6 sm:p-8 hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 group h-full flex flex-col overflow-hidden outline-none"
                  >
                    {/* Futuristic cyan framing highlights to ground the card visually */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
                    
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <span className="font-mono text-[10px] text-[#00d1ff] tracking-widest uppercase flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-[#00d1ff]" />
                        Achievements Matrix
                      </span>
                    </div>

                    <div className="overflow-hidden">
                      <ul className="space-y-3 mt-2 pr-2">
                        {exp.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300">
                            <CheckCircle className="w-4 h-4 text-[#00d1ff] shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
      </motion.div>
    </section>
  );
}
