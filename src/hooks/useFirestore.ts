import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentReference,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

type CollectionPath = 'products' | 'crafts' | 'categories' | 'orders' | 'users';

const useFirestore = <T extends { id?: string }>(collectionPath: CollectionPath) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time data fetching
  useEffect(() => {
    const collectionRef = collection(db, collectionPath);
    
    const unsubscribe = onSnapshot(collectionRef, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items: T[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          items.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error getting documents: ', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath]);

  // Add a new document
  const addDocument = async (item: Omit<T, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, collectionPath), item);
      return docRef.id;
    } catch (err) {
      console.error('Error adding document: ', err);
      throw new Error('Failed to add document');
    }
  };

  // Update an existing document
  const updateDocument = async (id: string, updates: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, updates as any);
    } catch (err) {
      console.error('Error updating document: ', err);
      throw new Error('Failed to update document');
    }
  };

  // Delete a document
  const deleteDocument = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error deleting document: ', err);
      throw new Error('Failed to delete document');
    }
  };

  // Get a single document by ID
  const getDocument = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionPath, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error getting document: ', err);
      throw new Error('Failed to get document');
    }
  };

  // Query documents with conditions
  const queryDocuments = async (
    field: string, 
    operator: any, 
    value: any
  ): Promise<T[]> => {
    try {
      const q = query(
        collection(db, collectionPath), 
        where(field, operator, value)
      );
      
      const querySnapshot = await getDocs(q);
      const items: T[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      
      return items;
    } catch (err) {
      console.error('Error querying documents: ', err);
      throw new Error('Failed to query documents');
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    queryDocuments
  };
};

export default useFirestore;
