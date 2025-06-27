import { useEffect } from 'react'
import { fetchCategories } from '@/redux/slices/categorySlice'
import { AppDispatch } from '@/redux/store'

import { useDispatch } from 'react-redux'

const GetAllCategory = () => {

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
      // Fetch all categories when the component mounts
      fetchAllCategories();
    }, [])

  
    const fetchAllCategories = async () => {
      try {
        // Call the fetchCategories thunk
        const response = await dispatch(fetchCategories());
        if(fetchCategories.fulfilled.match(response)) {
          console.log('Categories fetched successfully:', response.payload);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  return (
    null
  ) 
}

export default GetAllCategory