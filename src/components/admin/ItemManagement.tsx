import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Eye, X } from 'lucide-react';

export interface Item {
  id: string | number;
  name: string;
  firstDescription: string;
  secondDescription: string;
  priceValue: number;
  priceCurrency: string;
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

interface ItemManagementProps {
  items: Item[];
  onSave: (item: Item) => Promise<boolean>;
  onDelete: (id: string | number) => Promise<boolean>;
  title?: string;
  type?: 'products' | 'crafts';
  categoryOptions?: Array<{key: string; label: string}>;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<Item> | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Mock translation function for demonstration
  const t = (key: string) => key;
  const isRTL = false;

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
      priceValue: 0,
      priceCurrency: '',
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
        priceValue: currentItem.priceValue || 0,
        priceCurrency: currentItem.priceCurrency || '',
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
    if (window.confirm(t('confirmDelete') || 'Are You Sure You Want To Delete This Item?')) {
      setIsProcessing(true);
      try {
        const success = await onDelete(id);
        if (!success) {
          console.error('Failed To Delete Item');
        }
      } catch (error) {
        console.error('Error Deleting Item:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev!,
      [name]: name === 'priceValue' ? Number(value) : value
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
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 mx-4 sm:mx-0">
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Item Details Dialog */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b">
            <DialogTitle className="text-lg sm:text-xl">{t('Item Details') || 'Item Details'}</DialogTitle>
          </DialogHeader>
          
          {viewingItem && (
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4">
              <div className="space-y-6">
                {/* Mobile Layout - Stack everything vertically */}
                <div className="block lg:hidden space-y-6">
                  {/* Image Section - Mobile */}
                  {viewingItem.image && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-base">{t('Image') || 'Image'}</h3>
                      <div 
                        className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={handleImageClick}
                      >
                        <img 
                          src={viewingItem.image} 
                          alt={viewingItem.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Basic Information - Mobile */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-base">{t('Basic Information') || 'Basic Information'}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium text-gray-600 block">ID:</span>
                          <span className="text-gray-900">{viewingItem.id}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 block">{t('Rating') || 'Rating'}:</span>
                          <span className="text-gray-900">{viewingItem.rating || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600 block">{t('Name') || 'Name'}:</span>
                        <span className="text-gray-900">{viewingItem.name}</span>
                      </div>
                      
                      {viewingItem.nameAr && (
                        <div>
                          <span className="font-medium text-gray-600 block">{t('Name (Arabic)') || 'Name (Arabic)'}:</span>
                          <span className="text-gray-900">{viewingItem.nameAr}</span>
                        </div>
                      )}
                      
                      <div>
                        <span className="font-medium text-gray-600 block">{t('Price') || 'Price'}:</span>
                        <span className="text-gray-900">{viewingItem.priceValue} {viewingItem.priceCurrency}</span>
                      </div>
                      
                      {viewingItem.category && (
                        <div>
                          <span className="font-medium text-gray-600 block">{t('Category') || 'Category'}:</span>
                          <span className="text-gray-900">{categoryOptions.find(opt => opt.key === viewingItem.category)?.label || viewingItem.category}</span>
                        </div>
                      )}
                      
                      {viewingItem.seller && (
                        <div>
                          <span className="font-medium text-gray-600 block">{t('Seller') || 'Seller'}:</span>
                          <span className="text-gray-900">{viewingItem.seller}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Side by side */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-6">
                  {/* Basic Information - Desktop */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">{t('Basic Information') || 'Basic Information'}</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-medium text-gray-600">ID:</span> {viewingItem.id}</p>
                      <p><span className="font-medium text-gray-600">{t('Name') || 'Name'}:</span> {viewingItem.name}</p>
                      {viewingItem.nameAr && (
                        <p>
                          <span className="font-medium text-gray-600">{t('Name (Arabic)') || 'Name (Arabic)'}:</span> {viewingItem.nameAr}
                        </p>
                      )}
                      <p><span className="font-medium text-gray-600">{t('Price') || 'Price'}:</span> {viewingItem.priceValue} {viewingItem.priceCurrency}</p>
                      {viewingItem.category && (
                        <p>
                          <span className="font-medium text-gray-600">{t('Category') || 'Category'}:</span>{" "}
                          {categoryOptions.find(opt => opt.key === viewingItem.category)?.label || viewingItem.category}
                        </p>
                      )}
                      {viewingItem.seller && (
                        <p>
                          <span className="font-medium text-gray-600">{t('Seller') || 'Seller'}:</span> {viewingItem.seller}
                        </p>
                      )}
                      <p><span className="font-medium text-gray-600">{t('Rating') || 'Rating'}:</span> {viewingItem.rating || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Image - Desktop */}
                  {viewingItem.image && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">{t('Image') || 'Image'}</h3>
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
                
                {/* Descriptions - Full width on all screens */}
                {(viewingItem.firstDescription || viewingItem.secondDescription || viewingItem.description) && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-base sm:text-lg">{t('Description') || 'Description'}</h3>
                    <div className="space-y-4 text-sm text-gray-600">
                      {viewingItem.firstDescription && (
                        <div className="space-y-1">
                          <p className="whitespace-pre-line leading-relaxed">{viewingItem.firstDescription}</p>
                          {viewingItem.secondDescription && <div className="h-px bg-gray-100 my-3"></div>}
                        </div>
                      )}
                      {viewingItem.secondDescription && (
                        <div className="space-y-1">
                          <p className="whitespace-pre-line leading-relaxed">{viewingItem.secondDescription}</p>
                        </div>
                      )}
                      {viewingItem.description && !viewingItem.firstDescription && !viewingItem.secondDescription && (
                        <p className="whitespace-pre-line leading-relaxed">{viewingItem.description}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Additional Information */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-500">
                    {viewingItem.createdAt && (
                      <p><span className="font-medium text-gray-600">{t('Created At') || 'Created At'}:</span> {formatDate(viewingItem.createdAt)}</p>
                    )}
                    {viewingItem.updatedAt && viewingItem.updatedAt !== viewingItem.createdAt && (
                      <p><span className="font-medium text-gray-600">{t('Updated At') || 'Updated At'}:</span> {formatDate(viewingItem.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Modal */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="w-[95vw] h-[95vh] max-w-none max-h-none p-0 bg-black/90 border-0 shadow-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              onClick={() => setIsImageOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={viewingItem?.image} 
              alt={viewingItem?.name} 
              className="w-full h-full max-h-[85vh] object-contain p-4"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>}
        <Button onClick={handleAddNew} className="w-full sm:w-auto flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="text-sm sm:text-base">{t('addNew') || 'Add New'}</span>
        </Button>
      </div>

      {/* Edit Form */}
      {isEditing && currentItem && (
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              {isNewItem ? t('addNewItem') || 'Add New Item' : t('editItem') || 'Edit Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t('nameEn') || 'Name (English)'}</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentItem.name || ''}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder') || 'Enter item name in English'}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr" className="text-sm font-medium">{t('nameAr') || 'Name (Arabic)'}</Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={currentItem.nameAr || ''}
                  onChange={handleChange}
                  dir="rtl"
                  placeholder={t('nameArPlaceholder') || 'Enter item name in Arabic'}
                  className="w-full"
                />
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category - Full width on mobile, half on tablet, half on desktop */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                <Label htmlFor="category" className="text-sm font-medium">{t('category') || 'Category'}</Label>
                <select
                  id="category"
                  name="category"
                  value={currentItem?.category || ''}
                  onChange={handleChange}
                  className="block w-full p-3 border rounded-md focus:ring focus:ring-opacity-50 text-sm"
                >
                  {categoryOptions.map(option => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price - Half width on mobile, quarter on larger screens */}
              <div className="space-y-2">
                <Label htmlFor="priceValue" className="text-sm font-medium">{t('price') || 'Price'}</Label>
                <Input
                  id="priceValue"
                  name="priceValue"
                  type="number"
                  value={currentItem.priceValue || ''}
                  onChange={handleChange}
                  placeholder={t('pricePlaceholder') || 'Enter price'}
                  className="w-full"
                />
              </div>
              
              {/* Currency - Half width on mobile, quarter on larger screens */}
              <div className="space-y-2">
                <Label htmlFor="priceCurrency" className="text-sm font-medium">{t('currency') || 'Currency'}</Label>
                <Input
                  id="priceCurrency"
                  name="priceCurrency"
                  value={currentItem.priceCurrency || ''}
                  onChange={handleChange}
                  placeholder={t('Enter Currency') || 'Enter Currency'}
                  className="w-full"
                />
              </div>
            </div>

            {/* Seller and Rating */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seller" className="text-sm font-medium">{t('seller') || 'Seller'}</Label>
                <Input
                  id="seller"
                  name="seller"
                  value={currentItem.seller || ''}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-sm font-medium">{t('rating') || 'Rating'}</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentItem.rating || ''}
                  onChange={handleChange}
                  placeholder={t('Enter Rating (0-5)') || 'Enter Rating (0-5)'}
                  className="w-full"
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstDescription" className="text-sm font-medium">{t('firstDescription') || 'First Description'}</Label>
                <Textarea
                  id="firstDescription"
                  name="firstDescription"
                  value={currentItem.firstDescription || ''}
                  onChange={handleChange}
                  rows={3}
                  required
                  placeholder={t('Enter First Description') || 'Enter First Description'}
                  className="w-full resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondDescription" className="text-sm font-medium">{t('secondDescription') || 'Second Description'}</Label>
                <Textarea
                  id="secondDescription"
                  name="secondDescription"
                  value={currentItem.secondDescription || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('Enter Second Description (Optional)') || 'Enter Second Description (Optional)'}
                  className="w-full resize-none"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="text-sm font-medium">{t('image') || 'Image'}</Label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {currentItem.image ? (
                  <div className="relative">
                    <img 
                      src={currentItem.image} 
                      alt="Preview" 
                      className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentItem(prev => ({ ...prev!, image: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 w-full sm:w-auto">
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
                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {currentItem.image ? t('Change Image') || 'Change Image' : t('Upload Image') || 'Upload Image'}
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {t('Cancel') || 'Cancel'}
              </Button>
              <Button 
                onClick={handleSave}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isNewItem ? (t('Add') || 'Add') : (t('Save') || 'Save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{t('Image') || 'Image'}</TableHead>
                  <TableHead>{t('Name') || 'Name'}</TableHead>
                  <TableHead className="w-32">{t('Price') || 'Price'}</TableHead>
                  {categoryOptions.length > 0 && <TableHead className="w-32">{t('Category') || 'Category'}</TableHead>}
                  <TableHead className="w-32 text-right">{t('Actions') || 'Actions'}</TableHead>
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
                            className="w-12 h-12 object-cover rounded-md border"
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
                            title={t('View Details') || 'View Details'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            title={t('Edit') || 'Edit'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            title={t('Delete') || 'Delete'}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={categoryOptions.length > 0 ? 5 : 4} className="text-center py-8 text-gray-500">
                      {t('No Items Found') || 'No Items Found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {items.length > 0 ? (
              items.map((item, index) => (
                <Card key={`${item.id}-${index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-xs text-center">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{item.priceValue} {item.priceCurrency}</p>
                        {categoryOptions.length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {categoryOptions.find(opt => opt.key === item.category)?.label || item.category}
                          </p>
                        )}
                        
                        {/* Mobile Actions */}
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                            className="flex items-center gap-1 text-xs px-2 py-1 h-8"
                          >
                            <Eye className="h-3 w-3" />
                            <span className="hidden xs:inline">{t('View') || 'View'}</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 text-xs px-2 py-1 h-8"
                          >
                            <Edit className="h-3 w-3" />
                            <span className="hidden xs:inline">{t('Edit') || 'Edit'}</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 text-xs px-2 py-1 h-8 text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden xs:inline">{t('Delete') || 'Delete'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  {t('No Items Found') || 'No Items Found'}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}