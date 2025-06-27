import { useEffect, useRef, useCallback } from 'react'
import { getUserProfile } from '@/redux/slices/userProfileSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';


type Props = {
  userId: string | null;
  resetUserProfile?: () => void;
}
const GetUserProfile = ({ userId, resetUserProfile }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const isApi = useRef<boolean>(true);

  const userProfile = useCallback(async (userId: string) => {
    try {
      const getUserProfileData = await dispatch(getUserProfile(userId));
      // console.log('getUserProfileData', getUserProfileData);
      if (getUserProfileData.meta.requestStatus === 'fulfilled') {
        // console.log('User profile fetched successfully:', getUserProfileData.payload);
      } else {
        // console.error('Failed to fetch user profile:', getUserProfileData);
      }

      isApi.current = true;
      resetUserProfile?.();
    } catch (error) {
      isApi.current = true;
      resetUserProfile?.();
      console.error('Error fetching user profile:', error);
    }
  }, [dispatch, resetUserProfile]);

  useEffect(() => {
    if (userId && isApi.current) {
      isApi.current = false; // Prevent multiple calls
      userProfile(userId);
    }
  }, [userId, userProfile]);
  return (
    null
  )
}

export default GetUserProfile