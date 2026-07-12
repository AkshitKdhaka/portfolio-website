'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Cpu, 
  FileText, 
  Layers, 
  Server, 
  AlertTriangle, 
  Terminal, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  Code,
  ArrowRight
} from 'lucide-react';
import { projects } from '../data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 28,
    },
  },
};

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function AiCopilotSect() {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'tailor' | 'architecture'>('chat');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [queryCount, setQueryCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('ai_query_count');
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      setQueryCount(isNaN(count) ? 0 : count);
    }
  }, []);

  // 1. Recruiter Companion AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I am Akshit's AI Recruiter Companion. Ask me anything about his full-stack expertise, architectural projects, or AWS deployments, or select one of the quick inquiries below."
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isChatMountRef = useRef(true);

  const quickInquiries = [
    "Does Akshit have production Next.js experience?",
    "Explain his DevOps & AWS architecture setup",
    "What databases is he proficient with?",
    "Show his academic metrics and certifications"
  ];

  // 2. Resume Tailoring State
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [tailorResult, setTailorResult] = useState<string | null>(null);

  const mockJobDescriptions = [
    {
      title: "Senior SDE - Tedekstra Competitor",
      content: "Looking for a seasoned Full Stack Developer with hands-on experience in Next.js, NestJS, Prisma, JWT/RBAC, Microsoft Graph API integrations, Azure services, ETL/billing pipelines, Nginx, PM2, and CI/CD deployments on AWS."
    },
    {
      title: "React & Node Developer - Fintech",
      content: "Acquiring a frontend-heavy Software Engineer with Node.js chops. Must write scalable React/Next.js client models, optimize Lighthouse accessibility scores, integrate Firebase Auth systems, and work meticulously under Agile environments."
    }
  ];

  // 3. Architecture Explainer State
  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || 'Global News Live');
  const [architectureQueryGroup, setArchitectureQueryGroup] = useState<string>('scale');
  const [explainResult, setExplainResult] = useState<string | null>(null);

  const archQueries = [
    { id: 'scale', label: "How would you scale this to 10M page views?", query: "How would you design a scalable microservices topology for this project on AWS with Redis caching and global load balancing?" },
    { id: 'security', label: "What cloud security auditing is required?", query: "Provide a detailed security audit blueprint for this project covering SSL/TLS, database encryption, environment config protection, and API gateways." },
    { id: 'db', label: "Design a distributed database architecture", query: "Sketch out a resilient, high-availability replication design for the database backplane of this project, minimizing failover times." }
  ];

  // Scroll the chat feed to the bottom WITHOUT moving the whole page.
  // Skipping the first mount prevents the page from auto-jumping to this
  // section on initial load.
  useEffect(() => {
    if (isChatMountRef.current) {
      isChatMountRef.current = false;
      return;
    }
    const container = chatScrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages, loading]);

  // Execute Gemini REST call Helper
  const handleGeminiCall = async (action: string, payload: any, onChunk?: (text: string) => void) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Server-side processing failure' }));
        throw new Error(data.error || 'Server-side processing failure');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          accumulatedText += chunk;
          if (onChunk) {
            onChunk(accumulatedText);
          }
        }
      }

      return accumulatedText;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Connecting to Gemini Companion timed out.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Submit Recruiter Chat Input
  const handleSendChat = async (textToSend?: string) => {
    if (queryCount >= 10) {
      setErrorMessage("You have reached the limit of 10 free AI queries to prevent misuse.");
      return;
    }

    const messageText = textToSend || chatInput;
    if (!messageText.trim() || loading) return;

    // Append user message with explicit sender types
    const newMessages: ChatMessage[] = [...chatMessages, { sender: 'user' as const, text: messageText }];
    setChatMessages(newMessages);
    if (!textToSend) setChatInput('');

    // Append an empty AI message first that we will stream into
    setChatMessages(prev => [...prev, { sender: 'ai' as const, text: '' }]);

    const aiResponse = await handleGeminiCall('chat', {
      userMessage: messageText,
      chatHistory: chatMessages
    }, (currentText) => {
      setChatMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].sender === 'ai') {
          updated[updated.length - 1].text = currentText;
        }
        return updated;
      });
    });

    if (!aiResponse) {
      // If failed, remove the temporary message
      setChatMessages(prev => prev.slice(0, -1));
    } else {
      // Success! Increment count
      const nextCount = queryCount + 1;
      setQueryCount(nextCount);
      localStorage.setItem('ai_query_count', nextCount.toString());
    }
  };

  // Perform Resume Tailoring
  const handleTailorResume = async () => {
    if (queryCount >= 10) {
      setErrorMessage("You have reached the limit of 10 free AI queries to prevent misuse.");
      return;
    }
    if (!jobDescriptionInput.trim() || loading) return;
    setTailorResult('');
    const aiResponse = await handleGeminiCall('tailor', {
      jobDescription: jobDescriptionInput
    }, (currentText) => {
      setTailorResult(currentText);
    });

    if (aiResponse) {
      // Success! Increment count
      const nextCount = queryCount + 1;
      setQueryCount(nextCount);
      localStorage.setItem('ai_query_count', nextCount.toString());
    }
  };

  // Perform Architecture Explanation Routing
  const handleExplainArchitecture = async () => {
    if (queryCount >= 10) {
      setErrorMessage("You have reached the limit of 10 free AI queries to prevent misuse.");
      return;
    }
    if (loading) return;
    const activeQueryObj = archQueries.find(q => q.id === architectureQueryGroup);
    const queryText = activeQueryObj ? activeQueryObj.query : "Explain scaling";
    
    setExplainResult('');
    const aiResponse = await handleGeminiCall('explain', {
      projectName: selectedProject,
      architectureQuery: queryText
    }, (currentText) => {
      setExplainResult(currentText);
    });

    if (aiResponse) {
      // Success! Increment count
      const nextCount = queryCount + 1;
      setQueryCount(nextCount);
      localStorage.setItem('ai_query_count', nextCount.toString());
    }
  };

  return (
    <section className="relative py-24 w-full max-w-6xl mx-auto px-4 sm:px-8 z-20">
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="w-full"
      >
        {/* Narrative Section Header */}
        <motion.div variants={headerVariants} className="mb-14 flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00d1ff] tracking-[0.4em] uppercase mb-3">
            // CO-PILOT TERMINAL
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-wider">
            AI RECRUITER SUITE
          </h2>
          <p className="font-sans text-base sm:text-lg text-gray-400 max-w-2xl mt-4">
            Unleash autonomous co-pilot features powered by Gemini to chat with my background agents, customize resumes to your requirements instantly, and inspect architectural diagrams.
          </p>
          <div className="w-16 h-1 bg-[#00d1ff] mt-6 rounded-full shadow-[0_0_15px_rgba(0,209,255,0.6)]"></div>
        </motion.div>

        {/* Feature Navigation Tabs */}
        <motion.div variants={headerVariants} className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => { setActiveSubTab('chat'); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-5 py-3 transition-all rounded-lg font-mono text-xs uppercase tracking-wider ${
            activeSubTab === 'chat'
              ? 'bg-[#00d1ff]/15 border border-[#00d1ff] text-[#00d1ff] shadow-[0_0_15px_rgba(0,209,255,0.15)]'
              : 'bg-[#121212]/50 border border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          Recruiter Copilot
        </button>

        <button
          onClick={() => { setActiveSubTab('tailor'); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-5 py-3 transition-all rounded-lg font-mono text-xs uppercase tracking-wider ${
            activeSubTab === 'tailor'
              ? 'bg-[#00d1ff]/15 border border-[#00d1ff] text-[#00d1ff] shadow-[0_0_15px_rgba(0,209,255,0.15)]'
              : 'bg-[#121212]/50 border border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Resume Tailoring
        </button>

        <button
          onClick={() => { setActiveSubTab('architecture'); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-5 py-3 transition-all rounded-lg font-mono text-xs uppercase tracking-wider ${
            activeSubTab === 'architecture'
              ? 'bg-[#00d1ff]/15 border border-[#00d1ff] text-[#00d1ff] shadow-[0_0_15px_rgba(0,209,255,0.15)]'
              : 'bg-[#121212]/50 border border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          System Explainer
        </button>
      </motion.div>

      {/* Display warnings if backend credentials are missing */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-400 animate-pulse" />
            <div>
              <span className="font-semibold block font-mono text-xs uppercase tracking-wider">CONNECTION COMPROMISED</span>
              <p className="text-sm text-yellow-200/80 mt-1">{errorMessage}</p>
              <p className="text-xs text-yellow-300/60 mt-2 font-mono">
                Hint: Check that GEMINI_API_KEY is set in your .env file.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Panel Wrapper */}
      <motion.div variants={panelVariants} className="bg-[#0a0a0d] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none border-t border-r border-[#00d1ff]/10 rounded-tr-2xl" />

        {/* TAB 1: RECRUITER COMPANION (CHAT AGENT) */}
        {activeSubTab === 'chat' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#00d1ff]" />
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">AI Hiring Assistant</h3>
                  <span className="font-mono text-[10px] text-gray-500 uppercase">SYS.AGENT // ONLINE</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d1ff] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#00d1ff] uppercase">Questions: {queryCount}/10 Used</span>
                </div>
                {queryCount >= 10 ? (
                  <span className="font-mono text-[8px] text-red-400 uppercase tracking-wider">Limit Reached</span>
                ) : (
                  <span className="font-mono text-[8px] text-gray-400 uppercase tracking-wider">{10 - queryCount} remaining</span>
                )}
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div ref={chatScrollRef} className="h-[360px] overflow-y-auto bg-[#0a0a0a]/80 border border-white/5 rounded-xl p-4 space-y-4 font-sans text-sm block">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#00d1ff]/15 border border-[#00d1ff]/30 text-white font-medium'
                        : 'bg-white/5 border border-white/10 text-gray-300'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1.5 font-mono text-[10px] text-[#00d1ff] tracking-wider uppercase">
                        <Bot className="w-3.5 h-3.5" />
                        Companion Agent
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-[#00d1ff] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-[#00d1ff] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-[#00d1ff] rounded-full animate-bounce" />
                    </div>
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Compiling background facts...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Helper Panel */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-gray-500 uppercase">Interactive Quick Enquiries:</span>
              <div className="flex flex-wrap gap-2.5">
                {quickInquiries.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(promptText)}
                    disabled={loading || queryCount >= 10}
                    className="px-3.5 py-2 bg-[#141414]/90 hover:bg-[#00d1ff]/10 hover:border-[#00d1ff]/30 text-xs font-sans text-gray-400 hover:text-white border border-white/5 rounded-lg text-left transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="flex flex-col gap-2">
              {queryCount >= 10 && (
                <div className="text-xs text-red-400 font-mono flex items-center gap-1.5 bg-red-950/20 border border-red-900/30 p-3 rounded-lg mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
                  <span>You have used all 10 available questions. Thank you for testing the copilot!</span>
                </div>
              )}
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={queryCount >= 10 ? "Query limit reached (10/10 questions used)" : "Ask Akshit's co-pilot anything about his capabilities or custom projects..."}
                  disabled={loading || queryCount >= 10}
                  className="flex-1 bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 font-sans text-xs sm:text-sm text-white focus:outline-none focus:border-[#00d1ff] focus:ring-1 focus:ring-[#00d1ff]/20 placeholder-gray-500 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={loading || !chatInput.trim() || queryCount >= 10}
                  className="px-5 py-3 h-full bg-[#00d1ff] text-black font-semibold uppercase tracking-wider font-mono text-xs rounded-lg hover:shadow-[0_0_15px_#00d1ff] transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:shadow-none cursor-pointer"
                >
                  Send
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESUME TAILORING */}
        {activeSubTab === 'tailor' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#00d1ff]" />
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Job Matching & Targeting Analyzer</h3>
                  <span className="font-mono text-[10px] text-gray-500 uppercase">SYS.OPTIMIZER // COMPILE ENGINE</span>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="font-mono text-[10px] px-2.5 py-1 bg-white/5 border border-white/5 text-gray-300 uppercase shrink-0 self-start sm:self-auto">
                  Questions: {queryCount}/10 Used
                </span>
                {queryCount >= 10 && (
                  <span className="font-mono text-[8px] text-red-400 uppercase tracking-wider">Limit Reached</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column Input */}
              <div className="md:col-span-5 space-y-4">
                <span className="font-mono text-xs text-white/70 block uppercase tracking-wider">
                  Target Job Description Text
                </span>
                
                <textarea
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder={queryCount >= 10 ? "Query limit reached (10/10 questions used)" : "Paste target SDE/Full Stack job description parameters here..."}
                  disabled={loading || queryCount >= 10}
                  rows={8}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl p-4 font-sans text-xs sm:text-sm text-white focus:outline-none focus:border-[#00d1ff] focus:ring-1 focus:ring-[#00d1ff]/20 placeholder-gray-500 transition-all resize-none disabled:opacity-50"
                />

                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-gray-500 uppercase">Load preset test specs:</span>
                  <div className="flex flex-col gap-2">
                    {mockJobDescriptions.map((desc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setJobDescriptionInput(desc.content)}
                        disabled={loading || queryCount >= 10}
                        className="px-3 py-2 bg-[#121212]/80 hover:bg-white/5 text-xs text-left text-gray-400 hover:text-white border border-white/5 rounded-lg font-mono transition-colors disabled:opacity-50"
                      >
                        ⚡ {desc.title}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleTailorResume}
                  disabled={loading || !jobDescriptionInput.trim() || queryCount >= 10}
                  className="w-full py-3.5 bg-[#00d1ff] text-black font-semibold uppercase tracking-widest font-mono text-xs rounded-xl hover:shadow-[0_0_15px_#00d1ff] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      COMPILING DIRECT ALIGNMENT...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {queryCount >= 10 ? "LIMIT REACHED (10/10)" : "TAILOR & REPORT METRICS"}
                    </>
                  )}
                </button>
              </div>

              {/* Right Column Output Preview */}
              <div className="md:col-span-7 bg-[#0a0a0a]/80 border border-white/5 rounded-xl p-6 min-h-[340px] flex flex-col justify-between relative">
                
                {tailorResult ? (
                  <div className="space-y-4 font-sans text-sm text-gray-300 select-text overflow-y-auto max-h-[380px] pr-2">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-xs text-green-400 uppercase tracking-widest font-semibold">ALIGMENT ANALYSIS LOG EXPORTED</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm space-y-4 text-white/95">
                      {tailorResult}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                    <FileText className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
                    <span className="font-mono text-xs text-gray-500 uppercase">
                      No report compiled of current alignments
                    </span>
                    <p className="font-sans text-xs text-gray-600 max-w-sm mt-2">
                      Paste a target description on the left panel and initiate compilation to retrieve matching alignments and custom resumes.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
                    <Cpu className="w-8 h-8 text-[#00d1ff] animate-spin" />
                    <span className="font-mono text-xs text-[#00d1ff] uppercase tracking-widest">Compiler working on resume vectors...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARCHITECTURE EXPLaINER */}
        {activeSubTab === 'architecture' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#00d1ff]" />
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">System Architecture Scaling Explainer</h3>
                  <span className="font-mono text-[10px] text-gray-500 uppercase">SYS.DESIGN // TOPOLOGY CANVAS</span>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#00d1ff]/15 border border-[#00d1ff]/30 text-[#00d1ff] uppercase shrink-0 self-start sm:self-auto">
                  Questions: {queryCount}/10 Used
                </span>
                {queryCount >= 10 && (
                  <span className="font-mono text-[8px] text-red-400 uppercase tracking-wider">Limit Reached</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Selector project */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-gray-500 uppercase block">1. Select Portfolio Solution:</span>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  disabled={loading || queryCount >= 10}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-[#00d1ff] disabled:opacity-50"
                >
                  {projects.map((proj) => (
                    <option key={proj.name} value={proj.name} className="bg-black text-gray-300">
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector query challenge */}
              <div className="md:col-span-2 space-y-2">
                <span className="font-mono text-[10px] text-gray-500 uppercase block">2. Select Architecture Focus:</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  {archQueries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setArchitectureQueryGroup(q.id)}
                      disabled={loading || queryCount >= 10}
                      className={`flex-1 px-3 py-2.5 rounded-lg border text-[11px] font-sans tracking-wide text-left transition-all disabled:opacity-50 ${
                        architectureQueryGroup === q.id
                          ? 'bg-[#00d1ff]/15 border-[#00d1ff]/30 text-white'
                          : 'bg-[#121212]/80 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Execute action */}
              <div className="flex items-end">
                <button
                  onClick={handleExplainArchitecture}
                  disabled={loading || queryCount >= 10}
                  className="w-full py-2.5 bg-[#00d1ff] text-black font-semibold uppercase tracking-widest font-mono text-xs rounded-lg hover:shadow-[0_0_15px_#00d1ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      ARCHITECTING...
                    </>
                  ) : (
                    <>
                      {queryCount >= 10 ? "Limit Reached" : "Analyze System"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Architecture output canvas */}
            <div className="border border-white/10 rounded-xl bg-[#090909] p-6 min-h-[300px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-white/10 uppercase tracking-widest select-none">
                ASCII Architecture Viewport
              </div>

              {explainResult ? (
                <div className="space-y-4 font-sans text-sm text-gray-300 select-text overflow-x-auto">
                  <span className="font-mono text-[10.5px] text-[#00d1ff] block border-b border-white/5 pb-2 mb-2 uppercase tracking-wide">
                    // Scaled system design documentation for project: &quot;{selectedProject}&quot;
                  </span>
                  <div className="whitespace-pre text-xs font-mono text-[#00ffcc] leading-relaxed bg-[#050505] p-3 rounded-lg border border-white/5 overflow-x-auto shadow-inner">
                    {/* Render ASCII output or standard architecture response in monospace */}
                    {explainResult}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <Layers className="w-12 h-12 text-white/5 mb-4 animate-pulse" />
                  <span className="font-mono text-xs text-gray-500 uppercase">
                    Architecture Output Screen is Clear
                  </span>
                  <p className="font-sans text-xs text-gray-600 max-w-sm mt-2">
                    Inquire scalings, replicas, failover pipelines, or cloud layout validations. Gemini will draw dynamic ASCII systems maps and output blueprints here.
                  </p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Cpu className="w-8 h-8 text-[#00d1ff] animate-spin" />
                  <span className="font-mono text-xs text-[#00d1ff] uppercase tracking-widest">Generating system configurations...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      </motion.div>

    </section>
  );
}
