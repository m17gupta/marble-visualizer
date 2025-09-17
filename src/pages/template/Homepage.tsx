import React from "react";

import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import GetPlanFeatures from "@/components/planfeatures/GetPlanFeatures";
import GetuserProfile from "../auth/login/GetuserProfile";
import Template from "@/components/homepage/Template";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
  
      <Template />
      {/* <MaterialData /> */}
      <GetPlanFeatures />

      {/* get user Profile */}
      <GetuserProfile />
    </div>
  );
};

export default Homepage;
