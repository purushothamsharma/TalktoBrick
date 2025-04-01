import { MenuItem, MenuCategory } from '../types';

// Enhanced menu data with nutritional info and customizations
export const menuData: MenuItem[] = [
  // Indian Menu
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    description: 'Tender tandoor-cooked chicken in rich tomato-butter gravy',
    price: 24.99,
    category: MenuCategory.indianCurries,
    spiceLevel: 'medium',
    cookingMethod: 'tandoor',
    nutrition: {
      calories: 550,
      protein: 32,
      carbs: 18,
      fat: 38,
      allergens: ['milk'],
      dietaryInfo: ['gluten-free']
    },
    ingredients: [
      'chicken thigh',
      'tomato',
      'butter',
      'cream',
      'fenugreek',
      'garam masala'
    ],
    customizationOptions: [
      {
        id: 'spice',
        name: 'Spice Level',
        options: ['mild', 'medium', 'spicy', 'indian_hot']
      },
      {
        id: 'butter',
        name: 'Butter Amount',
        options: ['regular', 'less', 'extra']
      }
    ],
    origin: 'Delhi, India',
    preparation_time: 25,
    popular: true
  },
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes',
    price: 16.99,
    category: MenuCategory.indianStarters,
    spiceLevel: 'medium',
    cookingMethod: 'grilled',
    nutrition: {
      calories: 385,
      protein: 10,
      carbs: 65,
      fat: 12,
      allergens: [],
      dietaryInfo: ['vegetarian', 'vegan', 'gluten-free']
    },
    ingredients: [
      'rice',
      'urad dal',
      'potato',
      'onion',
      'mustard seeds'
    ],
    customizationOptions: [
      {
        id: 'crispiness',
        name: 'Crispiness',
        options: ['regular', 'extra crispy']
      }
    ],
    origin: 'Karnataka, India',
    preparation_time: 20,
    popular: true
  },

  // Mexican Menu
  {
    id: 'birria-tacos',
    name: 'Birria Tacos',
    description: 'Slow-cooked beef tacos with consommé',
    price: 18.99,
    category: MenuCategory.mexicanTacos,
    spiceLevel: 'medium',
    cookingMethod: 'braised',
    nutrition: {
      calories: 480,
      protein: 28,
      carbs: 32,
      fat: 26,
      allergens: ['wheat'],
      dietaryInfo: []
    },
    ingredients: [
      'beef chuck',
      'dried chilies',
      'corn tortillas',
      'onion',
      'cilantro'
    ],
    customizationOptions: [
      {
        id: 'meat',
        name: 'Meat Amount',
        options: ['regular', 'extra meat']
      },
      {
        id: 'consomme',
        name: 'Consommé',
        options: ['on side', 'dipped']
      }
    ],
    origin: 'Jalisco, Mexico',
    preparation_time: 25,
    popular: true
  },

  // American Menu
  {
    id: 'classic-burger',
    name: 'Classic Burger',
    description: 'Angus beef patty with fresh toppings',
    price: 15.99,
    category: MenuCategory.BURGERS,
    spiceLevel: 'none',
    cookingMethod: 'grilled',
    nutrition: {
      calories: 650,
      protein: 35,
      carbs: 45,
      fat: 38,
      allergens: ['wheat', 'dairy'],
      dietaryInfo: []
    },
    ingredients: [
      'angus beef',
      'lettuce',
      'tomato',
      'onion',
      'cheese',
      'brioche bun'
    ],
    customizationOptions: [
      {
        id: 'doneness',
        name: 'Cooking Temperature',
        options: ['medium rare', 'medium', 'well done']
      },
      {
        id: 'cheese',
        name: 'Cheese Type',
        options: ['american', 'cheddar', 'swiss']
      }
    ],
    origin: 'USA',
    preparation_time: 15,
    popular: true
  }
];

// Export menu data for Rasa training
export const exportMenuForRasa = () => {
  return menuData.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    spiceLevel: item.spiceLevel,
    dietaryInfo: item.nutrition.dietaryInfo,
    allergens: item.nutrition.allergens,
    customizationOptions: item.customizationOptions?.map(opt => ({
      name: opt.name,
      options: opt.options
    }))
  }));
};