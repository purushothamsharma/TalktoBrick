import React, { useState } from 'react';
import { useBFFStore } from '../lib/store';
import { Bot, Check, MessageSquare, Brain, ChefHat, Settings, Globe } from 'lucide-react';

interface RestaurantSetupProps {
  onComplete: () => void;
}

const translations = {
  en: {
    welcome: "Welcome to Brick",
    description: "I'm your AI restaurant assistant. Let me help you set up your business profile.",
    chatWithMe: "Chat with Me",
    quickSetup: "Quick Setup",
    restaurantSetup: "Restaurant Setup",
    chatWithBrick: "Chat with Brick",
    businessName: "Business Name",
    businessType: "Business Type",
    cuisineType: "Cuisine Type",
    specialties: "Specialties (comma-separated)",
    businessDescription: "Business Description",
    completeSetup: "Complete Setup",
    tellAboutBusiness: "Tell me about your business...",
    placeholderName: "e.g., Joe's Diner",
    placeholderCuisine: "e.g., Mexican, Indian, American",
    placeholderSpecialties: "e.g., Tacos al Pastor, Guacamole, Churros",
    placeholderDescription: "Tell us about your business..."
  },
  es: {
    welcome: "Bienvenido a Brick",
    description: "Soy tu asistente de restaurante AI. Permíteme ayudarte a configurar tu perfil comercial.",
    chatWithMe: "Chatear conmigo",
    quickSetup: "Configuración rápida",
    restaurantSetup: "Configuración del restaurante",
    chatWithBrick: "Chatear con Brick",
    businessName: "Nombre del negocio",
    businessType: "Tipo de negocio",
    cuisineType: "Tipo de cocina",
    specialties: "Especialidades (separadas por comas)",
    businessDescription: "Descripción del negocio",
    completeSetup: "Completar configuración",
    tellAboutBusiness: "Cuéntame sobre tu negocio...",
    placeholderName: "ej., Restaurante de Joe",
    placeholderCuisine: "ej., Mexicana, India, Americana",
    placeholderSpecialties: "ej., Tacos al Pastor, Guacamole, Churros",
    placeholderDescription: "Cuéntanos sobre tu negocio..."
  },
  zh: {
    welcome: "欢迎使用 Brick",
    description: "我是您的AI餐厅助手。让我帮您设置业务档案。",
    chatWithMe: "与我聊天",
    quickSetup: "快速设置",
    restaurantSetup: "餐厅设置",
    chatWithBrick: "与 Brick 聊天",
    businessName: "商家名称",
    businessType: "商家类型",
    cuisineType: "菜系类型",
    specialties: "特色菜品（用逗号分隔）",
    businessDescription: "商家描述",
    completeSetup: "完成设置",
    tellAboutBusiness: "告诉我关于您的业务...",
    placeholderName: "例如：小王餐厅",
    placeholderCuisine: "例如：中餐、墨西哥菜、美式",
    placeholderSpecialties: "例如：北京烤鸭、宫保鸡丁、麻婆豆腐",
    placeholderDescription: "告诉我们关于您的业务..."
  }
};

export function RestaurantSetup({ onComplete }: RestaurantSetupProps) {
  const { currentLanguage, setLanguage } = useBFFStore();
  const t = translations[currentLanguage as keyof typeof translations];
  const [step, setStep] = useState<'welcome' | 'chat' | 'form'>('welcome');
  const [formData, setFormData] = useState({
    name: '',
    type: 'restaurant',
    cuisine: '',
    specialties: '',
    description: '',
    businessHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' }
    }
  });

  const [chatInput, setChatInput] = useState('');
  const [conversation, setConversation] = useState<Array<{
    text: string;
    sender: 'user' | 'ai';
  }>>([{
    text: "Hi! I'm Brick, your AI restaurant assistant. Tell me about your business and I'll help you get set up. What kind of restaurant or food business do you run?",
    sender: 'ai'
  }]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setConversation(prev => [...prev, { text: chatInput, sender: 'user' }]);

    const input = chatInput.toLowerCase();
    const newFormData = { ...formData };

    if (input.includes('food truck')) newFormData.type = 'food_truck';
    else if (input.includes('cafe') || input.includes('café')) newFormData.type = 'cafe';

    const cuisineTypes = ['mexican', 'indian', 'italian', 'chinese', 'american', 'japanese', 'thai'];
    for (const cuisine of cuisineTypes) {
      if (input.includes(cuisine)) {
        newFormData.cuisine = cuisine;
        break;
      }
    }

    setFormData(newFormData);

    let response = '';
    if (!formData.name) {
      response = "Great! What's the name of your business?";
    } else if (!formData.cuisine) {
      response = "What type of cuisine do you serve?";
    } else if (!formData.specialties) {
      response = "What are your signature dishes or specialties?";
    } else {
      response = "Perfect! I've gathered enough information. Let's review and finalize your setup.";
      setStep('form');
    }

    setTimeout(() => {
      setConversation(prev => [...prev, { text: response, sender: 'ai' }]);
    }, 500);

    setChatInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    useBFFStore.getState().setRestaurantContext({
      ...formData,
      specialties: formData.specialties.split(',').map(s => s.trim())
    });
    
    onComplete();
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <div className="flex justify-end mb-4">
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-2 py-1 flex items-center gap-2"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
            </select>
          </div>
          
          <div className="text-center">
            <Bot className="w-16 h-16 text-brick-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{t.welcome}</h1>
            <p className="text-brick-950/70 mb-8">{t.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStep('chat')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                {t.chatWithMe}
              </button>
              <button
                onClick={() => setStep('form')}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                {t.quickSetup}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'chat') {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col">
        <div className="flex items-center gap-4 p-4 bg-white border-b border-surface-200">
          <Bot className="w-8 h-8 text-brick-500" />
          <div>
            <h1 className="font-bold">{t.restaurantSetup}</h1>
            <p className="text-sm text-brick-950/60">{t.chatWithBrick}</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  msg.sender === 'user'
                    ? 'bg-brick-500 text-white'
                    : 'bg-white text-brick-950 border border-surface-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-surface-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="input-field flex-1"
              placeholder={t.tellAboutBusiness}
            />
            <button type="submit" className="btn-primary p-3">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Bot className="w-8 h-8 text-brick-500" />
          <h1 className="text-2xl font-bold">{t.restaurantSetup}</h1>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-luxury p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-brick-950 mb-2">
              {t.businessName}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder={t.placeholderName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brick-950 mb-2">
              {t.businessType}
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="input-field"
            >
              <option value="restaurant">Restaurant</option>
              <option value="food_truck">Food Truck</option>
              <option value="cafe">Café</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brick-950 mb-2">
              {t.cuisineType}
            </label>
            <input
              type="text"
              required
              value={formData.cuisine}
              onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
              className="input-field"
              placeholder={t.placeholderCuisine}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brick-950 mb-2">
              {t.specialties}
            </label>
            <input
              type="text"
              required
              value={formData.specialties}
              onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
              className="input-field"
              placeholder={t.placeholderSpecialties}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brick-950 mb-2">
              {t.businessDescription}
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-field"
              rows={4}
              placeholder={t.placeholderDescription}
            />
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            {t.completeSetup}
          </button>
        </form>
      </div>
    </div>
  );
}