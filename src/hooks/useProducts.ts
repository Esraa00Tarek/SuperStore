import { useState, useEffect, useCallback } from 'react';
import { productsCollection } from '@/services/firebaseService';
import type { Item } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productsCollection.getAll();
      setProducts(data);
    } catch (e) {
      setError("Failed To Fetch Products");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (product: Omit<Item, "id">) => {
    try {
      const newItem = await productsCollection.add(product);
      setProducts(prev => [...prev, newItem]);
      return newItem;
    } catch (e) {
      setError("Failed To Add Product");
      console.error(e);
      throw e;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Item>) => {
    try {
      await productsCollection.update(id, updates);
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    } catch (e) {
      setError("Failed To Update Product");
      console.error(e);
      throw e;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsCollection.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError("Failed To Delete Product");
      console.error(e);
      throw e;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
