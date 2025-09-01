'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Sky } from '@react-three/drei';
import * as THREE from 'three';

interface StadiumProps {
  animationPhase: string;
}

export function Stadium({ animationPhase }: StadiumProps) {
  const groupRef = useRef<THREE.Group>(null);
  const skyRef = useRef<any>(null);

  useFrame((state) => {
    if (skyRef.current) {
      // Animate sky based on phase
      const sunPosition = animationPhase === 'intro' 
        ? [0.1, 0.2, -0.9]
        : [0.2, 0.1, -0.8];
      skyRef.current.material.uniforms.sunPosition.value.set(...sunPosition);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sky with sunset effect */}
      <Sky 
        ref={skyRef}
        distance={450000}
        sunPosition={[0.1, 0.2, -0.9]}
        inclination={0.49}
        azimuth={0.25}
        turbidity={10}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Cricket Ground - Main Pitch */}
      <Plane
        args={[100, 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#2d5a2d" />
      </Plane>

      {/* Cricket Pitch - Center Strip */}
      <Box
        args={[3, 0.05, 22]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshLambertMaterial 
          color="#8B7355" 
          roughness={0.8}
          metalness={0.1}
        />
      </Box>

      {/* Pitch markings - Stumps area */}
      <Box
        args={[0.5, 0.02, 0.5]}
        position={[0, 0.02, -10]}
      >
        <meshLambertMaterial color="#ffffff" />
      </Box>
      <Box
        args={[0.5, 0.02, 0.5]}
        position={[0, 0.02, 10]}
      >
        <meshLambertMaterial color="#ffffff" />
      </Box>

      {/* Stadium Stands - Simplified */}
      {/* Left Stand */}
      <Box
        args={[5, 15, 60]}
        position={[-40, 7.5, 0]}
        castShadow
        receiveShadow
      >
        <meshLambertMaterial 
          color="#444444"
          roughness={0.7}
        />
      </Box>
      
      {/* Right Stand */}
      <Box
        args={[5, 15, 60]}
        position={[40, 7.5, 0]}
        castShadow
        receiveShadow
      >
        <meshLambertMaterial 
          color="#444444"
          roughness={0.7}
        />
      </Box>
      
      {/* Back Stand */}
      <Box
        args={[80, 12, 5]}
        position={[0, 6, -35]}
        castShadow
        receiveShadow
      >
        <meshLambertMaterial 
          color="#444444"
          roughness={0.7}
        />
      </Box>

      {/* Stadium Lights */}
      {/* Light Tower 1 */}
      <group position={[25, 0, 25]}>
        <Box args={[1, 25, 1]} position={[0, 12.5, 0]}>
          <meshLambertMaterial color="#cccccc" />
        </Box>
        <Box args={[3, 1, 3]} position={[0, 25, 0]}>
          <meshLambertMaterial color="#ffffff" />
        </Box>
      </group>

      {/* Light Tower 2 */}
      <group position={[-25, 0, 25]}>
        <Box args={[1, 25, 1]} position={[0, 12.5, 0]}>
          <meshLambertMaterial color="#cccccc" />
        </Box>
        <Box args={[3, 1, 3]} position={[0, 25, 0]}>
          <meshLambertMaterial color="#ffffff" />
        </Box>
      </group>

      {/* Light Tower 3 */}
      <group position={[25, 0, -25]}>
        <Box args={[1, 25, 1]} position={[0, 12.5, 0]}>
          <meshLambertMaterial color="#cccccc" />
        </Box>
        <Box args={[3, 1, 3]} position={[0, 25, 0]}>
          <meshLambertMaterial color="#ffffff" />
        </Box>
      </group>

      {/* Light Tower 4 */}
      <group position={[-25, 0, -25]}>
        <Box args={[1, 25, 1]} position={[0, 12.5, 0]}>
          <meshLambertMaterial color="#cccccc" />
        </Box>
        <Box args={[3, 1, 3]} position={[0, 25, 0]}>
          <meshLambertMaterial color="#ffffff" />
        </Box>
      </group>

      {/* Boundary Rope */}
      <mesh position={[0, 0.1, 0]}>
        <ringGeometry args={[35, 35.2, 64]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>

      {/* Atmospheric particles for realism */}
      <points position={[0, 10, 0]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 200))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          size={0.5}
          transparent
          opacity={0.3}
          color="#FFE4B5"
        />
      </points>
    </group>
  );
}