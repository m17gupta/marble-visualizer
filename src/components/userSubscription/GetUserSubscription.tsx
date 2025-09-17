import { getUserSubscriptionPlan } from '@/redux/slices/user/authSlice';
import { AppDispatch, RootState } from '@/redux/store'
import  { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetUserSubscription = () => {
     const dispatch = useDispatch<AppDispatch>();
    const { userPlan, user, isSubscriptionLoading , isRegistered} = useSelector((state: RootState) => state.auth)

const isApiCalled = useRef(false);

const getSubscriptionPlan = useCallback(async (userId: string) => {
    try {
        await dispatch(getUserSubscriptionPlan(userId)).unwrap();
    } catch (error) {
        console.error("Error fetching user subscription plan:", error);
        // Reset the flag on error to allow retry
        isApiCalled.current = false;
    }
}, [dispatch]);

useEffect(() => {
   
    if (user && !userPlan && !isSubscriptionLoading && !isApiCalled.current && !isRegistered) {
        isApiCalled.current = true;
        getSubscriptionPlan(user.id);
    }
}, [user, userPlan, isSubscriptionLoading, isRegistered, getSubscriptionPlan]);
  return (
    null
  )
}

export default GetUserSubscription