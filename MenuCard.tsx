import React from 'react';
import { MenuItem } from '../types';
import { Check, ShoppingCart } from 'lucide-react';
import { useBFFStore } from '../lib/store';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [customizations, setCustomizations] = React.useState<Record<string, string>>({});
  const { addToOrder, currentOrder } = useBFFStore();

  const isInOrder = currentOrder.items.some(orderItem => orderItem.item.id === item.id);

  const handleOrder = () => {
    addToOrder(item, quantity, customizations);
    setQuantity(1);
    setCustomizations({});
  };

  return (
    <div className="bg-white rounded-xl shadow-luxury border border-surface-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-brick-950">{item.name}</h3>
          <p className="text-sm text-brick-950/60">{item.description}</p>
        </div>
        <span className="text-lg font-bold text-brick-500">${item.price.toFixed(2)}</span>
      </div>

      {item.customizationOptions && (
        <div className="mt-4 space-y-2">
          {item.customizationOptions.map(option => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-brick-950">
                {option.name}
                {option.price && ` (+$${option.price.toFixed(2)})`}
              </label>
              <select
                className="mt-1 block w-full rounded-lg border-surface-200 text-sm"
                value={customizations[option.id] || ''}
                onChange={(e) => setCustomizations(prev => ({
                  ...prev,
                  [option.id]: e.target.value
                }))}
              >
                <option value="">Select {option.name}</option>
                {option.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-1 rounded bg-surface-50"
          >
            -
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-1 rounded bg-surface-50"
          >
            +
          </button>
        </div>
        <button
          onClick={handleOrder}
          className="btn-primary flex items-center gap-2"
        >
          {isInOrder ? (
            <>
              <Check className="w-4 h-4" />
              Update Order
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Order
            </>
          )}
        </button>
      </div>
    </div>
  );
}