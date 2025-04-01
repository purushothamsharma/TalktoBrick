import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { BrickBot } from './BrickBot';

export function WelcomeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Show welcome message after 1 second
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasBeenShown(true);
    }, 1000);

    // Start pulsing animation after welcome message is closed
    const pulseTimer = setTimeout(() => {
      setIsPulsing(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  return (
    <>
      {/* Welcome Message */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-luxury p-6 max-w-sm z-50"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <BrickBot size="sm" expression="happy" />
              </div>
              <div>
                <h3 className="font-bold text-brick-950 mb-2">Welcome to Brick! 👋</h3>
                <p className="text-sm text-brick-950/70 mb-4">
                  I'm your AI food assistant. I can help you with orders, menu recommendations, and more!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-primary py-2 px-4 text-sm flex items-center gap-1"
                  >
                    Let's Chat
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-outline py-2 px-4 text-sm"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Animations */}
      {hasBeenShown && !isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          animate={isPulsing ? {
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, -10, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-4 bg-brick-500 text-white rounded-full shadow-luxury hover:shadow-luxury-xl transition-shadow"
          >
            <MessageSquare className="w-6 h-6" />
            
            {/* Sparkle Effects */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Sparkles className="w-4 h-4 text-gold-500" />
            </motion.div>
          </button>
        </motion.div>
      )}
    </>
  );
}