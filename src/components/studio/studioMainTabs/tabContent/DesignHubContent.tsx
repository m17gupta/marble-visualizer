import React from "react";
import AllSegments from "../../segment/AllSegments";
import { StudioSidebar } from "../../StudioSidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { useParams } from "react-router-dom";

const DesignHubContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: projectId } = useParams<{ id: string }>();

  const { activeTab: activeTabFromStore } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChangeTab = (value: string) => {
    dispatch(updateActiveTab(value));
    console.log("Tab changed to:", value);
  };
  return (
    <div className="flex flex-row">
      {/* All Segments - Left Side */}
      <div className="flex border-r">
        <AllSegments />
      </div>

      {/* Studio Sidebar - Right Side */}
      <div className="w-10/12">
        <StudioSidebar
          activeTab={activeTabFromStore ?? "design-hub"}
          onTabChange={handleChangeTab}
          projectId={projectId}
        />
      </div>
    </div>
  );
};

export default DesignHubContent;
