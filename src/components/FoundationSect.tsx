'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code, Server, Database, Cloud, GraduationCap, Award, CheckCircle, FileDown, Github, Star, GitBranch, Users, RefreshCw, Activity } from 'lucide-react';
import { technicalSkills, education, certifications } from '../data';
import { generateResumePDF } from '../lib/pdfGenerator';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

const staggeredContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export default function FoundationSect() {
  const [gitStats, setGitStats] = useState<{
    publicRepos: number;
    totalStars: number;
    followers: number;
    avatarUrl: string;
    htmlUrl: string;
    bio: string;
    success: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGitHubStats = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/github');
      if (res.ok) {
        const data = await res.json();
        setGitStats(data);
      }
    } catch (err) {
      console.error('Failed to load telemetry stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGitHubStats();
  }, []);

  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      {/* Floating Download Resume Button */}
      <div className="absolute top-8 right-4 sm:right-8 z-30">
        <motion.button
          onClick={generateResumePDF}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#0a0a0d] border border-[#00d1ff]/20 hover:border-[#00d1ff]/80 text-white hover:text-[#00d1ff] rounded-xl font-mono text-xs uppercase tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(0,209,255,0.25)] transition-all duration-300 cursor-pointer"
          aria-label="Download generated PDF Resume"
          title="Download PDF Resume"
        >
          <FileDown className="w-4 h-4 text-[#00d1ff]" />
          <span className="hidden sm:inline">Download Resume</span>
          <span className="inline sm:hidden">Download</span>
        </motion.button>
      </div>

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

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 mb-24"
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        
        {/* Bento box 1: Languages (5 cols on md) */}
        <motion.div 
          className="md:col-span-5 bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl outline-none"
          variants={cardEntryVariants}
        >
          {/* Futuristic cyan framing highlights to ground the card visually */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Languages</h3>
          </div>
          
          <motion.div 
            className="flex flex-wrap gap-2.5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technicalSkills.languages.map((lang) => (
              <motion.span
                key={lang}
                variants={itemVariants}
                className="px-3.5 py-1.5 bg-[#151515]/80 border border-white/5 text-xs text-on-surface hover:border-[#00d1ff]/20 rounded-xl font-mono tracking-wider transition-colors inline-block"
              >
                {lang}
              </motion.span>
            ))}
          </motion.div>
          
          <p className="font-sans text-xs text-gray-400 mt-8 leading-relaxed">
            Strictly typified implementations using modern TypeScript patterns alongside high performance backend environments.
          </p>
        </motion.div>

        {/* Bento box 2: Frameworks (7 cols on md) */}
        <motion.div 
          className="md:col-span-7 bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl outline-none"
          variants={cardEntryVariants}
        >
          {/* Futuristic cyan framing highlights to ground the card visually */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Frameworks & Tooling</h3>
          </div>
          
          <motion.div 
            className="flex flex-wrap gap-2.5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technicalSkills.frameworks_and_tools.map((fwork) => (
              <motion.span
                key={fwork}
                variants={itemVariants}
                className="px-3.5 py-1.5 bg-[#151515]/80 border border-white/5 text-xs text-on-surface hover:border-[#00d1ff]/20 rounded-xl font-mono tracking-wider transition-colors inline-block"
              >
                {fwork}
              </motion.span>
            ))}
          </motion.div>

          <p className="font-sans text-xs text-gray-400 mt-8 leading-relaxed">
            Deep alignment with static generation methodologies (SSG, SSR), optimized modular react trees, state managers, and component styles.
          </p>
        </motion.div>

        {/* Bento box 3: Databases (6 cols) */}
        <motion.div 
          className="md:col-span-6 bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl outline-none"
          variants={cardEntryVariants}
        >
          {/* Futuristic cyan framing highlights to ground the card visually */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          
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
        </motion.div>

        {/* Bento box 4: Cloud & DevOps (6 cols) */}
        <motion.div 
          className="md:col-span-6 bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl outline-none"
          variants={cardEntryVariants}
        >
          {/* Futuristic cyan framing highlights to ground the card visually */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="w-5 h-5 text-[#00d1ff]" />
            <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Ops & Environment</h3>
          </div>

          <motion.div 
            className="flex flex-wrap gap-2.5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technicalSkills.devops_and_cloud.map((cloud) => (
              <motion.span
                key={cloud}
                variants={itemVariants}
                className="px-3.5 py-1.5 bg-[#151515]/80 border border-white/5 text-xs text-on-surface hover:border-[#00d1ff]/20 rounded-xl font-mono tracking-wider transition-colors inline-block"
              >
                {cloud}
              </motion.span>
            ))}
          </motion.div>

          <p className="font-sans text-xs text-gray-400 mt-6 leading-relaxed">
            Deploying updates on standalone environments, secure certificates setups (Certbot), robust reverse proxy routes, and CI/CD pipelines.
          </p>
        </motion.div>

      </motion.div>

      {/* SUB-SECTION: LIVE GITHUB METRICS */}
      <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00d1ff] animate-pulse" />
          <span className="font-mono text-xs text-[#00d1ff] tracking-[0.3em] uppercase">
            // SYS.HUB : SYNCED GITHUB STATISTICS
          </span>
        </div>
        <button 
          onClick={fetchGitHubStats}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00d1ff]/10 hover:bg-[#00d1ff]/20 text-[#00d1ff] border border-[#00d1ff]/20 hover:border-[#00d1ff]/80 font-mono text-[10px] tracking-wider uppercase transition-all rounded-md cursor-pointer disabled:opacity-50"
          title="Refresh Git Stats"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      <motion.div
        className="mb-24 bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl"
        variants={cardEntryVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Futuristic cyan framing highlights */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 text-[#00d1ff] animate-spin mb-4" />
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse">Establishing handshake with github.com...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* User profile section */}
            <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-5 md:border-r md:border-white/10 md:pr-8">
              <div className="relative w-20 h-20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                {/* Cyber ring outer decoration */}
                <div className="absolute -inset-1 border border-[#00d1ff]/30 rounded-full animate-pulse pointer-events-none" />
                <div className="absolute -inset-1.5 border border-dashed border-[#00d1ff]/15 rounded-full pointer-events-none" />
                <img 
                  src={gitStats?.avatarUrl || 'https://github.com/AkshitKdhaka.png'} 
                  alt="GitHub Profile Avatar" 
                  className="rounded-full w-full h-full object-cover border-2 border-[#00d1ff]/40 relative z-15"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider">
                    AkshitKdhaka
                  </h3>
                  <span className="inline-flex w-2 h-2 rounded-full bg-[#00d1ff] shadow-[0_0_8px_#00d1ff] animate-ping" />
                </div>
                <p className="font-sans text-xs text-gray-400 mt-1.5 leading-relaxed max-w-sm">
                  {gitStats?.bio || "Full Stack Developer engineering high-efficiency systems and pixel-perfect UIs."}
                </p>
                <a 
                  href={gitStats?.htmlUrl || 'https://github.com/AkshitKdhaka'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center gap-1 text-xs font-mono text-[#00d1ff] hover:text-white transition-colors uppercase tracking-wider group/link"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Explore Workspace</span>
                  <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Repos card */}
              <div className="bg-[#151515]/30 p-5 rounded-xl border border-white/5 hover:border-[#00d1ff]/20 hover:bg-[#151515]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Repositories</span>
                  <GitBranch className="w-4 h-4 text-[#00d1ff]" />
                </div>
                <div className="font-display text-3xl font-black text-white tracking-wider">
                  {gitStats?.publicRepos}
                </div>
                <p className="font-sans text-[11px] text-gray-400 mt-1">Open Source projects</p>
              </div>

              {/* Stars card */}
              <div className="bg-[#151515]/30 p-5 rounded-xl border border-white/5 hover:border-[#00d1ff]/20 hover:bg-[#151515]/50 transition-all relative overflow-hidden group/star">
                <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-[#00d1ff]/5 rounded-full blur-xl group-hover/star:bg-[#00d1ff]/10 transition-colors pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Reputation</span>
                  <Star className="w-4 h-4 text-[#00d1ff] fill-[#00d1ff]/10 group-hover/star:fill-[#00d1ff] transition-all" />
                </div>
                <div className="font-display text-3xl font-black text-white tracking-wider flex items-baseline gap-1">
                  <span>{gitStats?.totalStars}</span>
                  <span className="text-xs text-[#00d1ff] font-medium font-mono">STARS</span>
                </div>
                <p className="font-sans text-[11px] text-gray-400 mt-1">Earned stargazers</p>
              </div>

              {/* Followers card */}
              <div className="bg-[#151515]/30 p-5 rounded-xl border border-white/5 hover:border-[#00d1ff]/20 hover:bg-[#151515]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Reach</span>
                  <Users className="w-4 h-4 text-[#00d1ff]" />
                </div>
                <div className="font-display text-3xl font-black text-white tracking-wider">
                  {gitStats?.followers}
                </div>
                <p className="font-sans text-[11px] text-gray-400 mt-1">Network connections</p>
              </div>

            </div>

          </div>
        )}
      </motion.div>

      {/* SUB-SECTION 2: CREDENTIALS & EDUCATION */}
      <div className="mb-10 flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="font-mono text-xs text-[#00d1ff] tracking-[0.3em] uppercase">
          // ACADEMIC.METRICS : CREDENTIALS & TRAINING
        </span>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6"
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        
        {/* Education list bento */}
        <motion.div 
          className="bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl outline-none"
          variants={cardEntryVariants}
        >
          {/* Futuristic cyan framing highlights to ground the card visually */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          
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
        </motion.div>

        {/* Certifications list bento */}
        <motion.div 
          className="bg-[#0a0a0d] border border-white/15 hover:border-[#00d1ff]/80 focus-within:border-[#00d1ff]/80 p-8 rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] focus-within:shadow-[0_0_20px_rgba(0,209,255,0.22),0_25px_60px_rgba(0,209,255,0.15)] transition-all duration-300 shadow-2xl outline-none"
          variants={cardEntryVariants}
        >
          {/* Futuristic cyan framing highlights to ground the card visually */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#00d1ff]/40 group-hover:border-[#00d1ff]/90 group-hover:shadow-[0_0_8px_rgba(0,209,255,0.6)] transition-all duration-300 pointer-events-none" aria-hidden="true" />
          
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
        </motion.div>

      </motion.div>

    </section>
  );
}
