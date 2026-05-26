'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Code, Server, Database, Cloud, GraduationCap, Award, CheckCircle } from 'lucide-react';
import { technicalSkills, education, certifications } from '../data';

export default function FoundationSect() {
  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      {/* Narrative Section Header */}
      <div className="mb-20 flex flex-col items-center text-center">
        <div className="font-mono text-xs text-[#00d1ff] tracking-[0.4em] uppercase mb-3">
          // CHAPTER III
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-wider">
          THE FOUNDATION
        </h2>
        <p className="font-sans text-base sm:text-lg text-gray-400 max-w-2xl mt-4">
          A rigid look at technical tooling and academic background. Configured to deliver extreme system speed and automated deployment.
        </p>
        <div className="w-16 h-1 bg-[#00d1ff] mt-6 rounded-full shadow-[0_0_15px_rgba(0,209,255,0.6)]"></div>
      </div>

      {/* SUB-SECTION 1: TECHNICAL STACK */}
      <div className="mb-10 flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="font-mono text-xs text-[#00d1ff] tracking-[0.3em] uppercase">
          // SYS.INFRASTRUCTURE : TECH STACK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 mb-24">
        
        {/* Bento box 1: Languages (5 cols on md) */}
        <div className="md:col-span-5 bg-[#0a0a0d] border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 group-hover:border-[#00d1ff]/30 transition-all rounded-tr-xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Languages</h3>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {technicalSkills.languages.map((lang) => (
              <span
                key={lang}
                className="px-3.5 py-1.5 bg-[#151515]/80 border border-white/5 text-xs text-on-surface hover:border-[#00d1ff]/20 rounded-xl font-mono tracking-wider transition-colors"
              >
                {lang}
              </span>
            ))}
          </div>
          
          <p className="font-sans text-xs text-gray-400 mt-8 leading-relaxed">
            Strictly typified implementations using modern TypeScript patterns alongside high performance backend environments.
          </p>
        </div>

        {/* Bento box 2: Frameworks (7 cols on md) */}
        <div className="md:col-span-7 bg-[#0a0a0d] border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 group-hover:border-[#00d1ff]/30 transition-all rounded-tr-xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Frameworks & Tooling</h3>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {technicalSkills.frameworks_and_tools.map((fwork) => (
              <span
                key={fwork}
                className="px-3.5 py-1.5 bg-[#151515]/80 border border-white/5 text-xs text-on-surface hover:border-[#00d1ff]/20 rounded-xl font-mono tracking-wider transition-colors"
              >
                {fwork}
              </span>
            ))}
          </div>

          <p className="font-sans text-xs text-gray-400 mt-8 leading-relaxed">
            Deep alignment with static generation methodologies (SSG, SSR), optimized modular react trees, state managers, and component styles.
          </p>
        </div>

        {/* Bento box 3: Databases (6 cols) */}
        <div className="md:col-span-6 bg-[#0a0a0d] border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 group-hover:border-[#00d1ff]/30 transition-all rounded-tr-xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Databases & Architecture</h3>
          </div>

          <div className="space-y-3.5">
            {technicalSkills.databases.map((db, idx) => (
              <div key={db} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-sans text-sm text-white font-medium">{db}</span>
                <span className="font-mono text-[10px] text-[#00d1ff] uppercase tracking-wider">
                  {idx === 0 ? "Production SQL" : "NoSQL Core"}
                </span>
              </div>
            ))}
            {technicalSkills.other.slice(2, 4).map((tech) => (
              <div key={tech} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-b-0">
                <span className="font-sans text-sm text-white/70">{tech}</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase">Tuning</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento box 4: Cloud & DevOps (6 cols) */}
        <div className="md:col-span-6 bg-[#0a0a0d] border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 group-hover:border-[#00d1ff]/30 transition-all rounded-tr-xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Ops & Environment</h3>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {technicalSkills.devops_and_cloud.map((cloud) => (
              <span
                key={cloud}
                className="px-3.5 py-1.5 bg-[#151515]/80 border border-white/5 text-xs text-on-surface hover:border-[#00d1ff]/20 rounded-xl font-mono tracking-wider transition-colors"
              >
                {cloud}
              </span>
            ))}
          </div>

          <p className="font-sans text-xs text-gray-400 mt-6 leading-relaxed">
            Deploying updates on standalone environments, secure certificates setups (Certbot), robust reverse proxy routes, and CI/CD pipelines.
          </p>
        </div>

      </div>

      {/* SUB-SECTION 2: CREDENTIALS & EDUCATION */}
      <div className="mb-10 flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="font-mono text-xs text-[#00d1ff] tracking-[0.3em] uppercase">
          // ACADEMIC.METRICS : CREDENTIALS & TRAINING
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        
        {/* Education list bento */}
        <div className="bg-[#0a0a0d] border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 group-hover:border-[#00d1ff]/30 transition-all rounded-tr-xl" />
          
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-6 h-6 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-xl text-white uppercase tracking-wider">Educational Timeline</h3>
          </div>

          <div className="space-y-8">
            {education.map((edu, idx) => (
              <div key={edu.degree} className="relative pl-6 border-l border-white/10 last:pb-0 pb-2">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[#00d1ff] rounded-full shadow-[0_0_8px_rgba(0,209,255,0.6)]" />
                
                <span className="font-mono text-[10px] text-[#00d1ff] tracking-widest block uppercase mb-1">
                  {edu.start} — {edu.end} • {edu.grade}
                </span>
                
                <h4 className="font-display text-lg text-white uppercase font-bold tracking-tight">
                  {edu.degree}
                </h4>
                <p className="font-sans text-sm text-gray-300 mt-1">{edu.field}</p>
                <p className="font-sans text-xs text-gray-400 mt-1">{edu.institution}, {edu.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications list bento */}
        <div className="bg-[#0a0a0d] border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 group-hover:border-[#00d1ff]/30 transition-all rounded-tr-xl" />
          
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-xl text-white uppercase tracking-wider">Accreditations</h3>
          </div>

          <div className="space-y-6">
            {certifications.map((cert) => (
              <div 
                key={cert.name}
                className="bg-[#151515]/30 p-4 rounded-xl border border-white/5 hover:border-[#00d1ff]/10 transition-colors flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-[#00d1ff] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-white leading-tight">
                    {cert.name}
                  </h4>
                  <span className="font-mono text-[9px] text-[#00d1ff] tracking-widest uppercase block mt-1">
                    {cert.issuer} ({cert.year})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
