import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { SwatchCard } from "@/components/swatch/SwatchCard";
import { SwatchFilters } from "@/components/swatch/SwatchFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppDispatch, RootState } from "@/redux/store";
import { setFilters, setPage } from "@/redux/slices/swatchSlice";
import {
  addMaterialPagination,
  fetchMaterials,
} from "@/redux/slices/materialSlices/materialsSlice";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FilterDropdown } from "@/AdminPannel/components/products/FilterComp";
import { ActiveFilter } from "./interfaces";
import {
  adminFetchMaterial,
  handleAddFilters,
  handleRemoverFilters,
} from "@/AdminPannel/reduxslices/adminMaterialLibSlice";

type ViewMode = "grid" | "list";
type LayoutMode = "compact" | "detailed";

interface SwatchBookMainContentProps {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  showFilters: boolean;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  getActiveFiltersCount: () => number;
  onOpenChange: (id: number) => void;
}

export function SwatchBookMainContent({
  viewMode,
  layoutMode,
  showFilters,
  showFavoritesOnly,
  setShowFavoritesOnly,
  getActiveFiltersCount,
  onOpenChange,
}: SwatchBookMainContentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, pagination } = useSelector(
    (state: RootState) => state.materials
  );
  const { materials, loading, filteringData, total } = useSelector(
    (state: RootState) => state.materialsdetails
  );
  const { list: brands } = useSelector((state: RootState) => state.adminBrands);
  const { list: categories } = useSelector(
    (state: RootState) => state.adminMaterials
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const removeFilter = (type: "category" | "brand", id: number) => {
    const newFilters = activeFilters.filter(
      (f) => !(f.type === type && f.id === id)
    );
    setActiveFilters(newFilters);
    dispatch(handleRemoverFilters({ type, values: newFilters }));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    // setSearchQuery("");
  };

  useEffect(() => {
    if (loading == null) {
      dispatch(adminFetchMaterial(filteringData));
    }
  }, [filteringData]);

  const addFilter = (type: "category" | "brand", id: number, name: string) => {
    const exists = activeFilters.some((f) => f.type === type && f.id === id);
    if (!exists) {
      setActiveFilters([...activeFilters, { type, id, name }]);
      dispatch(
        handleAddFilters({
          type: type,
          values: [...activeFilters, { type, id, name }],
        })
      );
    }
    setShowFilterDropdown(false);
  };

  //   const filteredSwatches = showFavoritesOnly
  //     ? swatches.filter(swatch => favorites.includes(swatch._id))
  //     : swatches;

  const handlePageChange = async (page: number) => {
    dispatch(addMaterialPagination(page));
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await dispatch(
        fetchMaterials({ page: page, limit: 100 })
      );
      if (fetchMaterials.fulfilled.match(response)) {
        // Successfully fetched materials, no additional action needed
        toast.success("Swatches fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching swatches:", error);
      dispatch(setFilters({}));
      dispatch(setPage(1));
    }
  };

  const LoadingSkeleton = () => (
    <div
      className={cn(
        "grid gap-4",
        layoutMode === "compact"
          ? viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
            : "grid-cols-1"
          : viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}
    >
      {[...Array(layoutMode === "compact" ? 24 : 12)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton
            className={cn(
              layoutMode === "compact"
                ? viewMode === "grid"
                  ? "aspect-square h-24"
                  : "h-16"
                : viewMode === "grid"
                ? "aspect-square"
                : "h-24"
            )}
          />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:block w-full relative"
        >
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 relative"
          >
            <Filter className="w-4 h-4" />
            Add filter
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilterDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showFilterDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowFilterDropdown(false)}
              />
              <FilterDropdown
                categories={categories}
                brands={brands}
                activeFilters={activeFilters}
                onAddFilter={addFilter}
                onClose={() => setShowFilterDropdown(false)}
              />
            </>
          )}

          <div className="flex gap-1 flex-wrap">
            {activeFilters.map((filter, idx) => (
              <div
                key={`${filter.type}-${filter.id}-${idx}`}
                className="inline-flex gap-2 items-center px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg mt-2"
              >
                <span className="text-xs opacity-75">
                  {filter.type === "category" ? "Category" : "Brand"}:
                </span>
                <span className="font-medium">{filter.name}</span>
                <button
                  onClick={() => removeFilter(filter.type, filter.id)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors outline-none hover:outline-none"
                >
                  <X className={`w-3.5 h-3.5 hover:text-white text-black`} />
                </button>
              </div>
            ))}
          </div>
          {/* <SwatchFilters /> */}
        </motion.aside>
      </AnimatePresence>

      {/* Mobile Filters */}
      {/* {showFilters && (
        <div className="lg:hidden mb-6">
          <SwatchFilters compact />
        </div>
      )} */}

      {/* Results */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              "Loading swatches..."
            ) : (
              <>
                Showing {materials.length} of {pagination.total} materials
                {showFavoritesOnly && " (favorites only)"}
                {layoutMode === "compact" && " • Compact view"}
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button>Try Again</Button>
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {!isLoading && !error && materials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground mb-4">
              {showFavoritesOnly ? (
                <>
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    No favorites yet
                  </h3>
                  <p>Start exploring swatches and add your favorites!</p>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    No swatches found
                  </h3>
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

        {!isLoading && !error && materials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={cn(
                "grid gap-4",
                layoutMode === "compact"
                  ? viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
                    : "grid-cols-1"
                  : viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              <AnimatePresence>
                {materials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <SwatchCard
                      onOpenChange={onOpenChange}
                      swatch={material}
                      variant={viewMode}
                      layoutMode={layoutMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

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
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
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
                    variant={
                      pagination.page === pagination.totalPages
                        ? "default"
                        : "outline"
                    }
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
  );
}
