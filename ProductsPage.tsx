import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot,
  MessageSquare,
  Brain,
  ChefHat,
  DollarSign,
  BarChart,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useBFFStore } from '../lib/store';

export function ProductsPage() {
  const { currentLanguage } = useBFFStore();

  const products = [
    {
      id: 'bff',
      name: 'BFF — Brick For Food',
      description: 'AI chatbot for orders and menu management',
      icon: <MessageSquare className="w-6 h-6" />,
      features: ['Natural language ordering', 'Menu recommendations', 'Dietary tracking'],
      price: 99,
      popular: true
    },
    {
      id: 'pos',
      name: 'Brick POS',
      description: 'Full point-of-sale with Square integration',
      icon: <ChefHat className="w-6 h-6" />,
      features: ['Square integration', 'Offline mode', 'Kitchen display'],
      price: 149,
      comingSoon: true
    },
    {
      id: 'dash',
      name: 'Brick Dash',
      description: 'Real-time analytics dashboard',
      icon: <BarChart className="w-6 h-6" />,
      features: ['Sales tracking', 'Menu performance', 'Customer insights'],
      price: 79
    },
    {
      id: 'pricebot',
      name: 'PriceBot',
      description: 'Dynamic pricing based on demand',
      icon: <DollarSign className="w-6 h-6" />,
      features: ['Rush hour pricing', 'Demand tracking', 'Revenue optimization'],
      price: 129
    },
    {
      id: 'prepbot',
      name: 'PrepBot',
      description: 'AI-powered prep forecasting',
      icon: <Brain className="w-6 h-6" />,
      features: ['Weather impact', 'Event detection', 'Waste reduction'],
      price: 149
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-brick-500" />
              <span className="text-xl font-bold">Brick</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link to="/demo/bff" className="btn-primary">Try Demo</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brick-500/10 px-4 py-2 rounded-full text-brick-500 font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Built with Rasa Pro + CALM
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-brick-950 mb-6">
            Complete Restaurant Management Suite
          </h1>
          
          <p className="text-xl text-brick-950/70 mb-10 max-w-2xl mx-auto">
            Transform your restaurant operations with our AI-powered tools
          </p>
        </div>
      </div>

      <div className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="relative card-lg">
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brick-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                {product.comingSoon && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Coming Soon
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brick-500/10 rounded-lg text-brick-500">
                    {product.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-brick-950">{product.name}</h3>
                    <p className="text-xl font-bold text-brick-500">
                      ${product.price}/mo
                    </p>
                  </div>
                </div>

                <p className="text-brick-950/70 mb-6">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-brick-950/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brick-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={product.comingSoon ? '/contact' : '/demo/bff'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {product.comingSoon ? 'Join Waitlist' : 'Try Demo'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brick-500 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your restaurant?
          </h2>
          <div className="flex justify-center gap-4">
            <Link to="/demo/bff" className="btn-primary bg-white text-brick-500">
              Try Demo
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}