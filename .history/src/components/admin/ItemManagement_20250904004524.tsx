import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Item {
  id: string | number;
  name: string;
  firstDescription: string;
  secondDescription: string;
  priceValue: number; // Numeric price field
  priceCurrency: string; // Currency string field
  category: string;
  image: string;
  seller: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
  // For backward compatibility
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  madeBy?: string;
}

interface ItemManagementProps {
  items: Item[];
  onSave: (item: Item) => Promise<boolean>;
  onDelete: (id: string | number) => Promise<boolean>;
  title?: string;
  type?: 'products' | 'crafts';
  categoryOptions?: Array<{key: string; label: string}>;
  loading?: boolean;
  error?: string | null;
}

export function ItemManagement({ 
  items, 
  onSave, 
  onDelete, 
  title, 
  type = 'products',
  categoryOptions = [],
  loading = false,
  error = null 
}: ItemManagementProps) {
  const { t, isRTL } = useLanguage();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<Item> | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleViewDetails = (item: Item) => {
    setViewingItem(item);
    setIsViewing(true);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingItem?.image) {
      setIsImageOpen(true);
    }
  };

  const handleEdit = (item: Item) => {
    const itemCopy = { ...item };
    // Ensure priceValue and priceCurrency are properly set
    itemCopy.priceValue = item.priceValue || 0;
    itemCopy.priceCurrency = item.priceCurrency || '';
    setCurrentItem(itemCopy);
    setIsEditing(true);
    setIsNewItem(false);
  };

  const handleAddNew = () => {
    setCurrentItem({
      id: '',
      name: '',
      priceValue: 0, // Default numeric price
      priceCurrency: '', // Default empty currency
      category: categoryOptions[0]?.key || '',
      image: '',
      firstDescription: '',
      secondDescription: '',
      seller: '',
      rating: 0,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsNewItem(true);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    
    setIsProcessing(true);
    try {
      const itemToSave: Item = {
        ...currentItem,
        id: currentItem.id?.toString() || Date.now().toString(),
        name: currentItem.name || 'Unnamed Item',
        priceValue: currentItem.priceValue || 0, // Ensure numeric price
        priceCurrency: currentItem.priceCurrency || '', // Ensure currency string
        rating: currentItem.rating || 0,
        secondDescription: currentItem.secondDescription || '',
        firstDescription: currentItem.firstDescription || '',
        category: currentItem.category || categoryOptions[0]?.key || 'other',
        image: currentItem.image || (type === 'crafts' ? '/placeholder-craft.jpg' : '/placeholder-food.jpg'),
        seller: currentItem.seller || '',
        description: currentItem.description || '',
        createdAt: currentItem.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const success = await onSave(itemToSave);
      if (success) {
        setIsEditing(false);
        setCurrentItem(null);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string | number) => {
  if (window.confirm(t('confirmDelete') || 'Are you sure you want to delete this item?')) {
      setIsProcessing(true);
      try {
        const success = await onDelete(id);
        if (!success) {
          console.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev!,
      [name]: name === 'priceValue' ? Number(value) : value // Convert priceValue to number
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem(prev => ({
          ...prev!,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || isProcessing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Item Details Dialog */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('itemDetails') || 'Item Details'}</DialogTitle>
          </DialogHeader>
          
          {viewingItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">{t('basicInfo') || 'Basic Information'}</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="font-medium text-gray-600">ID:</span> {viewingItem.id}</p>
                    <p><span className="font-medium text-gray-600">{t('name') || 'Name'}:</span> {viewingItem.name}</p>
                    {viewingItem.nameAr && (
                      <p className={!viewingItem.nameAr ? 'hidden' : ''}>
                        <span className="font-medium text-gray-600">{t('nameAr') || 'Name (Arabic)'}:</span> {viewingItem.nameAr}
                      </p>
                    )}
                    <p><span className="font-medium text-gray-600">{t('price') || 'Price'}:</span> {viewingItem.priceValue} {viewingItem.priceCurrency}</p>
                    {viewingItem.category && (
                      <p className={!viewingItem.category ? 'hidden' : ''}>
                        <span className="font-medium text-gray-600">{t('category') || 'Category'}:</span>{" "}
                        {categoryOptions.find(opt => opt.key === viewingItem.category)?.label || viewingItem.category}
                      </p>
                    )}
                    {viewingItem.seller && (
                      <p className={!viewingItem.seller ? 'hidden' : ''}>
                        <span className="font-medium text-gray-600">{t('seller') || 'Seller'}:</span> {viewingItem.seller}
                      </p>
                    )}
                    <p><span className="font-medium text-gray-600">{t('rating') || 'Rating'}:</span> {viewingItem.rating || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Image */}
                {viewingItem.image && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">{t('image') || 'Image'}</h3>
                    <div 
                      className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={handleImageClick}
                    >
                      <img 
                        src={viewingItem.image} 
                        alt={viewingItem.name} 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Descriptions */}
              {(viewingItem.firstDescription || viewingItem.secondDescription || viewingItem.description) && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-lg">{t('description', 'Description')}</h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    {viewingItem.firstDescription && (
                      <div className="space-y-1">
                        <p className="whitespace-pre-line">{viewingItem.firstDescription}</p>
                        {viewingItem.secondDescription && <div className="h-px bg-gray-100 my-2"></div>}
                      </div>
                    )}
                    {viewingItem.secondDescription && (
                      <div className="space-y-1">
                        <p className="whitespace-pre-line">{viewingItem.secondDescription}</p>
                      </div>
                    )}
                    {viewingItem.description && !viewingItem.firstDescription && !viewingItem.secondDescription && (
                      <p className="whitespace-pre-line">{viewingItem.description}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Additional Information */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  {viewingItem.createdAt && (
                    <p><span className="font-medium text-gray-600">{t('createdAt') || 'Created'}:</span> {formatDate(viewingItem.createdAt)}</p>
                  )}
                  {viewingItem.updatedAt && viewingItem.updatedAt !== viewingItem.createdAt && (
                    <p><span className="font-medium text-gray-600">{t('updatedAt') || 'Updated'}:</span> {formatDate(viewingItem.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Modal */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
          <div className="relative w-full h-full">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
              onClick={() => setIsImageOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={viewingItem?.image} 
              alt={viewingItem?.name} 
              className="w-full h-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('addNew') || 'Add New'}
        </Button>
      </div>

      {isEditing && currentItem && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isNewItem ? t('addNewItem') || 'Add New Item' : t('editItem') || 'Edit Item'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('nameEn') || 'Name (English)'}</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentItem.name || ''}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder') || 'Enter item name in English'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">{t('nameAr') || 'Name (Arabic)'}</Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={currentItem.nameAr || ''}
                  onChange={handleChange}
                  dir="rtl"
                  placeholder={t('nameArPlaceholder') || 'Enter item name in Arabic'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category - Takes half width (2/4) */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">{t('category') || 'Category'}</Label>
                <select
                  id="category"
                  name="category"
                  value={currentItem?.category || ''}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md focus:ring focus:ring-opacity-50"
                >
                  {categoryOptions.map(option => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price - Takes quarter width (1/4) */}
              <div className="space-y-2">
                <Label htmlFor="priceValue">{t('price') || 'Price'}</Label>
                <Input
                  id="priceValue"
                  name="priceValue"
                  type="text"
                  value={currentItem.priceValue || ''}
                  onChange={handleChange}
                  placeholder={t('pricePlaceholder') || 'Enter price'}
                />
              </div>
              
              {/* Currency - Takes quarter width (1/4) */}
              <div className="space-y-2">
                <Label htmlFor="priceCurrency">{t('currency') || 'Currency'}</Label>
                <Input
                  id="priceCurrency"
                  name="priceCurrency"
                  value={currentItem.priceCurrency || ''}
                  onChange={handleChange}
                  placeholder={t('currencyPlaceholder') || 'Enter currency'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seller">{t('seller') || 'Seller'}</Label>
                <Input
                  id="seller"
                  name="seller"
                  value={currentItem.seller || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">{t('rating') || 'Rating'}</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentItem.rating || ''}
                  onChange={handleChange}
                  placeholder={t('ratingPlaceholder') || 'Enter rating (0-5)'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="firstDescription">{t('firstDescription') || 'First Description'}</Label>
                <Textarea
                  id="firstDescription"
                  name="firstDescription"
                  value={currentItem.firstDescription || ''}
                  onChange={handleChange}
                  rows={2}
                  required
                  placeholder={t('firstDescriptionPlaceholder') || 'Enter first description'}
                />
              </div>

              {/* Second Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="secondDescription">{t('secondDescription') || 'Second Description'}</Label>
                <Textarea
                  id="secondDescription"
                  name="secondDescription"
                  value={currentItem.secondDescription || ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder={t('secondDescriptionPlaceholder') || 'Enter second description (optional)'}
                />
              </div>
            </div>

            {/* Category has been moved to be in the same row as price and currency */}

            <div className="space-y-2">
              <Label htmlFor="image-upload">{t('image') || 'Image'}</Label>
              <div className="flex items-center gap-4">
                {currentItem.image ? (
                  <div className="relative">
                    <img 
                      src={currentItem.image} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentItem(prev => ({ ...prev!, image: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-20 w-20 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {currentItem.image ? t('changeImage') || 'Change Image' : t('uploadImage') || 'Upload Image'}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t('cancel') || 'Cancel'}
              </Button>
              <Button onClick={handleSave}>
                {isNewItem ? (t('add') || 'Add') : (t('save') || 'Save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('image') || 'Image'}</TableHead>
                <TableHead>{t('name') || 'Name'}</TableHead>
                <TableHead>{t('price') || 'Price'}</TableHead>
                {categoryOptions.length > 0 && <TableHead>{t('category') || 'Category'}</TableHead>}
                <TableHead className="text-right">{t('actions') || 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <TableRow key={`${item.id}-${index}`}>
                    <TableCell>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.priceValue} {item.priceCurrency}</TableCell>
                    {categoryOptions.length > 0 && (
                      <TableCell>
                        {categoryOptions.find(opt => opt.key === item.category)?.label || item.category}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(item)}
                          title={t('viewDetails') || 'View details'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          title={t('edit') || 'Edit'}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          title={t('delete') || 'Delete'}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t('noItems') || 'No items found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
