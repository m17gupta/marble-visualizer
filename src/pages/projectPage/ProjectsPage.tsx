import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import {
  fetchProjects,
  clearError,
  updateIsCreateDialog,
  setCurrentProject,
  deleteProject,
  updateProjectAnalysis,
} from "@/redux/slices/projectSlice";
// import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { BsIncognito } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Plus,
  Calendar,
  Share2,
  Edit3,
  Globe,
  Lock,
  FolderOpen,
  MoreHorizontal,
  Users,
  Settings,
  Copy,
  InspectIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserProfileHome from "@/components/userProfile/UserProfileHome";
// import { CreateProjectDialog } from './CreateProject';
import JobHome from "@/components/job/JobHome";
import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";
import VisualToolHome from "@/components/workSpace/visualTool/VisualToolHome";
import {
  addbreadcrumb,
  updateWorkspaceType,
  updateBreadCrumbs,
} from "@/redux/slices/visualizerSlice/workspaceSlice";
import { updateSidebarHeaderCollapse } from "@/redux/slices/jobSlice";
import {
  addHouseImage,
  updateRequestJobId,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import ProjectHeader from "./ProjectHeader";
import ProjectStaticCard from "./ProjectStaticCard";
import { setCurrentImageUrl } from "@/redux/slices/studioSlice";
import { CiSquareInfo } from "react-icons/ci";
import AnalyzedDataModal from "@/components/Modal";

export function ProjectsPage() {
  // const [user_id, setUser_id] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    list: projects,
    isLoading,
    error,
    isUpdating,
  } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isCreateDialogOpen } = useSelector(
    (state: RootState) => state.projects
  );

  const [isOpen, setIsOpen] = useState<{
    visible: boolean;
    projectId: number;
  }>({
    visible: false,
    projectId: -1,
  });

  const handleClose = () => {
    const newState = { ...isOpen };
    newState.visible = false;
    newState.projectId = -1;
    setIsOpen(newState);
  };

  const [updatingProjectId, setUpdatingProjectId] = useState<number[]>([]);

  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const [shareDialogProject, setShareDialogProject] = useState<{ id: string; name: string } | null>(null);
  const isProject = useRef(true);
  const handleHouseAnalysis = async (project: ProjectModel) => {
    if (project) {
      const url: string = project.jobData?.[0].full_image ?? "";
      const projectId = project.id!;
      const latestUpdating = [...updatingProjectId];
      latestUpdating.push(projectId);
      setUpdatingProjectId(latestUpdating); // <-- Set current updating ID
      await dispatch(updateProjectAnalysis({ url: url, id: projectId }));
      const filteredata = [...latestUpdating].filter((d) => d !== projectId);
      setUpdatingProjectId(filteredata);
    }
  };

  useEffect(() => {
    // Only fetch if user exists and projects list is empty
    if (user?.id && projects.length === 0 && !isLoading && isProject.current) {
      isProject.current = false;
      dispatch(fetchProjects(user.id));
    }
  }, [user?.id, projects.length, isLoading, dispatch]);

  useEffect(() => {
    // Set breadcrumb to "Projects" when component mounts
    dispatch(updateBreadCrumbs("Projects"));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);
  const handleProjectClick = (project: ProjectModel) => {
    if (project.id && project.jobData && project.jobData.length > 0) {
      const projectImage = project.jobData[0]?.full_image;
      const jobId = project.jobData[0]?.id;

      if (jobId) {
        dispatch(addbreadcrumb("Studio"));
        dispatch(setCurrentImageUrl(projectImage || ""));
        dispatch(addHouseImage(projectImage || ""));
        dispatch(updateSidebarHeaderCollapse(false));
        setSelectedProjectId(project.id);
        dispatch(updateRequestJobId(jobId?.toString()));
        dispatch(setCurrentProject(project));
        navigate(`/app/studio/${project.id}`);
      }
    }
  };

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
      toast.error("Failed to delete project");
    }
  };
  const handleCopyLink = (project: ProjectModel) => {
    const projectUrl = `${window.location.origin}/studio/${project.id}`;
    navigator.clipboard.writeText(projectUrl);
    toast.success("Project link copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-32 w-full rounded-md mb-3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // const handleCloseCreateDialog = () => {
  //   setIsCreateDialogOpen(false);

  // };

  const handleCreateProject = () => {
    dispatch(updateWorkspaceType("renovate"));
    dispatch(updateIsCreateDialog(true));
  };

  const handleResetProjectCreated = () => {
    dispatch(updateIsCreateDialog(false));
    dispatch(updateWorkspaceType("renovate"));
    setSelectedProjectId(undefined);
  };

  return (
    <>
      {!isCreateDialogOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 p-8 pe-10 ps-8"
        >
          {/* Header */}
          {isOpen && (
            <AnalyzedDataModal
              projectId={isOpen.projectId}
              isOpen={isOpen.visible}
              onClose={handleClose}
            />
          )}
          <ProjectHeader createProject={handleCreateProject} />

          {/* Stats Section */}

          {/* Stats Cards */}
          <ProjectStaticCard />

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden rounded-lg">
                    <div
                      className="relative"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.jobData && project.jobData.length > 0 ? (
                        <div className="relative overflow-hidden rounded-lg rounded-b-none ">
                          <img
                            src={
                              project.jobData[0]?.thumbnail ||
                              "/placeholder-image.png"
                            }
                            alt={project.name}
                            className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <FolderOpen className="h-8 w-8 text-primary/50" />
                        </div>
                      )}

                      {/* Visibility and Role indicators */}
                      <div className="absolute top-2 right-2 flex items-center space-x-1">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            project.visibility === "public"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          )}
                        >
                          {project.visibility === "public" ? (
                            <Globe className="h-3 w-3 mr-1" />
                          ) : (
                            <Lock className="h-3 w-3 mr-1" />
                          )}
                          {project.visibility}
                        </Badge>
                      </div>

                      {/* Role badge */}
                      <div className="absolute top-2 left-2"></div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg truncate">
                          {project.name}
                        </CardTitle>
                        <Badge
                          className={getStatusColor(
                            project?.status || "active"
                          )}
                        >
                          {project?.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Updated {formatDate(project.updated_at || "")}
                      </div>

                      {/* Access info */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      {isUpdating &&
                        updatingProjectId.includes(project.id!) && <Loader />}
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
                              onClick={() => {
                                const newState = { ...isOpen };
                                // newState.project = project;
                                newState.visible = true;
                                newState.projectId = project.id
                                  ? project.id
                                  : -1;
                                setIsOpen(newState);
                              }}
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
                              onClick={() => handleHouseAnalysis(project)}
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {projects.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to get started
              </p>
              <Button onClick={handleCreateProject}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      <UserProfileHome />

      {isCreateDialogOpen && (
        <VisualToolHome resetProjectCreated={handleResetProjectCreated} />
      )}

      <SwatchBookDataHome />

      <MaterialData />
    </>
  );
}

export const Loader = () => {
  return (
    <div className="relative w-full h-[3px] bg-gray-200 overflow-hidden rounded">
      <div className="absolute inset-0 w-full bg-blue-500 animate-progress-bar" />
    </div>
  );
};
