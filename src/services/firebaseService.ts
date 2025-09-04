import { db } from '@/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where,
  writeBatch,
  runTransaction,
  DocumentData
} from 'firebase/firestore';
import type { Item } from '@/types';

// Helper function to sanitize data by removing undefined, empty strings, and id field
const sanitizeData = <T extends Record<string, any>>(data: T): Omit<T, 'id'> => {
  const sanitized = Object.entries(data).reduce((acc, [key, value]) => {
    // Skip undefined, null, empty strings, and the id field
    if (value === undefined || value === '' || key === 'id') {
      return acc;
    }
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const sanitizedNested = sanitizeData(value);
      if (Object.keys(sanitizedNested).length > 0) {
        acc[key] = sanitizedNested;
      }
    } else {
      acc[key] = value;
    }
    
    return acc;
  }, {} as Record<string, any>);

  return sanitized as Omit<T, 'id'>;
};

// Generic CRUD operations
export const getCollection = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addDocument = async <T extends object>(collectionName: string, data: T) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: docRef.id, ...data };
};

export const updateDocument = async <T extends object>(collectionName: string, id: string, data: T) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Document ${collectionName}/${id} does not exist`);
    }

    // Use a transaction to ensure data consistency
    await runTransaction(db, async (transaction) => {
      transaction.delete(docRef);
    });
  } catch (error) {
    console.error(`Error deleting document ${collectionName}/${id}:`, error);
    throw error;
  }
};

// Specific collections
export const productsCollection = {
  getAll: async () => {
    const col = collection(db, "products");
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Item, "id">),
    })) as Item[];
  },

  add: async (data: Omit<Item, "id">) => {
    const col = collection(db, "products");
    // Sanitize data (remove undefined, empty strings, and id field)
    const sanitizedData = sanitizeData(data);
    
    // Ensure priceValue is a number if it exists
    if (typeof sanitizedData.priceValue !== 'undefined') {
      sanitizedData.priceValue = Number(sanitizedData.priceValue);
    }
    
    // Ensure priceCurrency is a string if it exists
    if (typeof sanitizedData.priceCurrency !== 'undefined') {
      sanitizedData.priceCurrency = String(sanitizedData.priceCurrency);
    }
    
    // Add document with sanitized data (no id field)
    const ref = await addDoc(col, sanitizedData);
    
    // Return the saved data with the generated ID for the UI
    return { id: ref.id, ...sanitizedData } as Item;
  },

  update: async (id: string, updates: Partial<Item>) => {
    const ref = doc(db, "products", id);
    
    // Sanitize updates (remove undefined, empty strings, and id field)
    const sanitizedUpdates = sanitizeData(updates);
    
    // Ensure priceValue is a number if it exists
    if (typeof sanitizedUpdates.priceValue !== 'undefined') {
      sanitizedUpdates.priceValue = Number(sanitizedUpdates.priceValue);
    }
    
    // Ensure priceCurrency is a string if it exists
    if (typeof sanitizedUpdates.priceCurrency !== 'undefined') {
      sanitizedUpdates.priceCurrency = String(sanitizedUpdates.priceCurrency);
    }
    
    // Only update if there are valid fields to update
    if (Object.keys(sanitizedUpdates).length > 0) {
      await updateDoc(ref, sanitizedUpdates);
    }
  },

  delete: async (id: string) => {
    const ref = doc(db, "products", id);
    await deleteDoc(ref);
  },
};

export const craftsCollection = {
  getAll: async () => {
    const col = collection(db, "crafts");
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Item, "id">),
    })) as Item[];
  },

  add: async (data: Omit<Item, "id">) => {
    const col = collection(db, "crafts");
    // Sanitize data (remove undefined, empty strings, and id field)
    const sanitizedData = sanitizeData(data);
    
    // Ensure priceValue is a number if it exists
    if (typeof sanitizedData.priceValue !== 'undefined') {
      sanitizedData.priceValue = Number(sanitizedData.priceValue);
    }
    
    // Ensure priceCurrency is a string if it exists
    if (typeof sanitizedData.priceCurrency !== 'undefined') {
      sanitizedData.priceCurrency = String(sanitizedData.priceCurrency);
    }
    
    // Add document with sanitized data (no id field)
    const ref = await addDoc(col, sanitizedData);
    
    // Return the saved data with the generated ID for the UI
    return { id: ref.id, ...sanitizedData } as Item;
  },

  update: async (id: string, updates: Partial<Item>) => {
    const ref = doc(db, "crafts", id);
    
    // Sanitize updates (remove undefined, empty strings, and id field)
    const sanitizedUpdates = sanitizeData(updates);
    
    // Ensure priceValue is a number if it exists
    if (typeof sanitizedUpdates.priceValue !== 'undefined') {
      sanitizedUpdates.priceValue = Number(sanitizedUpdates.priceValue);
    }
    
    // Ensure priceCurrency is a string if it exists
    if (typeof sanitizedUpdates.priceCurrency !== 'undefined') {
      sanitizedUpdates.priceCurrency = String(sanitizedUpdates.priceCurrency);
    }
    
    // Only update if there are valid fields to update
    if (Object.keys(sanitizedUpdates).length > 0) {
      await updateDoc(ref, sanitizedUpdates);
    }
  },

  delete: async (id: string) => {
    const ref = doc(db, "crafts", id);
    await deleteDoc(ref);
  },
};

export const categoriesCollection = {
  getAll: async (type: 'products' | 'crafts') => {
    const querySnapshot = await getDocs(collection(db, `categories/${type}/items`));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  add: async (type: 'products' | 'crafts', name: string) => {
    return addDocument(`categories/${type}/items`, { name });
  },
  delete: async (type: 'products' | 'crafts', id: string) => {
    return deleteDocument(`categories/${type}/items`, id);
  }
};

export const contactsCollection = {
  getAll: () => getCollection('contacts'),
  getById: (id: string) => getDocument('contacts', id),
  add: (data: Item) => addDocument('contacts', data),
  update: (id: string, data: Item) => updateDocument('contacts', id, data),
  delete: (id: string) => deleteDocument('contacts', id)
};
