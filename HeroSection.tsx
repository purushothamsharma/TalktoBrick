import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot,
  MessageSquare,
  Globe,
  Sparkles,
  Brain,
  ChefHat,
  Clock,
  Users
} from 'lucide-react';
import { BrickBot } from './BrickBot';

export function HeroSection() {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-50 via-brick-50/30 to-surface-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold-200/20 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <BrickBot size="lg" expression="happy" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brick-50 px-3 py-1 text-sm font-semibold text-brick-600 ring-1 ring-inset ring-brick-500/20">
              <Sparkles className="w-4 h-4" />
              Rasa Challenge Submission 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-4xl font-bold tracking-tight text-brick-950 sm:text-6xl"
          >
            Meet BFF — Brick For Food
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-lg text-brick-950/70 max-w-2xl mx-auto"
          >
            Your AI-powered food truck assistant. Streamline ordering, boost sales, and delight customers with personalized recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              to="/demo/bff"
              className="btn-primary"
            >
              Try BFF Demo
            </Link>
            <Link
              to="/contact"
              className="btn-outline"
            >
              Contact Sales <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Feature 1: AI-Powered Ordering */}
          <div className="card-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-brick-500/10 text-brick-500">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brick-950">AI-Powered Ordering</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <MessageSquare className="w-4 h-4 text-brick-500" />
                Natural language processing
              </li>
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Globe className="w-4 h-4 text-brick-500" />
                Multi-language support
              </li>
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Sparkles className="w-4 h-4 text-brick-500" />
                Smart recommendations
              </li>
            </ul>
          </div>

          {/* Feature 2: Kitchen Management */}
          <div className="card-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-brick-500/10 text-brick-500">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brick-950">Kitchen Management</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Clock className="w-4 h-4 text-brick-500" />
                Real-time order tracking
              </li>
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Bot className="w-4 h-4 text-brick-500" />
                Automated alerts
              </li>
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Users className="w-4 h-4 text-brick-500" />
                Staff management
              </li>
            </ul>
          </div>

          {/* Feature 3: Business Intelligence */}
          <div className="card-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-brick-500/10 text-brick-500">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brick-950">Business Intelligence</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Brain className="w-4 h-4 text-brick-500" />
                Sales predictions
              </li>
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Users className="w-4 h-4 text-brick-500" />
                Customer insights
              </li>
              <li className="flex items-center gap-2 text-sm text-brick-950/70">
                <Sparkles className="w-4 h-4 text-brick-500" />
                Menu optimization
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}