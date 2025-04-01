import { supabase } from './supabase';

export interface CALMConfig {
  model: 'gte-small' | 'gte-base' | 'gte-large';
  temperature: number;
  maxTokens: number;
}

export const calmConfig: CALMConfig = {
  model: 'gte-small',
  temperature: 0.7,
  maxTokens: 150
};

export const generateEmbeddings = async (text: string) => {
  const model = new Supabase.ai.Session('gte-small');
  return await model.run(text, { 
    mean_pool: true,
    normalize: true 
  });
};

export const generateResponse = async (
  prompt: string, 
  context?: Record<string, any>
) => {
  const model = new Supabase.ai.Session('gte-small');
  return await model.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are BFF (Brick For Food), an AI assistant for restaurants.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    ...calmConfig,
    context
  });
};

export const analyzeNutrition = async (text: string) => {
  const model = new Supabase.ai.Session('gte-small');
  return await model.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a nutrition expert. Analyze the following food item.'
      },
      {
        role: 'user',
        content: text
      }
    ],
    ...calmConfig
  });
};

export const generateMenuSuggestions = async (
  preferences: string[],
  restrictions: string[],
  context?: Record<string, any>
) => {
  const model = new Supabase.ai.Session('gte-small');
  return await model.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a culinary expert. Suggest menu items based on preferences and restrictions.'
      },
      {
        role: 'user',
        content: `Preferences: ${preferences.join(', ')}\nRestrictions: ${restrictions.join(', ')}`
      }
    ],
    ...calmConfig,
    context
  });
};