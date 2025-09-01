'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CricketBatProps {
  animationPhase: string;
  position: [number, number, number];
}

export function CricketBat({ animationPhase, position }: CricketBatProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Mesh>(null);
  const handleRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline();

    switch (animationPhase) {
      case 'intro':
        // Bat at rest position
        tl.to(groupRef.current.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.out"
        });
        break;

      case 'focus':
        // Slight lift in preparation
        tl.to(groupRef.current.rotation, {
          x: -0.2,
          duration: 0.5,
          ease: "power2.inOut"
        });
        break;

      case 'approach':
        // Backswing preparation
        tl.to(groupRef.current.rotation, {
          x: -0.8,
          z: -0.3,
          duration: 0.8,
          ease: "power2.out"
        });
        break;

      case 'impact':
        // Swing through ball contact
        tl.to(groupRef.current.rotation, {
          x: 0.5,
          y: 0.2,
          z: 0.4,
          duration: 0.3,
          ease: "power4.out"
        });
        // Add impact vibration
        tl.to(groupRef.current.position, {
          x: position[0] + 0.05,
          duration: 0.05,
          ease: "power2.out",
          yoyo: true,
          repeat: 3
        }, 0);
        break;

      case 'celebration':
        // Follow through
        tl.to(groupRef.current.rotation, {
          x: 1.2,
          y: 0.5,
          z: 0.8,
          duration: 0.5,
          ease: "power2.out"
        });
        break;
    }
  }, [animationPhase, position]);

  // Create wood grain texture for the bat
  const createWoodTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base wood color
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, '#DEB887');
    gradient.addColorStop(0.5, '#D2B48C');
    gradient.addColorStop(1, '#CD853F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 512);
    
    // Wood grain lines
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 20; i++) {
      const y = (i / 20) * 512;
      const variation = Math.sin(i * 0.5) * 10;
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(128 + variation, y + 10, 256, y);
      ctx.stroke();
    }
    
    // Add wood knots
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 512;
      
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(x, y, 8, 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  // Create leather grip texture
  const createLeatherTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Dark brown leather base
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 0, 128, 256);
    
    // Leather texture pattern
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * 128,
        Math.random() * 256,
        Math.random() * 3,
        Math.random() * 3
      );
    }
    
    // Grip ridges
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 10; i++) {
      const y = (i / 10) * 256;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(128, y);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const woodTexture = createWoodTexture();
  const leatherTexture = createLeatherTexture();

  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  leatherTexture.wrapS = THREE.RepeatWrapping;
  leatherTexture.wrapT = THREE.RepeatWrapping;

  return (
    <group ref={groupRef} position={position}>
      {/* Bat Blade */}
      <Box
        ref={bladeRef}
        args={[0.12, 0.95, 0.04]}
        position={[0, 0.47, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          map={woodTexture}
          color="#DEB887"
          roughness={0.6}
          metalness={0.0}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </Box>

      {/* Bat Handle */}
      <Cylinder
        ref={handleRef}
        args={[0.025, 0.03, 0.35]}
        position={[0, -0.175, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          map={leatherTexture}
          color="#654321"
          roughness={0.9}
          metalness={0.0}
        />
      </Cylinder>

      {/* Handle Grip Tape */}
      <Cylinder
        args={[0.032, 0.032, 0.25]}
        position={[0, -0.125, 0]}
        castShadow
      >
        <meshLambertMaterial
          color="#2C1810"
          roughness={1.0}
        />
      </Cylinder>

      {/* Bat Edge Protection */}
      <Box
        args={[0.14, 0.02, 0.06]}
        position={[0, 0.02, 0]}
      >
        <meshLambertMaterial color="#000000" />
      </Box>

      {/* Sponsor Sticker (Optional detail) */}
      <Box
        args={[0.08, 0.08, 0.001]}
        position={[0, 0.3, 0.021]}
      >
        <meshBasicMaterial color="#FFFFFF" />
      </Box>

      {/* Sweet Spot marking */}
      <Box
        args={[0.06, 0.15, 0.001]}
        position={[0, 0.15, 0.021]}
      >
        <meshBasicMaterial 
          color="#FFDDDD"
          transparent
          opacity={0.3}
        />
      </Box>

      {/* Add motion trail during swing */}
      {(animationPhase === 'impact' || animationPhase === 'celebration') && (
        <group>
          {/* Motion blur trail effect */}
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              args={[0.12, 0.95, 0.04]}
              position={[0, 0.47, 0]}
              rotation={[0, 0, -i * 0.1]}
            >
              <meshBasicMaterial
                color="#DEB887"
                transparent
                opacity={0.1 / (i + 1)}
              />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
}