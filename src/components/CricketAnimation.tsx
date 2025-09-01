'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import { Stadium } from './3d/Stadium';
import { Batsman } from './3d/Batsman';
import { CricketBall } from './3d/CricketBall';
import { CricketBat } from './3d/CricketBat';
import { CameraController } from './3d/CameraController';
import { PostProcessingEffects } from './effects/PostProcessing';
import { TextReveal } from './ui/TextReveal';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimationState {
  phase: 'intro' | 'focus' | 'approach' | 'impact' | 'celebration' | 'text' | 'complete';
  progress: number;
}

export default function CricketAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: 'intro',
    progress: 0
  });
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Animation sequence timing
    const sequenceTimer = setTimeout(() => {
      if (animationState.phase === 'intro') {
        setAnimationState({ phase: 'focus', progress: 0 });
      } else if (animationState.phase === 'focus') {
        setAnimationState({ phase: 'approach', progress: 0 });
      } else if (animationState.phase === 'approach') {
        setAnimationState({ phase: 'impact', progress: 0 });
      } else if (animationState.phase === 'impact') {
        setAnimationState({ phase: 'celebration', progress: 0 });
      } else if (animationState.phase === 'celebration') {
        setAnimationState({ phase: 'text', progress: 0 });
        setShowText(true);
      } else if (animationState.phase === 'text') {
        setAnimationState({ phase: 'complete', progress: 100 });
      }
    }, 2000); // 2 seconds per phase

    return () => clearTimeout(sequenceTimer);
  }, [animationState.phase]);

  const fallback = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900 via-purple-900 to-black">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading 3D Scene...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas
        camera={{ 
          position: [0, 10, 30], 
          fov: 60,
          near: 0.1,
          far: 1000 
        }}
        shadows
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Physics World */}
          <Physics
            gravity={[0, -9.82, 0]}
            allowSleep={false}
            broadphase="SAP"
          >
            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[-10, 20, 10]}
              intensity={1.5}
              color="#FF8C42"
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-far={100}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
            
            {/* Spotlights for stadium effect */}
            <spotLight
              position={[20, 30, 20]}
              intensity={1.0}
              angle={0.3}
              penumbra={0.5}
              color="#FFE4B5"
              castShadow
            />
            <spotLight
              position={[-20, 30, 20]}
              intensity={1.0}
              angle={0.3}
              penumbra={0.5}
              color="#FFE4B5"
              castShadow
            />

            {/* 3D Components */}
            <Stadium animationPhase={animationState.phase} />
            <Batsman 
              animationPhase={animationState.phase}
              position={[0, 0, 0]}
            />
            <CricketBat 
              animationPhase={animationState.phase}
              position={[1.2, 1.8, -0.2]}
            />
            <CricketBall 
              animationPhase={animationState.phase}
              position={[0, 2, -20]}
            />
            
            {/* Camera Controller */}
            <CameraController 
              animationPhase={animationState.phase}
              target={animationState.phase === 'approach' ? [0, 2, -10] : [0, 1, 0]}
            />
          </Physics>

          {/* Environment */}
          <Environment 
            background={false}
            files={null}
            preset="sunset"
            ground={{
              height: 0,
              radius: 100,
              scale: 100,
            }}
          />

          {/* Post Processing Effects */}
          <PostProcessingEffects enabled={true} />
        </Suspense>
      </Canvas>

      {/* Text Reveal Overlay */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            <TextReveal 
              show={showText}
              onComplete={() => console.log('Text animation complete')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Progress Indicator (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-sm z-20">
          Phase: {animationState.phase} | Progress: {animationState.progress}%
        </div>
      )}
    </div>
  );
}