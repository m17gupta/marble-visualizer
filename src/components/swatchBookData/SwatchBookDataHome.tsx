import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchCategories } from '@/redux/slices/categorySlice'
import { fetchBrands } from '@/redux/slices/brandSlice'
import { fetchMaterials } from '@/redux/slices/materialsSlice'


const SwatchBookDataHome = () => {
  const dispatch = useDispatch<AppDispatch>()
  

  
  // Get auth and data states
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth)
  const { categories, isLoading: categoriesLoading } = useSelector((state: RootState) => state.categories)
  const { brands, isLoading: brandsLoading } = useSelector((state: RootState) => state.brands)
  const { materials, isLoading: materialsLoading } = useSelector((state: RootState) => state.materials)


  const fetchAllCategories = useCallback(async () => {
   
    
    try {
      const response = await dispatch(fetchCategories())
      if (fetchCategories.fulfilled.match(response)) {
        
        console.log('Categories fetched successfully:', response.payload)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [dispatch])

  const fetchAllBrands = useCallback(async () => {
    
    
    try {
      const response = await dispatch(fetchBrands())
      if (fetchBrands.fulfilled.match(response)) {
      
        console.log('Brands fetched successfully:', response.payload)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }, [dispatch])



  const fetchAllMaterials = useCallback(async () => {
  
    try {
      const response = await dispatch(fetchMaterials({ page: 1, limit: 100 }))
      if (fetchMaterials.fulfilled.match(response)) {
        
        console.log('Materials fetched successfully:', response.payload)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }, [dispatch])

  useEffect(() => {
    // Only fetch data if user is authenticated and auth is initialized
    if (!isAuthenticated || !isInitialized) {
      console.log('User not authenticated or auth not initialized, skipping data fetch')
      return
    }

    // Fetch categories only if not already loaded and not currently loading
    if (categories.length === 0 && !categoriesLoading) {
      console.log('Fetching categories...')
      fetchAllCategories()
    } else if (categories.length > 0) {
      console.log('Categories already loaded, skipping fetch')
    }

    // Fetch brands only if not already loaded and not currently loading  
    if (brands.length === 0 && !brandsLoading) {
      console.log('Fetching brands...')
      fetchAllBrands()
    } else if (brands.length > 0) {
      console.log('Brands already loaded, skipping fetch')
    }

    // Fetch materials only if not already loaded and not currently loading
    if (materials.length === 0 && !materialsLoading) {
      console.log('Fetching materials...')
      fetchAllMaterials()
    } else if (materials.length > 0) {
      console.log('Materials already loaded, skipping fetch')
    }
  }, [
    isAuthenticated, 
    isInitialized, 
    categories.length, 
    brands.length, 
    materials.length, 
    categoriesLoading, 
    brandsLoading, 
    materialsLoading,
    fetchAllCategories,
    fetchAllBrands,
    fetchAllMaterials
  ])

  return null
}

export default SwatchBookDataHome