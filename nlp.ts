import nlp from 'compromise';
import Fuse from 'fuse.js';
import { MenuItem, MenuCategory } from '../types';

interface Intent {
  type: string;
  confidence: number;
  entities?: Record<string, any>;
}

interface BusinessTestingIntent {
  isBusinessOwner: boolean;
  testType?: 'simulation' | 'evaluation' | 'customization';
  language?: 'en' | 'es';
  cuisine?: string;
  businessType?: 'restaurant' | 'food_truck' | 'cafe';
  features?: string[];
}

export function detectBusinessTesting(text: string): BusinessTestingIntent | null {
  const lowerText = text.toLowerCase();

  // Business owner testing patterns
  const businessPatterns = {
    testing: ['test', 'try', 'simulate', 'mock', 'pretend', 'demo', 'example'],
    evaluation: ['evaluate', 'assess', 'review', 'check', 'see how', 'look like'],
    customization: ['make it', 'change', 'customize', 'adapt', 'sound like', 'feel like'],
    business: ['my restaurant', 'my food truck', 'my business', 'my cafe', 'my team'],
    simulation: ['customer', 'order', 'interaction', 'conversation', 'scenario']
  };

  // Check if any business pattern matches
  const isBusinessContext = Object.values(businessPatterns)
    .some(patterns => patterns.some(p => lowerText.includes(p)));

  if (!isBusinessContext) return null;

  // Determine test type
  let testType: 'simulation' | 'evaluation' | 'customization' | undefined;
  if (businessPatterns.simulation.some(p => lowerText.includes(p))) {
    testType = 'simulation';
  } else if (businessPatterns.evaluation.some(p => lowerText.includes(p))) {
    testType = 'evaluation';
  } else if (businessPatterns.customization.some(p => lowerText.includes(p))) {
    testType = 'customization';
  }

  // Detect language preference
  let language: 'en' | 'es' | undefined;
  if (lowerText.includes('spanish') || lowerText.includes('español')) {
    language = 'es';
  } else if (lowerText.includes('english')) {
    language = 'en';
  }

  // Detect cuisine type
  const cuisineTypes = {
    mexican: ['mexican', 'taco', 'burrito'],
    indian: ['indian', 'curry', 'biryani'],
    italian: ['italian', 'pizza', 'pasta'],
    american: ['american', 'burger', 'diner']
  };

  let cuisine: string | undefined;
  for (const [type, patterns] of Object.entries(cuisineTypes)) {
    if (patterns.some(p => lowerText.includes(p))) {
      cuisine = type;
      break;
    }
  }

  // Detect business type
  let businessType: 'restaurant' | 'food_truck' | 'cafe' | undefined;
  if (lowerText.includes('food truck')) {
    businessType = 'food_truck';
  } else if (lowerText.includes('cafe') || lowerText.includes('café')) {
    businessType = 'cafe';
  } else if (lowerText.includes('restaurant')) {
    businessType = 'restaurant';
  }

  // Detect requested features
  const featurePatterns = {
    ordering: ['order', 'menu', 'items'],
    payments: ['payment', 'transactions', 'billing'],
    analytics: ['analytics', 'reports', 'insights'],
    inventory: ['inventory', 'stock', 'supplies']
  };

  const features = Object.entries(featurePatterns)
    .filter(([_, patterns]) => patterns.some(p => lowerText.includes(p)))
    .map(([feature]) => feature);

  return {
    isBusinessOwner: true,
    testType,
    language,
    cuisine,
    businessType,
    features: features.length > 0 ? features : undefined
  };
}

interface OrderEntity {
  quantity?: number;
  size?: string;
  item: string;
  modifiers: string[];
}

export function extractFoodEntities(text: string): {
  orders: OrderEntity[];
  dishes: string[];
  category?: string;
  dietaryPreferences: string[];
  allergens: string[];
  intents: Intent[];
  confidence: number;
  isGreeting: boolean;
  cuisine?: string;
  spiceLevel?: string;
  temperature?: string;
  cookingStyle?: string;
  businessIntent?: {
    type: 'menu' | 'inventory' | 'analytics' | 'settings' | 'help';
    action?: string;
  };
} {
  const doc = nlp(text.toLowerCase());
  
  const result = {
    orders: [] as OrderEntity[],
    dishes: [] as string[],
    dietaryPreferences: [] as string[],
    allergens: [] as string[],
    intents: [] as Intent[],
    confidence: 0,
    isGreeting: false
  };

  // Business intents
  const businessTerms = {
    menu: ['menu', 'items', 'dishes', 'specials', 'pricing'],
    inventory: ['inventory', 'stock', 'supplies', 'ingredients', 'ordering'],
    analytics: ['sales', 'revenue', 'trends', 'reports', 'performance'],
    settings: ['settings', 'configuration', 'setup', 'preferences'],
    help: ['help', 'support', 'guide', 'tutorial', 'assistance']
  };

  for (const [intent, terms] of Object.entries(businessTerms)) {
    if (terms.some(term => text.toLowerCase().includes(term))) {
      result.businessIntent = {
        type: intent as 'menu' | 'inventory' | 'analytics' | 'settings' | 'help'
      };
      break;
    }
  }

  // Cuisine detection
  const cuisinePatterns = {
    indian: ['indian', 'desi', 'curry', 'masala', 'biryani', 'dosa', 'tandoori'],
    mexican: ['mexican', 'tacos', 'burrito', 'quesadilla', 'enchilada'],
    american: ['american', 'burger', 'fries', 'wings', 'hot dog'],
    italian: ['italian', 'pasta', 'pizza', 'risotto', 'lasagna'],
    chinese: ['chinese', 'dimsum', 'noodles', 'stir fry', 'dumpling']
  };

  for (const [cuisine, patterns] of Object.entries(cuisinePatterns)) {
    if (patterns.some(pattern => text.toLowerCase().includes(pattern))) {
      result.cuisine = cuisine;
      break;
    }
  }

  // Dietary preferences
  const dietaryTerms = {
    vegetarian: ['vegetarian', 'no meat', 'veg'],
    vegan: ['vegan', 'plant-based', 'dairy-free'],
    glutenFree: ['gluten-free', 'no gluten', 'celiac'],
    halal: ['halal', 'zabiha'],
    kosher: ['kosher', 'pareve'],
    jain: ['jain', 'no onion no garlic']
  };

  Object.entries(dietaryTerms).forEach(([pref, terms]) => {
    if (terms.some(term => text.toLowerCase().includes(term))) {
      result.dietaryPreferences.push(pref);
    }
  });

  // Menu items
  const menuItems = sampleMenu.map(item => ({
    name: item.name.toLowerCase(),
    aliases: item.aliases || [],
    category: item.category
  }));

  const fuse = new Fuse(menuItems, {
    keys: ['name', 'aliases'],
    threshold: 0.4
  });

  const words = text.toLowerCase().split(/\s+/);
  let currentOrder: Partial<OrderEntity> = {};
  
  words.forEach((word, index) => {
    const matches = fuse.search(word);
    if (matches.length > 0 && matches[0].score! < 0.4) {
      currentOrder.item = matches[0].item.name;
      result.dishes.push(matches[0].item.name);
      
      // Look for quantity
      const prevWord = words[index - 1];
      if (prevWord && /^\d+$/.test(prevWord)) {
        currentOrder.quantity = parseInt(prevWord);
      }
      
      // Look for modifiers
      const nextWords = words.slice(index + 1, index + 4);
      currentOrder.modifiers = nextWords.filter(w => 
        ['extra', 'less', 'no', 'with', 'without'].includes(w)
      );
      
      if (Object.keys(currentOrder).length > 0) {
        result.orders.push(currentOrder as OrderEntity);
        currentOrder = {};
      }
    }
  });

  result.confidence = calculateConfidence(result);
  return result;
}

function calculateConfidence(result: any): number {
  let score = 0;
  let factors = 0;

  if (result.orders.length > 0) {
    score += 0.8;
    factors++;
  }

  if (result.dietaryPreferences.length > 0) {
    score += 0.7;
    factors++;
  }

  if (result.businessIntent) {
    score += 0.9;
    factors++;
  }

  if (result.cuisine) {
    score += 0.6;
    factors++;
  }

  return factors > 0 ? score / factors : 0.5;
}

export function generateBusinessResponse(intent: string): string {
  const responses = {
    menu: `I can help you manage your menu:
1. View current menu items
2. Add new items
3. Update prices
4. Manage categories
5. Set specials

What would you like to do?`,

    inventory: `Let me help you with inventory:
1. Check stock levels
2. Track ingredients
3. Set reorder points
4. View usage reports
5. Manage suppliers

Which area interests you?`,

    analytics: `Here's what I can show you:
1. Sales trends
2. Popular items
3. Revenue analysis
4. Customer insights
5. Inventory turnover

What metrics would you like to see?`,

    settings: `I can help configure:
1. Business hours
2. Payment methods
3. Delivery options
4. User permissions
5. Notifications

What would you like to set up?`,

    help: `I'm here to help! I can assist with:
1. Using the platform
2. Training staff
3. Best practices
4. Troubleshooting
5. Feature guides

What do you need help with?`
  };

  return responses[intent as keyof typeof responses] || responses.help;
}