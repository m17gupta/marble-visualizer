import { useCallback, useEffect } from 'react'
import { AppDispatch, RootState } from '@/redux/store'

import { useDispatch, useSelector } from 'react-redux'

import { fetchMaterialSegments } from '@/redux/slices/materialSlices/materialSegmentSlice'

const GetAllMaterialSegment = () => {

    const dispatch = useDispatch<AppDispatch>()
    // const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth)

    const { materials, isLoading: segmentLoading } = useSelector((state: RootState) => state.materials)
    const fetchAllMaterialSegments = useCallback(async () => {

      try {
        const response = await dispatch(fetchMaterialSegments())
            if (fetchMaterialSegments.fulfilled.match(response)) {

               if( response.payload && Array.isArray(response.payload)) {
               //  console.log('Material segments fetched successfully:', response.payload)
               }
            }
          } catch (error) {
            console.error('Error fetching categories:', error)
          }
        }, [dispatch])


         useEffect(() => {
            // Only fetch data if user is authenticated and auth is initialized
            // if (!isAuthenticated || !isInitialized) {
            //   console.log('User not authenticated or auth not initialized, skipping data fetch')
            //   return
            // }
            if (!segmentLoading && materials.length === 0) {
              fetchAllMaterialSegments()
            }
          }, [ fetchAllMaterialSegments,segmentLoading])

  return (
    null
  ) 
}

export default GetAllMaterialSegment