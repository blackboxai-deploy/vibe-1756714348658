'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CameraControllerProps {
  animationPhase: string;
  target: [number, number, number];
}

export function CameraController({ animationPhase, target }: CameraControllerProps) {
  const { camera, scene } = useThree();
  const cameraGroupRef = useRef<THREE.Group>(null);
  const targetRef = useRef(new THREE.Vector3(...target));
  const shakeRef = useRef({ intensity: 0, duration: 0 });

  // Camera shake effect
  const addCameraShake = (intensity: number, duration: number) => {
    shakeRef.current = { intensity, duration };
    
    gsap.to(shakeRef.current, {
      intensity: 0,
      duration: duration,
      ease: "power2.out"
    });
  };

  useEffect(() => {
    targetRef.current.set(...target);
  }, [target]);

  useEffect(() => {
    if (!camera) return;

    const tl = gsap.timeline();

    switch (animationPhase) {
      case 'intro':
        // Wide establishing shot
        tl.to(camera.position, {
          x: 0,
          y: 15,
          z: 40,
          duration: 2,
          ease: "power2.inOut"
        });
        tl.to(targetRef.current, {
          x: 0,
          y: 2,
          z: 0,
          duration: 2,
          ease: "power2.inOut"
        }, 0);
        break;

      case 'focus':
        // Zoom in on batsman
        tl.to(camera.position, {
          x: 3,
          y: 8,
          z: 15,
          duration: 1.5,
          ease: "power2.out"
        });
        tl.to(targetRef.current, {
          x: 0,
          y: 2.5,
          z: 0,
          duration: 1.5,
          ease: "power2.out"
        }, 0);
        break;

      case 'approach':
        // Follow ball approach - dynamic camera movement
        tl.to(camera.position, {
          x: -2,
          y: 4,
          z: 8,
          duration: 1,
          ease: "power2.inOut"
        });
        tl.to(targetRef.current, {
          x: 0,
          y: 2,
          z: -5,
          duration: 1,
          ease: "power2.inOut"
        }, 0);
        
        // Add dramatic camera movement following the ball
        tl.to(camera.position, {
          x: 1,
          y: 3,
          z: 5,
          duration: 1,
          ease: "power2.inOut"
        }, 0.5);
        break;

      case 'impact':
        // Close-up on impact with camera shake
        tl.to(camera.position, {
          x: 2,
          y: 2.5,
          z: 3,
          duration: 0.3,
          ease: "power4.out"
        });
        tl.to(targetRef.current, {
          x: 0.5,
          y: 2,
          z: 0,
          duration: 0.3,
          ease: "power4.out"
        }, 0);
        
        // Trigger camera shake on impact
        setTimeout(() => {
          addCameraShake(0.3, 0.5);
        }, 100);
        break;

      case 'celebration':
        // Pull back to show ball trajectory and batsman celebration
        tl.to(camera.position, {
          x: -5,
          y: 12,
          z: 20,
          duration: 1.5,
          ease: "power2.out"
        });
        tl.to(targetRef.current, {
          x: 0,
          y: 3,
          z: -10,
          duration: 1.5,
          ease: "power2.out"
        }, 0);
        
        // Slow zoom out for cinematic effect
        tl.to(camera.position, {
          x: 0,
          y: 20,
          z: 35,
          duration: 2,
          ease: "power1.out"
        }, 1);
        break;

      case 'text':
        // Final composition shot
        tl.to(camera.position, {
          x: 0,
          y: 25,
          z: 50,
          duration: 2,
          ease: "power1.inOut"
        });
        tl.to(targetRef.current, {
          x: 0,
          y: 5,
          z: 0,
          duration: 2,
          ease: "power1.inOut"
        }, 0);
        break;
    }
  }, [animationPhase, camera]);

  useFrame((state) => {
    if (!camera) return;

    // Apply camera shake
    if (shakeRef.current.intensity > 0) {
      const shake = shakeRef.current.intensity;
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
      camera.position.z += (Math.random() - 0.5) * shake;
    }

    // Smooth camera look-at with interpolation
    const currentTarget = new THREE.Vector3();
    camera.getWorldDirection(currentTarget);
    currentTarget.multiplyScalar(-1).add(camera.position);
    
    currentTarget.lerp(targetRef.current, 0.05);
    camera.lookAt(currentTarget);

    // Add subtle floating motion during static phases
    if (animationPhase === 'intro' || animationPhase === 'text') {
      camera.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      camera.position.x += Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }

    // Dynamic FOV changes for cinematic effect
    if (animationPhase === 'impact') {
      camera.fov = 65 + Math.sin(state.clock.elapsedTime * 10) * 5;
      camera.updateProjectionMatrix();
    } else if (animationPhase === 'approach') {
      camera.fov = 70 + Math.sin(state.clock.elapsedTime * 2) * 2;
      camera.updateProjectionMatrix();
    } else {
      // Return to default FOV
      const targetFov = animationPhase === 'text' ? 50 : 60;
      camera.fov += (targetFov - camera.fov) * 0.02;
      camera.updateProjectionMatrix();
    }
  });

  // Camera position helper for development
  useFrame(() => {
    if (process.env.NODE_ENV === 'development' && cameraGroupRef.current) {
      // Optional: Add a visual representation of camera path
    }
  });

  return (
    <group ref={cameraGroupRef}>
      {/* Optional: Camera path visualization for development */}
      {process.env.NODE_ENV === 'development' && (
        <mesh position={targetRef.current.toArray()}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#ff0000" wireframe />
        </mesh>
      )}
    </group>
  );
}