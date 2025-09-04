export interface Item {
  id: string | number;
  name: string;
  firstDescription: string;
  secondDescription: string;
  priceValue: number; // Added field for numeric price
  priceCurrency: string; // Added field for currency string
  category: string;
  image: string;
  seller: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  madeBy?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'products' | 'crafts';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}
