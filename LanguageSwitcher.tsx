import React from 'react';
import { Globe } from 'lucide-react';
import { useBFFStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useBFFStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = {
    en: 'English',
    es: 'Español',
    zh: '中文'
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-50 hover:bg-surface-100 text-brick-950/70 hover:text-brick-950 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {languages[currentLanguage as keyof typeof languages]}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentLanguage.toUpperCase()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-luxury border border-surface-200 overflow-hidden z-50"
          >
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === code
                    ? 'bg-brick-500/10 text-brick-500'
                    : 'hover:bg-surface-50 text-brick-950/70 hover:text-brick-950'
                }`}
              >
                {name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}