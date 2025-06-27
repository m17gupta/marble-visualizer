import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSwatches, setPage, setFilters } from '@/redux/slices/swatchSlice';
import {
  SwatchBookHeader,
  SwatchBookSearchControls,
  SwatchBookActiveFilters,
  SwatchBookMainContent
} from '@/components/swatchBook';

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

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleRetry = () => {
    dispatch(fetchSwatches({ page: 1, filters }));
  };

  const handleClearFilters = () => {
    setShowFavoritesOnly(false);
    dispatch(setFilters({}));
  };

  const handleFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SwatchBookHeader 
        canImport={canImport}
        onCreateClick={() => navigate('/swatch/create')}
        onImportClick={() => navigate('/swatch/import')}
      />
      
      <SwatchBookSearchControls
        searchValue={filters.search}
        onSearchChange={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onFiltersToggle={handleFiltersToggle}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={handleFavoritesToggle}
        favoritesCount={favorites.length}
        activeFiltersCount={getActiveFiltersCount()}
      />
      
      <SwatchBookActiveFilters 
        filters={filters}
        activeFiltersCount={getActiveFiltersCount()}
      />
      
      <SwatchBookMainContent
        showFilters={showFilters}
        isLoading={isLoading}
        error={error}
        filteredSwatches={filteredSwatches}
        pagination={pagination}
        showFavoritesOnly={showFavoritesOnly}
        layoutMode={layoutMode}
        viewMode={viewMode}
        activeFiltersCount={getActiveFiltersCount()}
        onPageChange={handlePageChange}
        onRetry={handleRetry}
        onClearFilters={handleClearFilters}
      />
    </motion.div>
  );
}