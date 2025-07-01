import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import {  searchMaterials, setSearchQuery, setSelectedCategory, clearSearch } from '@/redux/slices/materialSlices/materialsSlice';
import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, Crown, Palette, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (material: MaterialModel) => void;
  selectedMaterialId?: string;
}

export function MaterialPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedMaterialId,
}: MaterialPickerDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { materials, categories, searchQuery, selectedCategory, isLoading } = useSelector(
    (state: RootState) => state.materials
  );
  
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (open && materials.length === 0) {
     // dispatch(fetchMaterials());
    }
  }, [open, materials.length, dispatch]);

  useEffect(() => {
    if (open) {
      const delayedSearch = setTimeout(() => {
        if (searchQuery) {
          dispatch(searchMaterials({ 
            query: searchQuery, 
            category: selectedCategory || undefined 
          }));
        } else {
          // If no search query, fetch all materials
        //  dispatch(fetchMaterials());
        }
      }, 300);

      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery, selectedCategory, open, dispatch]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleCategorySelect = (category: string | null) => {
    dispatch(setSelectedCategory(category));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  const handleMaterialSelect = (material: MaterialModel) => {
    onSelect(material);
    onOpenChange(false);
  };

  const filteredMaterials = materials.filter(material => {
    // Since MaterialModel doesn't have a type property, we'll show all materials for now
    // This can be updated based on material_type_id or other properties when available
    let passesFilter = true;
    
    // Apply search filter if searchQuery exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      passesFilter = passesFilter && Boolean(
        material.title?.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query)
      );
    }
    
    return passesFilter;
  });

  const MaterialCard = ({ material }: { material: MaterialModel }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          selectedMaterialId === material.id.toString()
            ? 'ring-2 ring-primary border-primary'
            : 'hover:border-primary/50'
        )}
        onClick={() => handleMaterialSelect(material)}
      >
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Material Preview */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {material.color ? (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: material.color }}
                />
              ) : material.photo ? (
                <img
                  src={material.photo}
                  alt={material.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              {/* Featured Badge */}
              {material.is_featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
                    <Crown className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              {/* Material Type Icon */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Material
                </Badge>
              </div>
            </div>

            {/* Material Info */}
            <div className="space-y-2">
              <div>
                <h3 className="font-medium text-sm truncate">{material.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{material.description || 'No description'}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  ID: {material.id}
                </Badge>
                {material.status && (
                  <Badge variant="outline" className="text-xs text-green-600">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3">
            <div className="space-y-3">
              <Skeleton className="aspect-video rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Choose Material</span>
          </DialogTitle>
          <DialogDescription>
            Select a material to apply to your segment
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategorySelect(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Material Type Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="textures">Textures</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 min-h-0">
              <ScrollArea className="h-[400px] pr-4">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LoadingSkeleton />
                    </motion.div>
                  ) : filteredMaterials.length > 0 ? (
                    <motion.div
                      key="materials"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {filteredMaterials.map((material, index) => (
                        <motion.div
                          key={material.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <MaterialCard material={material} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No materials found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or category filters
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''} found
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}