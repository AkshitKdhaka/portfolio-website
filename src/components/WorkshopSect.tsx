'use client';

import React, { useState } from 'react';
import { ExternalLink, Server, Compass, CheckCircle2, Award, Zap } from 'lucide-react';
import { projects } from '../data';
import { Project } from '../types';

interface ProjectCardProps {
  proj: Project;
  idx: number;
}

function ProjectCard({ proj, idx }: ProjectCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to the element
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalized coords (-0.5 to 0.5)
    const xPct = mouseX / width;
    const yPct = mouseY / height;
    
    // Expanded maximum angle limit for extra responsive physical movement (up to 18 degrees)
    const maxTilt = 18;
    const rX = -(yPct - 0.5) * maxTilt;
    const rY = (xPct - 0.5) * maxTilt;
    
    setRotateX(rX);
    setRotateY(rY);
    setGlowX(xPct * 100);
    setGlowY(yPct * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-labelledby={`project-title-${idx}`}
      className="relative bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/60 focus-within:border-[#00d1ff]/60 rounded-xl overflow-hidden flex flex-col shadow-2xl hover:shadow-[0_25px_60px_rgba(0,209,255,0.18)] focus-within:shadow-[0_25px_60px_rgba(0,209,255,0.18)] transition-all duration-300 group pointer-events-auto h-full outline-none"
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered 
          ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, box-shadow 0.3s ease' 
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Laser spotlight cursor tracking glare */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-350"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 320px at ${glowX}% ${glowY}%, rgba(0, 209, 255, 0.22), transparent 85%)`,
        }}
      />
      
      {/* Floating Performance Metric badge with extreme scale depth */}
      {proj.metric && (
        <div 
          className="absolute top-4 right-4 z-40 bg-black/95 backdrop-blur-md border border-[#00d1ff]/25 px-3 py-1.5 rounded-none flex items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.7)]"
          style={{ transform: 'translateZ(40px)' }}
          aria-label={`Performance metric: ${proj.metric} ${proj.metricLabel}`}
        >
          <Zap className="w-3.5 h-3.5 text-[#00d1ff] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[9px] tracking-widest text-[#00d1ff] font-bold uppercase">
            {proj.metric} {proj.metricLabel}
          </span>
        </div>
      )}
 
      {/* Futuristic cyan framing highlights to ground the card visually */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 pointer-events-none" aria-hidden="true" />
 
      {/* Taller Wide aspect-ratio container running object-contain on solid terminal dark backgrounds */}
      {/* This preserves full uncropped content screenshots in gorgeous preview format */}
      <div 
        className="aspect-[16/10] w-full relative overflow-hidden bg-[#030303] flex items-center justify-center p-3 border-b border-white/5 select-none"
        style={{ 
          transform: 'translateZ(25px)',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 pointer-events-none" />
        
        {proj.imageUrl ? (
          <img
            src={proj.imageUrl}
            alt={`Screenshot preview of ${proj.name} interface`}
            referrerPolicy="no-referrer"
            className="w-[98%] h-[98%] object-contain filter brightness-[1.05] saturate-[1.03] z-0 rounded-lg shadow-2xl"
            style={{ 
              transform: isHovered ? 'translateZ(30px) scale(1.05)' : 'translateZ(10px) scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#07090f] border border-white/5 rounded-lg">
            <Compass className="w-10 h-10 text-[#00d1ff]/30 animate-spin-slow" aria-hidden="true" />
          </div>
        )}
      </div>
 
      {/* Project content with depth layout */}
      <div 
        className="p-6 flex flex-col flex-grow relative z-20"
        style={{ 
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d'
        }}
      >
        <span className="font-mono text-[9px] text-[#00d1ff] tracking-[0.25em] uppercase mb-1 block select-none">
          {proj.subtitle || "Enterprise Subsystem"}
        </span>
        
        <h3 
          id={`project-title-${idx}`} 
          className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-[#00d1ff] tracking-tight uppercase select-text"
          style={{
            transform: isHovered ? 'translateZ(15px) translateX(6px)' : 'translateZ(0px) translateX(0px)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease'
          }}
        >
          {proj.name}
        </h3>
        
        <p className="font-sans text-sm text-gray-300 line-clamp-3 mt-3 mb-6 leading-relaxed select-text" style={{ transform: 'translateZ(5px)' }}>
          {proj.summary}
        </p>
 
        {/* Tags cluster */}
        <div 
          className="flex flex-wrap gap-1.5 mb-6 mt-auto select-none" 
          style={{ transform: 'translateZ(15px)' }}
          role="list"
          aria-label={`Tech stack for ${proj.name}`}
        >
          {proj.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              role="listitem"
              className="px-2.5 py-1 bg-[#121318]/90 border border-[#00d1ff]/20 text-[#00d1ff] font-mono text-[9px] uppercase tracking-wider rounded-md"
            >
              {tag}
            </span>
          ))}
          {proj.tags.length > 4 && (
            <span role="listitem" className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/40 font-mono text-[9px] rounded-md">
              +{proj.tags.length - 4} items
            </span>
          )}
        </div>
 
        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto" style={{ transform: 'translateZ(18px)' }}>
          {proj.url ? (
            <a
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-[#00d1ff]/10 border border-[#00d1ff]/20 text-[#00d1ff] hover:bg-[#00d1ff] hover:text-black focus:bg-[#00d1ff] focus:text-black font-mono text-[10px] uppercase font-bold tracking-widest rounded-none flex items-center gap-1.5 transition-all duration-300 w-full justify-center cursor-pointer outline-none focus:ring-2 focus:ring-[#00d1ff] focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Explore live deployment of ${proj.name}`}
            >
              <span>Explore Deployment</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-widest rounded-none flex items-center gap-1.5 w-full justify-center select-none" role="status" aria-label="Internal subsystem specification only, no live URL">
              <span>Internal Subsystem Spec</span>
            </div>
          )}
        </div>
      </div>
 
      {/* Expanded Specifications List - Permanently displayed */}
      <section
        className="overflow-hidden bg-[#040507]/98 border-t border-white/10 boundary z-20"
        style={{ transform: 'translateZ(5px)' }}
        aria-labelledby={`project-specs-title-${idx}`}
      >
        <div className="p-6 space-y-4">
          <div id={`project-specs-title-${idx}`} className="font-mono text-[9px] text-[#00d1ff] tracking-widest uppercase flex items-center gap-1 border-b border-white/5 pb-2 select-none">
            <Server className="w-3.5 h-3.5 text-[#00d1ff]" aria-hidden="true" />
            Architectural Implementation details
          </div>
          
          <ul className="space-y-3" aria-label={`Implementation highlights for ${proj.name}`}>
            {proj.details.map((detail, dIdx) => (
              <li key={dIdx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00d1ff] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-sans text-xs text-gray-300 leading-relaxed select-text">
                  {detail}
                </span>
              </li>
            ))}
          </ul>
 
          {/* Technical checklist details */}
          <div className="bg-[#0b0c10] p-3 rounded-none border border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-cyan-200 select-none" role="status">
            <Award className="w-3.5 h-3.5 text-[#00d1ff]" aria-hidden="true" />
            <span>Stack Audit Verified • Clean SSR Hygiene</span>
          </div>
        </div>
      </section>
 
    </article>
  );
}

export default function WorkshopSect() {
  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      {/* Narrative Section Header */}
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="font-mono text-xs text-[#00d1ff] tracking-[0.4em] uppercase mb-3 select-none">
          // CHAPTER II
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-wider select-none animate-pulse">
          THE WORKSHOP
        </h2>
        <p className="font-sans text-base sm:text-lg text-gray-400 max-w-2xl mt-4">
          A catalog of validated active deployments. Architected for speed, organic indexability, and highly responsive user interfaces.
        </p>
        <div className="w-16 h-1 bg-[#00d1ff] mt-6 rounded-full shadow-[0_0_15px_rgba(0,209,255,0.6)]"></div>
      </div>

      {/* 2-column Layout of Projects showing 2 cards in one row on wider screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pb-12">
        {projects.map((proj: Project, idx: number) => {
          return (
            <div key={proj.name} className="h-full">
              <ProjectCard
                proj={proj}
                idx={idx}
              />
            </div>
          );
        })}
      </div>

    </section>
  );
}
