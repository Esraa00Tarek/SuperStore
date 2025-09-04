import { useLanguage } from '@/contexts/LanguageContext';
import { ItemManagement } from '@/components/admin/ItemManagement';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Item } from '@/types';

const ProductsPage = () => {
  const { t, isRTL } = useLanguage();
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();
  
  const { categories } = useCategories('products');

  const handleSaveProduct = async (product: Item) => {
    try {
      const productData = {
        ...product,
        type: 'product'
      };

      const isTemporaryId = /^\d{13,}$/.test(String(product.id)); // Convert id to string
      
      if (product.id && !isTemporaryId) {
        await updateProduct(String(product.id), productData); // Convert id to string
      } else {
        await addProduct({
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      return true;
    } catch (err) {
      console.error('Error saving product:', err);
      return false;
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    try {
      await deleteProduct(String(id));
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  const categoryOptions = [
    { key: '', label: isRTL ? 'اختر تصنيف' : 'Select category' },
    ...categories.map(cat => ({
      key: cat.name,
      label: cat.name
    }))
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const items: Item[] = products.map(product => ({
    ...product,
    id: product.id.toString(),
    priceValue: product.priceValue || 0, // Ensure priceValue is a number
    priceCurrency: product.priceCurrency || '', // Ensure priceCurrency is a string
    rating: product.rating || 0,
    firstDescription: product.firstDescription || "",
    secondDescription: product.secondDescription || "",
    seller: product.seller || "",
    nameAr: product.nameAr || "",
    descriptionAr: product.descriptionAr || "",
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString()
  }));

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t('products.manage') || 'Manage Products'}
        </h1>
      </div>
      
      <ItemManagement
        items={items}
        onSave={async (item) => {
          const productItem: Omit<Item, 'id'> & { id?: string } = {
            id: String(item.id),
            name: item.name,
            nameAr: item.nameAr || '', // Removed any
            priceValue: Number(item.priceValue) || 0, // Ensure priceValue is a number
            priceCurrency: item.priceCurrency || '', // Ensure priceCurrency is a string
            description: item.firstDescription || '',
            descriptionAr: item.descriptionAr || '', // Removed any
            category: item.category,
            image: item.image,
            firstDescription: item.firstDescription,
            secondDescription: item.secondDescription,
            seller: item.seller || '',
            rating: Number(item.rating) || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return handleSaveProduct(productItem as Item);
        }}
        onDelete={handleDeleteProduct}
        categoryOptions={categoryOptions}
        title='Manage Products'
        placeholder='Search Products'
        button='Add Product'
      />
    </div>
  );
};

export default ProductsPage;
