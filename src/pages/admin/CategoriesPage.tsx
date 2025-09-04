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
    } catch {
      setLocalError(isRTL ? 'حدث خطأ أثناء إضافة التصنيف' : 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch {
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
        {/* Input & Button */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={isRTL ? 'New Category' : 'New Category'} // تم تعديل البلاس هولدر
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 min-w-0"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Button onClick={handleAddCategory} className="w-full sm:w-auto flex-shrink-0 gap-2 justify-center">
            <Plus className="h-4 w-4" />
            {isRTL ? 'إضافة' : 'Add Category'}
          </Button>
        </div>

        {/* Errors */}
        {localError && <p className="text-red-500 text-sm mb-4">{localError}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Categories List */}
        <div className="space-y-2">
          {loading ? (
            <p>{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">{isRTL ? 'لا توجد تصنيفات مضافة بعد' : 'No categories added yet'}</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                >
                  <span className="break-words">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:bg-red-50 flex-shrink-0"
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
  return (
    <div className="container mx-auto py-6 px-2">
      <div className="grid gap-8 md:grid-cols-2">
        <CategoriesManager type="products" />
        <CategoriesManager type="crafts" />
      </div>
    </div>
  );
};

export default CategoriesPage;
