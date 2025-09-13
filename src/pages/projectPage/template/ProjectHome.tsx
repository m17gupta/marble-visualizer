import GetUserSubscription from "@/components/userSubscription/GetUserSubscription";
import React from "react";
import { ProjectsPage } from "../ProjectsPage";
import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import ProjectAnalyseSegmentApiCall from "../analyseProjectImage/ProjectAnalyseSegmentApiCall";
import GetHouseSegments from "../analyseProjectImage/GetHouseSegments";
import GetuserProfile from "@/pages/auth/login/GetuserProfile";
import GetUserSubscriptionPlan from "@/pages/auth/login/GetUserSubscriptionPlan";
// import FetchuserProfile from '../FetchuserProfile'

const ProjectHome = () => {
  return (
    <>
      <ProjectsPage />
      <GetUserSubscription />

      <SwatchBookDataHome />

      <MaterialData />

      <ProjectAnalyseSegmentApiCall />

      <GetHouseSegments />
      <GetuserProfile />
      <GetUserSubscriptionPlan />
    </>
  );
};

export default ProjectHome;
