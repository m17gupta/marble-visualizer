import { getUserData } from "@/redux/slices/authSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import GetUserProfile from "./GetUserProfile";
import { RootState } from "@/redux/store";

const UserProfileHome = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isUserProfile = useRef<boolean>(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const getUserDatas = useSelector(getUserData);
  const { profile } = useSelector((state: RootState) => state.userProfile);

  useEffect(() => {
    if (getUserDatas && getUserDatas.id && profile === null) {
      isUserProfile.current = true;
      setUserId(getUserDatas.id);
    } else {
      isUserProfile.current = false;
    }
  }, [getUserDatas, profile]);

  const handleResetUserProfile = () => {
    isUserProfile.current = false;
    setUserId(null);
  };
  return (
    <>
      {isUserProfile.current && userId && (
        <GetUserProfile
          userId={userId}
          resetUserProfile={handleResetUserProfile}
        />
      )}
    </>
  );
};

export default UserProfileHome;
