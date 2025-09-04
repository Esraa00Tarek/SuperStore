import { db } from './config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  CRAFTS: 'crafts',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
  CONTACT_MESSAGES: 'contactMessages'
};

// Sample data for initialization
const SAMPLE_CATEGORIES = [
  { name: 'Food', nameAr: 'طعام' },
  { name: 'Handicrafts', nameAr: 'حرف يدوية' },
  { name: 'Home Decor', nameAr: 'ديكور منزلي' },
  { name: 'Clothing', nameAr: 'ملابس' },
];

// Initialize collections with sample data
export const initializeFirestore = async () => {
  try {
    // Create categories
    const categoriesPromises = SAMPLE_CATEGORIES.map(async (category) => {
      const docRef = doc(collection(db, COLLECTIONS.CATEGORIES));
      await setDoc(docRef, {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...category };
    });

    const createdCategories = await Promise.all(categoriesPromises);

    // Add a sample product
    const productRef = doc(collection(db, COLLECTIONS.PRODUCTS));
    await setDoc(productRef, {
      name: 'Sample Product',
      description: 'This is a sample product',
      price: 9.99,
      category: createdCategories[0].id,
      imageUrl: 'https://via.placeholder.com/150',
      stock: 100,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: 'Firestore initialized successfully' };
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return { success: false, error };
  }
};

// Run this function once to initialize your database
// initializeFirestore().then(console.log).catch(console.error);
