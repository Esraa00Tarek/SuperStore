import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoriesManagerProps {
  type: 'products' | 'crafts';
  onCategoriesChange?: (categories: string[]) => void;
}

export const CategoriesManager = ({ type, onCategoriesChange }: CategoriesManagerProps) => {
  const { t, isRTL } = useLanguage();
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Generate the localStorage key based on the type
  const storageKey = `${type}Categories`;

  // Load categories from localStorage on component mount
  useEffect(() => {
    const storedCategories = localStorage.getItem(storageKey);
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setCategories(parsedCategories);
    }
  }, [storageKey]);

  // Notify parent component when categories change
  useEffect(() => {
    if (onCategoriesChange) {
      onCategoriesChange(categories);
    }
  }, [categories, onCategoriesChange]);

  const addCategory = () => {
    // Validate input
    if (!newCategory.trim()) {
      setError(isRTL ? 'اسم التصنيف مطلوب' : 'Category Name Is Required');
      return;
    }

    // Check for duplicate
    if (categories.includes(newCategory.trim())) {
      setError(isRTL ? 'هذا التصنيف موجود مسبقاً' : 'This Category Already Exists');
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    updateCategories(updatedCategories);
    setNewCategory('');
    setError('');
  };

  const deleteCategory = (categoryToDelete: string) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
    updateCategories(updatedCategories);
  };

  const updateCategories = (updatedCategories: string[]) => {
    setCategories(updatedCategories);
    localStorage.setItem(storageKey, JSON.stringify(updatedCategories));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCategory();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
          {isRTL 
            ? (type === 'products' ? 'إدارة تصنيفات المنتجات' : 'إدارة تصنيفات الحرف اليدوية')
            : (type === 'products' ? 'Manage Product Categories' : 'Manage Craft Categories')
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isRTL 
                  ? 'أدخل اسم التصنيف الجديد'
                  : 'Enter New Category Name'
              }
              className="flex-1"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <Button onClick={addCategory} className="gap-2">
              <Plus size={16} />
              {isRTL ? 'إضافة' : 'Add'}
            </Button>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="border rounded-md divide-y">
            {categories.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                {isRTL ? 'لا توجد تصنيفات مضافة بعد' : 'No Categories Added Yet'}
              </p>
            ) : (
              categories.map((category) => (
                <div 
                  key={category} 
                  className="p-3 flex justify-between items-center hover:bg-gray-50"
                >
                  <span>{category}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(category)}
                    aria-label={
                      isRTL 
                        ? `حذف ${category}`
                        : `Delete ${category}`
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesManager;
