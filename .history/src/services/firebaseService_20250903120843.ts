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
  runTransaction
} from 'firebase/firestore';
import type { Item } from '@/types';

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
  console.log(`Attempting to delete document: ${collectionName}/${id}`);
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`Document ${collectionName}/${id} does not exist.`);
      return;
    }

    await runTransaction(db, async (transaction) => {
      transaction.delete(docRef);
    });

    console.log(`Document ${collectionName}/${id} deleted successfully.`);
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
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined && value !== "")
    );
    if (sanitizedData.priceValue) {
      sanitizedData.priceValue = Number(sanitizedData.priceValue); // Ensure priceValue is a number
    }
    if (sanitizedData.priceCurrency) {
      sanitizedData.priceCurrency = String(sanitizedData.priceCurrency); // Ensure priceCurrency is a string
    }
    const ref = await addDoc(col, sanitizedData);
    return { id: ref.id, ...sanitizedData } as Item;
  },

  update: async (id: string, updates: Partial<Item>) => {
    const ref = doc(db, "products", id);
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key, value]) => value !== undefined && value !== "")
    );
    if (sanitizedUpdates.priceValue) {
      sanitizedUpdates.priceValue = Number(sanitizedUpdates.priceValue); // Ensure priceValue is a number
    }
    if (sanitizedUpdates.priceCurrency) {
      sanitizedUpdates.priceCurrency = String(sanitizedUpdates.priceCurrency); // Ensure priceCurrency is a string
    }
    await updateDoc(ref, sanitizedUpdates);
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
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined && value !== "")
    );
    if (sanitizedData.priceValue) {
      sanitizedData.priceValue = Number(sanitizedData.priceValue); // Ensure priceValue is a number
    }
    if (sanitizedData.priceCurrency) {
      sanitizedData.priceCurrency = String(sanitizedData.priceCurrency); // Ensure priceCurrency is a string
    }
    const ref = await addDoc(col, sanitizedData);
    return { id: ref.id, ...sanitizedData } as Item;
  },

  update: async (id: string, updates: Partial<Item>) => {
    const ref = doc(db, "crafts", id);
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key, value]) => value !== undefined && value !== "")
    );
    if (sanitizedUpdates.priceValue) {
      sanitizedUpdates.priceValue = Number(sanitizedUpdates.priceValue); // Ensure priceValue is a number
    }
    if (sanitizedUpdates.priceCurrency) {
      sanitizedUpdates.priceCurrency = String(sanitizedUpdates.priceCurrency); // Ensure priceCurrency is a string
    }
    await updateDoc(ref, sanitizedUpdates);
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
