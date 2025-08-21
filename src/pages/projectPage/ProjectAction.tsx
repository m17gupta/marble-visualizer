import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectModel } from "@/models";
import { deleteProject, setCurrentProject, setIsDeleteModalOpen } from "@/redux/slices/projectSlice";
import { AppDispatch } from "@/redux/store";

import { Copy, Edit3, MoreHorizontal, Settings, Share2 } from "lucide-react";
import React from "react";
import { BsIncognito } from "react-icons/bs";
import { CiSquareInfo } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import GetHouseSegments from "./analyseProjectImage/GetHouseSegments";
import {
  setIsAnalyseFinish,
  setJobUrl,
} from "@/redux/slices/projectAnalyseSlice";

type ProjectActionProps = {
  project: ProjectModel;
  openAnalysedData: (project: ProjectModel) => void;
  doHouseAnalysis: (project: ProjectModel) => void;
};
const ProjectAction = ({
  project,
  openAnalysedData,
  doHouseAnalysis,
}: ProjectActionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenDeleteModal = (project: ProjectModel) => {
    dispatch(setIsDeleteModalOpen(true));
    dispatch(setCurrentProject(project)); 
  }
  const handleDeleteProject = async (project: ProjectModel) => {
    if (!project.id) return;

    try {
      // Call the deleteProjectById method from ProjectsService
      const result = await dispatch(deleteProject(project.id));

      if (deleteProject.fulfilled.match(result)) {
        toast.success("Project deleted successfully");
      } else {
        toast.error((result.payload as string) || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleCopyLink = (project: ProjectModel) => {
    const projectUrl = `${window.location.origin}/studio/${project.id}`;
    navigator.clipboard.writeText(projectUrl);
    toast.success("Project link copied to clipboard!");
  };

  const handleHouseSegments = (projectData: ProjectModel) => {
    if (
      projectData &&
      projectData.jobData &&
      projectData.jobData[0] &&
      projectData.jobData[0].full_image
    ) {
      dispatch(setIsAnalyseFinish(true));
      dispatch(setJobUrl(projectData.jobData[0].full_image));
      console.log(
        "House segments action triggered",
        projectData.jobData[0].full_image
      );
    }
  };
  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <div className="flex relative items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            // onClick={(e) => {
            //   e.stopPropagation();
            //   handleShare(project);
            // }}
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            // onClick={(e) => {
            //   e.stopPropagation();
            //   handleProjectClick(project.id);
            // }}
            onClick={() => {}}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          {project.analysed_data ? (
            <Button
              variant="ghost"
              size="sm"
              // onClick={(e) => {
              //   e.stopPropagation();
              //   handleProjectClick(project.id);
              // }}
              onClick={() => openAnalysedData(project)}
              className="group/info relative"
            >
              <CiSquareInfo size={18} />
              <span
                className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
               rounded-md bg-white px-3 py-1 text-xs text-black shadow-xl opacity-0 group-hover/info:opacity-100
               transition-opacity duration-200 z-50"
              >
                Click to view analysed data.
              </span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              // onClick={(e) => {
              //   e.stopPropagation();
              //   handleProjectClick(project.id);
              // }}
              onClick={() => doHouseAnalysis(project)}
              className="group/info relative"
            >
              {" "}
              <BsIncognito size={15} />
              <span
                className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
               rounded-md bg-white px-3 py-1 text-xs text-black shadow-xl opacity-0 group-hover/info:opacity-100
               transition-opacity duration-200 z-50"
              >
                Click to Analyse the Project
              </span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="group/info relative"
            onClick={() => handleHouseSegments(project)}
          >
            <span
              className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
               rounded-md bg-white px-3 py-1 text-xs text-black shadow-xl opacity-0 group-hover/info:opacity-100
               transition-opacity duration-200 z-50"
            >
              click to get house segment
            </span>
       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2"/><path stroke-linecap="round" d="m2 12.5l1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5"/><path d="m18.562 2.935l.417-.417a1.77 1.77 0 0 1 2.503 2.503l-.417.417m-2.503-2.503s.052.887.834 1.669s1.669.834 1.669.834m-2.503-2.503L14.727 6.77c-.26.26-.39.39-.5.533a3 3 0 0 0-.338.545c-.078.164-.136.338-.252.686l-.372 1.116m7.8-4.212L17.23 9.273c-.26.26-.39.39-.533.5a3 3 0 0 1-.545.338c-.164.078-.338.136-.686.252l-1.116.372m0 0l-.722.24a.477.477 0 0 1-.604-.603l.241-.722m1.085 1.085L13.265 9.65"/></g></svg>
          </Button>


        </div>
     {/* dots dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCopyLink(project)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleOpenDeleteModal(project)}>
              <Settings className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ProjectAction;
