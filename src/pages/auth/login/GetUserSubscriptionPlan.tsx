import App from "@/App";
import { fetchUserSubscriptionPlans } from "@/redux/slices/user/subscriptionPlanSlice";
import { AppDispatch, RootState } from "@/redux/store";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetUserSubscriptionPlan = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userSubscriptionPlan, isLoading, error } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );
  const isApi = useRef<boolean>(true);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    if (
      isApi.current &&
      user &&
      user.id &&
      isAuthenticated &&
      userSubscriptionPlan === null
    ) {
      isApi.current = false;
      GetuserPlan(user.id);
    }
  }, [user, isAuthenticated]);

  const GetuserPlan = async (userId: string) => {
    try {
      console.log("GetuserPlan - userId:", userId);
      const response = await dispatch(
        fetchUserSubscriptionPlans({ userId })
      ).unwrap();
      console.log("GetuserPlan - response:", response);
      if (response && response.success) {
        console.log("GetuserPlan - response:", response);
      }
    } catch (err) {
      console.error("GetuserPlan - Error:", err);
    }
  };

  return null;
};

export default GetUserSubscriptionPlan;
