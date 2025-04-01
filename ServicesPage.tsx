import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Bot,
  Brain,
  ChefHat,
  Globe,
  DollarSign,
  Settings,
  MessageSquare,
  BarChart,
  Users,
  Clock,
  Shield,
  Sparkles,
  Zap,
  LineChart,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BrickBot } from './BrickBot';

export function ServicesPage() {
  const services = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Food Concierge",
      description: "Multilingual AI assistant that handles orders, recommendations, and customer service",
      features: [
        "Natural language ordering in English & Spanish",
        "Smart menu recommendations",
        "Dietary preference tracking",
        "Real-time order customization",
        "Allergy awareness & warnings",
        "24/7 customer support"
      ]
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Restaurant Management",
      description: "Complete restaurant operations platform powered by AI",
      features: [
        "Inventory optimization & forecasting",
        "Dynamic pricing strategies",
        "Staff scheduling & management",
        "Kitchen display system",
        "Table management",
        "Reservation system"
      ]
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Intelligent POS System",
      description: "Next-generation point of sale with AI-powered insights",
      features: [
        "One-click reordering",
        "Smart upselling suggestions",
        "Multi-location support",
        "Offline mode capability",
        "Mobile POS options",
        "Integrated payments"
      ]
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Data-driven insights for better business decisions",
      features: [
        "Real-time sales tracking",
        "Customer behavior analysis",
        "Menu performance metrics",
        "Predictive analytics",
        "Competitor insights",
        "Custom reporting"
      ]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Customer Engagement",
      description: "Build lasting relationships with your customers",
      features: [
        "Loyalty program management",
        "Personalized marketing",
        "Review management",
        "Customer feedback analysis",
        "Social media integration",
        "Email marketing automation"
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Digital Presence",
      description: "Comprehensive online presence management",
      features: [
        "Custom branded website",
        "Mobile ordering app",
        "Online menu management",
        "SEO optimization",
        "Social media management",
        "Google Business integration"
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant with end-to-end encryption"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Dedicated enterprise support team"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Integration",
      description: "Go live in days, not months"
    }
  ];

  const techStack = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Rasa Pro + CALM",
      description: "Enterprise-grade conversational AI"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Custom ML Models",
      description: "Tailored to restaurant operations"
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Powered by streaming data"
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-brick-950/60 hover:text-brick-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/demo/bff"
                className="btn-primary"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-surface-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <BrickBot size="lg" expression="happy" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-brick-950 sm:text-5xl"
            >
              Complete Restaurant AI Solution
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-xl text-brick-950/70 max-w-2xl mx-auto"
            >
              Transform your restaurant operations with AI-powered solutions that drive efficiency, increase revenue, and delight customers
            </motion.p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-lg hover:translate-y-[-8px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-brick-500/10 text-brick-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brick-950">{service.title}</h3>
                </div>
                <p className="text-brick-950/70 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-brick-950/70">
                      <Sparkles className="w-4 h-4 text-brick-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brick-950">Enterprise-Grade Technology</h2>
            <p className="mt-4 text-lg text-brick-950/70">Built for reliability and scale</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...features, ...techStack].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-xl shadow-luxury text-brick-500">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-brick-950 mb-2">{feature.title}</h3>
                <p className="text-brick-950/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brick-500 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to transform your restaurant?
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                to="/demo/bff"
                className="btn-primary bg-white text-brick-500 hover:bg-surface-50"
              >
                Try Demo
              </Link>
              <Link
                to="/contact"
                className="btn-outline border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}