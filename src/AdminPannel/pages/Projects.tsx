import React, { useEffect, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  adminFetchProjects,
  changeProjectUserId,
  deleteProjectById,
  handleSelectViewProject,
  handlesortingprojects,
} from "../reduxslices/adminProjectSlice";
import {
  LoadingSpinner,
  ProjectModal,
} from "../components/Projects/ProjectModal";
import { supabase } from "@/lib/supabase";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart as RechartsLineChart,
  Tooltip as RechartsTooltip,
} from "recharts";
import dayjs from "dayjs";
import { date } from "zod";
import {
  Plus,
  Share2,
  Edit2,
  Copy,
  MoreHorizontal,
  Calendar,
  Users,
  Filter,
  Grid3X3,
  List,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobModel } from "@/models/jobModel/JobModel";
import { MdAddHome, MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";
import { updateJobList, updateSidebarHeaderCollapse } from "@/redux/slices/jobSlice";
import { addbreadcrumb, updateWorkspaceType } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { setCurrentImageUrl } from "@/redux/slices/studioSlice";
import { addHouseImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import ProjectAction from "@/pages/projectPage/ProjectAction";

// Types
interface ProjectUser {
  id: number;
  full_name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold" | string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  user_id: ProjectUser;
  jobs?: JobModel[];
}

interface ChartData {
  date: string;
  count: number;
}

const Projects: React.FC = () => {
  const { isLoading, list, sortfield, sortorder, currentProject } = useSelector(
    (state: RootState) => state.adminProjects
  );

  const navigate = useNavigate();
  const [chartLoading, setChartLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    dayjs().subtract(29, "day").format()
  );

  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [data, setData] = useState<ChartData[]>([]);

  const handleDateChange = (e: any, type: string) => {
    if (type == "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(adminFetchProjects({ orderby: sortfield, order: sortorder }));
  }, [sortfield, sortorder]);

  useEffect(() => {
    const fetchProjectsBetweenDates = async (
      startDate: string,
      endDate: string
    ) => {
      setChartLoading(true);
      const { data: fetchedProjects, error } = await supabase
        .from("projects")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: true });

      // console.log("fetchedProjects", fetchedProjects);
      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      // Initialize counts for last 30 days (or provided range)
      const counts: Record<string, number> = {};
      let start = dayjs(startDate);
      const end = dayjs(endDate);
      for (let i = 0; i <= end.diff(start, "day"); i++) {
        const dateStr = start.add(i, "day").format("YYYY-MM-DD");
        counts[dateStr] = 0;
      }

      // Count projects from fetched data
      fetchedProjects?.forEach((p) => {
        const dateStr = dayjs(p.created_at).format("YYYY-MM-DD");
        if (counts[dateStr] !== undefined) counts[dateStr] += 1;
      });

      // Count projects from Redux list (if needed)
      list.forEach((p: Project) => {
        const dateStr = dayjs(p.created_at).format("YYYY-MM-DD");
        if (counts[dateStr] !== undefined) counts[dateStr] += 1;
      });

      const chartData: ChartData[] = Object.entries(counts).map(
        ([date, count]) => ({
          date,
          count,
        })
      );

      setData(chartData);
      setChartLoading(false);
    };
    fetchProjectsBetweenDates(startDate, endDate);
  }, [startDate, endDate]);

  const actions = [
    {
      label: "View",
      onClick: (row: Project) => dispatch(handleSelectViewProject(row)),
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: (row: Project) => console.log("Edit project:", row),
      variant: "secondary" as const,
    },
    {
      label: "Delete",
      onClick: (row: Project) => console.log("Delete project:", row),
      variant: "danger" as const,
    },
  ];

  const handleCreateProject = () => {
        dispatch(updateWorkspaceType("renovate"));
    // Logic to open a modal or navigate to a project creation page
    // console.log("Create Project clicked");
    navigate("/admin/add-project");
  };

  const getJobByProjectId = async (projectId: number) => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("project_id", projectId)
      .single();
    if (error) {
      console.error("Error fetching job:", error);
      return null;
    }
    return data as JobModel;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {currentProject && <ProjectModal />}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your projects and track progress
          </p>
        </div>

        <button
          onClick={handleCreateProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Project
        </button>

        {/* <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </button>
        </div> */}
      </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            Filter
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
          <button className="p-2 rounded-md bg-gray-100 text-gray-700">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <button
          onClick={handleCreateProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Project
        </button>
      </div> */}
      {/* Project Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => dispatch(handleSelectViewProject(project))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;

interface DateProps {
  startDate: string;
  endDate: string;
  onDateChange: (e: any, type: string) => void;
}

export const DatePicker = ({ startDate, endDate, onDateChange }: DateProps) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          value={startDate}
          max={endDate}
          onChange={(e) => onDateChange(e, "start")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          value={endDate}
          min={startDate}
          onChange={(e) => onDateChange(e, "end")}
        />
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onView: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
      on_hold: "bg-yellow-100 text-yellow-800 border-yellow-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const style =
      statusStyles[status as keyof typeof statusStyles] || statusStyles.default;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${style}`}
      >
        {status}
      </span>
    );
  };

  const handleAddDemo = async () => {
    const response = await dispatch(
      changeProjectUserId({
        projectId: project.id,
        userId: "33eacb82-d1c8-4661-984c-635307b411de",
      })
    ).unwrap();

    if (response?.status) {
      toast.info("Project added to demo successfully");
    }
  };

  const handleProjectClick = async () => {
    if (!project?.id || !project?.jobs?.length) return;
    if (!project?.id || !project?.jobs?.length) return;
    const projectImage = project.jobs[0]?.full_image;
    const jobId = project.jobs[0]?.id;
    if (!jobId || !projectImage) return;

    dispatch(updateJobList(project.jobs));
    dispatch(addbreadcrumb("Studio"));
    dispatch(setCurrentImageUrl(projectImage));
    dispatch(addHouseImage(projectImage));
    dispatch(updateSidebarHeaderCollapse(false));
    // setSelectedProjectId(project.id);
    // dispatch(setCurrentProject(project));

    //single pallet genAi slice
    //dispatch(setGenAiImageJobIdRequest({ jobId, imageUrl: projectImage }));

    // Navigate to studio
    navigate(`/admin/studio/${project.id}`);
  };

  const handleDelete=async()=>{
    window.alert("Do you want to delete project")
    const response= await dispatch(deleteProjectById(project.id)).unwrap()
      console.log("deleet project. ", response)
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Project Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        {project && project.jobs && project.jobs.length > 0 ? (
          <img
            src={project.jobs[0].full_image || ""}
            alt={project.name}
            className="w-full h-full object-cover"
              onClick={handleProjectClick}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge(project.status)}
        </div>

        {/* Private Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-black/20 text-white text-xs rounded-full backdrop-blur-sm">
            🔒 private
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {project.name || "New Project"}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description || "This is a demo project"}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>
              Updated {dayjs(project.updated_at).format("MMM D, YYYY")}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>
              {typeof project.user_id === "object"
                ? project.user_id.full_name
                : "Unknown"}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: "0%" }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onView}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onView}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* ADD HOME */}
            <div className="relative group" onClick={handleAddDemo}>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <MdAddHome className="w-4 h-4" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 -top-7 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Add to demo
              </span>
            </div>

                <div className="relative group" onClick={handleDelete}>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <MdDeleteOutline className="w-4 h-4" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 -top-7 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Delete
              </span>
            </div>
                  {/* <ProjectAction
                        project={project}
                        openAnalysedData={handleOpenAnalysedData}
                        doHouseAnalysis={handleHouseAnalysis}
                      /> */}
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="More"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
