import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot,
  MessageSquare,
  Brain,
  ChefHat,
  Clock,
  DollarSign,
  BarChart,
  ArrowRight,
  Sparkles,
  LineChart,
  ShoppingCart,
  Boxes,
  Users,
  Settings
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useBFFStore } from '../lib/store';

export function Homepage() {
  const { currentLanguage } = useBFFStore();

  const translations = {
    en: {
      title: "AI-Powered Restaurant Management System",
      subtitle: "Complete operations platform that manages orders, predicts demand, optimizes pricing, and boosts revenue — while you focus on creating amazing food.",
      tryDemo: "Try Demo",
      launchSystem: "Launch Your System",
      features: "Complete Management System",
      featuresSubtitle: "One platform to run your entire operation",
      aiTitle: "AI That Grows Your Business",
      aiSubtitle: "Built for scale and performance",
      readyTitle: "Ready to transform your restaurant?",
      readySubtitle: "Join restaurants using Brick to boost revenue and streamline operations",
      products: "Products"
    },
    es: {
      title: "Sistema de Gestión de Restaurantes con IA",
      subtitle: "Plataforma completa que gestiona pedidos, predice demanda, optimiza precios y aumenta ingresos — mientras te enfocas en crear comida increíble.",
      tryDemo: "Probar Demo",
      launchSystem: "Lanzar Tu Sistema",
      features: "Sistema de Gestión Completo",
      featuresSubtitle: "Una plataforma para toda tu operación",
      aiTitle: "IA que Hace Crecer tu Negocio",
      aiSubtitle: "Construido para escalar y rendir",
      readyTitle: "¿Listo para transformar tu restaurante?",
      readySubtitle: "Únete a los restaurantes que usan Brick para aumentar ingresos y optimizar operaciones",
      products: "Productos"
    },
    zh: {
      title: "AI驱动的餐厅管理系统",
      subtitle: "完整的运营平台，管理订单、预测需求、优化定价、提升收入 — 让您专注于创造美食。",
      tryDemo: "试用演示",
      launchSystem: "启动您的系统",
      features: "完整管理系统",
      featuresSubtitle: "一个平台运营所有业务",
      aiTitle: "助您业务增长的AI",
      aiSubtitle: "为规模化和性能而建",
      readyTitle: "准备好改变您的餐厅了吗？",
      readySubtitle: "加入使用Brick提升收入和优化运营的餐厅行列",
      products: "产品"
    }
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-brick-500" />
              <span className="text-xl font-bold ml-2">Brick</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link to="/products" className="text-brick-950 hover:text-brick-600 transition-colors">
                {t.products}
              </Link>
              <Link to="/demo/bff" className="hidden sm:block text-brick-950 hover:text-brick-600">
                {t.tryDemo}
              </Link>
              <Link to="/contact" className="btn-primary">
                {t.launchSystem}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-12 sm:py-24 bg-surface-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-brick-500/10 px-4 py-2 rounded-full text-brick-500 font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Built with Rasa Pro + CALM
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brick-950 mb-6">
            {t.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-brick-950/70 mb-10 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/demo/bff" className="btn-primary flex items-center justify-center gap-2">
              <Bot className="w-5 h-5" />
              {t.tryDemo}
            </Link>
            <Link to="/contact" className="btn-outline flex items-center justify-center gap-2">
              <ArrowRight className="w-5 h-5" />
              {t.launchSystem}
            </Link>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brick-950">{t.features}</h2>
            <p className="mt-4 text-lg text-brick-950/70">
              {t.featuresSubtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Order Management */}
            <div className="card-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brick-500/10 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold">Order Management</h3>
              </div>
              <ul className="space-y-3 text-brick-950/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Bilingual order taking (EN/ES)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Smart queue management
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Real-time kitchen updates
                </li>
              </ul>
            </div>

            {/* Dynamic Pricing */}
            <div className="card-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brick-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold">Dynamic Pricing</h3>
              </div>
              <ul className="space-y-3 text-brick-950/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Rush hour optimization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Demand-based pricing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Competitive analysis
                </li>
              </ul>
            </div>

            {/* AI Forecasting */}
            <div className="card-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brick-500/10 rounded-lg">
                  <Brain className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold">AI Forecasting</h3>
              </div>
              <ul className="space-y-3 text-brick-950/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Prep quantity predictions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Weather impact analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Event-based planning
                </li>
              </ul>
            </div>

            {/* Inventory Control */}
            <div className="card-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brick-500/10 rounded-lg">
                  <Boxes className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold">Inventory Control</h3>
              </div>
              <ul className="space-y-3 text-brick-950/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Auto reorder points
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Waste reduction
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Cost optimization
                </li>
              </ul>
            </div>

            {/* Analytics Dashboard */}
            <div className="card-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brick-500/10 rounded-lg">
                  <BarChart className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold">Analytics Dashboard</h3>
              </div>
              <ul className="space-y-3 text-brick-950/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Real-time sales tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Menu performance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Customer insights
                </li>
              </ul>
            </div>

            {/* Staff Management */}
            <div className="card-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brick-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold">Staff Management</h3>
              </div>
              <ul className="space-y-3 text-brick-950/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Smart scheduling
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Performance tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                  Task automation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Section */}
      <div className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-brick-950 mb-6">
                {t.aiTitle}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-brick-500/10 rounded-lg text-brick-500">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brick-950">Smart Revenue Optimization</h3>
                    <p className="text-brick-950/70">
                      AI-driven pricing adjusts automatically during peak hours, analyzes competitor prices, and maximizes your revenue without losing customers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-brick-500/10 rounded-lg text-brick-500">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brick-950">Kitchen Intelligence</h3>
                    <p className="text-brick-950/70">
                      Predicts prep quantities based on weather, local events, and historical data to minimize waste and ensure you're always ready for demand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000"
                alt="Restaurant kitchen"
                className="rounded-xl shadow-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brick-500 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.readyTitle}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {t.readySubtitle}
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/demo/bff" className="btn-primary bg-white text-brick-500">
              {t.tryDemo}
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white">
              {t.launchSystem}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-brick-950/60">
            Built with Rasa Pro + CALM · Powered by ViLa AI Labs
          </p>
          <p className="text-sm text-brick-950/40 mt-2">
            © 2024 ViLa Ventures. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}