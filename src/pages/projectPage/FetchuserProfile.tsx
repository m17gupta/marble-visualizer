import { getUserProfile } from '@/redux/slices/userProfileSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const FetchuserProfile = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { profile } = useSelector((state: RootState) => state.userProfile);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const isApi = useRef(true);
    useEffect(() => {
        if (isAuthenticated &&
            user &&
            user.id &&
            isApi.current
        ) {
            // Fetch user profile data
            console.log("Fetching user profile for user ID:", user.id);
            // Set isApi to false to prevent further API calls
            isApi.current = false; // Prevent further API calls
            getUserProfilebasedOnId(user.id);
        }
    }, [isAuthenticated, user, dispatch]);


    const getUserProfilebasedOnId = async (userId: string) => {
        console.log("Fetching user profile by ID:", userId);
        const response = await dispatch(getUserProfile(userId));
        console.log("User Profile Response:", response);
    }
    return (
        null
    )
}

export default FetchuserProfile