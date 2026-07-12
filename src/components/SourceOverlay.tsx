'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Terminal, Code, HelpCircle, FileJson } from 'lucide-react';
import { experiences, projects, education, certifications, contactInfo } from '../data';

interface SourceOverlayProps {
  onClose: () => void;
}

export default function SourceOverlay({ onClose }: SourceOverlayProps) {
  const [copied, setCopied] = useState(false);

  // Generate a pristine JSON object representing Akshit's resume
  const resumeJsonString = JSON.stringify({
    profile: {
      fullName: "AKSHIT KUMAR DHAKA",
      roles: ["Full Stack Developer", "Software Developer (SDE-1)", "Web Developer"],
      contact: contactInfo
    },
    experience: experiences.map(exp => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      duration: `${exp.start} - ${exp.end}`,
      challengesSolved: exp.highlights
    })),
    selectedProjects: projects.map(p => ({
      name: p.name,
      objective: p.subtitle,
      impact: p.summary,
      verifications: p.metric ? `${p.metric} ${p.metricLabel}` : "Passed",
      tags: p.tags
    })),
    education: education,
    certifications: certifications
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#010f1f]/90 backdrop-blur-md"
      />

      {/* Code window */}
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-[#051424] border border-[#00f0ff]/20 rounded-2xl shadow-[0_30px_70px_rgba(0,240,255,0.08)] overflow-hidden flex flex-col z-10 max-h-[85vh]"
      >
        {/* IDE top bar */}
        <div className="bg-[#122131]/60 px-6 py-4 flex items-center justify-between border-b border-white/5 select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3.5 h-3.5 bg-red-500/80 rounded-full inline-block cursor-pointer hover:bg-red-400" onClick={onClose} />
              <span className="w-3.5 h-3.5 bg-yellow-500/80 rounded-full inline-block" />
              <span className="w-3.5 h-3.5 bg-green-500/80 rounded-full inline-block" />
            </div>
            
            <span className="text-white/20">|</span>
            
            <div className="flex items-center gap-2 text-primary-container">
              <FileJson className="w-4 h-4 text-primary-container" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">akshit-resume.json</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-[#122131] hover:bg-cyan-950/40 border border-[#00f0ff]/20 hover:border-primary-container rounded-lg font-mono text-[10px] uppercase font-semibold text-cyan-200 tracking-wider flex items-center gap-1.5 transition-all select-none cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-[#122131] border border-white/5 hover:border-red-500/50 hover:text-red-400 rounded-lg text-white/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console warning note */}
        <div className="bg-[#122131]/20 px-6 py-2.5 border-b border-white/5 flex items-center gap-2 text-[10px] font-mono text-cyan-200/60 select-none">
          <Terminal className="w-3.5 h-3.5 text-primary-container" />
          <span>PRODUCTION-GRADE SCHEMA LOADED SUCCESSFULLY UNDER RFC-8259</span>
        </div>

        {/* Editor viewer window */}
        <div className="p-6 overflow-y-auto bg-[#010f1f]/80 text-on-surface flex-grow font-mono text-xs leading-relaxed selection:bg-primary-container selection:text-black">
          <pre className="text-cyan-100/90 leading-relaxed whitespace-pre overflow-x-auto">
            <code>{resumeJsonString}</code>
          </pre>
        </div>

        {/* Code window status row status */}
        <div className="bg-[#122131]/40 px-6 py-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-outline select-none">
          <span className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>JSON • UTF-8 • 100% Type Safe</span>
          </span>
          <span>Lines: {resumeJsonString.split('\n').length}</span>
        </div>
      </motion.div>
    </div>
  );
}
