import { Item } from "@/components/admin/ItemManagement";

const CRAFTS_KEY = 'crafts';
const PRODUCTS_KEY = 'products';

// Initialize default data if not exists
const initializeDefaultData = () => {
  const isRTL = document.documentElement.dir === 'rtl';
  
  if (!localStorage.getItem(CRAFTS_KEY)) {
    const defaultCrafts: Item[] = [
      {
        id: 1,
        name: isRTL ? 'تطريز تراثي فلسطيني' : 'Traditional Palestinian Embroidery',
        firstDescription: isRTL ? 'تصميم فريد يدوي الصنع' : 'Handcrafted unique design',
        secondDescription: isRTL ? 'تطريز يدوي على الثوب الفلسطيني التقليدي' : 'Hand embroidery on traditional Palestinian dress',
        price: '150 JD',
        category: 'embroidery',
        seller: isRTL ? 'أم خليل' : 'Um Khalil',
        image: '/placeholder-craft.jpg',
        rating: 4.9,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: isRTL ? 'خزف يدوي' : 'Handmade Pottery',
        firstDescription: isRTL ? 'تحفة فنية من الخزف اليدوي' : 'Handcrafted ceramic masterpiece',
        secondDescription: isRTL ? 'مزهرية يدوية الصنع بتصميمات تقليدية' : 'Handmade vase with traditional designs',
        price: '85 JD',
        category: 'pottery',
        seller: isRTL ? 'مركز الحرف اليدوية' : 'Handicraft Center',
        image: '/placeholder-craft.jpg',
        rating: 4.7,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(CRAFTS_KEY, JSON.stringify(defaultCrafts));
  }

  if (!localStorage.getItem(PRODUCTS_KEY)) {
    const defaultProducts: Item[] = [
      {
        id: 1,
        name: isRTL ? 'منسف أردني تقليدي' : 'Traditional Jordanian Mansaf',
        firstDescription: isRTL ? 'طبق وطني أردني' : 'Traditional Jordanian dish',
        secondDescription: isRTL ? 'منسف بلحم الخروف واللبن الرائب' : 'Lamb with fermented dried yogurt sauce',
        price: '25 JD',
        category: 'meals',
        seller: isRTL ? 'أم محمد' : 'Um Mohammad',
        image: '/placeholder-food.jpg',
        rating: 4.8,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: isRTL ? 'كنافة نابلسية' : 'Nabulsi Kunafa',
        firstDescription: isRTL ? 'حلويات شرقية' : 'Middle Eastern dessert',
        secondDescription: isRTL ? 'كنافة محشوة بالجبنة وقطر' : 'Cheese-filled pastry with sugar syrup',
        price: '15 JD',
        category: 'sweets',
        seller: isRTL ? 'حلواني القدس' : 'Al-Quds Sweets',
        image: '/placeholder-food.jpg',
        rating: 4.9,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
  }
};

// Initialize data when the module is imported
initializeDefaultData();

// Crafts Service
export const craftService = {
  getAll: (): Item[] => {
    const crafts = localStorage.getItem(CRAFTS_KEY);
    return crafts ? JSON.parse(crafts) : [];
  },
  getById: (id: string | number): Item | undefined => {
    const crafts = craftService.getAll();
    return crafts.find(craft => craft.id === id);
  },
  save: (craft: Item): void => {
    const crafts = craftService.getAll();
    const existingIndex = crafts.findIndex(c => c.id === craft.id);
    
    if (existingIndex >= 0) {
      // Update existing
      crafts[existingIndex] = { ...craft, updatedAt: new Date().toISOString() };
    } else {
      // Add new
      crafts.push({ ...craft, id: Date.now(), createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(CRAFTS_KEY, JSON.stringify(crafts));
  },
  delete: (id: string | number): void => {
    const crafts = craftService.getAll().filter(craft => craft.id !== id);
    localStorage.setItem(CRAFTS_KEY, JSON.stringify(crafts));
  }
};

// Products Service
export const productService = {
  getAll: (): Item[] => {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  },
  getById: (id: string | number): Item | undefined => {
    const products = productService.getAll();
    return products.find(product => product.id === id);
  },
  save: (product: Item): void => {
    const products = productService.getAll();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      // Update existing
      products[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      // Add new
      products.push({ ...product, id: Date.now(), createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },
  delete: (id: string | number): void => {
    const products = productService.getAll().filter(product => product.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
};
