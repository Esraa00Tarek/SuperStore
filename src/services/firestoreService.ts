import { db } from '@/firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  runTransaction,
  WhereFilterOp as FirestoreWhereFilterOp
} from 'firebase/firestore';
import { Item } from '@/types';

// Base interface for all documents
interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Collection names
export const COLLECTIONS = {
  CRAFTS: 'crafts',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
  CONTACT_MESSAGES: 'contactMessages'
} as const;

type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// Helper to convert Firestore timestamps to JavaScript Date objects
const convertTimestamps = (data: { [key: string]: unknown }): { [key: string]: unknown } => {
  if (!data) return data;

  const convertedData: { [key: string]: unknown } = {};
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      convertedData[key] = (data[key] as Timestamp).toDate().toISOString();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      convertedData[key] = convertTimestamps(data[key] as { [key: string]: unknown });
    } else {
      convertedData[key] = data[key];
    }
  }
  return convertedData;
};

// Helper to convert Firestore data to app data
const fromFirestore = <T extends BaseDocument>(
  doc: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData }
): T => {
  const docData = 'data' in doc ? doc.data() : doc;
  const docId = 'id' in doc ? doc.id : (doc as { id: string }).id;
  const convertedData = convertTimestamps(docData) || {};
  
  const createdAt = docData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString();
  const updatedAt = docData?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString();

  return {
    ...convertedData,
    id: docId,
    createdAt,
    updatedAt
  } as unknown as T;
};

// Generic CRUD operations
export const firestoreService = {
  // Collection reference helper
  colRef: (collectionName: CollectionName) => collection(db, collectionName),
  
  // Document reference helper
  docRef: (collectionName: CollectionName, id: string) => doc(db, collectionName, id),
  
  // Create a new document
  async create<T extends BaseDocument>(
    collectionName: CollectionName, 
    data: Omit<T, keyof BaseDocument>
  ): Promise<T> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Failed to create document');
      }
      
      return fromFirestore<T>(docSnap);
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  },

  // Read a single document by ID
  async getById<T extends BaseDocument>(collectionName: CollectionName, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return fromFirestore<T>(docSnap);
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  },

  // Update a document
  async update<T extends BaseDocument>(
    collectionName: CollectionName, 
    id: string, 
    data: Partial<Omit<T, keyof BaseDocument>>
  ): Promise<T> {
    try {
      const docRef = doc(db, collectionName, id);
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error('Document not found after update');
      }
      
      return fromFirestore<T>(updatedDoc);
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName: CollectionName, id: string): Promise<boolean> {
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

      return true;
    } catch (error) {
      console.error(`Error deleting document ${collectionName}/${id}:`, error);
      return false;
    }
  },

  // Query documents with filters
  async query<T extends BaseDocument>(
    collectionName: CollectionName,
    conditions: Condition[] = [],
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> {
    try {
      let q = query(
        collection(db, collectionName),
        orderBy(orderByField, orderDirection)
      );
      
      // Apply where conditions if any
      for (const [field, op, value] of conditions) {
        q = query(q, where(field, op as FirestoreWhereFilterOp, value));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => fromFirestore<T>(doc));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  },
  
  // Batch operations
  async batchCreate<T extends BaseDocument>(
    collectionName: CollectionName,
    items: Array<Omit<T, keyof BaseDocument>>
  ): Promise<T[]> {
    const batchResults: T[] = [];
    
    for (const item of items) {
      try {
        const result = await this.create(collectionName, item);
        batchResults.push(result);
      } catch (error) {
        console.error('Error in batch create:', error);
        // Continue with other items even if one fails
      }
    }
    
    return batchResults;
  },
  
  // Real-time updates
  subscribe<T extends BaseDocument>(
    collectionName: CollectionName,
    callback: (items: T[]) => void,
    conditions: Condition[] = [],
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc'
  ): () => void {
    let q = query(
      collection(db, collectionName),
      orderBy(orderByField, orderDirection)
    );
    
    // Apply where conditions if any
    for (const [field, op, value] of conditions) {
      q = query(q, where(field, op as FirestoreWhereFilterOp, value));
    }
    
    // Import onSnapshot dynamically to avoid SSR issues
    let unsubscribe: (() => void) | null = null;
    
    import('firebase/firestore').then(({ onSnapshot }) => {
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => fromFirestore<T>(doc));
        callback(items);
      });
    }).catch(console.error);
    
    // Return unsubscribe function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }
};

// Collection-specific services
const createCollectionService = <T extends BaseDocument>(collectionName: CollectionName) => ({
  // Get all documents
  getAll: (conditions: Condition[] = []) => 
    firestoreService.query<T>(collectionName, conditions),
  
  // Get document by ID
  getById: (id: string) => 
    firestoreService.getById<T>(collectionName, id),
  
  // Create new document
  create: (data: Omit<T, keyof BaseDocument>) => 
    firestoreService.create<T>(collectionName, data as Omit<T, keyof BaseDocument>),
  
  // Update document
  update: (id: string, data: Partial<Omit<T, keyof BaseDocument>>) => 
    firestoreService.update<T>(collectionName, id, data),
  
  // Delete document
  delete: (id: string) => 
    firestoreService.delete(collectionName, id),
  
  // Subscribe to real-time updates
  subscribe: (
    callback: (items: T[]) => void, 
    conditions: Condition[] = [],
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc'
  ) => firestoreService.subscribe<T>(
    collectionName, 
    callback, 
    conditions, 
    orderByField, 
    orderDirection
  )
});

// Export collection-specific services
export const productsService = createCollectionService<Item>(COLLECTIONS.PRODUCTS);
export const craftsService = createCollectionService<Item>(COLLECTIONS.CRAFTS);

export const categoriesService = createCollectionService<{
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}>(COLLECTIONS.CATEGORIES);

export const ordersService = createCollectionService<{
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}>(COLLECTIONS.ORDERS);

export const contactMessagesService = createCollectionService<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}>(COLLECTIONS.CONTACT_MESSAGES);

// Define Condition type
export type Condition = [field: string, operator: FirestoreWhereFilterOp, value: unknown];

// Example usage of conditions
const conditions: Condition[] = [];

const q = query(
  collection(db, 'exampleCollection'),
  ...conditions.map(([field, operator, value]) => where(field, operator as FirestoreWhereFilterOp, value))
);

const create = async <T extends Record<string, unknown>>(collectionName: string, item: T) => {
  const docRef = await addDoc(collection(db, collectionName), item);
  return { id: docRef.id, ...item };
};
