import  { useEffect } from 'react';
import { RootState } from '@/redux/store';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { 
  fetchInspirationalColors, 
} from '@/redux/slices/InspirationalSlice/inspirationalColorSlice';
import { fetchInspirationalImages } from '@/redux/slices/InspirationalSlice/inspirationalImageSlice';

const GetAllInspirational = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  
  // Get inspirational colors state
  const {
    inspirational_colors,
    isLoading: colorsLoading,
  } = useSelector((state: RootState) => state.inspirationalColors);

  // Get inspirational images state
  const {
    Inspirational_images,
    isLoading: imagesLoading,
  } = useSelector((state: RootState) => state.inspirationalImages);

  useEffect(() => {
 
      // Fetch initial data
       if(!colorsLoading && inspirational_colors.length === 0) {
         fetchInspirationalColorsData();
       }
       if(!imagesLoading && Inspirational_images.length === 0) {
         fetchInspirationalImagesData();
       }

  }, [inspirational_colors,colorsLoading,Inspirational_images,imagesLoading]);


  const fetchInspirationalColorsData = async () => {
    try {
      // Fetch all colors with empty filters
      await dispatch(fetchInspirationalColors()).unwrap();
    } catch (error) {
      console.error('Error fetching inspirational colors:', error);
    }
  };

  const fetchInspirationalImagesData = async () => {
    try {
      // Fetch active images with default parameters
      await dispatch(fetchInspirationalImages()).unwrap();
    } catch (error) {
      console.error('Error fetching inspirational images:', error);
    }
  };


  
  return (
    null
  );
}

export default GetAllInspirational;