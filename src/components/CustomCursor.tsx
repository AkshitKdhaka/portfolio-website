'use client';

import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const mousePosRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });
  const hoverStateRef = useRef(false);
  const clickStateRef = useRef(false);
  const visibleStateRef = useRef(false);

  useEffect(() => {
    // Disable custom cursor on mobile touch screens for optimal UX
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    if (mediaQuery.matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Initially hide the cursors so they don't flash at top-left
    ring.style.opacity = '0';
    dot.style.opacity = '0';

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest?.(
        'a, button, [role="button"], .cursor-pointer, .interactive-hover, input, select, textarea, label'
      ) as HTMLElement | null;

      const isOverInteractive = !!interactiveEl;
      hoverStateRef.current = isOverInteractive;

      if (!visibleStateRef.current) {
        visibleStateRef.current = true;
        ring.style.opacity = '1';
        dot.style.opacity = '1';
      }

      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => {
      clickStateRef.current = true;
    };
    const onMouseUp = () => {
      clickStateRef.current = false;
    };
    
    const onMouseLeave = () => {
      visibleStateRef.current = false;
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const onMouseEnter = () => {
      visibleStateRef.current = true;
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // High performance RAF loop
    let rafId: number;
    const updateCursor = () => {
      const target = mousePosRef.current;
      const current = currentPosRef.current;

      // Inner dot tracks real mouse position with absolute 100% instant precision (zero lag/offset)
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;

      // Outer ring tracks mouse with smooth interpolation
      const ringEase = 0.25;
      current.x += (target.x - current.x) * ringEase;
      current.y += (target.y - current.y) * ringEase;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;

      // Update interactive hover & click states directly on DOM properties for zero lag and perfect stability
      const isHovered = hoverStateRef.current;
      const isClicking = clickStateRef.current;

      // Apply scale, background, border, and shadow dynamically
      const ringScale = isClicking ? 0.82 : isHovered ? 1.35 : 1.0;
      ring.style.setProperty('--cursor-scale', ringScale.toString());
      ring.style.backgroundColor = isHovered ? 'rgba(0, 209, 255, 0.16)' : 'rgba(0, 209, 255, 0)';
      ring.style.borderColor = isHovered ? '#00d1ff' : 'rgba(0, 209, 255, 0.32)';
      ring.style.boxShadow = isHovered ? '0 0 14px rgba(0, 209, 255, 0.45)' : 'none';

      const dotScale = isClicking ? 0.8 : isHovered ? 1.25 : 1.0;
      dot.style.setProperty('--cursor-scale', dotScale.toString());

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

  return (
    <>
      {/* Outer Glowing Liquid Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] mix-blend-screen"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          scale: 'var(--cursor-scale, 1)',
          willChange: 'transform, scale',
          transition: 'scale 120ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
          pointerEvents: 'none'
        }}
      />

      {/* Inner Pinpoint Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#00d1ff] rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          scale: 'var(--cursor-scale, 1)',
          backgroundColor: '#00d1ff',
          boxShadow: '0 0 8px #00d1ff',
          willChange: 'transform, scale',
          transition: 'scale 120ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 120ms ease, box-shadow 120ms ease',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
