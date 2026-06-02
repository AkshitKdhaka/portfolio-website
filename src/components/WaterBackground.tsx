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

interface WaterBackgroundProps {
  activeSection: number;
}

export default function WaterBackground({ activeSection }: WaterBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  
  // Physical droplet state machine mimicking high-speed high-fidelity splash physics
  const dropletStateRef = useRef({
    phase: 'falling', // 'falling' | 'impact' | 'rebound' | 'bead_rise' | 'bead_fall' | 'secondary_impact' | 'done'
    y: -30,
    vy: 1.5,
    spoutHeight: 0,
    beadY: 0,
    beadVy: 0,
    beadVisible: false,
    cooldown: 90
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
        vy: 1.5,
        spoutHeight: 0,
        beadY: 0,
        beadVy: 0,
        beadVisible: false,
        cooldown: 90
      };
    } else {
      // Gracefully clear/halt droplet when user leaves top screen to save CPU cycles
      dropletStateRef.current = {
        phase: 'done',
        y: -30,
        vy: 1.5,
        spoutHeight: 0,
        beadY: 0,
        beadVy: 0,
        beadVisible: false,
        cooldown: 90
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
          color: '#00d1ff'
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
            ? 'rgba(0, 229, 255, 0.8)' // neon water cyan
            : Math.random() > 0.35
              ? 'rgba(24, 255, 255, 0.7)' // deep lagoon turquoise
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
        size: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.25 - 0.1, // floating slightly upwards
        opacity: 0.15 + Math.random() * 0.4,
        color: Math.random() > 0.65 ? 'rgba(0, 209, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)'
      });
    }

    // DRAW ENGINE LOOP Runs at 60 FPS
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render Cinematic Cyberocean Ocean Bed Gradient Background
      // Shifts slightly based on active scroll section
      let oceanColor1 = '#030406'; // Deep dark space coordinates
      let oceanColor2 = '#06131c'; // Indigo oceanic floor
      
      if (activeSectionRef.current === 1) {
        oceanColor2 = '#091c29'; // Journey deep glow
      } else if (activeSectionRef.current === 2) {
        oceanColor2 = '#0b2633'; // Deep teal workshop
      } else if (activeSectionRef.current === 3) {
        oceanColor2 = '#11131a'; // Slate foundation bento
      } else if (activeSectionRef.current === 4) {
        oceanColor2 = '#0d2229'; // Cyber copilot glowing matrix
      } else if (activeSectionRef.current === 5) {
        oceanColor2 = '#051b2a'; // Deep space finish
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

      // 3. Draw Perspective Holographic Cyber Grid
      // Mesh vertices refract and shift based on live mathematical waves
      ctx.strokeStyle = 'rgba(0, 209, 255, 0.05)';
      ctx.lineWidth = 1;

      const gridCols = 44;
      const gridRows = 30;
      const cellW = canvas.width / (gridCols - 1);
      const cellH = canvas.height / (gridRows - 1);

      // Vertical perspective alignment offsets
      const focalLength = 320;
      const depthOffset = 180;

      // Store distorted projected grid points to draw clean curved lines
      const projectedGrid: { sx: number; sy: number; height: number }[][] = [];

      for (let r = 0; r < gridRows; r++) {
        projectedGrid[r] = [];
        for (let c = 0; c < gridCols; c++) {
          const originalX = c * cellW;
          const originalY = r * cellH;

          // Compute ripple displacement sum
          let totalZ = 0;
          let distortX = 0;
          let distortY = 0;

          for (let i = 0; i < ripples.length; i++) {
            const rip = ripples[i];
            const dx = originalX - rip.x;
            const dy = originalY - rip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < rip.radius) {
              const progress = (rip.radius - dist) / rip.radius;
              if (progress > 0 && progress < 1) {
                // Decay envelope + sine wave oscillation
                const wave = Math.sin((rip.radius - dist) * rip.frequency - Math.PI / 2);
                const envelope = Math.sin(progress * Math.PI);
                const z = wave * rip.amplitude * envelope;
                totalZ += z;

                if (dist > 1) {
                  distortX += (dx / dist) * z * 0.28;
                  distortY += (dy / dist) * z * 0.28;
                }
              }
            }
          }

          // 3D Plane coordinates perspective projection
          const px3d = (originalX - canvas.width / 2) + distortX;
          const py3d = (originalY - canvas.height / 2) + distortY;
          const pz3d = totalZ;

          // Slanted 3D surface grid calculation in camera space
          const slantAngle = 0.45; // Camera viewport pitch look angle
          const rotatedY = py3d * Math.cos(slantAngle) - pz3d * Math.sin(slantAngle);
          const rotatedZ = py3d * Math.sin(slantAngle) + pz3d * Math.cos(slantAngle);

          const distanceZ = rotatedZ + focalLength + depthOffset;
          const scale = focalLength / distanceZ;

          const sx = canvas.width / 2 + px3d * scale;
          const sy = canvas.height / 2 + rotatedY * scale + 100; // shift downwards

          projectedGrid[r].push({ sx, sy, height: totalZ });
        }
      }

      // Draw horizontal and vertical curved lines removed per user request to have a clean water background without grid lines

      // 4. Highlight wave node reflections with dynamic specular circles
      for (let r = 0; r < gridRows; r += 3) {
        for (let c = 0; c < gridCols; c += 3) {
          const pt = projectedGrid[r][c];
          if (Math.abs(pt.height) > 1.2) {
            // Bright specularity where wave slope is active
            const pulse = Math.min(Math.abs(pt.height) * 0.04, 0.45);
            ctx.fillStyle = `rgba(0, 209, 255, ${pulse})`;
            ctx.beginPath();
            ctx.arc(pt.sx, pt.sy, 1 + Math.abs(pt.height) * 0.1, 0, Math.PI * 2);
            ctx.fill();
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
        cursorSpot.addColorStop(0, 'rgba(0, 209, 255, 0.08)');
        cursorSpot.addColorStop(0.5, 'rgba(0, 209, 255, 0.02)');
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

        // Apply interactive water refraction offset of particles under waves
        let rx = p.x;
        let ry = p.y;
        for (let i = 0; i < ripples.length; i++) {
          const rip = ripples[i];
          const dx = p.x - rip.x;
          const dy = p.y - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < rip.radius) {
            const k = (rip.radius - dist) / rip.radius;
            const w = Math.sin((rip.radius - dist) * rip.frequency) * rip.amplitude * Math.sin(k * Math.PI);
            if (dist > 0.5) {
              rx += (dx / dist) * w * 0.35;
              ry += (dy / dist) * w * 0.35;
            }
          }
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 7. Update and Draw Dispersed Splash Ring Particles (from Droplet Landing)
      const particleArr = particlesRef.current;
      particlesRef.current = particleArr.filter((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.08; // slight gravity pull downwards on splash splinters
        p.opacity -= 0.012; // slow fade

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        return p.opacity > 0;
      });

      // 8. Update and Draw Cursor-Following Bioluminescent Bubbles & Plankton
      const trail = trailParticlesRef.current;
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

        // Apply interactive water refraction distortion from current live ripples
        let rx = tp.x;
        let ry = tp.y;
        for (let i = 0; i < ripples.length; i++) {
          const rip = ripples[i];
          const dx = tp.x - rip.x;
          const dy = tp.y - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < rip.radius) {
            const k = (rip.radius - dist) / rip.radius;
            const w = Math.sin((rip.radius - dist) * rip.frequency) * rip.amplitude * Math.sin(k * Math.PI);
            if (dist > 0.5) {
              rx += (dx / dist) * w * 0.35;
              ry += (dy / dist) * w * 0.35;
            }
          }
        }

        ctx.globalAlpha = Math.max(tp.opacity, 0);

        if (tp.isBubble) {
          // Render highly polished glossy sphere bubble (outline + translucent fill + white flare glare)
          ctx.strokeStyle = tp.color;
          ctx.lineWidth = 0.85;
          ctx.fillStyle = 'rgba(0, 209, 255, 0.06)';

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
          dropState.vy = 1.5;
          dropState.spoutHeight = 0;
          dropState.beadY = 0;
          dropState.beadVy = 0;
          dropState.beadVisible = false;
          dropState.cooldown = 90; // reset cooldown for next round
        }
      }

      if (dropState.phase !== 'done') {
        if (dropState.phase === 'falling') {
          // Accelerate downwards naturally under gravity
          dropState.vy += 0.42;
          dropState.y += dropState.vy;

          // Draw the falling droplet shape (glossy neon cyan teardrop with glowing highlight)
          ctx.beginPath();
          ctx.fillStyle = 'rgba(0, 209, 255, 0.95)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.25;

          // Pointy top, organic round bulb bottom teardrop
          ctx.moveTo(centerX, dropState.y - 12);
          ctx.bezierCurveTo(centerX - 4.5, dropState.y + 2, centerX - 5.5, dropState.y + 6, centerX, dropState.y + 6);
          ctx.bezierCurveTo(centerX + 5.5, dropState.y + 6, centerX + 4.5, dropState.y + 2, centerX, dropState.y - 12);
          ctx.fill();
          ctx.stroke();

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
              color: 'rgba(0, 229, 255, 0.65)',
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
            const force = 2.5 + Math.random() * 7.5;
            particlesRef.current.push({
              x: centerX,
              y: targetY - 2,
              size: 1.5 + Math.random() * 2.5,
              speedX: Math.cos(angle) * force,
              speedY: Math.sin(angle) * force - 2.5, // strong upwards impulse
              opacity: 1,
              color: Math.random() > 0.45 ? '#00d1ff' : '#00ffff'
            });
          }

          // Transition to vertical liquid spout column phase
          dropState.phase = 'rebound';
          dropState.vy = 8.5; // rising velocity of fluid jet
          dropState.spoutHeight = 0;
        }

        if (dropState.phase === 'rebound') {
          // Liquid siphoned upwards, spout grows while gravity decelerates it
          dropState.vy -= 0.35;
          dropState.spoutHeight += dropState.vy;

          if (dropState.spoutHeight > 0) {
            // Draw visual 2D silhouette of vertical water jet (curved organic column, wide base)
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 209, 255, 0.85)';
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
            dropState.beadVy = -2.2; // secondary upward pop
            dropState.beadVisible = true;
          }
        }

        if (dropState.phase === 'bead_rise' || dropState.phase === 'bead_fall') {
          // Column jet retracts back downwards to join water volume
          if (dropState.spoutHeight > 0) {
            dropState.spoutHeight = Math.max(0, dropState.spoutHeight - 5.5);

            if (dropState.spoutHeight > 0) {
              ctx.beginPath();
              ctx.fillStyle = 'rgba(0, 209, 255, 0.7)';
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
            dropState.beadVy += 0.22; // gravity active
            dropState.beadY += dropState.beadVy;

            if (dropState.beadVy > 0) {
              dropState.phase = 'bead_fall';
            }

            // Draw glossy circular daughter bead (white highlights)
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = '#00d1ff';
            ctx.lineWidth = 1;
            ctx.arc(centerX, dropState.beadY, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Glare highlight spot
            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(centerX - 1, dropState.beadY - 1, 1, 0, Math.PI * 2);
            ctx.fill();

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
          addRipple(centerX, targetY, 18, 0.065, 3.0);
          
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
              color: '#00d1ff'
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
