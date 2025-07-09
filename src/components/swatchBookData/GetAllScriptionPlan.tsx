import { fetchAllSubscriptionPlans } from '@/redux/slices/subscriptionPlanSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

 const GetAllSubscriptionPlan = () => {
      const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
    const { subscriptionalPlans, isLoading: isLoadingPlans } = useSelector((state: RootState) => state.subscriptionPlan);


    useEffect(() => {
      if (isAuthenticated && isInitialized) {
        if(!isLoadingPlans && subscriptionalPlans.length === 0) {
        GetAllSubscriptionPlanData();
        }
      }
    }, [isAuthenticated, isInitialized,subscriptionalPlans,isLoadingPlans]);

    const GetAllSubscriptionPlanData = async () => {
      try {
         await dispatch(fetchAllSubscriptionPlans({})).unwrap();
       
      }catch (error) {
        console.error('Error fetching subscription plans:', error);
        toast.error('Failed to fetch subscription plans. Please try again later.');
      }
    };
  return (
    null
  )
}

export default GetAllSubscriptionPlan