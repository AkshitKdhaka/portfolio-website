'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Linkedin, Github, Send, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import { contactInfo, fullName } from '../data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const colLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const colRightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function InteractiveFooter() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'compiling'>('idle');
  const [polishing, setPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailHover, setEmailHover] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(contactInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('compiling');
    
    // Simulate compilation of contact communication
    setTimeout(() => {
      setStatus('success');
      
      // Beautifully trigger a prefilled mailto draft to recruit Akshit
      const subject = encodeURIComponent(`Inquiry from ${name} (${company || 'Enterprise Partner'})`);
      const body = encodeURIComponent(`Hi Akshit,\n\n${message}\n\nBest regards,\n${name}\n${email}`);
      window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    }, 1200);
  };

  const handleAiPolish = async () => {
    if (!message.trim() || polishing) return;
    setPolishing(true);
    setPolishError(null);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'polish_email',
          payload: { name, company, email, rawMessage: message }
        })
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Connection to refinement compiler interrupted' }));
        throw new Error(data.error || 'Connection to refinement compiler interrupted');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';
      setMessage(''); // Clear original content to stream the refined one in real-time

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          accumulatedText += chunk;
          setMessage(accumulatedText);
        }
      }
    } catch (err: any) {
      console.error(err);
      setPolishError(err.message || 'The Gemini server was unreachable. Please type a custom message or try again.');
    } finally {
      setPolishing(false);
    }
  };

  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        
        {/* Contact details narrative Column */}
        <motion.div variants={colLeftVariants} className="lg:col-span-12 xl:col-span-5 space-y-8">
          <div className="font-mono text-xs text-[#00d1ff] tracking-[0.4em] uppercase mb-1">
            // UNIFIED COMMUNICATION
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
            Let's build <span className="text-transparent" style={{ WebkitTextStroke: '1.2px #ffffff', textShadow: '0 0 30px rgba(255, 255, 255, 0.4)' }}>together</span>.
          </h2>
          
          <p className="font-sans text-base text-gray-400 leading-relaxed">
            Open to technical discussions regarding Next.js stacks, automated database architecture, developer operations, and high-performance engineering collaborations.
          </p>

          <div className="space-y-4 pt-4">
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setEmailHover(true)}
              onMouseLeave={() => setEmailHover(false)}
              onClick={handleCopyEmail}
            >
              {/* Custom micro-tooltip absolute popup */}
              <AnimatePresence>
                {emailHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -top-11 left-6 z-30 px-3.5 py-1.5 bg-black/95 border border-[#00d1ff]/50 shadow-[0_0_20px_rgba(0,209,255,0.35)] text-white text-[10px] font-mono rounded-lg uppercase tracking-wider pointer-events-none flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00d1ff] animate-pulse" />
                        <span className="text-[#00d1ff] font-bold">Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#00d1ff]" />
                        <span>Click to copy email address</span>
                      </>
                    )}
                    {/* Tiny arrow */}
                    <div className="absolute left-6 -bottom-1 w-2 h-2 bg-black border-r border-b border-[#00d1ff]/30 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="group flex items-center justify-between bg-[#0a0b0d] border border-white/10 hover:border-[#00d1ff]/40 p-4 rounded-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00d1ff]/10 flex items-center justify-center text-[#00d1ff] group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(0,209,255,0.2)] transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-white/40 uppercase block tracking-wider">Secure Email Channel</span>
                    <span className="font-mono text-sm text-[#00d1ff] transition-all group-hover:text-white select-all">{contactInfo.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCopyEmail(e); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00d1ff]/10 hover:border-[#00d1ff]/50 hover:text-[#00d1ff] transition-all duration-200 text-[10px] font-mono text-white/60 focus:outline-none cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00d1ff] shrink-0" />
                      <span className="text-[#00d1ff] uppercase tracking-wider text-[9px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white/55 shrink-0" />
                      <span className="uppercase tracking-wider text-[9px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <a 
              href={`tel:${contactInfo.phone}`}
              className="group flex items-center gap-4 bg-[#0a0b0d] border border-white/10 hover:border-[#00d1ff]/40 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00d1ff]/10 flex items-center justify-center text-[#00d1ff] group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-white/40 uppercase block tracking-wider">Direct Handset</span>
                <span className="font-mono text-sm text-[#00d1ff]">{contactInfo.phone}</span>
              </div>
            </a>
          </div>

          <div className="flex gap-4 pt-4">
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#0a0b0d] hover:bg-[#111115] border border-white/10 hover:border-[#00d1ff]/40 text-white hover:text-[#00d1ff] rounded-none transition-all text-xs uppercase font-mono tracking-wider cursor-pointer"
            >
              <Linkedin className="w-4 h-4 text-[#00d1ff]" />
              LinkedIn
            </a>
            
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#0a0b0d] hover:bg-[#111115] border border-white/10 hover:border-[#00d1ff]/40 text-white hover:text-[#00d1ff] rounded-none transition-all text-xs uppercase font-mono tracking-wider cursor-pointer"
            >
              <Github className="w-4 h-4 text-[#00d1ff]" />
              GitHub
            </a>
          </div>
        </motion.div>

        {/* Contact form Column */}
        <motion.div variants={colRightVariants} className="lg:col-span-12 xl:col-span-7">
          <div className="bg-[#0a0a0d] border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-[#00d1ff]/10 rounded-tr-xl" />
            
            <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-white/5">
              <Terminal className="w-4 h-4 text-[#00d1ff]" />
              <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                Initiate Secure Handshake Protocol
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-[#00d1ff] tracking-widest uppercase block">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Recruiter Name"
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-none px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d1ff] focus:bg-black/40 transition-all text-left"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-white/50 tracking-widest uppercase block">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-none px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d1ff] focus:bg-black/40 transition-all text-left"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#00d1ff] tracking-widest uppercase block">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-none px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d1ff] focus:bg-black/40 transition-all text-left"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-mono text-[10px] text-[#00d1ff] tracking-widest uppercase block">Message</label>
                  <button
                    type="button"
                    onClick={handleAiPolish}
                    disabled={polishing || !message.trim()}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#00d1ff]/15 hover:bg-[#00d1ff]/25 border border-[#00d1ff]/30 text-[#00d1ff] hover:text-white transition-all text-[10px] font-mono uppercase tracking-wider disabled:opacity-40 disabled:hover:bg-[#00d1ff]/15 cursor-pointer rounded-sm"
                  >
                    {polishing ? (
                      <>
                        <Sparkles className="w-3 h-3 animate-spin" />
                        Refining message...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#00d1ff]" />
                        Refine draft with Gemini
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, role opportunities, or engineering requirements. Type a quick draft and click 'Refine draft with Gemini' above to polish it!"
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-none px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d1ff] focus:bg-black/40 transition-all resize-none text-left"
                />

                <AnimatePresence>
                  {polishError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[10px] font-mono text-yellow-400 mt-1"
                    >
                      ⚠️ {polishError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full px-6 py-4 rounded-none bg-white font-bold text-black hover:bg-[#00d1ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all duration-300 transform active:scale-[0.98] font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 select-none cursor-pointer"
                >
                  {status === 'idle' && (
                    <>
                      <span>Submit Query & Compile Email</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                  {status === 'compiling' && (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-black" />
                      <span>Compiling Request Schema...</span>
                    </>
                  )}
                  {status === 'success' && (
                    <span>Drafted Successfully!</span>
                  )}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-[#00d1ff]/15 border border-[#00d1ff]/30 rounded-xl flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4 text-[#00d1ff] shrink-0" />
                  <p className="font-sans text-xs text-cyan-200">
                    Your default email client has been summoned to dispatch the communication secure packet. Thank you!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </motion.div>

      {/* Corporate Signatures Footer */}
      <footer className="w-full pt-16 mt-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 select-none">
            <span className="font-display font-black text-xl text-white tracking-widest">AKD</span>
            <span className="text-white/10">|</span>
            <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">ENG v1.5</span>
          </div>

          <p className="font-mono text-[10px] text-gray-500 text-center md:text-left tracking-wide select-all">
            © {new Date().getFullYear()} {fullName}. ALL RIGHTS RESERVED. CUSTOM MANUFACTURED FOR RECRUITERS.
          </p>

          <div className="flex gap-6 font-mono text-[10px] tracking-wider uppercase">
            <a href="#hero" className="text-gray-500 hover:text-[#00d1ff] transition-colors">Top</a>
            <a href="#journey" className="text-gray-500 hover:text-[#00d1ff] transition-colors">Journey</a>
            <a href="#projects" className="text-gray-500 hover:text-[#00d1ff] transition-colors">Workshop</a>
            <a href="#foundation" className="text-[#00d1ff] hover:text-white transition-colors underline decoration-[#00d1ff]/40">Resume</a>
          </div>
        </div>
      </footer>

    </section>
  );
}
