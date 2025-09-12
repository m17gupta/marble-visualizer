import { fetchPlanFeatures } from "@/redux/slices/planFeatureSlice/PlanFeatureSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetPlanFeatures = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { planFeatures } = useSelector((state: RootState) => state.planFeature);
  const isApi= useRef<boolean>(true);

  useEffect(() => {
    if (planFeatures.length === 0 && isApi.current) {
      // dispatch action to fetch plan features
      isApi.current = false;
      dispatch(fetchPlanFeatures());
    }
  }, [planFeatures]);

  return null;
};

export default GetPlanFeatures;
