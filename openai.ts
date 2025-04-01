import OpenAI from 'openai';
import { sampleMenu } from '../types';
import { extractFoodEntities } from './nlp';
import { useBFFStore } from './store';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function getSystemPrompt(restaurantContext: any = null, businessTesting: any = null) {
  let prompt = `You are BFF (Brick For Food), an AI assistant with expertise in restaurant operations and food ordering.`;

  if (businessTesting?.isBusinessOwner) {
    prompt += `\n\nI detect you're evaluating BFF for your business. I'll demonstrate how I can help with:`;
    
    if (businessTesting.features) {
      prompt += `\n- ${businessTesting.features.join('\n- ')}`;
    }
    
    if (businessTesting.testType === 'simulation') {
      prompt += `\n\nI'll simulate a natural customer interaction`;
      if (businessTesting.language === 'es') {
        prompt += ` in Spanish`;
      }
    }
    
    if (businessTesting.cuisine) {
      prompt += `\n\nI'll adapt my responses to match ${businessTesting.cuisine} cuisine style and terminology.`;
    }
  }

  if (restaurantContext) {
    prompt += `\n\nYou are currently assisting ${restaurantContext.name}, a ${restaurantContext.type} specializing in ${restaurantContext.cuisine} cuisine.\n\n${restaurantContext.description}\n\nSpecialties: ${restaurantContext.specialties.join(', ')}`;
  }

  prompt += `\n\nComplete Menu Details:\n${JSON.stringify(sampleMenu, null, 2)}`;

  return prompt;
}

const FALLBACK_RESPONSES = {
  API_ERROR: "I apologize, but I'm having trouble connecting right now. Could you please try again?",
  RATE_LIMIT: "I apologize, but we're experiencing high demand right now. I'll be able to help you better in a moment.",
  TIMEOUT: "I apologize for the delay. I'd love to help you find what you're looking for. Could you please try again?"
};

export async function generateResponse(
  message: string,
  context: string,
  emotion: string,
  language: string,
  userId: string,
  restaurantContext: any = null,
  businessTesting: any = null
): Promise<{ content: string; menuItems?: typeof sampleMenu }> {
  try {
    const entities = extractFoodEntities(message);
    
    let conversationContext = context
      ? `Previous conversation:\n${context}\n\nCurrent message: ${message}`
      : message;

    const store = useBFFStore.getState();
    if (store.currentOrder.items.length > 0) {
      conversationContext += '\n\nCurrent Order:\n' + JSON.stringify(store.currentOrder.items);
    }

    const response = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(restaurantContext, businessTesting)
          },
          {
            role: "user",
            content: conversationContext
          }
        ],
        temperature: businessTesting ? 0.8 : 0.7,
        max_tokens: 500
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 15000)
      )
    ]);

    if (typeof response === 'object' && 'choices' in response) {
      const content = response.choices[0].message.content || 
        "I'd be happy to help you order food! What would you like to try?";

      const menuItems = entities.dishes.length > 0 || entities.category
        ? sampleMenu.filter(item => {
            if (entities.category) {
              return item.category.toLowerCase() === entities.category.toLowerCase();
            }
            return entities.dishes.some(dish => 
              item.name.toLowerCase().includes(dish.toLowerCase()) ||
              item.description.toLowerCase().includes(dish.toLowerCase())
            );
          }).slice(0, 3)
        : undefined;

      return { content, menuItems };
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Error generating response:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return { content: FALLBACK_RESPONSES.RATE_LIMIT };
      }
      return { content: FALLBACK_RESPONSES.API_ERROR };
    }

    if (error.message === 'TIMEOUT') {
      return { content: FALLBACK_RESPONSES.TIMEOUT };
    }

    return {
      content: "I'd be happy to help you order food! What would you like to try?",
      menuItems: sampleMenu.slice(0, 3)
    };
  }
}