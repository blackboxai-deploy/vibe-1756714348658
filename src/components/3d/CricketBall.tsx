'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CricketBallProps {
  animationPhase: string;
  position: [number, number, number];
}

export function CricketBall({ animationPhase, position }: CricketBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [ref, api] = useSphere(() => ({
    mass: 0.156, // Official cricket ball mass in kg
    position: position,
    material: {
      friction: 0.8,
      restitution: 0.6
    }
  }));

  // Track ball position for animation
  const ballPosition = useRef(position);
  
  useEffect(() => {
    api.position.subscribe((pos) => {
      ballPosition.current = pos as [number, number, number];
    });
  }, [api]);

  useEffect(() => {
    if (!ref.current) return;

    switch (animationPhase) {
      case 'intro':
        // Ball at bowler's end, stationary
        api.position.set(...position);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        break;

      case 'approach':
        // Ball bowled towards batsman with spin
        api.position.set(0, 2.5, -20);
        api.velocity.set(0, -2, 25); // Forward velocity with slight drop
        api.angularVelocity.set(10, 0, 15); // Spin around multiple axes
        break;

      case 'impact':
        // Ball hit by bat - dramatic trajectory change
        setTimeout(() => {
          api.velocity.set(-8, 15, -20); // Hit towards boundary
          api.angularVelocity.set(-20, 10, 5);
        }, 300); // Slight delay for bat contact
        break;

      case 'celebration':
        // Ball continues flying
        // Physics will handle the trajectory naturally
        break;
    }
  }, [animationPhase, api, position]);

  useFrame((state) => {
    if (meshRef.current) {
      // Add motion blur effect during high-speed phases
      if (animationPhase === 'approach' || animationPhase === 'impact') {
        // Calculate velocity for motion blur intensity
        const velocity = ballPosition.current;
        const speed = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
        
        // Add slight trailing effect with opacity
        if (speed > 5) {
          meshRef.current.material.transparent = true;
          meshRef.current.material.opacity = Math.max(0.7, 1 - speed * 0.02);
        } else {
          meshRef.current.material.opacity = 1;
        }
      }

      // Continuous spin for realism
      if (animationPhase !== 'intro') {
        meshRef.current.rotation.x += 0.1;
        meshRef.current.rotation.z += 0.05;
      }
    }
  });

  // Create seam texture pattern
  const createSeamTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Base red leather color
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add leather texture
    ctx.fillStyle = '#A0201A';
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(
        Math.random() * 256, 
        Math.random() * 256, 
        Math.random() * 4, 
        Math.random() * 4
      );
    }
    
    // White seam stitching
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    
    // Seam curve 1
    ctx.beginPath();
    ctx.arc(128, 64, 50, 0, Math.PI);
    ctx.stroke();
    
    // Seam curve 2
    ctx.beginPath();
    ctx.arc(128, 192, 50, Math.PI, 2 * Math.PI);
    ctx.stroke();
    
    // Cross stitching
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = 128 + Math.cos(angle) * 45;
      const y1 = 128 + Math.sin(angle) * 45;
      const x2 = 128 + Math.cos(angle) * 55;
      const y2 = 128 + Math.sin(angle) * 55;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const seamTexture = createSeamTexture();
  seamTexture.wrapS = THREE.RepeatWrapping;
  seamTexture.wrapT = THREE.RepeatWrapping;

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <sphereGeometry args={[0.072, 32, 32]} />
      <meshPhysicalMaterial
        ref={meshRef as any}
        map={seamTexture}
        color="#8B0000"
        roughness={0.8}
        metalness={0.1}
        clearcoat={0.1}
        clearcoatRoughness={0.3}
      />
      
      {/* Add glow effect during high-speed movement */}
      {(animationPhase === 'approach' || animationPhase === 'impact') && (
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[0.072, 16, 16]} />
          <meshBasicMaterial
            color="#FF4444"
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </mesh>
  );
}