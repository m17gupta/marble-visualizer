import React, { useState } from 'react';

// import SideBar from './userProfile/SideBar';
import LandingHome from './workSpace/landing/LandingHome';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import VisualToolHome from './workSpace/visualTool/VisualToolHome';
import { cn } from '@/lib/utils';
import SideBarHome from './sideBar/SideBarHome';


export const DashboardLandingSection = () => {
 // const { isWorkSpace, isVisual } = useSelector((state: RootState) => state.workspace);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { workspace_type } = useSelector((state: RootState) => state.workspace);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      {/* <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200"> */}

      <SideBarHome />
      {/* </div> */}

      {/* Main Content */}
      <div
        className={cn(
          "transition-all w-screen duration-300 lg:pl-80 bg-gray-50",
          sidebarCollapsed && "lg:pl-20"
        )}
      >
        {workspace_type=='workspace' &&
         <LandingHome />}

          
          {
          workspace_type=='renovate' && 
           <VisualToolHome />}
          {
          workspace_type=='design-hub' && 
           <VisualToolHome />}


        </div>


    </div>
    // </div>
  );
};

export default DashboardLandingSection;
