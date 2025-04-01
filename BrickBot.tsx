import React from 'react';
import { motion } from 'framer-motion';

interface BrickBotProps {
  size?: 'sm' | 'md' | 'lg';
  expression?: 'happy' | 'thinking' | 'surprised' | 'wink';
}

export function BrickBot({ size = 'md', expression = 'happy' }: BrickBotProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  // Head animation
  const headVariants = {
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Face animations
  const faceVariants = {
    happy: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    thinking: {
      rotate: [-1, 1, -1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    surprised: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    wink: {
      rotate: [-2, 0, -2],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className={`relative ${sizes[size]}`}
      variants={headVariants}
      animate="animate"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-rose-300/20 blur-xl rounded-full" />
      
      {/* Head */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-surface-50 to-surface-100 rounded-2xl shadow-luxury overflow-hidden"
        variants={faceVariants}
        animate={expression}
      >
        {/* Face texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(212,175,55,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
        
        {/* Face features */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {/* Eyes */}
          <div className="flex justify-center items-center gap-2 w-full">
            {/* Left eye */}
            <motion.div 
              className="w-1/5 h-1/5 bg-gradient-to-br from-brick-500 to-brick-600 rounded-full relative overflow-hidden"
              animate={expression === 'wink' ? { scaleY: [1, 0.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-[15%] bg-white rounded-full opacity-80" />
            </motion.div>
            
            {/* Right eye */}
            <motion.div 
              className="w-1/5 h-1/5 bg-gradient-to-br from-brick-500 to-brick-600 rounded-full relative overflow-hidden"
              animate={expression === 'wink' ? { scaleY: 1 } : {}}
            >
              <div className="absolute inset-[15%] bg-white rounded-full opacity-80" />
            </motion.div>
          </div>

          {/* Mouth */}
          <div className="mt-2">
            {expression === 'happy' && (
              <motion.div 
                className="w-8 h-1 bg-brick-500 rounded-full"
                animate={{ 
                  scaleX: [1, 1.2, 1],
                  scaleY: [1, 1.5, 1],
                  y: [0, -1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {expression === 'thinking' && (
              <motion.div 
                className="w-4 h-1 bg-brick-500 rounded-full"
                animate={{ 
                  rotate: [-10, 10, -10],
                  x: [-2, 2, -2]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {expression === 'surprised' && (
              <motion.div 
                className="w-3 h-3 bg-brick-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
            {expression === 'wink' && (
              <motion.div 
                className="w-6 h-1 bg-brick-500 rounded-full"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Highlight effects */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
        <div className="absolute inset-0 border border-surface-200 rounded-2xl" />
      </motion.div>
    </motion.div>
  );
}