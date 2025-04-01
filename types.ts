import { Message } from './types';

export enum MenuCategory {
  APPETIZERS = "appetizers",
  MAIN_COURSE = "main_course",
  DESSERTS = "desserts",
  BEVERAGES = "beverages",
  SIDES = "sides",
  SALADS = "salads",
  BURGERS = "burgers",
  PIZZA = "pizza",
  PASTA = "pasta",
  SEAFOOD = "seafood",
  STEAKS = "steaks",
  SANDWICHES = "sandwiches",
  MEXICAN = "mexican",
  INDIAN = "indian",
  CHINESE = "chinese",
  AMERICAN = "american",
  ITALIAN = "italian",
  indianCurries = "indianCurries",
  indianStarters = "indianStarters",
  indianBiryani = "indianBiryani",
  indianBreads = "indianBreads",
  indianDesserts = "indianDesserts",
  mexicanTacos = "mexicanTacos",
  italianSecundi = "italianSecundi"
}

export type SpiceLevel = 'none' | 'mild' | 'medium' | 'spicy' | 'extraSpicy';
export type CookingMethod = 'grilled' | 'fried' | 'baked' | 'steamed' | 'raw' | 'braised' | 'tandoor' | 'simmered' | 'dum';
export type DietaryRestriction = 'vegetarian' | 'vegan' | 'glutenFree' | 'dairyFree' | 'nutFree';
export type Allergen = 'nuts' | 'dairy' | 'gluten' | 'shellfish' | 'eggs' | 'soy' | 'fish';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language: string;
  menuItems?: MenuItem[];
  custom?: Record<string, any>;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  spiceLevel?: SpiceLevel;
  cookingMethod?: CookingMethod;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    allergens: Allergen[];
    dietaryInfo: DietaryRestriction[];
  };
  ingredients: string[];
  customizationOptions?: {
    id: string;
    name: string;
    options: string[];
    price?: number;
    affects?: {
      calories?: number;
      allergens?: Allergen[];
      dietaryInfo?: DietaryRestriction[];
    };
  }[];
  aliases?: string[];
  pairings?: {
    wine?: {
      varietal: string;
      description: string;
      origin: string;
      body: string;
      price: number;
    }[];
  };
  origin?: string;
  preparation_time?: number;
  popular?: boolean;
  awards?: string[];
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  totalPrice: number;
  customizations: Record<string, string>;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'draft' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  confirmed_at?: Date;
  specialInstructions?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: Date;
  };
  preferences?: {
    spiceLevel?: SpiceLevel;
    dietaryRestrictions?: DietaryRestriction[];
    allergens?: Allergen[];
    favoriteCuisines?: string[];
    favoriteItems?: string[];
  };
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

export interface OrderStats {
  daily: number;
  weekly: number;
  monthly: number;
  averageOrderValue: number;
}

export interface UserStats {
  total: number;
  active: number;
  newThisMonth: number;
  churnRate: number;
}

export interface RevenueStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearToDate: number;
}

export const sampleMenu: MenuItem[] = [
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
  }
];