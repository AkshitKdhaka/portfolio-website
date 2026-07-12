'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    }
  }
};

const elementVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 15,
      mass: 0.8
    }
  }
};

export default function HeroSect({ onExplore }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-start items-center w-full px-4 sm:px-8 md:px-16 overflow-hidden z-20 pt-32 sm:pt-40 md:pt-48 pb-12">
      <motion.div 
        className="w-full max-w-5xl text-center flex flex-col items-center select-none pt-12 md:pt-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        
        {/* Animated label */}
        <motion.p
          variants={elementVariants}
          className="font-mono text-sm text-[#00d1ff] uppercase tracking-[0.3em] mb-4 md:mb-6 leading-none select-none"
        >
          Full Stack Developer
        </motion.p>

        {/* Deep custom Glassmorphic Narrative Card */}
        <motion.div
          variants={cardVariants}
          className="relative w-full max-w-3xl bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 md:p-12 mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden group hover:border-[#00d1ff]/30 transition-all duration-700 font-sans"
        >
          {/* Internal neon ambient lighting indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00d1ff]/50 to-transparent"></div>

          <p className="font-sans text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto select-all">
            Full Stack Developer with 2+ years of experience building scalable web applications using Next.js, React, TypeScript, Node.js, NestJS, Prisma, PostgreSQL, and MongoDB. Experienced in developing REST APIs, integrating Microsoft Graph API, implementing secure authentication systems, optimizing SEO, and deploying scalable cloud-native applications using AWS and Azure with CI/CD pipelines. Passionate about building performant, secure, and user-centric applications.
          </p>
        </motion.div>

        {/* Scroll indicator pointing down */}
        <motion.div
          variants={elementVariants}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          onClick={onExplore}
          className="cursor-pointer group flex flex-col items-center gap-2 text-outline/50 hover:text-primary-container transition-colors py-4 mt-auto mb-4"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-75 group-hover:opacity-100 transition-opacity">Scroll to Unfurl</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary-container/60 to-transparent"></div>
        </motion.div>

      </motion.div>
    </section>
  );
}
