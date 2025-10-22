import * as React from "react";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";
import { DemoRoomsPanelProps } from "./types";
import GalleryCard from "./GalleryCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { useNavigate } from "react-router-dom";
import { setCurrentProject } from "@/redux/slices/projectSlice";
import { setCurrentJob } from "@/redux/slices/jobSlice";

;
const DemoRoomsPanel = () => {
     const dispatch= useDispatch<AppDispatch>()
     const navigate = useNavigate();
    const {list:projectList, isLoading}= useSelector   ((state:RootState) => state.projects)

    const handleDemoProject = (project:ProjectModel) => {
        if(!project?.jobData || project?.jobData.length===0) return;
          dispatch(setCurrentProject(project));
          dispatch(setCurrentJob(project?.jobData?.[0]??null))
          navigate(`/try-visualizer/project/${project.id}`);
        // console.log("Demo project selected:", project);
        // You can add more logic here, such as navigating to a detailed view
      }
  return (
  <div className="mt-4 rounded-lg border border-gray-50 bg-gray-100 flex">
      {/* Green sidebar shimmer loader */}
  
      <div className="p-4 sm:p-5 flex-1">
      
        <div className="mt-1 flex items-center gap-2">
          <div className="relative w-full max-w-sm mb-4">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              className="h-9 rounded-md border-zinc-300 bg-white pl-8 placeholder:text-zinc-500"
              placeholder="Search demo house...."
          
            />
          </div>
        </div>

        {/* gallery with overlay + selection */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-blue-600 font-medium">Loading demo ...</span>
        </div>
      )}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project:ProjectModel) => {
            if(!project?.jobData || project?.jobData.length===0) return null;
            const imagePath = project?.jobData[0].full_image??"";
            return (
              <GalleryCard
                key={project.id}
                src={imagePath}
                idx={project.id??0}
                // isSelected={selectedIdx === project.id}
                // onUse={onImageSelect}
                  onClick={() => {handleDemoProject(project)}}
              />
            );
          })}
        </div>
       
       
      </div>
    </div>
  );
};

export default DemoRoomsPanel;