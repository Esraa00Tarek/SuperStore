import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

const CategoriesManager = ({ type }: { type: 'products' | 'crafts' }) => {
  const { t, isRTL } = useLanguage();
  const [newCategory, setNewCategory] = useState('');
  const { categories, loading, error, addCategory, deleteCategory } = useCategories(type);
  const [localError, setLocalError] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setLocalError(isRTL ? 'اسم التصنيف مطلوب' : 'Category name is required');
      return;
    }

    try {
      await addCategory(newCategory);
      setNewCategory('');
      setLocalError('');
    } catch (err) {
      setLocalError(isRTL ? 'حدث خطأ أثناء إضافة التصنيف' : 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        setLocalError(isRTL ? 'حدث خطأ أثناء حذف التصنيف' : 'Failed to delete category');
      }
    }
  };

  const title = type === 'products' 
    ? (isRTL ? 'تصنيفات المنتجات' : 'Product Categories') 
    : (isRTL ? 'تصنيفات الحرف اليدوية' : 'Craft Categories');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t('categories.new') || 'New category name'}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-1" />
            {isRTL ? 'إضافة' : 'Add'}
          </Button>
        </div>
        
        {localError && <p className="text-red-500 text-sm mb-4">{localError}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="space-y-2">
          {loading ? (
            <p>{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">
              {isRTL ? 'لا توجد تصنيفات مضافة بعد' : 'No categories added yet'}
            </p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li 
                  key={category.id}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                >
                  <span>{category.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CategoriesPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('categories.manage') || 'Manage Categories'}
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <CategoriesManager type="products" />
        <CategoriesManager type="crafts" />
      </div>
    </div>
  );
};

export default CategoriesPage;
