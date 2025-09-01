'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface BatsmanProps {
  animationPhase: string;
  position: [number, number, number];
}

export function Batsman({ animationPhase, position }: BatsmanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const helmetRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline();

    switch (animationPhase) {
      case 'intro':
        // Standing ready position
        tl.to(groupRef.current.rotation, {
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
        break;

      case 'focus':
        // Slight anticipation movement
        if (torsoRef.current) {
          tl.to(torsoRef.current.rotation, {
            z: -0.1,
            duration: 0.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1
          });
        }
        break;

      case 'approach':
        // Prepare for swing
        if (rightArmRef.current) {
          tl.to(rightArmRef.current.rotation, {
            x: -0.5,
            duration: 0.8,
            ease: "power2.out"
          });
        }
        if (leftArmRef.current) {
          tl.to(leftArmRef.current.rotation, {
            x: -0.3,
            duration: 0.8,
            ease: "power2.out"
          }, 0);
        }
        break;

      case 'impact':
        // Swing motion
        if (rightArmRef.current && leftArmRef.current) {
          tl.to([rightArmRef.current.rotation, leftArmRef.current.rotation], {
            x: 0.8,
            duration: 0.3,
            ease: "power4.out"
          });
        }
        // Body rotation
        if (torsoRef.current) {
          tl.to(torsoRef.current.rotation, {
            y: 0.3,
            duration: 0.3,
            ease: "power4.out"
          }, 0);
        }
        break;

      case 'celebration':
        // Follow through and celebration
        if (rightArmRef.current) {
          tl.to(rightArmRef.current.rotation, {
            x: 1.2,
            duration: 0.5,
            ease: "power2.out"
          });
        }
        if (groupRef.current) {
          tl.to(groupRef.current.position, {
            y: position[1] + 0.2,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
        }
        break;
    }
  }, [animationPhase, position]);

  useFrame((state) => {
    // Subtle breathing animation
    if (torsoRef.current && animationPhase !== 'impact') {
      torsoRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }

    // Head movement following camera
    if (headRef.current && animationPhase === 'approach') {
      headRef.current.lookAt(state.camera.position);
      headRef.current.rotation.x = Math.max(headRef.current.rotation.x, -0.3);
      headRef.current.rotation.x = Math.min(headRef.current.rotation.x, 0.3);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Legs */}
      <group ref={leftLegRef} position={[-0.3, 1, 0]}>
        {/* Upper Leg */}
        <Cylinder
          args={[0.15, 0.12, 0.8]}
          position={[0, -0.4, 0]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Lower Leg */}
        <Cylinder
          args={[0.12, 0.1, 0.8]}
          position={[0, -1.2, 0]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Shoe */}
        <Box
          args={[0.25, 0.15, 0.4]}
          position={[0, -1.7, 0.1]}
        >
          <meshLambertMaterial color="#000000" />
        </Box>
      </group>

      <group ref={rightLegRef} position={[0.3, 1, 0]}>
        {/* Upper Leg */}
        <Cylinder
          args={[0.15, 0.12, 0.8]}
          position={[0, -0.4, 0]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Lower Leg */}
        <Cylinder
          args={[0.12, 0.1, 0.8]}
          position={[0, -1.2, 0]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Shoe */}
        <Box
          args={[0.25, 0.15, 0.4]}
          position={[0, -1.7, 0.1]}
        >
          <meshLambertMaterial color="#000000" />
        </Box>
      </group>

      {/* Torso */}
      <Box
        ref={torsoRef}
        args={[0.6, 1.2, 0.3]}
        position={[0, 1.8, 0]}
        castShadow
      >
        <meshLambertMaterial color="#ffffff" />
      </Box>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.4, 2.2, 0]}>
        {/* Upper Arm */}
        <Cylinder
          args={[0.08, 0.07, 0.6]}
          position={[0, -0.3, 0]}
          rotation={[0, 0, -0.2]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Lower Arm */}
        <Cylinder
          args={[0.07, 0.06, 0.5]}
          position={[-0.1, -0.8, 0]}
          rotation={[0, 0, -0.3]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Glove */}
        <Sphere
          args={[0.1]}
          position={[-0.2, -1.2, 0]}
        >
          <meshLambertMaterial color="#8B4513" />
        </Sphere>
      </group>

      <group ref={rightArmRef} position={[0.4, 2.2, 0]}>
        {/* Upper Arm */}
        <Cylinder
          args={[0.08, 0.07, 0.6]}
          position={[0, -0.3, 0]}
          rotation={[0, 0, 0.2]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Lower Arm */}
        <Cylinder
          args={[0.07, 0.06, 0.5]}
          position={[0.1, -0.8, 0]}
          rotation={[0, 0, 0.3]}
        >
          <meshLambertMaterial color="#ffffff" />
        </Cylinder>
        {/* Glove */}
        <Sphere
          args={[0.1]}
          position={[0.2, -1.2, 0]}
        >
          <meshLambertMaterial color="#8B4513" />
        </Sphere>
      </group>

      {/* Head */}
      <Sphere
        ref={headRef}
        args={[0.25]}
        position={[0, 2.8, 0]}
        castShadow
      >
        <meshLambertMaterial color="#FDBCB4" />
      </Sphere>

      {/* Helmet */}
      <Sphere
        ref={helmetRef}
        args={[0.28]}
        position={[0, 2.8, 0]}
        castShadow
      >
        <meshLambertMaterial 
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Helmet Visor */}
      <Box
        args={[0.4, 0.15, 0.02]}
        position={[0, 2.75, 0.25]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#0066CC"
          transparent
          opacity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Protective Pads */}
      {/* Left Pad */}
      <Box
        args={[0.25, 1.5, 0.1]}
        position={[-0.3, 0.2, 0.15]}
      >
        <meshLambertMaterial color="#ffffff" />
      </Box>
      {/* Right Pad */}
      <Box
        args={[0.25, 1.5, 0.1]}
        position={[0.3, 0.2, 0.15]}
      >
        <meshLambertMaterial color="#ffffff" />
      </Box>
    </group>
  );
}