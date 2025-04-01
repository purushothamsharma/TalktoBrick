import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  DollarSign,
  Tag,
  FileText,
  ChefHat,
  Search,
  Filter,
  RefreshCw,
  GripVertical
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { MenuItem, MenuCategory } from '../types';

function SortableMenuItem({ item, onEdit, onDelete }: { 
  item: MenuItem; 
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-luxury p-4 flex items-center gap-4"
    >
      <button 
        className="cursor-grab text-brick-950/40 hover:text-brick-950 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h3 className="font-medium text-brick-950">{item.name}</h3>
        <p className="text-sm text-brick-950/60">{item.description}</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-sm font-medium text-brick-500">${item.price.toFixed(2)}</span>
          <span className="text-sm text-brick-950/60">{item.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | 'all'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('position');

      if (error) throw error;

      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items');
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update positions in database
      try {
        const updates = newItems.map((item, index) => ({
          id: item.id,
          position: index
        }));

        const { error } = await supabase
          .from('menu_items')
          .upsert(updates);

        if (error) throw error;
      } catch (err) {
        console.error('Error updating positions:', err);
        toast.error('Failed to update menu order');
        fetchMenuItems(); // Revert to original order
      }
    }
  };

  const handleSaveItem = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .upsert({
          ...item,
          position: item.id ? item.position : items.length
        });

      if (error) throw error;

      toast.success(item.id ? 'Item updated successfully' : 'Item added successfully');
      fetchMenuItems();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving menu item:', err);
      toast.error('Failed to save menu item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Item deleted successfully');
      fetchMenuItems();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast.error('Failed to delete menu item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brick-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brick-950">Menu Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brick-950/40" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:ring-2 focus:ring-brick-500/20 focus:border-brick-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brick-950/40" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MenuCategory | 'all')}
              className="rounded-lg border-surface-200 text-sm focus:ring-brick-500 focus:border-brick-500"
            >
              <option value="all">All Categories</option>
              {Object.values(MenuCategory).map(category => (
                <option key={category} value={category}>
                  {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchMenuItems}
            className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Menu Items List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredItems.map(item => item.id)}>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <SortableMenuItem
                key={item.id}
                item={item}
                onEdit={() => {
                  setEditingItem(item);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brick-950/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-luxury-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brick-950">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-brick-950/60 hover:text-brick-950 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const item: MenuItem = {
                  id: editingItem?.id || crypto.randomUUID(),
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  price: parseFloat(formData.get('price') as string),
                  category: formData.get('category') as MenuCategory,
                  position: editingItem?.position || items.length,
                  nutrition: editingItem?.nutrition || {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    allergens: [],
                    dietaryInfo: []
                  },
                  cookingMethod: 'grilled',
                  ingredients: []
                };
                handleSaveItem(item);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-brick-950">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  className="mt-1 block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brick-950">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brick-950">Price</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-brick-950/40">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingItem?.price}
                    required
                    min="0"
                    step="0.01"
                    className="pl-7 block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brick-950">Category</label>
                <select
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                  className="mt-1 block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
                >
                  {Object.values(MenuCategory).map(category => (
                    <option key={category} value={category}>
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}