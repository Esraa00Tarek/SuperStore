import { db } from './config';
import { collection, setDoc, doc } from 'firebase/firestore';

export const initializeDatabase = async () => {
  try {
    // Create main collections
    const collections = {
      products: {
        name: 'Products',
        description: 'Store products',
      },
      categories: {
        name: 'Categories',
        description: 'Product categories',
      },
      orders: {
        name: 'Orders',
        description: 'Customer orders',
      },
      users: {
        name: 'Users',
        description: 'User profiles',
      },
      settings: {
        name: 'Settings',
        description: 'App settings',
      },
    };

    // Create collections in Firestore
    for (const [collectionName, data] of Object.entries(collections)) {
      const collectionRef = collection(db, collectionName);
      
      // Add a sample document to each collection
      await setDoc(doc(collectionRef, 'sample'), {
        name: `Sample ${collectionName.slice(0, -1)}`,
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run the initialization
// initializeDatabase(); // Uncomment this line to run the initialization
