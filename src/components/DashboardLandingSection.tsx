import React from 'react';

import SideBar from './userProfile/SideBar';
import LandingHome from './workSpace/landing/LandingHome';
import VisualToolHome from './workSpace/visualTool/VisualToolHome';


export const DashboardLandingSection = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      {/* <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200"> */}

      <SideBar />
      {/* </div> */}

      {/* Right Main Content */}

      <LandingHome />

      <VisualToolHome />

    </div>
    // </div>
  );
};

export default DashboardLandingSection;
