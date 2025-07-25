import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/slices/materialSlices/categorySlice";
import { fetchBrands } from "@/redux/slices/materialSlices/brandSlice";
import { fetchMaterials } from "@/redux/slices/materialSlices/materialsSlice";
import { fetchStyles } from "@/redux/slices/materialSlices/StyleSlice";
import GetAllMaterialSegment from "./GetMaterialSegments";
import GetAllInspirational from "./GetAllInsiprational";
import GetAllSubscriptionPlan from "./GetAllScriptionPlan";

const SwatchBookDataHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get auth and data states
  const { isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth
  );
  const { categories, isLoading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const { brands, isLoading: brandsLoading } = useSelector(
    (state: RootState) => state.brands
  );
  const { materials, isLoading: materialsLoading } = useSelector(
    (state: RootState) => state.materials
  );
  const { styles, isLoading: stylesLoading } = useSelector(
    (state: RootState) => state.styles
  );

  const fetchAllCategories = useCallback(async () => {
    try {
      await dispatch(fetchCategories());
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [dispatch]);

  const fetchAllStyles = useCallback(async () => {
    try {
      await dispatch(fetchStyles());
    } catch (error) {
      console.error("Error fetching styles:", error);
    }
  }, [dispatch]);

  const fetchAllBrands = useCallback(async () => {
    try {
      await dispatch(fetchBrands());
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, [dispatch]);

  const fetchAllMaterials = useCallback(async () => {
    try {
      dispatch(fetchMaterials({ page: 1, limit: 100 }));
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch data if user is authenticated and auth is initialized
    if (!isAuthenticated || !isInitialized) {
      return;
    }

    // Fetch categories only if not already loaded and not currently loading
    if (categories.length === 0 && !categoriesLoading) {
      fetchAllCategories();
    }
    // Fetch brands only if not already loaded and not currently loading
    if (brands.length === 0 && !brandsLoading) {
      fetchAllBrands();
    }

    // Fetch materials only if not already loaded and not currently loading
    if (materials.length === 0 && !materialsLoading) {
      fetchAllMaterials();
    }

    if (styles.length === 0 && !stylesLoading) {
      fetchAllStyles();
    }
  }, [
    isAuthenticated,
    isInitialized,
    categories.length,
    brands.length,
    materials.length,
    styles.length,
    stylesLoading,
    categoriesLoading,
    brandsLoading,
    materialsLoading,
    fetchAllCategories,
    fetchAllBrands,
    fetchAllMaterials,
    fetchAllStyles,
  ]);

  return (
    <>
      <GetAllMaterialSegment />

      <GetAllInspirational />

      <GetAllSubscriptionPlan />
    </>
  );
};

export default SwatchBookDataHome;
