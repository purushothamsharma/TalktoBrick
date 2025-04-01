import { supabase } from './supabase';
import { generateEmbeddings, generateResponse } from './calm';
import { MenuItem, Order } from '../types';
import { menuData } from './menuData';

export const rasaActions = {
  MENU_INQUIRY: 'menu_inquiry',
  ORDER_FOOD: 'order_food',
  CUSTOMIZE_ORDER: 'customize_order',
  CHECK_STATUS: 'check_status',
  DIETARY_INQUIRY: 'dietary_inquiry',
  RECOMMENDATION: 'recommendation',
  PROCESS_PAYMENT: 'process_payment',
  REQUEST_PAYMENT: 'request_payment',
  UPDATE_MENU: 'update_menu',
  INVENTORY_CHECK: 'inventory_check',
  PREDICT_DEMAND: 'predict_demand'
};

export const handleRasaAction = async (action: string, data: any) => {
  try {
    switch(action) {
      case rasaActions.MENU_INQUIRY:
        const { category, dietary, spiceLevel } = data;
        let filteredMenu = [...menuData];
        
        if (category) {
          filteredMenu = filteredMenu.filter(item => item.category === category);
        }
        if (dietary) {
          filteredMenu = filteredMenu.filter(item => 
            item.nutrition.dietaryInfo.includes(dietary)
          );
        }
        if (spiceLevel) {
          filteredMenu = filteredMenu.filter(item => 
            item.spiceLevel === spiceLevel
          );
        }
        
        return { items: filteredMenu };

      case rasaActions.DIETARY_INQUIRY:
        const { itemId, allergen, restriction } = data;
        const item = menuData.find(i => i.id === itemId);
        
        if (!item) return { error: 'Item not found' };
        
        const hasAllergen = allergen && item.nutrition.allergens.includes(allergen);
        const meetsRestriction = restriction && 
          item.nutrition.dietaryInfo.includes(restriction);
        
        return {
          item,
          hasAllergen,
          meetsRestriction,
          nutrition: item.nutrition
        };

      case rasaActions.UPDATE_MENU:
        const { updates } = data;
        const { error: updateError } = await supabase
          .from('menu_items')
          .upsert(updates);
          
        if (updateError) throw updateError;
        
        // Update embeddings for menu items
        for (const item of updates) {
          const embedding = await generateEmbeddings(
            `${item.name} ${item.description} ${item.category}`
          );
          await supabase
            .from('menu_embeddings')
            .upsert({
              item_id: item.id,
              embedding
            });
        }
        
        return { success: true };

      case rasaActions.INVENTORY_CHECK:
        const { itemIds } = data;
        const { data: inventory } = await supabase
          .from('inventory')
          .select('*')
          .in('item_id', itemIds);
          
        return { inventory };

      case rasaActions.PREDICT_DEMAND:
        const { timeframe } = data;
        const { data: orders } = await supabase
          .from('orders')
          .select('items')
          .gte('created_at', new Date(Date.now() - timeframe).toISOString());
          
        // Calculate demand predictions
        const predictions = analyzeDemand(orders);
        return { predictions };

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in Rasa action:', error);
    throw error;
  }
};

function analyzeDemand(orders: any[]) {
  const itemCounts = new Map<string, number>();
  const totalOrders = orders.length;
  
  // Count items
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      const count = itemCounts.get(item.id) || 0;
      itemCounts.set(item.id, count + item.quantity);
    });
  });
  
  // Calculate predictions
  return Array.from(itemCounts.entries()).map(([itemId, count]) => {
    const averagePerOrder = count / totalOrders;
    const item = menuData.find(i => i.id === itemId);
    
    return {
      itemId,
      name: item?.name,
      totalOrdered: count,
      averagePerOrder,
      predicted: Math.ceil(averagePerOrder * 1.2) // Add 20% buffer
    };
  });
}