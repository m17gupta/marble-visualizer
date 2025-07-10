import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '@/redux/store';
import {
  fetchMaterialSegments,
  setFilters,
  clearFilters,
} from '@/redux/slices/materialSlices/materialSegmentSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Palette,
  Grid,
  List,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MaterialSegmentListProps {
  className?: string;
}

export function MaterialSegmentList({ className }: MaterialSegmentListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    segments, 
    segmentLoading, 
    error, 
    filters 
  } = useSelector((state: RootState) => state.materialSegments);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch segments on component mount
  useEffect(() => {
    dispatch(fetchMaterialSegments());
  }, [dispatch]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
    dispatch(fetchMaterialSegments({ ...filters, search: query }));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchMaterialSegments({ ...filters, ...newFilters }));
  };

  // Handle segment selection
  const handleSelectSegment = (segmentId: number) => {
   
  };

  // Handle segment creation
  // const handleCreateSegment = async () => {
  //   try {
  //     const newSegment = {
  //       name: 'New Material Segment',
  //       color: '#3B82F6',
  //       color_code: '#3B82F6',
  //       short_code: 'NMS',
  //       index: segments.length,
  //       is_active: true,
  //       is_visible: true,
  //       description: 'A new material segment',
  //       categories: ['default'],
  //       gallery: [],
  //     };

  //     await dispatch(createMaterialSegment(newSegment)).unwrap();
  //     toast({
  //       title: 'Success',
  //       description: 'Material segment created successfully',
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to create material segment',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // Handle segment update
  // const handleUpdateSegment = async (segmentId: number, updates: any) => {
  //   try {
  //     await dispatch(updateMaterialSegment({ id: segmentId, ...updates })).unwrap();
  //     toast({
  //       title: 'Success',
  //       description: 'Material segment updated successfully',
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to update material segment',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // Handle segment deletion
  // const handleDeleteSegment = async (segmentId: number) => {
  //   try {
  //     await dispatch(deleteMaterialSegment(segmentId)).unwrap();
  //     toast({
  //       title: 'Success',
  //       description: 'Material segment deleted successfully',
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to delete material segment',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchQuery('');
    dispatch(fetchMaterialSegments());
  };

  if (segmentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchMaterialSegments())}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Material Segments</h2>
          <p className="text-gray-600 mt-1">
            Manage your material segments and their properties
          </p>
        </div>
        <Button 
        //onClick={handleCreateSegment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search material segments..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border-t bg-gray-50 rounded-b-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="activeFilter">Status</Label>
                  <select
                    id="activeFilter"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => handleFilterChange({ 
                      is_active: e.target.value === 'all' ? undefined : e.target.value === 'true' 
                    })}
                  >
                    <option value="all">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="visibleFilter">Visibility</Label>
                  <select
                    id="visibleFilter"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => handleFilterChange({ 
                      is_visible: e.target.value === 'all' ? undefined : e.target.value === 'true' 
                    })}
                  >
                    <option value="all">All</option>
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Material Segments */}
      {segments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No material segments found
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first material segment to get started
            </p>
            <Button 
            //onClick={handleCreateSegment}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Segment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {segments.map((segment) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg`}
                onClick={() => handleSelectSegment(segment.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: segment.color }}
                      />
                      <div>
                        <CardTitle className="text-lg">{segment.name}</CardTitle>
                        <p className="text-sm text-gray-600">{segment.short_code}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem 
                        // onClick={() => handleUpdateSegment(segment.id, { 
                        //   is_visible: !segment.is_visible 
                        // })}
                        >
                          {segment.is_visible ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Show
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          // onClick={() => handleDeleteSegment(segment.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {segment.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={segment.is_active ? 'default' : 'secondary'}>
                          {segment.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {!segment.is_visible && (
                          <Badge variant="outline">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        #{segment.index}
                      </div>
                    </div>
                    {segment.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {segment.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
