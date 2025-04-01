import { describe, it, expect } from 'vitest';
import { extractFoodEntities, getClarificationPrompt, generateFollowUp } from '../../lib/nlp';
import { MenuItem, MenuCategory } from '../../types';

describe('NLP Functions', () => {
  describe('extractFoodEntities', () => {
    it('extracts dish names', () => {
      const result = extractFoodEntities('I want a ribeye steak and a burger');
      expect(result.dishes).toContain('steak');
      expect(result.dishes).toContain('burger');
    });

    it('detects dietary preferences', () => {
      const result = extractFoodEntities('Do you have any vegetarian options?');
      expect(result.category).toBe('vegetarian');
    });

    it('identifies wine pairing requests', () => {
      const result = extractFoodEntities('What wine goes well with steak?');
      expect(result.category).toBe('wine');
      expect(result.dishes).toContain('steak');
    });
  });

  describe('getClarificationPrompt', () => {
    it('handles greetings', () => {
      const entities = extractFoodEntities('hello');
      const prompt = getClarificationPrompt(entities);
      expect(prompt).toContain('Hello!');
      expect(prompt).toContain('help you');
    });

    it('suggests dishes for categories', () => {
      const entities = {
        dishes: [],
        category: MenuCategory.steaks,
        customizations: [],
        intents: [{ type: 'menu', confidence: 0.8 }],
        confidence: 0.8,
        isGreeting: false
      };
      const prompt = getClarificationPrompt(entities);
      expect(prompt).toContain(MenuCategory.steaks);
    });
  });

  describe('generateFollowUp', () => {
    it('suggests wine pairings with steaks', () => {
      const items: MenuItem[] = [{
        id: 'steak-1',
        name: 'Ribeye Steak',
        description: 'Prime cut ribeye',
        price: 42.99,
        category: MenuCategory.steaks,
        nutrition: {
          calories: 850,
          protein: 65,
          carbs: 0,
          fat: 45,
          allergens: [],
          dietaryInfo: ['low-carb']
        }
      }];

      const followUp = generateFollowUp(items);
      expect(followUp).toContain('wine');
    });
  });
});