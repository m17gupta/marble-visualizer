import React from "react";
import GetAllUSerProfile from "./GetAllUSerProfile";
import ShowUserProfile from "./ShowUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const UserProfileHome = () => {
  return (
    <>
      {/* get all user profiles    */}
      <GetAllUSerProfile />
      <ShowUserProfile />
    </>
  );
};

export default UserProfileHome;
