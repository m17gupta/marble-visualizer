import { getUserProfile } from '@/redux/slices/user/userProfileSlice';
import { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetuserProfile = () => {

    const dispatch= useDispatch<AppDispatch>();

    const {user, isAuthenticated} = useSelector((state: RootState) => state.auth);
    const {profile} = useSelector((state: RootState) => state.userProfile);
    const isAPi= useRef<boolean>(true);
    useEffect(() => {
      if (isAuthenticated &&
         user &&
          user.id && 
          profile===null &&
          isAPi.current) {
          isAPi.current = false;
          getUserProfileData(user.id);
      }
    }, [isAuthenticated, dispatch]);


    const getUserProfileData= async (userId:string) => {
        try{
            const response= await dispatch(getUserProfile(userId));
            if(response.payload){
                console.log("User profile fetched successfully:", response.payload);
            }
        }catch(error){
            console.error("Error fetching user profile:", error);
        }
      
    }
  return (
    null
  )
}

export default GetuserProfile