import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { Message, Conversation, UserProfile, OrderItem, Order, MenuItem } from '../types';
import { saveOrder, getLastOrder, getOrderHistory } from './supabase';
import { toast } from 'sonner';

interface BFFState {
  messages: Message[];
  conversations: Conversation[];
  userProfile: UserProfile | null;
  currentLanguage: string;
  isTyping: boolean;
  restaurantContext: {
    name: string;
    type: 'restaurant' | 'food_truck' | 'cafe';
    cuisine: string;
    specialties: string[];
    description: string;
    businessHours: {
      [key: string]: { open: string; close: string };
    };
  } | null;
  currentOrder: {
    items: OrderItem[];
    totalAmount: number;
    status: 'draft' | 'confirmed' | 'cancelled';
    customizations: Record<string, string>;
    specialInstructions?: string;
    allergenAlerts?: string[];
    dietaryPreferences?: string[];
    created_at: Date;
    updated_at: Date;
  };
  lastOrder: Order | null;
  orderHistory: Order[];
  userPreferences: {
    dietaryRestrictions: string[];
    favoriteItems: string[];
    allergens: string[];
    spicePreference?: 'mild' | 'medium' | 'spicy';
    lastOrder?: Order;
  };
}

interface BFFActions {
  addMessage: (message: Message) => void;
  setUserProfile: (profile: UserProfile) => void;
  setLanguage: (language: string) => void;
  setTyping: (isTyping: boolean) => void;
  setRestaurantContext: (context: BFFState['restaurantContext']) => void;
  addToOrder: (item: MenuItem, quantity: number, customizations: Record<string, string>) => void;
  removeFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateItemCustomizations: (itemId: string, customizations: Record<string, string>) => void;
  confirmOrder: () => Promise<void>;
  cancelOrder: () => void;
  clearOrder: () => void;
  reorderLast: () => Promise<void>;
  loadLastOrder: () => Promise<void>;
  loadOrderHistory: () => Promise<void>;
  clearMessages: () => void;
  clearConversations: () => void;
  resetState: () => void;
}

const initialState: BFFState = {
  messages: [{
    id: crypto.randomUUID(),
    content: "Hello! I'm BFF, your AI food assistant. How can I help you today?",
    sender: 'ai',
    timestamp: new Date(),
    language: 'en'
  }],
  conversations: [],
  userProfile: null,
  currentLanguage: localStorage.getItem('preferredLanguage') || 'en',
  isTyping: false,
  restaurantContext: null,
  currentOrder: {
    items: [],
    totalAmount: 0,
    status: 'draft',
    customizations: {},
    created_at: new Date(),
    updated_at: new Date()
  },
  lastOrder: null,
  orderHistory: [],
  userPreferences: {
    dietaryRestrictions: [],
    favoriteItems: [],
    allergens: []
  }
};

const store = create<BFFState & BFFActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addMessage: (message) => set((state) => {
          const messages = [...state.messages];
          if (messages.length > 100) {
            messages.shift(); // Remove oldest message if over 100
          }
          return { messages: [...messages, message] };
        }),

        setUserProfile: (profile) => set({ userProfile: profile }),

        setLanguage: (language) => {
          localStorage.setItem('preferredLanguage', language);
          set({ currentLanguage: language });
        },

        setTyping: (isTyping) => set({ isTyping }),

        setRestaurantContext: (context) => set({ restaurantContext: context }),

        addToOrder: (item, quantity, customizations) => set((state) => {
          const currentOrder = state.currentOrder;
          const existingItemIndex = currentOrder.items.findIndex(
            orderItem => orderItem.item.id === item.id
          );

          let updatedItems: OrderItem[];
          if (existingItemIndex >= 0) {
            updatedItems = [...currentOrder.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
              customizations: { ...updatedItems[existingItemIndex].customizations, ...customizations },
              totalPrice: calculateItemTotal(item, updatedItems[existingItemIndex].quantity + quantity, customizations)
            };
          } else {
            updatedItems = [
              ...currentOrder.items,
              {
                item,
                quantity,
                customizations,
                totalPrice: calculateItemTotal(item, quantity, customizations)
              }
            ];
          }

          const totalAmount = Number(
            updatedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
          );

          return {
            currentOrder: {
              ...currentOrder,
              items: updatedItems,
              totalAmount,
              updated_at: new Date()
            }
          };
        }),

        removeFromOrder: (itemId) => set((state) => {
          const currentOrder = state.currentOrder;
          const updatedItems = currentOrder.items.filter(
            item => item.item.id !== itemId
          );

          const totalAmount = Number(
            updatedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
          );

          return {
            currentOrder: {
              ...currentOrder,
              items: updatedItems,
              totalAmount,
              updated_at: new Date()
            }
          };
        }),

        updateItemQuantity: (itemId, quantity) => set((state) => {
          const currentOrder = state.currentOrder;
          const updatedItems = currentOrder.items.map(orderItem => {
            if (orderItem.item.id === itemId) {
              return {
                ...orderItem,
                quantity,
                totalPrice: calculateItemTotal(orderItem.item, quantity, orderItem.customizations)
              };
            }
            return orderItem;
          });

          const totalAmount = Number(
            updatedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
          );

          return {
            currentOrder: {
              ...currentOrder,
              items: updatedItems,
              totalAmount,
              updated_at: new Date()
            }
          };
        }),

        updateItemCustomizations: (itemId, customizations) => set((state) => {
          const currentOrder = state.currentOrder;
          const updatedItems = currentOrder.items.map(orderItem => {
            if (orderItem.item.id === itemId) {
              return {
                ...orderItem,
                customizations,
                totalPrice: calculateItemTotal(orderItem.item, orderItem.quantity, customizations)
              };
            }
            return orderItem;
          });

          const totalAmount = Number(
            updatedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
          );

          return {
            currentOrder: {
              ...currentOrder,
              items: updatedItems,
              totalAmount,
              updated_at: new Date()
            }
          };
        }),

        confirmOrder: async () => {
          const state = get();
          const confirmedOrder = {
            ...state.currentOrder,
            status: 'confirmed' as const,
            updated_at: new Date()
          };

          try {
            const { error } = await saveOrder(confirmedOrder);
            if (error) throw error;

            set({ 
              currentOrder: createEmptyOrder(),
              lastOrder: confirmedOrder
            });
            toast.success('Order confirmed successfully!');
          } catch (error) {
            console.error('Failed to save order:', error);
            toast.error('Failed to confirm order');
            throw error;
          }
        },

        cancelOrder: () => set({ 
          currentOrder: createEmptyOrder() 
        }),

        clearOrder: () => set({ 
          currentOrder: createEmptyOrder() 
        }),

        reorderLast: async () => {
          const lastOrder = await getLastOrder();
          if (lastOrder) {
            set({
              currentOrder: {
                ...lastOrder,
                status: 'draft',
                created_at: new Date(),
                updated_at: new Date()
              }
            });
          }
        },

        loadLastOrder: async () => {
          const lastOrder = await getLastOrder();
          if (lastOrder) {
            set({ lastOrder });
          }
        },

        loadOrderHistory: async () => {
          const orders = await getOrderHistory();
          if (orders) {
            set({ orderHistory: orders });
          }
        },

        clearMessages: () => set({ messages: [initialState.messages[0]] }),

        clearConversations: () => set({ conversations: [] }),

        resetState: () => set(initialState)
      }),
      {
        name: 'brick-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentLanguage: state.currentLanguage,
          userPreferences: state.userPreferences,
          restaurantContext: state.restaurantContext
        })
      }
    )
  )
);

function createEmptyOrder(): Order {
  return {
    items: [],
    totalAmount: 0,
    status: 'draft',
    created_at: new Date(),
    updated_at: new Date()
  };
}

function calculateItemTotal(item: MenuItem, quantity: number, customizations: Record<string, string>): number {
  let total = item.price * quantity;

  if (item.customizationOptions) {
    for (const option of item.customizationOptions) {
      if (option.price && customizations[option.id]) {
        total += option.price;
      }
    }
  }

  return Number(total.toFixed(2));
}

export const useBFFStore = store;