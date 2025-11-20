import GetUserSubscription from "@/components/userSubscription/GetUserSubscription";
import React from "react";
import { ProjectsPage } from "../ProjectsPage";
import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import ProjectAnalyseSegmentApiCall from "../analyseProjectImage/ProjectAnalyseSegmentApiCall";
import GetHouseSegments from "../analyseProjectImage/GetHouseSegments";
import GetuserProfile from "@/pages/auth/login/GetuserProfile";
import GetUserSubscriptionPlan from "@/pages/auth/login/GetUserSubscriptionPlan";
import CreateUserSubscription from "@/pages/auth/signUp/CreateUserSubscription";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import FetchuserProfile from '../FetchuserProfile'

const ProjectHome = () => {

  const {isRegistered, isAuthenticated} = useSelector((state: RootState) => state.auth);
  return (
    <>
      <ProjectsPage />
      {(!isRegistered && isAuthenticated) ? (<GetUserSubscription />) : ( <CreateUserSubscription/>)}

      {/* <SwatchBookDataHome /> */}

      <MaterialData />

      <ProjectAnalyseSegmentApiCall />

      {/* <GetHouseSegments /> */}
      <GetuserProfile />
      <GetUserSubscriptionPlan />


     
    </>
  );
};

export default ProjectHome;
