import { useState, useEffect, useCallback } from 'react';
import { categoriesCollection } from '@/services/firebaseService';

type CategoryType = 'products' | 'crafts';

interface Category {
  id: string;
  name: string;
}

export const useCategories = (type: CategoryType) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoriesCollection.getAll(type);
      setCategories(data as Category[]);
    } catch (err) {
      setError(`Failed To Fetch ${type.charAt(0).toUpperCase() + type.slice(1)} Categories`);
      console.error(`Error Fetching ${type.charAt(0).toUpperCase() + type.slice(1)} Categories:`, err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const addCategory = async (name: string) => {
    try {
      const newCategory = await categoriesCollection.add(type, name);
      setCategories(prev => [...prev, newCategory as Category]);
      return newCategory;
    } catch (err) {
      setError(`Failed To Add ${type.charAt(0).toUpperCase() + type.slice(1)} Category`);
      console.error(`Error Adding ${type.charAt(0).toUpperCase() + type.slice(1)} Category:`, err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesCollection.delete(type, id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError(`Failed to delete ${type} category`);
      console.error(`Error deleting ${type} category:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
