import { useEffect } from 'react'
import { AppDispatch } from '@/redux/store'

import { useDispatch } from 'react-redux'
import { fetchBrands } from '@/redux/slices/brandSlice'

const GetAllBrand = () => {

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
      // Fetch all categories when the component mounts
      fetchAllBrands();
    }, [])

    const fetchAllBrands = async () => {
      try {
        // Call the fetchBrands thunk
        const response = await dispatch(fetchBrands());
        if(fetchBrands.fulfilled.match(response)) {
          console.log('Brands fetched successfully:', response.payload);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    }
  return (
    null
  ) 
}

export default GetAllBrand