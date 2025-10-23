import { getAllUserFileProfiles } from "@/redux/slices/user/userProfileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { boolean } from "zod";

const GetAllUSerProfile = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const { profile, allUserProfiles } = useSelector(
    (state: RootState) => state.userProfile
  );

  const isApi = useRef<boolean>(true);

  useEffect(() => {
    const getAllUSers = async () => {
      try {
        await dispatch(getAllUserFileProfiles()).unwrap();
      } catch (err) {
        toast.error("Failed to fetch user profiles. Please try again later.");
      }
    };
    if (
      isAuthenticated &&
      profile &&
      profile.role === "admin" &&
      isApi.current
    ) {
      isApi.current = false;
      getAllUSers();
    }
  }, [isAuthenticated]);

  return null;
};

export default GetAllUSerProfile;
