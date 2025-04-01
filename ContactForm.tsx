import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MessageSquare,
  Globe2,
  DollarSign,
  Bot,
  Users,
  ChefHat,
  Brain,
  BarChart,
  Clock,
  Shield
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { BrickBot } from './BrickBot';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    locations: '1',
    budget: 'unknown',
    industry: 'restaurant',
    role: '',
    currentSolution: '',
    timeline: 'exploring'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('enterprise_leads')
        .insert([{
          ...formData,
          status: 'new',
          source: 'website'
        }]);

      if (error) throw error;

      toast.success('Thank you for your interest!', {
        description: 'Our enterprise team will contact you within 24 hours.'
      });
      
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        locations: '1',
        budget: 'unknown',
        industry: 'restaurant',
        role: '',
        currentSolution: '',
        timeline: 'exploring'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form', {
        description: 'Please try again or contact us directly at enterprise@brick.ai'
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Operations",
      description: "Natural language ordering and smart menu optimization"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Real-time insights and performance tracking"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Location Support",
      description: "Centralized management for all your restaurants"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Dedicated enterprise support team"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant infrastructure"
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Kitchen Integration",
      description: "Seamless POS and kitchen display integration"
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
              <Bot className="w-8 h-8 text-brick-500" />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-luxury rounded-2xl p-8"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-brick-950">Contact Enterprise Sales</h1>
                <p className="mt-2 text-brick-950/70">
                  Transform your restaurant group with AI-powered operations.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Contact Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-brick-950 mb-4">Contact Information</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Full Name
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="John Smith"
                          />
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Work Email
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="john@company.com"
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Phone Number
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="+1 (555) 000-0000"
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-brick-950 mb-4">Company Information</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Company Name
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="text"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="Company Inc."
                          />
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Your Role
                        </label>
                        <div className="mt-1 relative">
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            className="input-field pl-10"
                          >
                            <option value="">Select your role</option>
                            <option value="owner">Owner/Founder</option>
                            <option value="executive">Executive (C-Level, VP)</option>
                            <option value="manager">Restaurant Manager</option>
                            <option value="operations">Operations Manager</option>
                            <option value="it">IT Manager</option>
                            <option value="other">Other</option>
                          </select>
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Number of Locations
                        </label>
                        <div className="mt-1 relative">
                          <select
                            value={formData.locations}
                            onChange={(e) => setFormData(prev => ({ ...prev, locations: e.target.value }))}
                            className="input-field pl-10"
                          >
                            <option value="1">1 Location</option>
                            <option value="2-5">2-5 Locations</option>
                            <option value="6-10">6-10 Locations</option>
                            <option value="11-20">11-20 Locations</option>
                            <option value="20+">20+ Locations</option>
                          </select>
                          <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Current Solution
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="text"
                            value={formData.currentSolution}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentSolution: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="What systems do you currently use?"
                          />
                          <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h2 className="text-lg font-semibold text-brick-950 mb-4">Project Details</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Implementation Timeline
                        </label>
                        <div className="mt-1 relative">
                          <select
                            value={formData.timeline}
                            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                            className="input-field pl-10"
                          >
                            <option value="exploring">Just Exploring</option>
                            <option value="1-3">1-3 Months</option>
                            <option value="3-6">3-6 Months</option>
                            <option value="6-12">6-12 Months</option>
                            <option value="asap">As Soon As Possible</option>
                          </select>
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Monthly Budget
                        </label>
                        <div className="mt-1 relative">
                          <select
                            value={formData.budget}
                            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                            className="input-field pl-10"
                          >
                            <option value="unknown">I'm not sure yet</option>
                            <option value="500-1000">$500 - $1,000</option>
                            <option value="1000-2000">$1,000 - $2,000</option>
                            <option value="2000-5000">$2,000 - $5,000</option>
                            <option value="5000+">$5,000+</option>
                          </select>
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brick-950">
                          Message
                        </label>
                        <div className="mt-1 relative">
                          <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="Tell us about your business and requirements..."
                          />
                          <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-brick-950/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Information Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 lg:mt-0"
            >
              <div className="bg-white shadow-luxury rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <BrickBot size="md" expression="happy" />
                  <div>
                    <h2 className="text-2xl font-bold text-brick-950">Enterprise Features</h2>
                    <p className="text-brick-950/70">Built for scale and performance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                      className="p-4 bg-surface-50 rounded-xl border border-surface-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-brick-500/10 rounded-lg text-brick-500">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-brick-950">{feature.title}</h3>
                          <p className="text-sm text-brick-950/70">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-surface-50 rounded-xl border border-surface-200">
                  <h3 className="text-lg font-semibold text-brick-950 mb-4">Why Choose Brick Enterprise?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-brick-950/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                      95% reduction in order errors
                    </li>
                    <li className="flex items-center gap-2 text-brick-950/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                      30% increase in average order value
                    </li>
                    <li className="flex items-center gap-2 text-brick-950/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                      24/7 dedicated enterprise support
                    </li>
                    <li className="flex items-center gap-2 text-brick-950/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                      Custom integrations & API access
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}