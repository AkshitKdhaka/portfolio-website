'use client';

import React, { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .cursor-pointer, .interactive-hover, input, select, textarea, label';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mousePosRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const hoverStateRef = useRef(false);
  const clickStateRef = useRef(false);
  const visibleStateRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    if (mediaQuery.matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    ring.style.opacity = '0';
    dot.style.opacity = '0';

    const showCursor = () => {
      if (!visibleStateRef.current) {
        visibleStateRef.current = true;
        ring.style.opacity = '1';
        dot.style.opacity = '1';
      }
    };

    const hideCursor = () => {
      visibleStateRef.current = false;
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest(INTERACTIVE_SELECTOR);
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      showCursor();

      // Snap the ring to the pointer on interactive elements so it never
      // lags behind and looks like it drifted off the button.
      if (hoverStateRef.current) {
        ringPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      hoverStateRef.current = isInteractiveTarget(e.target);
      if (hoverStateRef.current) {
        ringPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const nextTarget = e.relatedTarget;
      hoverStateRef.current = isInteractiveTarget(nextTarget);
    };

    const onMouseDown = () => {
      clickStateRef.current = true;
    };

    const onMouseUp = () => {
      clickStateRef.current = false;
    };

    const onMouseLeave = () => hideCursor();
    const onMouseEnter = () => showCursor();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    let rafId: number;

    const applyCursorVisuals = (
      el: HTMLDivElement,
      x: number,
      y: number,
      scale: number,
      extraStyles?: Partial<CSSStyleDeclaration>
    ) => {
      // Keep position + scale in one transform so the visual center never
      // shifts when the hover scale changes.
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;

      if (extraStyles) {
        Object.assign(el.style, extraStyles);
      }
    };

    const updateCursor = () => {
      const target = mousePosRef.current;
      const ringPos = ringPosRef.current;

      if (!hoverStateRef.current) {
        const ringEase = 0.35;
        ringPos.x += (target.x - ringPos.x) * ringEase;
        ringPos.y += (target.y - ringPos.y) * ringEase;
      } else {
        ringPos.x = target.x;
        ringPos.y = target.y;
      }

      const isHovered = hoverStateRef.current;
      const isClicking = clickStateRef.current;

      const ringScale = isClicking ? 0.9 : isHovered ? 1.2 : 1;
      const dotScale = isClicking ? 0.85 : isHovered ? 1.1 : 1;

      applyCursorVisuals(dotRef.current!, target.x, target.y, dotScale, {
        backgroundColor: '#00d1ff',
        boxShadow: isHovered
          ? '0 0 12px rgba(0, 209, 255, 0.95)'
          : '0 0 8px rgba(0, 209, 255, 0.8)',
      });

      applyCursorVisuals(ringRef.current!, ringPos.x, ringPos.y, ringScale, {
        backgroundColor: isHovered ? 'rgba(0, 209, 255, 0.2)' : 'rgba(0, 209, 255, 0)',
        borderColor: isHovered ? '#00d1ff' : 'rgba(0, 209, 255, 0.45)',
        boxShadow: isHovered ? '0 0 16px rgba(0, 209, 255, 0.55)' : 'none',
      });

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999]"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(1)',
          borderWidth: '1.5px',
          willChange: 'transform',
        }}
      />

      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(1)',
          backgroundColor: '#00d1ff',
          boxShadow: '0 0 8px rgba(0, 209, 255, 0.8)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
