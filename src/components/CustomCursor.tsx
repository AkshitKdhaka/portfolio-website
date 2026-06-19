'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const hoverStateRef = useRef(false);
  const visibleStateRef = useRef(false);
  const mousePosRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });

  // Cache the hovered element to avoid excessive getBoundingClientRect layout triggers
  const lastElementRef = useRef<HTMLElement | null>(null);
  const lastRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    // Disable custom cursor on mobile touch screens for optimal UX
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    if (mediaQuery.matches) {
      if (visibleStateRef.current) {
        visibleStateRef.current = false;
        setIsVisible(false);
      }
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest?.(
        'a, button, [role="button"], .cursor-pointer, .interactive-hover, input, select, textarea, label'
      ) as HTMLElement | null;

      const isOverInteractive = !!interactiveEl;

      if (isOverInteractive !== hoverStateRef.current) {
        hoverStateRef.current = isOverInteractive;
        setIsHovered(isOverInteractive);
      }

      if (!visibleStateRef.current) {
        visibleStateRef.current = true;
        setIsVisible(true);
      }

      // Perfect precise centering on real mouse coordinates without magnetic pulling
      const targetX = e.clientX;
      const targetY = e.clientY;

      mousePosRef.current = { x: targetX, y: targetY };
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    
    const onMouseLeave = () => {
      visibleStateRef.current = false;
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      visibleStateRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // High performance fully-synchronized RAF loop to render buttery smooth, perfectly aligned cursor
    let rafId: number;
    const updateCursor = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      const target = mousePosRef.current;
      const current = currentPosRef.current;

      if (ring && dot) {
        // 100% synchronous tracking to absolute client coordinates to prevent any separation or floating offset
        current.x = target.x;
        current.y = target.y;

        // Apply hardware-accelerated translate3d transforms directly
        ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
        dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glowing Liquid Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] mix-blend-screen"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          scale: isClicking ? 0.85 : isHovered ? 1.15 : 1,
          backgroundColor: isHovered ? 'rgba(0, 209, 255, 0.12)' : 'rgba(0, 209, 255, 0)',
          borderColor: isHovered ? '#00d1ff' : 'rgba(255, 255, 255, 0.35)',
          boxShadow: isHovered 
            ? '0 0 10px rgba(0, 209, 255, 0.3)' 
            : 'none',
          willChange: 'transform',
          transition: 'scale 120ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease'
        }}
      />

      {/* Inner Pinpoint Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          scale: isClicking ? 0.85 : isHovered ? 1.15 : 1,
          backgroundColor: isHovered ? '#00d1ff' : '#ffffff',
          boxShadow: isHovered ? '0 0 6px #00d1ff' : 'none',
          willChange: 'transform',
          transition: 'scale 120ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 120ms ease, box-shadow 120ms ease'
        }}
      />
    </>
  );
}
