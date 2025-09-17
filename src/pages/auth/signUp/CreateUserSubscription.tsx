import { RequestUserPlan } from "@/models/userModel/UserPLanModel";
import { useAppDispatch } from "@/redux/hooks";
import { createUserSubscriptionPlan } from "@/redux/slices/user/subscriptionPlanSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CreateUserSubscription = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated,isRegistered } = useSelector(
    (state: RootState) => state.auth
  );
  const { planFeatures } = useSelector((state: RootState) => state.planFeature);
  const { userSubscriptionPlan } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );

  const isApi = useRef<boolean>(true);
  useEffect(() => {

    console.log("CreateUserSubscription - useEffect triggered:", {
      user,
      isAuthenticated,
      planFeatures,
      isRegistered,
      userSubscriptionPlan
    });
    if (
      user &&
      user.id &&
      isAuthenticated &&
      planFeatures &&
      planFeatures.length > 0 &&
      isApi.current &&
      isRegistered 
    ) {
      isApi.current = false;
      createnewsubscription();
    }
  }, [isRegistered,planFeatures, user, isAuthenticated]);

  const createnewsubscription = async () => {
    if (
      !user ||
      !user.id ||
      !isAuthenticated ||
      !planFeatures ||
      planFeatures.length === 0
    )
      return;

      console.log("Creating new subscription for user:", user.id);
    const data: RequestUserPlan = {
      user_id: user?.id,
      started_at: new Date().toISOString(),
      expires_at: new Date(
        new Date().setMonth(new Date().getMonth() + 6)
      ).toISOString(), // expire for 6 month
      status: "active",
      payment_id: "",
      credits: 15,
      created_at: new Date().toISOString(),
      plan_feature_id: String(planFeatures[0]?.id) || "",
    };
    try {
      const response = await dispatch(
        createUserSubscriptionPlan(data)
      ).unwrap();
      if (response && response.success) {
        toast.success("Subscription created successfully!");
      } else {
        toast.error("Failed to create subscription. Please try again.");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Failed to create subscription. Please try again.");
    }
  };

  return null;
};

export default CreateUserSubscription;
