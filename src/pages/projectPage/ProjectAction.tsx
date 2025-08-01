import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectModel } from '@/models';
import { deleteProject } from '@/redux/slices/projectSlice';
import { AppDispatch } from '@/redux/store';

import { Copy, Edit3, MoreHorizontal, Settings, Share2 } from 'lucide-react';
import React from 'react'
import { BsIncognito } from 'react-icons/bs';
import { CiSquareInfo } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import GetHouseSegments from './analyseProjectImage/GetHouseSegments';
import { setIsAnalyseFinish, setJobUrl } from '@/redux/slices/projectAnalyseSlice';

type ProjectActionProps = {
    project: ProjectModel
    openAnalysedData: (project: ProjectModel) => void;
    doHouseAnalysis: (project: ProjectModel) => void;
}
const ProjectAction = ({ project, openAnalysedData, doHouseAnalysis }: ProjectActionProps) => {
    const dispatch = useDispatch<AppDispatch>();



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
        if (projectData &&
            projectData.jobData &&
            projectData.jobData[0] &&
            projectData.jobData[0].full_image) {
            dispatch(setIsAnalyseFinish(true));
            dispatch(setJobUrl(projectData.jobData[0].full_image));
            console.log("House segments action triggered", projectData.jobData[0].full_image);
        }


    }
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
                        onClick={() => { }}
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-git-compare-arrows-icon lucide-git-compare-arrows"><circle cx="5" cy="6" r="3" /><path d="M12 6h5a2 2 0 0 1 2 2v7" /><path d="m15 9-3-3 3-3" /><circle cx="19" cy="18" r="3" /><path d="M12 18H7a2 2 0 0 1-2-2V9" /><path d="m9 15 3 3-3 3" /></svg>
                    </Button>
                </div>

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
                        <DropdownMenuItem
                            onClick={() => handleCopyLink(project)}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleDeleteProject(project)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            
        </>
    )
}

export default ProjectAction