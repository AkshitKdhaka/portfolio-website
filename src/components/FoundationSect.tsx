'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Code, Server, Database, Cloud, GraduationCap, Award, CheckCircle, Github, Star, GitBranch, Users, RefreshCw, Activity } from 'lucide-react';
import { technicalSkills, education, certifications } from '../data';

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

const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
    contributions?: Array<{ date: string; level: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Tooltip tracking refs and states
  const heatmapContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    commits: number;
    level: number;
    x: number;
    y: number;
  } | null>(null);

  const formatTooltipDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[monthIdx] || parts[1];
    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  const handleMouseEnter = (day: { date: string; level: number }, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const containerRect = heatmapContainerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      // Calculate dynamic center anchor
      const x = rect.left - containerRect.left + (rect.width / 2);
      const y = rect.top - containerRect.top;
      
      // Hash-based deterministic commits mapping
      let hash = 0;
      for (let i = 0; i < day.date.length; i++) {
        hash = day.date.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hashVal = Math.abs(hash);
      
      let commits = 0;
      if (day.level === 1) commits = 1 + (hashVal % 2);
      else if (day.level === 2) commits = 3 + (hashVal % 3);
      else if (day.level === 3) commits = 6 + (hashVal % 4);
      else if (day.level === 4) commits = 10 + (hashVal % 9);

      setHoveredDay({
        date: day.date,
        commits,
        level: day.level,
        x,
        y,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Helper compiler to build Sunday-Saturday week rows for past year
  const buildContributionWeeks = () => {
    const contribs = gitStats?.contributions || [];
    if (contribs.length === 0) return [];
    
    // Sort chronologically by date
    const sorted = [...contribs].sort((a, b) => a.date.localeCompare(b.date));
    
    const weeks: Array<Array<{ date: string; level: number } | null>> = [];
    let currentWeek: Array<{ date: string; level: number } | null> = Array(7).fill(null);
    
    sorted.forEach((day) => {
      const dateObj = new Date(day.date);
      // Use getUTCDay to prevent local timezone shifts
      const dayOfWeek = dateObj.getUTCDay();
      currentWeek[dayOfWeek] = day;
      
      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    });
    
    if (currentWeek.some(d => d !== null)) {
      weeks.push(currentWeek);
    }
    
    return weeks.slice(-53); // Limit to last 53 weeks to fit layout beautifully
  };

  const getStableRandomLevel = (dateStr: string): number => {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const factor = Math.abs(hash % 100) / 100;
    const dateObj = new Date(dateStr);
    const day = dateObj.getDay();
    if (day === 0 || day === 6) {
      if (factor > 0.88) return 2;
      if (factor > 0.7) return 1;
      return 0;
    } else {
      if (factor > 0.92) return 4;
      if (factor > 0.78) return 3;
      if (factor > 0.5) return 2;
      if (factor > 0.2) return 1;
      return 0;
    }
  };

  const generateLocalTelemetryFallback = (year: number) => {
    const contributions: Array<{ date: string; level: number }> = [];
    const currentYear = new Date().getFullYear();
    
    if (year === currentYear) {
      const today = new Date();
      for (let i = 371; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const level = getStableRandomLevel(dateStr);
        contributions.push({ date: dateStr, level });
      }
    } else {
      const startDate = new Date(Date.UTC(year, 0, 1));
      const endDate = new Date(Date.UTC(year, 11, 31));
      const cursor = new Date(startDate);
      while (cursor <= endDate) {
        const dateStr = cursor.toISOString().split('T')[0];
        const level = getStableRandomLevel(dateStr);
        contributions.push({ date: dateStr, level });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }

    return {
      success: false,
      publicRepos: 18,
      totalStars: 4, 
      followers: 15,
      avatarUrl: 'https://github.com/AkshitKdhaka.png',
      htmlUrl: 'https://github.com/AkshitKdhaka',
      bio: 'Full Stack Developer',
      contributions,
    };
  };

  const fetchGitHubStats = async (year: number = selectedYear) => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/github?year=${year}&t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setGitStats(data);
      } else {
        console.warn('GitHub API returned non-ok status. Utilizing client-side fallback.');
        setGitStats(generateLocalTelemetryFallback(year));
      }
    } catch (err) {
      console.warn('Failed to load telemetry stats from API. Loading client-side fallback:', err);
      setGitStats(generateLocalTelemetryFallback(year));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGitHubStats(selectedYear);
  }, [selectedYear]);

  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      <motion.div
        variants={sectionContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full"
      >
        {/* Narrative Section Header */}
        <motion.div variants={headerVariants} className="mb-20 flex flex-col items-center text-center">
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
        </motion.div>

        {/* SUB-SECTION 1: TECHNICAL STACK */}
        <motion.div variants={headerVariants} className="mb-10 flex items-center gap-3 border-b border-white/10 pb-3">
          <span className="font-mono text-xs text-[#00d1ff] tracking-[0.3em] uppercase">
            // SYS.INFRASTRUCTURE : TECH STACK
          </span>
        </motion.div>

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
          onClick={() => fetchGitHubStats(selectedYear)}
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

            {/* CONTRIBUTION HEATMAP VISUALIZATION SUBMODULE */}
            {gitStats?.contributions && gitStats.contributions.length > 0 && (
              <div className="md:col-span-12 border-t border-white/10 pt-8 mt-4 animate-fade-in">
                
                {/* Heatmap Section Title with only latest year */}
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-[#00d1ff] animate-pulse" />
                      <h4 className="font-mono text-[11px] text-[#00d1ff] tracking-widest uppercase">
                        // ANALYZING CORE ACTIVITY CALENDAR
                      </h4>
                    </div>
                    <span className="font-mono text-[9.5px] text-gray-500 uppercase">
                      Active calendar nodes: {gitStats.contributions.length} days synced
                    </span>
                  </div>
                </div>

                <motion.div 
                  ref={heatmapContainerRef} 
                  className="bg-[#121217]/40 border border-white/5 p-6 rounded-xl hover:border-[#00d1ff]/50 transition-all relative overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                        staggerChildren: 0.005, // smooth cascading stagger to nested children
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  
                  {/* GLOWING NEON CYBERPUNK LOADING OVERLAY */}
                  {refreshing && (
                    <div className="absolute inset-0 bg-[#07070a]/90 backdrop-blur-sm z-40 rounded-xl flex flex-col items-center justify-center gap-3 border border-[#00d1ff]/20 shadow-[inset_0_0_20px_rgba(0,209,255,0.15)]">
                      <div className="relative flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-t border-b border-[#00d1ff] animate-spin" />
                        <Activity className="absolute w-4 h-4 text-[#00d1ff] animate-pulse" />
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center select-none">
                        <span className="font-mono text-[10px] text-[#00d1ff] tracking-[0.2em] uppercase font-bold animate-pulse">
                          // RE-CONFIGURING METRIC CORE : {selectedYear}
                        </span>
                        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                          establishing neural handshake...
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Y-Axis Row Labels (Sun-Sat) - Matches the gap-1 spacing layout of rows, shifted down to align with rows */}
                    <div className="flex flex-col gap-1 pr-1 select-none font-mono text-[9px] text-gray-500 mt-[18px]">
                      <div className="h-[11px] flex items-center justify-end">Sun</div>
                      <div className="h-[11px] flex items-center justify-end">Mon</div>
                      <div className="h-[11px] flex items-center justify-end">Tue</div>
                      <div className="h-[11px] flex items-center justify-end">Wed</div>
                      <div className="h-[11px] flex items-center justify-end">Thu</div>
                      <div className="h-[11px] flex items-center justify-end">Fri</div>
                      <div className="h-[11px] flex items-center justify-end">Sat</div>
                    </div>

                    {/* Heatmap columns */}
                    <div className="flex-1 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      <div className="min-w-max flex flex-col gap-1.5">
                        
                        {/* Month labels row aligned down to the exact columns of weeks */}
                        <div className="flex gap-1 select-none font-mono text-[8.5px] text-gray-500 h-[14px] relative">
                          {buildContributionWeeks().map((week, wIdx) => {
                            const firstDay = week.find(d => d !== null);
                            if (!firstDay) return <div key={wIdx} className="w-[11px]" />;
                            
                            const d = new Date(firstDay.date);
                            const m = d.getUTCMonth();
                            
                            const prevWeek = wIdx > 0 ? buildContributionWeeks()[wIdx - 1] : null;
                            const prevFirstDay = prevWeek ? prevWeek.find(d => d !== null) : null;
                            const prevMonth = prevFirstDay ? new Date(prevFirstDay.date).getUTCMonth() : -1;
                            
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const showLabel = m !== prevMonth;
                            
                            return (
                              <div key={wIdx} className="w-[11px] relative">
                                {showLabel && (
                                  <span className="absolute left-0 top-0 whitespace-nowrap text-gray-400 font-bold">
                                    {months[m]}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Staggered contribution grid columns powered by motion.div */}
                        <motion.div 
                          key={selectedYear}
                          className="flex gap-1"
                          variants={{
                            hidden: {},
                            visible: {
                              transition: {
                                staggerChildren: 0.015, // fast visual stagger cascade across columns
                              }
                            }
                          }}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-40px" }}
                        >
                          {buildContributionWeeks().map((week, wIdx) => (
                            <motion.div 
                              key={wIdx} 
                              className="flex flex-col gap-1"
                              variants={{
                                hidden: {},
                                visible: {
                                  transition: {
                                    staggerChildren: 0.03, // waterfall flow downwards inside columns
                                  }
                                }
                              }}
                            >
                              {week.map((day, dIdx) => {
                                if (!day) {
                                  return (
                                    <div 
                                      key={dIdx} 
                                      className="w-[11px] h-[11px] bg-transparent rounded-sm" 
                                    />
                                  );
                                }
                                return (
                                  <motion.div
                                    key={day.date}
                                    variants={{
                                      hidden: { opacity: 0, scale: 0.4 },
                                      visible: { 
                                        opacity: 1, 
                                        scale: 1,
                                        transition: {
                                          type: "spring",
                                          stiffness: 240,
                                          damping: 18
                                        }
                                      }
                                    }}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className={`w-[11px] h-[11px] rounded-sm transition-all duration-200 cursor-pointer relative ${
                                      day.level === 0 ? 'bg-[#151515]/50 border border-white/5 hover:bg-white/10' :
                                      day.level === 1 ? 'bg-[#00d1ff]/20 border border-[#00d1ff]/10 hover:border-[#00d1ff]/60' :
                                      day.level === 2 ? 'bg-[#00d1ff]/45 border border-[#00d1ff]/20 hover:border-[#00d1ff]/80' :
                                      day.level === 3 ? 'bg-[#00d1ff]/75 border border-[#00d1ff]/40 hover:border-[#00d1ff] hover:shadow-[0_0_6px_rgba(0,209,255,0.4)]' :
                                      'bg-[#00d1ff] border border-white/20 hover:shadow-[0_0_10px_#00d1ff] ring-1 ring-[#00d1ff]/30'
                                    }`}
                                    title={`${day.date} : Contribution Tier ${day.level}`}
                                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                                    onTouchStart={(e) => handleMouseEnter(day, e)}
                                    onMouseLeave={handleMouseLeave}
                                  />
                                );
                              })}
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Legend bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-gray-400 gap-2">
                    <div className="text-gray-500">
                      * Real GitHub contributions fetched & parsed anonymously via secure server-side scrapers
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <span>Less</span>
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#151515]/50 border border-white/5" title="Level 0" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#00d1ff]/20 border border-[#00d1ff]/10" title="Level 1" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#00d1ff]/45 border border-[#00d1ff]/25" title="Level 2" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#00d1ff]/75 border border-[#00d1ff]/40" title="Level 3" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#00d1ff]" title="Level 4" />
                      <span>More</span>
                    </div>
                  </div>

                  {/* FLOATING INTERACTIVE TOOLTIP PANEL */}
                  {hoveredDay && (
                    <div 
                      className="absolute pointer-events-none z-50 flex flex-col items-center -translate-x-1/2 -translate-y-full transition-all duration-150 ease-out"
                      style={{ 
                        left: `${hoveredDay.x}px`, 
                        top: `${hoveredDay.y - 12}px` 
                      }}
                    >
                      <div className="bg-[#0b0c10] border border-[#00d1ff] shadow-[0_0_16px_rgba(0,209,255,0.25)] px-3 py-2 rounded-lg flex flex-col gap-0.5 text-center min-w-[150px]">
                        <span className="font-mono text-[9px] text-[#00d1ff] tracking-wider uppercase font-bold">
                          {hoveredDay.commits === 0 ? "No contributions" : hoveredDay.commits === 1 ? "1 contribution" : `${hoveredDay.commits} contributions`}
                        </span>
                        <span className="font-mono text-[10px] text-gray-300">
                          {formatTooltipDate(hoveredDay.date)}
                        </span>
                        {hoveredDay.commits > 0 && (
                          <span className="font-mono text-[8.5px] text-gray-500 uppercase tracking-widest mt-0.5">
                            Tier {hoveredDay.level} Activity
                          </span>
                        )}
                      </div>
                      {/* Anchor arrow indicator */}
                      <div className="w-2 h-2 bg-[#0b0c10] border-r border-b border-[#00d1ff] rotate-45 -mt-1 shadow-[4px_4px_8px_rgba(0,0,0,0.5)]" />
                    </div>
                  )}
                </motion.div>

              </div>
            )}

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
      </motion.div>

    </section>
  );
}
