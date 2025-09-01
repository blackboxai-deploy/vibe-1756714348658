'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import the 3D component to avoid SSR issues
const CricketAnimation = dynamic(() => import('../components/CricketAnimation'), {
  ssr: false,
  loading: () => <LoadingScreen />
});

function LoadingScreen() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-orange-900 via-purple-900 to-black flex items-center justify-center">
      <motion.div 
        className="text-center text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="mb-8">
          <motion.div 
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          TANISH CREATES
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Loading Cricket Animation...
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowAnimation(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-full h-screen relative overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <CricketAnimation />
        </motion.div>
      )}

      {/* Controls overlay - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-40 bg-black bg-opacity-50 p-4 rounded-lg">
          <button 
            onClick={() => {
              setIsLoading(true);
              setShowAnimation(false);
              setTimeout(() => {
                setIsLoading(false);
                setShowAnimation(true);
              }, 1000);
            }}
            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all"
          >
            Replay Animation
          </button>
        </div>
      )}
    </main>
  );
}