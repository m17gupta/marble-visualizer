import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSwatches, setPage, setFilters } from '@/redux/slices/swatchSlice';
import { SwatchCard } from '@/components/swatch/SwatchCard';
import { SwatchFilters } from '@/components/swatch/SwatchFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Search,
  Grid3X3,
  List,
  ArrowUpDown,
  Heart,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  LayoutGrid,
  Rows3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type LayoutMode = 'compact' | 'detailed';
type SortOption = 'name' | 'price_low' | 'price_high' | 'lrv_low' | 'lrv_high' | 'newest' | 'popular';

export function SwatchBookPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { 
    swatches, 
    filters, 
    favorites,
    isLoading, 
    error, 
    pagination 
  } = useSelector((state: RootState) => state.swatches);
  
  const { profile } = useSelector((state: RootState) => state.userProfile);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('compact');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const canImport = profile?.role === 'admin' || profile?.role === 'vendor';

  // Set compact layout as default and increase items per page
  useEffect(() => {
    // Update pagination to show more items in compact mode
    const newLimit = layoutMode === 'compact' ? 48 : 24;
    if (pagination.limit !== newLimit) {
      dispatch(setPage(1)); // Reset to first page when changing layout
    }
  }, [layoutMode, dispatch, pagination.limit]);

  useEffect(() => {
    dispatch(fetchSwatches({ page: pagination.page, filters }));
  }, [dispatch, pagination.page, filters, layoutMode]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
    dispatch(setPage(1));
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    // In a real app, this would be handled by the backend
    // For now, we'll just update the UI state
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name': return 'Name A-Z';
      case 'price_low': return 'Price: Low to High';
      case 'price_high': return 'Price: High to Low';
      case 'lrv_low': return 'LRV: Dark to Light';
      case 'lrv_high': return 'LRV: Light to Dark';
      case 'newest': return 'Newest First';
      case 'popular': return 'Most Popular';
      default: return 'Name A-Z';
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.style) count++;
    if (filters.finish) count++;
    if (filters.coating_type) count++;
    if (filters.tags.length > 0) count++;
    if (filters.segment_types.length > 0) count++;
    if (filters.price_range[0] > 0 || filters.price_range[1] < 200) count++;
    if (filters.lrv_range[0] > 0 || filters.lrv_range[1] < 100) count++;
    return count;
  };

  const filteredSwatches = showFavoritesOnly 
    ? swatches.filter(swatch => favorites.includes(swatch._id))
    : swatches;

  const LoadingSkeleton = () => (
    <div className={cn(
      'grid gap-4',
      layoutMode === 'compact' 
        ? (viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8' 
          : 'grid-cols-1')
        : (viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1')
    )}>
      {[...Array(layoutMode === 'compact' ? 24 : 12)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className={cn(
            layoutMode === 'compact' 
              ? (viewMode === 'grid' ? 'aspect-square h-24' : 'h-16')
              : (viewMode === 'grid' ? 'aspect-square' : 'h-24')
          )} />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SwatchBook</h1>
          <p className="text-muted-foreground">
            Discover and explore our comprehensive collection of paint swatches
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/swatch/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Swatch
          </Button>
          
          {canImport && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/swatch/import')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Swatches
            </Button>
          )}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search swatches by name, brand, or tags..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Layout Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="layout-mode" className="text-sm whitespace-nowrap">Layout:</Label>
            <div className="flex items-center border rounded-md">
              <Button
                variant={layoutMode === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('compact')}
                className="rounded-r-none border-r"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Compact</span>
              </Button>
              <Button
                variant={layoutMode === 'detailed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('detailed')}
                className="rounded-l-none"
              >
                <Rows3 className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Detailed</span>
              </Button>
            </div>
          </div>

          {/* Favorites Toggle */}
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center space-x-1"
          >
            <Heart className={cn('h-4 w-4', showFavoritesOnly && 'fill-current')} />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {favorites.length}
              </Badge>
            )}
          </Button>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{getSortLabel(sortBy)}</span>
                <span className="sm:hidden">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Name A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('price_low')}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('price_high')}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('lrv_low')}>
                LRV: Dark to Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('lrv_high')}>
                LRV: Light to Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('popular')}>
                Most Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.search && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Search: "{filters.search}"
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Category: {filters.category}
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Brand: {filters.brand}
            </Badge>
          )}
          {filters.style && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Style: {filters.style}
            </Badge>
          )}
          {filters.finish && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Finish: {filters.finish}
            </Badge>
          )}
          {filters.coating_type && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Type: {filters.coating_type}
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground">
              Tag: {tag}
            </Badge>
          ))}
          {filters.segment_types.map(type => (
            <Badge key={type} variant="secondary" className="bg-muted text-muted-foreground">
              Area: {type}
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block flex-shrink-0"
            >
              <SwatchFilters />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mb-6">
            <SwatchFilters compact />
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                'Loading swatches...'
              ) : (
                <>
                  Showing {filteredSwatches.length} of {pagination.total} swatches
                  {showFavoritesOnly && ' (favorites only)'}
                  {layoutMode === 'compact' && ' • Compact view'}
                </>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => dispatch(fetchSwatches({ page: 1, filters }))}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSkeleton />}

          {/* Empty State */}
          {!isLoading && !error && filteredSwatches.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-muted-foreground mb-4">
                {showFavoritesOnly ? (
                  <>
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No favorites yet</h3>
                    <p>Start exploring swatches and add your favorites!</p>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No swatches found</h3>
                    <p>Try adjusting your search or filters</p>
                  </>
                )}
              </div>
              {(showFavoritesOnly || getActiveFiltersCount() > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFavoritesOnly(false);
                    dispatch(setFilters({}));
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </motion.div>
          )}

          {/* Swatches Grid/List */}
          {!isLoading && !error && filteredSwatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className={cn(
                'grid gap-4',
                layoutMode === 'compact' 
                  ? (viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8' 
                    : 'grid-cols-1')
                  : (viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1')
              )}>
                <AnimatePresence>
                  {filteredSwatches.map((swatch, index) => (
                    <motion.div
                      key={swatch._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      <SwatchCard 
                        swatch={swatch} 
                        variant={viewMode} 
                        layoutMode={layoutMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={pagination.page === pagination.totalPages ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {pagination.totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}