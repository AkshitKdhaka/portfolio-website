'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  activeSection: number;
  mousePos: { x: number; y: number };
}

// 1. Beautiful 3D Spiral Galaxy Generator
// Distribute stars in continuous mathematical arms, colored by a gradient 
// radiating from the hot core to the cool outer rims.
function InteractiveGalaxy({ activeSection, mousePos }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const parameters = {
    count: 10000,
    size: 0.016,
    radius: 13,
    branches: 4,
    spin: 1.4,
    randomness: 0.55,
    power: 3.5, // Concentrate stars aggressively in the core center
    insideColor: '#ffeed1', // Bright warm golden core
    middleColor: '#00d1ff', // Electric cyan arms
    outsideColor: '#0b0028' // Dark violet margin
  };

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(parameters.count * 3);
    const cols = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorMiddle = new THREE.Color(parameters.middleColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      // Radius distribution concentrated near center
      const radius = Math.pow(Math.random(), parameters.power) * parameters.radius;
      
      // Branch angle based on branch index
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      
      // Spin curl factor proportional to radius
      const spinAngle = radius * parameters.spin;

      // Random dispersion calculation
      const randomX = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (radius + 0.15);
      const randomY = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (radius + 0.15);
      const randomZ = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (radius + 0.15);

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = Math.sin(branchAngle + spinAngle) * radius + randomY;
      const z = randomZ; // Coordinates placed directly on the main viewport focal plane

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Interpolate colors smoothly
      const mixedColor = colorInside.clone();
      if (radius < parameters.radius * 0.25) {
        // Core to arm transition
        const ratio = radius / (parameters.radius * 0.25);
        mixedColor.lerp(colorMiddle, ratio);
      } else {
        // Arm to outer boundary transition
        const ratio = (radius - parameters.radius * 0.25) / (parameters.radius * 0.75);
        mixedColor.lerp(colorOutside, ratio);
      }

      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;
    }

    return [pos, cols];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Core galactic rotation
    const baseRotation = time * 0.045;
    
    // 2. Interactive scroll targeting updates:
    // Different scroll sections slant the galactic space vector for a multi-axis perspective
    let targetXRot = 0.3; // Default 3D slant angle
    let targetYRot = -0.2;
    let targetZRot = baseRotation;
    let targetXPos = 0;
    let targetYPos = 0;
    let targetZPos = -1.5;

    if (activeSection === 1) { // Journey: Shift perspective downwards
      targetXRot = 0.6;
      targetYRot = 0.3;
      targetZPos = -1.2;
    } else if (activeSection === 2) { // Workshop: Andromeda-style horizontal tilt
      targetXRot = 1.1; 
      targetYRot = -0.4;
      targetXPos = -2.0; // Pan to left sidebar bento accent
    } else if (activeSection === 3) { // Foundation: Cosmic cluster slant
      targetXRot = 0.4;
      targetYRot = 0.6;
      targetXPos = 2.0; // Pan to right
    } else if (activeSection === 4) { // AI Recruiter: Core zoom in
      targetXRot = 0.1;
      targetYRot = -0.1;
      targetZPos = 1.0; // Zoom closer to golden nucleus
    } else if (activeSection === 5) { // Contact: Soft centered zoom out
      targetXRot = 0.5;
      targetYRot = 0.1;
      targetZPos = -2.5;
    }

    // Interactive Mouse Cursor sway: shift nodes instantly with soft spring-damper lag (lerping)
    const mouseParallaxX = mousePos.x * 1.5;
    const mouseParallaxY = -mousePos.y * 1.5;

    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetXPos + mouseParallaxX, 0.05);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetYPos + mouseParallaxY, 0.05);
    pointsRef.current.position.z = THREE.MathUtils.lerp(pointsRef.current.position.z, targetZPos, 0.04);

    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetXRot + (mousePos.y * 0.2), 0.04);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetYRot + (mousePos.x * 0.2), 0.04);
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, targetZRot, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={parameters.size}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.18}
        vertexColors={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 2. Ambient background twinkling starfield.
// Distributed much further back on the depth map to provide deep context parallax.
function TwinklingStars({ mousePos }: { mousePos: { x: number; y: number } }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1200;

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scls = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Standard spherical coordinate distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 24.0 + Math.random() * 20.0; // Place star bounds far in background

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta); // X
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // Y
      pos[i * 3 + 2] = r * Math.cos(phi) - 10.0; // Z depth alignment offset

      scls[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, scls];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Fast flickering twinkling motion
    pointsRef.current.rotation.y = time * 0.004;
    pointsRef.current.rotation.z = -time * 0.001;

    // React cleanly to mouse parallax at a lower scale (simulating distance filters)
    const targetX = mousePos.x * 0.4;
    const targetY = -mousePos.y * 0.4;
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.03);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, 0.03);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.035}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3. Immersive breathing camera manager
function CameraWellnessManager() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Gentle deep space floating loop
    camera.position.z = 4.8 + Math.sin(time * 0.15) * 0.12;
    camera.position.y = Math.cos(time * 0.12) * 0.04;
    camera.position.x = Math.sin(time * 0.12) * 0.04;
  });

  return null;
}

export default function ThreeCanvas({ activeSection, mousePos }: SceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#020202]">
      {/* Dynamic stellar void space background radial styling */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,40,88,0.08),transparent_75%)] pointer-events-none" />
      
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 75 }}
        style={{ pointerEvents: 'none' }} // Strictly let user interface clicks flow safely past 3D backdrop
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 8]} intensity={1.5} color="#00ffff" />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#7b2cff" />
        
        <CameraWellnessManager />
        <InteractiveGalaxy activeSection={activeSection} mousePos={mousePos} />
        <TwinklingStars mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
