import {
  fetchCurrentProjectJobs,
  handleCloseModal,
} from "@/AdminPannel/reduxslices/adminProjectSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Calendar, User, Tag, Clock, X, Briefcase } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ProjectModal = () => {
  const { currentProject, isOpen, currentloading } = useSelector(
    (state: RootState) => state.adminProjects
  );

  const dispatch = useDispatch<AppDispatch>();

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    if (currentProject != null) {
      dispatch(fetchCurrentProjectJobs(currentProject));
    }
  }, []);

  if (!currentProject) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-50 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } transition-all duration-200`}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden text-sm">
        {/* Header */}
        <div className="relative h-32">
          {currentProject?.thumbnail && (
            <img
              src={currentProject.thumbnail}
              alt="Project Thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <button
            onClick={() => dispatch(handleCloseModal())}
            className="absolute top-2 right-2 p-1.5 bg-white/30 rounded-full hover:bg-white/40 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">
                {currentProject?.name || "Untitled Project"}
              </h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium border ${getStatusColor(
                  currentProject?.status
                )}`}
              >
                {currentProject?.status || "Unknown"}
              </span>
            </div>
            <p className="text-white/80 text-xs font-semibold">
              #{currentProject?.id}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center text-sm mb-1">
              <Tag className="w-3.5 h-3.5 mr-2 text-blue-500" /> About
            </h3>
            <p className="text-gray-600 text-sm">
              {currentProject?.description || "No description available"}
            </p>
          </div>

          {/* Creator + Timeline */}
          <div className="grid grid-cols-2 gap-3">
            {/* Creator */}
            <div className="bg-gray-50 border rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 text-xs mb-2 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                Creator
              </h4>
              <p className="font-medium text-gray-800 text-sm">
                {currentProject?.user_id?.full_name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">
                ID: {currentProject?.user_id?.id || "N/A"}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 border rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 text-xs mb-2 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                Timeline
              </h4>
              <p className="text-xs text-gray-600">
                Created: {formatDate(currentProject?.created_at)}
              </p>
              <p className="text-xs text-gray-600">
                Updated: {formatDate(currentProject?.updated_at)}
              </p>
            </div>
          </div>

          {/* Jobs */}
          {currentloading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center text-sm mb-2">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-purple-500" /> Jobs
              </h3>
              {currentProject.jobs != null &&
              currentProject?.jobs?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {currentProject.jobs.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-lg overflow-hidden bg-white"
                    >
                      <img
                        src={job.thumbnail}
                        alt="Job"
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-700">
                          {job.jobType || "N/A"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {job.distance_ref?.distance_meter} m •{" "}
                          {job.distance_ref?.distance_pixel} px
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs italic">No jobs found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin size-10 rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  );
};
