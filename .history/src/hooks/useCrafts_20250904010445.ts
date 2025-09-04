import { useState, useEffect, useCallback } from 'react';
import { craftsCollection } from '@/services/firebaseService';
import type { Item } from '@/types';

export const useCrafts = () => {
  const [crafts, setCrafts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrafts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await craftsCollection.getAll();
      setCrafts(data);
    } catch (e) {
      setError("Failed To Fetch Crafts");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCraft = async (craft: Omit<Item, "id">) => {
    try {
      const newItem = await craftsCollection.add(craft);
      setCrafts(prev => [...prev, newItem]);
      return newItem;
    } catch (e) {
      setError("Failed To Add Craft");
      console.error(e);
      throw e;
    }
  };

  const updateCraft = async (id: string, updates: Partial<Item>) => {
    try {
      await craftsCollection.update(id, updates);
      setCrafts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    } catch (e) {
      setError("Failed to update craft");
      console.error(e);
      throw e;
    }
  };

  const deleteCraft = async (id: string) => {
    try {
      await craftsCollection.delete(id);
      setCrafts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError("Failed to delete craft");
      console.error(e);
      throw e;
    }
  };

  useEffect(() => {
    fetchCrafts();
  }, [fetchCrafts]);

  return {
    crafts,
    loading,
    error,
    addCraft,
    updateCraft,
    deleteCraft,
    refetch: fetchCrafts,
  };
};
