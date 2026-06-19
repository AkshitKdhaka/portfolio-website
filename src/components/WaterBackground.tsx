'use client';

import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  speed: number;
  frequency: number;
  damping: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  maxSize: number;
  speedX: number;
  speedY: number;
  opacity: number;
  decay: number;
  color: string;
  isBubble: boolean;
  swaySpeed: number;
  swayOffset: number;
}

interface ColorTheme {
  timeSuffix: string;
  glowMain: string;
  glowRgb: string;
  glowRgbSecondary: string;
  oceanColor1: string;
  oceanColor2Base: string;
  oceanColor2Overlays: string[];
}

interface WaterBackgroundProps {
  activeSection: number;
  localHours?: number;
}

export default function WaterBackground({ activeSection, localHours }: WaterBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);

  const DEFAULT_THEME: ColorTheme = {
    timeSuffix: 'OCEAN_OCEANIC',
    glowMain: '#00d1ff',
    glowRgb: '0, 209, 255',
    glowRgbSecondary: '24, 255, 255',
    oceanColor1: '#030406',
    oceanColor2Base: '#06131c',
    oceanColor2Overlays: [
      '#091c29',
      '#0b2633',
      '#11131a',
      '#0d2229',
      '#051b2a'
    ]
  };

  const activeThemeRef = useRef<ColorTheme>(DEFAULT_THEME);

  useEffect(() => {
    const hour = localHours !== undefined ? localHours : new Date().getHours();
    let theme: ColorTheme;

    if (hour >= 5 && hour < 11) {
      theme = {
        timeSuffix: 'DAWN_SUNRISE',
        glowMain: '#ff9c3a',
        glowRgb: '255, 156, 58',
        glowRgbSecondary: '255, 102, 36',
        oceanColor1: '#050302',
        oceanColor2Base: '#1e0e02',
        oceanColor2Overlays: [
          '#1a0c02',
          '#240f02',
          '#140d0a',
          '#2a1202',
          '#180b05'
        ]
      };
    } else if (hour >= 11 && hour < 17) {
      theme = {
        timeSuffix: 'OCEAN_OCEANIC',
        glowMain: '#00d1ff',
        glowRgb: '0, 209, 255',
        glowRgbSecondary: '24, 255, 255',
        oceanColor1: '#030406',
        oceanColor2Base: '#06131c',
        oceanColor2Overlays: [
          '#091c29',
          '#0b2633',
          '#11131a',
          '#0d2229',
          '#051b2a'
        ]
      };
    } else if (hour >= 17 && hour < 21) {
      theme = {
        timeSuffix: 'SUNSET_TWILIGHT',
        glowMain: '#ff3b94',
        glowRgb: '255, 59, 148',
        glowRgbSecondary: '180, 50, 255',
        oceanColor1: '#050205',
        oceanColor2Base: '#1a061c',
        oceanColor2Overlays: [
          '#210925',
          '#2a0531',
          '#17101a',
          '#270a2b',
          '#1a0a22'
        ]
      };
    } else {
      theme = {
        timeSuffix: 'MIDNIGHT_NEBULA',
        glowMain: '#7a46ff',
        glowRgb: '122, 70, 255',
        glowRgbSecondary: '0, 150, 255',
        oceanColor1: '#020306',
        oceanColor2Base: '#060714',
        oceanColor2Overlays: [
          '#0a0b21',
          '#0e0d30',
          '#11111a',
          '#0c0c29',
          '#07061f'
        ]
      };
    }

    activeThemeRef.current = theme;
  }, [localHours]);
  
  // Physical droplet state machine mimicking high-speed high-fidelity splash physics
  const dropletStateRef = useRef({
    phase: 'falling', // 'falling' | 'impact' | 'rebound' | 'bead_rise' | 'bead_fall' | 'secondary_impact' | 'done'
    y: -30,
    vy: 0.3,
    spoutHeight: 0,
    beadY: 0,
    beadVy: 0,
    beadVisible: false,
    cooldown: 120
  });

  // Helper to add a physical water wave ripple
  const addRipple = (x: number, y: number, amplitude = 25, frequency = 0.04, speed = 4) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.5,
      amplitude,
      speed,
      frequency,
      damping: 0.975 // smooth wave decay
    });
  };

  const activeSectionRef = useRef(activeSection);

  // Sync activeSection values into a ref to decouple state-triggering from canvas rendering tear-down
  useEffect(() => {
    activeSectionRef.current = activeSection;

    if (activeSection === 0) {
      // Trigger smooth continuous droplet loops
      dropletStateRef.current = {
        phase: 'falling',
        y: -30,
        vy: 0.3,
        spoutHeight: 0,
        beadY: 0,
        beadVy: 0,
        beadVisible: false,
        cooldown: 120
      };
    } else {
      // Gracefully clear/halt droplet when user leaves top screen to save CPU cycles
      dropletStateRef.current = {
        phase: 'done',
        y: -30,
        vy: 0.3,
        spoutHeight: 0,
        beadY: 0,
        beadVy: 0,
        beadVisible: false,
        cooldown: 120
      };
    }
  }, [activeSection]);

  // Main Canvas Setup, Resize, Interaction and Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Click handler -> inject major ripple
    const handleCanvasClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY, 32, 0.035, 4.5);
      
      // Inject click particles
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: 1 + Math.random() * 2,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          opacity: 0.8,
          color: activeThemeRef.current.glowMain
        });
      }
    };

    // Keep active mouse trails
    const handleCanvasMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      const now = performance.now();
      const last = lastMousePosRef.current;

      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const timeElapsed = now - last.time;

      if (dist > 25 && timeElapsed > 60) {
        addRipple(e.clientX, e.clientY, 8 + Math.min(dist * 0.15, 12), 0.055, 3.8);
        lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
      }

      // Spawn glowing bioluminescent bubbles and plankton trailing particle effect
      const spawnCount = Math.max(1, Math.min(Math.floor(dist * 0.25) + 1, 4));
      for (let i = 0; i < spawnCount; i++) {
        const isBubble = Math.random() > 0.45;
        const offsetX = (Math.random() - 0.5) * 16;
        const offsetY = (Math.random() - 0.5) * 16;

        trailParticlesRef.current.push({
          id: Math.random(),
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
          size: isBubble ? 0.8 + Math.random() * 1.5 : 0.6 + Math.random() * 1.2,
          maxSize: isBubble ? 3.5 + Math.random() * 3.5 : 1.8 + Math.random() * 1.5,
          speedX: (Math.random() - 0.5) * 0.7,
          speedY: -0.5 - Math.random() * 1.2, // Floats smoothly upwards like bubbles in liquid
          opacity: 0.75 + Math.random() * 0.25,
          decay: 0.007 + Math.random() * 0.013, // Slow ethereal fade
          color: Math.random() > 0.6
            ? `rgba(${activeThemeRef.current.glowRgb}, 0.8)` // neon water cyan
            : Math.random() > 0.35
              ? `rgba(${activeThemeRef.current.glowRgbSecondary}, 0.7)` // deep lagoon turquoise
              : 'rgba(240, 253, 250, 0.95)', // sparkling silver-white bubbles
          isBubble,
          swaySpeed: 1.2 + Math.random() * 2.2,
          swayOffset: Math.random() * Math.PI * 2
        });
      }
    };

    window.addEventListener('click', handleCanvasClick);
    window.addEventListener('mousemove', handleCanvasMouseMove);

    // Initialize decorative ambient particles
    const localParticles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      localParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 0.5 + Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.25 - 0.1, // floating slightly upwards
        opacity: 0.15 + Math.random() * 0.4,
        color: Math.random() > 0.65 ? `rgba(${activeThemeRef.current.glowRgb}, 0.4)` : 'rgba(255, 255, 255, 0.25)'
      });
    }

    // DRAW ENGINE LOOP Runs at 60 FPS
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render Cinematic Cyberocean Ocean Bed Gradient Background
      // Shifts slightly based on active scroll section with timezone-calibrated colors
      let oceanColor1 = activeThemeRef.current.oceanColor1; // Deep dark space coordinates
      let oceanColor2 = activeThemeRef.current.oceanColor2Base; // Indigo oceanic floor
      
      const sIndex = activeSectionRef.current;
      if (sIndex >= 1 && sIndex <= 5) {
        oceanColor2 = activeThemeRef.current.oceanColor2Overlays[sIndex - 1];
      }

      const oceanGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.9
      );
      oceanGradient.addColorStop(0, oceanColor2);
      oceanGradient.addColorStop(1, oceanColor1);
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Ripple Equations Wave Update
      const ripples = ripplesRef.current;
      ripplesRef.current = ripples.filter((r) => {
        r.radius += r.speed;
        r.amplitude *= r.damping;
        return r.amplitude > 0.1 && r.radius < r.maxRadius;
      });

      // 3 & 4. Highlight wave node reflections with ultra-fast dynamic specular reflections
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        if (r.amplitude > 0.5) {
          const pulse = Math.min(r.amplitude * 0.008, 0.35);
          ctx.strokeStyle = `rgba(${activeThemeRef.current.glowRgb}, ${pulse})`;
          ctx.lineWidth = 1.2 + r.amplitude * 0.04;
          ctx.beginPath();
          // Draw circular glowing wave outline directly at screen coordinates
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Add a subtle auxiliary secondary highlight reflection ring for natural caustics variance 
          if (r.radius > 30) {
            ctx.strokeStyle = `rgba(${activeThemeRef.current.glowRgbSecondary}, ${pulse * 0.65})`;
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius - 20, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // 5. Draw interactive vector cursor lighting spotlight caustics
      const mouse = mousePosRef.current;
      if (mouse.x > 0 || mouse.y > 0) {
        // Find screen distortion under cursor
        let cDistX = 0;
        let cDistY = 0;
        for (let i = 0; i < ripples.length; i++) {
          const rip = ripples[i];
          const dx = mouse.x - rip.x;
          const dy = mouse.y - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < rip.radius) {
            const k = (rip.radius - dist) / rip.radius;
            const w = Math.sin((rip.radius - dist) * rip.frequency) * rip.amplitude * Math.sin(k * Math.PI);
            if (dist > 1) {
              cDistX += (dx / dist) * w * 1.5;
              cDistY += (dy / dist) * w * 1.5;
            }
          }
        }

        const spotX = mouse.x + cDistX;
        const spotY = mouse.y + cDistY;

        const cursorSpot = ctx.createRadialGradient(spotX, spotY, 5, spotX, spotY, 180);
        cursorSpot.addColorStop(0, `rgba(${activeThemeRef.current.glowRgb}, 0.08)`);
        cursorSpot.addColorStop(0.5, `rgba(${activeThemeRef.current.glowRgb}, 0.02)`);
        cursorSpot.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorSpot;
        ctx.beginPath();
        ctx.arc(spotX, spotY, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw Refractive Ambient Space Particles
      localParticles.forEach((p) => {
        // Ambient wind/drift update
        p.x += p.speedX;
        p.y += p.speedY;

        // Boundaries recycle wrap margins
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = canvas.height;

        // Clean, direct screen coordinates (skip heavy wave maths for secondary ambient particles)
        const rx = p.x;
        const ry = p.y;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 7. Update and Draw Dispersed Splash Ring Particles (from Droplet Landing)
      let particleArr = particlesRef.current;
      if (particleArr.length > 200) {
        particleArr = particleArr.slice(-200);
      }
      particlesRef.current = particleArr.filter((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.03; // slight gravity pull downwards on splash splinters
        p.opacity -= 0.008; // slow fade

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        return p.opacity > 0;
      });

      // 8. Update and Draw Cursor-Following Bioluminescent Bubbles & Plankton
      let trail = trailParticlesRef.current;
      if (trail.length > 150) {
        trail = trail.slice(-150);
      }
      trailParticlesRef.current = trail.filter((tp) => {
        // Apply vertical rise speed (floats up)
        tp.y += tp.speedY;

        // Apply gentle horizontal sway oscillation
        const swayAmp = tp.isBubble ? 0.35 : 0.15;
        tp.x += tp.speedX + Math.sin(performance.now() * 0.0035 * tp.swaySpeed + tp.swayOffset) * swayAmp;

        // Bubbles expand slightly as pressure drops near surface; plankton fades & dissolves
        if (tp.isBubble) {
          tp.size = Math.min(tp.size + 0.035, tp.maxSize);
        } else {
          tp.size = Math.max(tp.size - 0.005, 0.3);
        }

        tp.opacity -= tp.decay;

        // Clean, direct screen coordinates (skip heavy wave maths for trailing bubbles in motion)
        const rx = tp.x;
        const ry = tp.y;

        ctx.globalAlpha = Math.max(tp.opacity, 0);

        if (tp.isBubble) {
          // Render highly polished glossy sphere bubble (outline + translucent fill + white flare glare)
          ctx.strokeStyle = tp.color;
          ctx.lineWidth = 0.85;
          ctx.fillStyle = `rgba(${activeThemeRef.current.glowRgb}, 0.06)`;

          ctx.beginPath();
          ctx.arc(rx, ry, tp.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();

          // Sparkle white glare reflection spot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(rx - tp.size * 0.33, ry - tp.size * 0.33, Math.max(0.3, tp.size * 0.22), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Render microscopic bioluminescent glowing plankton (bright dot + diffuse aura glow)
          ctx.fillStyle = tp.color;
          ctx.beginPath();
          ctx.arc(rx, ry, tp.size, 0, Math.PI * 2);
          ctx.fill();

          // Soft light emission corona
          const rgbStr = tp.color.replace('0.7', '0.12').replace('0.8', '0.12');
          ctx.fillStyle = rgbStr;
          ctx.beginPath();
          ctx.arc(rx, ry, tp.size * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;

        return tp.opacity > 0;
      });

      // 9. Physical Fluid Droplet Splash + Rebound Spout Simulation
      // Mimics high-speed video frames of water droplet impact with a distinct liquid spout & release bead
      const dropState = dropletStateRef.current;
      const targetY = canvas.height * 0.55;
      const centerX = canvas.width / 2;

      if (dropState.phase === 'done' && activeSectionRef.current === 0) {
        if (dropState.cooldown > 0) {
          dropState.cooldown--;
        } else {
          // Reset the droplet sequence for continuous dropping
          dropState.phase = 'falling';
          dropState.y = -30;
          dropState.vy = 0.3;
          dropState.spoutHeight = 0;
          dropState.beadY = 0;
          dropState.beadVy = 0;
          dropState.beadVisible = false;
          dropState.cooldown = 120; // reset cooldown for next round
        }
      }

      if (dropState.phase !== 'done') {
        if (dropState.phase === 'falling') {
          // Accelerate downwards naturally under gravity, much slower and smoother
          dropState.vy += 0.045;
          dropState.y += dropState.vy;

          // Draw the falling droplet shape (glossy, glass-refracting 3D liquid teardrop with glowing highlights)
          const dropGrad = ctx.createRadialGradient(
            centerX - 1.5, dropState.y, 0.5,
            centerX, dropState.y + 1, 7
          );
          dropGrad.addColorStop(0, '#ffffff'); // Internal bright caustic refraction focal point
          dropGrad.addColorStop(0.25, `rgba(${activeThemeRef.current.glowRgb}, 0.9)`); 
          dropGrad.addColorStop(0.8, `rgba(${activeThemeRef.current.glowRgbSecondary || '0, 130, 255'}, 0.95)`);
          dropGrad.addColorStop(1, 'rgba(255, 255, 255, 0.35)'); // Soft highlight wrap
          
          ctx.beginPath();
          ctx.fillStyle = dropGrad;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1;

          // Highly organic liquid droplet drawing: pointy top, smoothly widening to a bulbous sphere base
          ctx.moveTo(centerX, dropState.y - 12);
          ctx.bezierCurveTo(centerX - 5.5, dropState.y - 4, centerX - 7, dropState.y + 1, centerX - 7, dropState.y + 4);
          ctx.bezierCurveTo(centerX - 7, dropState.y + 8.5, centerX - 4, dropState.y + 11.5, centerX, dropState.y + 11.5);
          ctx.bezierCurveTo(centerX + 4, dropState.y + 11.5, centerX + 7, dropState.y + 8.5, centerX + 7, dropState.y + 4);
          ctx.bezierCurveTo(centerX + 7, dropState.y + 1, centerX + 5.5, dropState.y - 4, centerX, dropState.y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // High-shimmer reflection flare inside the teardrop
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 0.75;
          ctx.moveTo(centerX - 4.5, dropState.y + 1);
          ctx.bezierCurveTo(centerX - 4.5, dropState.y + 5, centerX - 2, dropState.y + 7.5, centerX, dropState.y + 7.5);
          ctx.stroke();
          
          // Specular peak pinpoint node
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.arc(centerX - 2, dropState.y + 1, 1, 0, Math.PI * 2);
          ctx.fill();

          // Wake bubble trails forming in midair
          if (Math.random() > 0.4) {
            trailParticlesRef.current.push({
              id: Math.random(),
              x: centerX + (Math.random() - 0.5) * 4,
              y: dropState.y - 6,
              size: 0.6 + Math.random() * 0.8,
              maxSize: 1.6,
              speedX: (Math.random() - 0.5) * 0.15,
              speedY: -0.1,
              opacity: 0.65,
              decay: 0.035,
              color: `rgba(${activeThemeRef.current.glowRgb}, 0.65)`,
              isBubble: false,
              swaySpeed: 1,
              swayOffset: 0
            });
          }

          // Boundary check for impact at perspective water level
          if (dropState.y >= targetY) {
            dropState.phase = 'impact';
            dropState.y = targetY;
          }
        }

        if (dropState.phase === 'impact') {
          // Landing impact! Produce massive wave ripples and fly particles
          addRipple(centerX, targetY, 45, 0.024, 4.2);
          
          // Primary particles spray crown ring
          for (let i = 0; i < 48; i++) {
            const angle = (Math.random() * Math.PI) + Math.PI; // fly upwards and outwards
            const force = 1.0 + Math.random() * 2.5;
            particlesRef.current.push({
              x: centerX,
              y: targetY - 2,
              size: 1.5 + Math.random() * 2.5,
              speedX: Math.cos(angle) * force,
              speedY: Math.sin(angle) * force - 1.0, // gentle upwards impulse
              opacity: 1,
              color: Math.random() > 0.45 ? activeThemeRef.current.glowMain : `rgba(${activeThemeRef.current.glowRgbSecondary}, 1)`
            });
          }

          // Transition to vertical liquid spout column phase (higher and slower)
          dropState.phase = 'rebound';
          dropState.vy = 5.2; // robust fluid jet rise velocity for dramatic height
          dropState.spoutHeight = 0;
        }

        if (dropState.phase === 'rebound') {
          // Liquid siphoned upwards, spout grows while gravity decelerates it smoothly
          dropState.vy -= 0.08;
          dropState.spoutHeight += dropState.vy;

          if (dropState.spoutHeight > 0) {
            // Draw visual 2D silhouette of vertical water jet (curved organic column, wide base)
            ctx.beginPath();
            ctx.fillStyle = `rgba(${activeThemeRef.current.glowRgb}, 0.85)`;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.lineWidth = 1;

            const baseW = 14 + (dropState.spoutHeight * 0.04);
            const tipW = Math.max(2.5, 5 - (dropState.spoutHeight * 0.02));
            const curY = targetY - dropState.spoutHeight;

            ctx.moveTo(centerX - baseW, targetY);
            ctx.quadraticCurveTo(centerX - tipW, targetY - dropState.spoutHeight * 0.5, centerX - tipW, curY);
            ctx.arc(centerX, curY, tipW, Math.PI, 0); // round tip cap
            ctx.quadraticCurveTo(centerX + tipW, targetY - dropState.spoutHeight * 0.5, centerX + baseW, targetY);
            
            ctx.fill();
            ctx.stroke();
          }

          if (dropState.vy <= 0) {
            // Peak reached! Separate single daughter drop (bead) at peak apex, collapse spout
            dropState.phase = 'bead_rise';
            dropState.beadY = targetY - dropState.spoutHeight;
            dropState.beadVy = -1.8; // stronger secondary upward floaty pop
            dropState.beadVisible = true;
          }
        }

        if (dropState.phase === 'bead_rise' || dropState.phase === 'bead_fall') {
          // Column jet retracts back downwards to join water volume
          if (dropState.spoutHeight > 0) {
            dropState.spoutHeight = Math.max(0, dropState.spoutHeight - 1.5);

            if (dropState.spoutHeight > 0) {
              ctx.beginPath();
              ctx.fillStyle = `rgba(${activeThemeRef.current.glowRgb}, 0.7)`;
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
              ctx.lineWidth = 0.8;

              const baseW = 11 + (dropState.spoutHeight * 0.03);
              const tipW = Math.max(1.5, 4 - (dropState.spoutHeight * 0.02));
              const curY = targetY - dropState.spoutHeight;

              ctx.moveTo(centerX - baseW, targetY);
              ctx.quadraticCurveTo(centerX - tipW, targetY - dropState.spoutHeight * 0.4, centerX - tipW, curY);
              ctx.arc(centerX, curY, tipW, Math.PI, 0);
              ctx.quadraticCurveTo(centerX + tipW, targetY - dropState.spoutHeight * 0.4, centerX + baseW, targetY);
              
              ctx.fill();
              ctx.stroke();
            }
          }

          // Separate bead particle continues trajectory under gravity
          if (dropState.beadVisible) {
            dropState.beadVy += 0.04; // gravity active, floatier physics
            dropState.beadY += dropState.beadVy;

            if (dropState.beadVy > 0) {
              dropState.phase = 'bead_fall';
            }

            // Draw glossy circular daughter bead (with gorgeous fluid gradient)
            const beadGrad = ctx.createRadialGradient(
              centerX - 1, dropState.beadY - 1, 0.5,
              centerX, dropState.beadY, 4
            );
            beadGrad.addColorStop(0, '#ffffff');
            beadGrad.addColorStop(0.3, `rgba(${activeThemeRef.current.glowRgb}, 0.9)`);
            beadGrad.addColorStop(1, `rgba(${activeThemeRef.current.glowRgbSecondary || '0, 130, 255'}, 0.95)`);

            ctx.beginPath();
            ctx.fillStyle = beadGrad;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 0.75;
            ctx.arc(centerX, dropState.beadY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Distinct sharp curved glare overlay
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 0.5;
            ctx.arc(centerX, dropState.beadY, 2.5, -Math.PI * 0.75, -Math.PI * 0.25);
            ctx.stroke();

            // Secondary splash impact triggers when bead strikes surface level
            if (dropState.beadY >= targetY) {
              dropState.phase = 'secondary_impact';
            }
          } else if (dropState.spoutHeight <= 0) {
            dropState.phase = 'done';
          }
        }

        if (dropState.phase === 'secondary_impact') {
          // Secondary bead splash! Trigger tighter delicate wave rings
          addRipple(centerX, targetY, 12, 0.065, 2.0);
          
          // Tiny secondary splash particles
          for (let i = 0; i < 12; i++) {
            const angle = (Math.random() * Math.PI) + Math.PI;
            const force = 1.2 + Math.random() * 3;
            particlesRef.current.push({
              x: centerX,
              y: targetY - 1,
              size: 0.8 + Math.random() * 1.5,
              speedX: Math.cos(angle) * force,
              speedY: Math.sin(angle) * force - 0.5,
              opacity: 0.9,
              color: activeThemeRef.current.glowMain
            });
          }

          dropState.beadVisible = false;
          dropState.phase = 'done';
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
      {/* Primary Interaction WebGL-grade Water Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto z-1" 
        style={{ filter: 'contrast(1.05) brightness(0.98)' }}
      />

      {/* Atmospheric lighting backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#040406] via-transparent to-[#040406] z-2" />
    </div>
  );
}
