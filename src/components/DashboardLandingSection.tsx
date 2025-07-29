import React, { useState } from "react";

// import SideBar from './userProfile/SideBar';
import LandingHome from "./workSpace/landing/LandingHome";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import VisualToolHome from "./workSpace/visualTool/VisualToolHome";
import { cn } from "@/lib/utils";
import SideBarHome from "./sideBar/SideBarHome";


export const DashboardLandingSection = () => {
  // const { isWorkSpace, isVisual } = useSelector((state: RootState) => state.workspace);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { workspace_type } = useSelector((state: RootState) => state.workspace);

  const handleResetProjectCreated = () => {
    // Reset logic for project created state
  };
  return (
    <>

    
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      {/* <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200"> */}

      <SideBarHome sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      {/* </div> */}

      {/* Main Content */}
      { (
        <div
          className={cn(
            "transition-all duration-300 bg-gray-50 border-2 w-screen lg:pl-80",
            sidebarCollapsed && "lg:pl-20"
          )}
        >
          {workspace_type == "workspace" && <LandingHome />}
          {workspace_type == "renovate" && (
            <VisualToolHome resetProjectCreated={handleResetProjectCreated} />
          )}
          {workspace_type == "design-hub" && (
            <VisualToolHome resetProjectCreated={handleResetProjectCreated} />
          )}
        </div>
      )}
    </div>


    </>
  );
};

export default DashboardLandingSection;
