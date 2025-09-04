import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ItemManagement, type Item as ManagementItem } from '@/components/admin/ItemManagement';
import { useCrafts } from '@/hooks/useCrafts';
import { useCategories } from '@/hooks/useCategories';
import type { Item } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Utility function to convert between the two Item types
const toManagementItem = (item: Item): ManagementItem => ({
  ...item,
  id: item.id,
  price: item.price ? String(item.price) : "", // Convert price to string
  firstDescription: item.firstDescription || "",
  secondDescription: item.secondDescription || "",
  seller: item.seller || "", // Remove default value
  rating: item.rating || 0,
  descriptionAr: item.descriptionAr || "", // Ensure Arabic description is preserved
  nameAr: item.nameAr || "", // Ensure Arabic name is preserved
  madeBy: item.madeBy || "", // Ensure madeBy is preserved
});

const CraftsPage = () => {
  const { t, isRTL } = useLanguage();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    crafts, 
    loading, 
    error: craftsError, 
    addCraft, 
    updateCraft, 
    deleteCraft 
  } = useCrafts();
  
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories('crafts');
  
  // Convert crafts to the format expected by ItemManagement
  const managementItems = useMemo(() => 
    crafts.map(craft => ({
      ...craft,
      id: craft.id,
      price: craft.price ? String(craft.price) : "", // Ensure price is a string
      firstDescription: craft.firstDescription || "",
      secondDescription: craft.secondDescription || "",
      seller: craft.seller || "", // Remove default value
      nameAr: craft.nameAr || "", // Ensure Arabic name is preserved
      descriptionAr: craft.descriptionAr || "", // Ensure Arabic description is preserved
      rating: craft.rating || 0,
    })), 
    [crafts]
  );

  const handleSaveCraft = async (craft: Item) => {
    if (!currentUser) {
      toast({
        title: t('auth.unauthorized') || 'Unauthorized',
        description: t('auth.loginRequired') || 'Please log in to perform this action',
        variant: 'destructive',
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      // Ensure we're adding to the crafts collection only
      const craftData = {
        ...craft,
        nameAr: craft.nameAr || "", // Ensure Arabic name is preserved
        descriptionAr: craft.descriptionAr || "", // Ensure Arabic description is preserved
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid,
        // Add a type field to distinguish between crafts and products
        type: 'craft'
      };

      // Check if this is a temporary ID (created with Date.now())
      const isTemporaryId = /^\d{13,}$/.test(craft.id);
      
      if (craft.id && !isTemporaryId) {
        // Update existing craft
        await updateCraft(craft.id, craftData);
        toast({
          title: t('crafts.updated') || 'Craft updated',
          description: t('crafts.updateSuccess') || 'The craft has been updated successfully',
        });
      } else {
        // Add new craft
        await addCraft({
          ...craftData,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.uid,
        });
        toast({
          title: t('crafts.added') || 'Craft added',
          description: t('crafts.addSuccess') || 'The craft has been added successfully',
        });
      }
      return true;
    } catch (err) {
      console.error('Error saving craft:', err);
      toast({
        title: t('admin.error') || 'Error',
        description: t('admin.saveCraftError') || 'Failed to save craft. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCraft = async (id: string) => {
    if (!currentUser) {
      toast({
        title: t('auth.unauthorized') || 'Unauthorized',
        description: t('auth.loginRequired') || 'Please log in to perform this action',
        variant: 'destructive',
      });
      return false;
    }

    if (!window.confirm(t('crafts.confirmDelete') || 'Are you sure you want to delete this craft? This action cannot be undone.')) {
      return false;
    }

    try {
      await deleteCraft(id);
      toast({
        title: t('crafts.deleted') || 'Craft deleted',
        description: t('crafts.deleteSuccess') || 'The craft has been deleted successfully',
      });
      return true;
    } catch (err) {
      console.error('Error deleting craft:', err);
      toast({
        title: t('admin.error') || 'Error',
        description: t('admin.deleteCraftError') || 'Failed to delete craft. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get available categories for the dropdown with a default 'Select Category' option
  const categoryOptions = useMemo(() => [
    { key: '', label: isRTL ? 'اختر تصنيف' : 'Select category' },
    ...(categories?.map(category => ({
      key: category.name,
      label: isRTL ? category.nameAr || category.name : category.name
    })) || [])
  ] as Array<{key: string; label: string}>, [categories, isRTL]);

  // Handle loading and error states
  if (loading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getErrorMessage = (error: unknown): string => {
    if (!error) return '';
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unknown error occurred';
  };

  if (craftsError || categoriesError) {
    const craftsErrorMsg = getErrorMessage(craftsError);
    const categoriesErrorMsg = getErrorMessage(categoriesError);
    
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('admin.loadingError') || 'Failed to load data. Please try again later.'}
              </h3>
              {craftsErrorMsg && (
                <div className="mt-2 text-sm text-red-700">
                  <p>Crafts: {craftsErrorMsg}</p>
                </div>
              )}
              {categoriesErrorMsg && (
                <div className="mt-2 text-sm text-red-700">
                  <p>Categories: {categoriesErrorMsg}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t('crafts.manage') || 'Manage Crafts'}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ItemManagement
          items={managementItems}
          categoryOptions={categoryOptions}
          loading={isSubmitting}
          error={craftsError || null}
          onSave={async (item: ManagementItem) => {
            // Convert back to the app's Item type
            const craftItem: Item = {
              ...item,
              id: item.id.toString(), // Ensure id is a string
              price: parseFloat(item.price as string) || 0,
              // Preserve Arabic fields
              nameAr: item.nameAr || '',
              descriptionAr: item.descriptionAr || '',
              // Ensure required fields are preserved
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              // Add any missing required fields with defaults
              category: item.category || '',
              image: item.image || '',
              description: item.description || '',
              seller: item.seller || '',
              rating: item.rating || 0,
              firstDescription: item.firstDescription || '',
              secondDescription: item.secondDescription || '',
            };
            return handleSaveCraft(craftItem);
          }}
          onDelete={async (id: string | number) => {
            const success = await handleDeleteCraft(id.toString());
            return success;
          }}
        />
      </div>
    </div>
  );
}
export default CraftsPage;
