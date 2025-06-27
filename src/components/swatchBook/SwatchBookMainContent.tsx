import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SwatchCard } from '@/components/swatch/SwatchCard';
import { SwatchFilters } from '@/components/swatch/SwatchFilters';
import { Swatch } from '@/redux/slices/swatchSlice';
import { ViewMode, LayoutMode, Pagination } from './types';
import {
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwatchBookMainContentProps {
  showFilters: boolean;
  isLoading: boolean;
  error: string | null;
  filteredSwatches: Swatch[];
  pagination: Pagination;
  showFavoritesOnly: boolean;
  layoutMode: LayoutMode;
  viewMode: ViewMode;
  activeFiltersCount: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function SwatchBookMainContent({
  showFilters,
  isLoading,
  error,
  filteredSwatches,
  pagination,
  showFavoritesOnly,
  layoutMode,
  viewMode,
  activeFiltersCount,
  onPageChange,
  onRetry,
  onClearFilters
}: SwatchBookMainContentProps) {
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
            <Button onClick={onRetry}>
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
            {(showFavoritesOnly || activeFiltersCount > 0) && (
              <Button variant="outline" onClick={onClearFilters}>
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
              onClick={() => onPageChange(pagination.page - 1)}
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
                    onClick={() => onPageChange(pageNum)}
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
                    onClick={() => onPageChange(pagination.totalPages)}
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
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
