import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";

import { SwatchBookHeader } from "@/components/swatchBook/SwatchBookHeader";
import { SwatchBookSearch } from "@/components/swatchBook/SwatchBookSearch";
import { SwatchBookControls } from "@/components/swatchBook/SwatchBookControls";
import { SwatchBookActiveFilters } from "@/components/swatchBook/SwatchBookActiveFilters";
import { SwatchBookMainContent } from "@/components/swatchBook/SwatchBookMainContent";
import { setPage } from "@/redux/slices/swatchSlice";
import { AdminPage, Sidebar } from "@/AdminPannel";
import { useNavigate } from "react-router-dom";

type ViewMode = "grid" | "list";
type LayoutMode = "compact" | "detailed";
type SortOption =
  | "name"
  | "price_low"
  | "price_high"
  | "lrv_low"
  | "lrv_high"
  | "newest"
  | "popular";

export function SwatchBookPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, pagination } = useSelector(
    (state: RootState) => state.swatches
  );
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<number | null>(null);
  const handleOpen = () => {
    setOpen((prev) => !prev);
    setEdit(null);
  };
  const handleEditOpen = (id: number) => {
    setOpen(true);
    setEdit(id);
  };

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("compact");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [showFilters, setShowFilters] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Set compact layout as default and increase items per page
  useEffect(() => {
    // Update pagination to show more items in compact mode
    const newLimit = layoutMode === "compact" ? 48 : 24;
    if (pagination.limit !== newLimit) {
      dispatch(setPage(1)); // Reset to first page when changing layout
    }
  }, [layoutMode, dispatch, pagination.limit]);

  // useEffect(() => {
  //   dispatch(fetchSwatches({ page: pagination.page, filters }));
  // }, [dispatch, pagination.page, filters, layoutMode]);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    // In a real app, this would be handled by the backend
    // For now, we'll just update the UI state
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

  const navigate = useNavigate();

  const getCurrentPageFromUrl = (): AdminPage => {
    const path = location.pathname.replace("/admin/", "");
    // Handle root admin path
    if (path === "" || path === "admin") return "dashboard";
    return path as AdminPage;
  };

  const [currentPage, setCurrentPage] = useState<AdminPage>(
    getCurrentPageFromUrl
  );

  const handlePageChange = (page: AdminPage) => {
    navigate(`/admin/${page}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 px-8"
    >
      {/* Header */}
      {/* <SwatchBookHeader open={open} onOpenChange={handleOpen} edit={edit} /> */}

      {/* Search and Controls */}
      <SwatchBookControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        sortBy={sortBy}
        handleSort={handleSort}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        getActiveFiltersCount={getActiveFiltersCount}
      />
      {/* Active Filters */}
      <SwatchBookActiveFilters getActiveFiltersCount={getActiveFiltersCount} />

      {/* Main Content */}
      <SwatchBookMainContent
        onOpenChange={handleEditOpen}
        viewMode={viewMode}
        layoutMode={layoutMode}
        showFilters={showFilters}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        getActiveFiltersCount={getActiveFiltersCount}
      />
    </motion.div>
  );
}
