'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRevealProps {
  show: boolean;
  onComplete?: () => void;
}

export function TextReveal({ show, onComplete }: TextRevealProps) {
  const [currentPhase, setCurrentPhase] = useState<'hidden' | 'overlay' | 'tanish' | 'creates' | 'complete'>('hidden');

  useEffect(() => {
    if (!show) return;

    const sequence = async () => {
      // Phase 1: Show dark overlay
      setCurrentPhase('overlay');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Phase 2: Show "TANISH"
      setCurrentPhase('tanish');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Phase 3: Show "CREATES"
      setCurrentPhase('creates');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Phase 4: Complete
      setCurrentPhase('complete');
      onComplete && onComplete();
    };

    sequence();
  }, [show, onComplete]);

  if (!show && currentPhase === 'hidden') return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <AnimatePresence>
        {(currentPhase !== 'hidden') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 text-center">
        <AnimatePresence>
          {(currentPhase === 'tanish' || currentPhase === 'creates' || currentPhase === 'complete') && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                damping: 12
              }}
              className="mb-4"
            >
              <h1 className="text-8xl md:text-9xl font-black text-white tracking-wider">
                <motion.span
                  initial={{ textShadow: "0 0 0px rgba(255,255,255,0)" }}
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(255,255,255,0.8)",
                      "0 0 30px rgba(255,255,255,0.6)",
                      "0 0 10px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                >
                  TANISH
                </motion.span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(currentPhase === 'creates' || currentPhase === 'complete') && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ 
                duration: 1,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-gray-200 tracking-widest">
                <motion.span
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: [0.7, 1, 0.9, 1] }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(45deg, #e0e0e0, #ffffff, #e0e0e0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  CREATES
                </motion.span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <AnimatePresence>
          {(currentPhase === 'creates' || currentPhase === 'complete') && (
            <>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                className="w-32 h-0.5 bg-white mx-auto mt-8 mb-4"
                style={{
                  background: 'linear-gradient(90deg, transparent, white, transparent)'
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
                className="text-gray-400 text-lg font-light tracking-wide"
              >
                Cinematic Cricket Experience
              </motion.p>
            </>
          )}
        </AnimatePresence>

        {/* Particles effect */}
        <AnimatePresence>
          {(currentPhase === 'tanish' || currentPhase === 'creates' || currentPhase === 'complete') && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  animate={{ 
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 600 - 300,
                    y: Math.random() * 600 - 300
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.random() * 2
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    filter: 'blur(0.5px)',
                    boxShadow: '0 0 6px rgba(255,255,255,0.8)'
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}