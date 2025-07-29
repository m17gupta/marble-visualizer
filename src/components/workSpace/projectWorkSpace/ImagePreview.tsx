import { RootState } from "@/redux/store";
import React  from "react";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

// import sampleImg from "@/assets/kitchen.jpg"; // Replace with your actual image path

const ImageCard: React.FC = () => {
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);

  const param = useParams();
  const id = param.id !== undefined ? parseInt(param.id) : 0;
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const findProject = projects.find((d) => d.id == id);

 

  return (
    <div className="border rounded-md bg-white shadow-sm p-2 relative w-full mx-auto">
      {/* Action icons in top-right */}
      {/* <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={handleFullscreen}
          className="text-gray-700 hover:text-black"
          title="Fullscreen"
        >
          <Expand className="w-5 h-5" />
        </button>
        <button
          onClick={handleDownload}
          className="text-gray-700 hover:text-black"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={handleClose}
          className="text-gray-700 hover:text-black"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div> */}

      {/* Image section */}
      {!findProject || findProject.jobData == undefined ? (
        <h1>Loading</h1>
      ) : (
        <img
          src={
            findProject.jobData[0]?.full_image ||
            "https://via.placeholder.com/800x600"
          }
          alt={findProject.jobData[0]?.title || "Image Preview"}
          className="rounded-md object-contain"
        />
      )}
    </div>
  );
};

export default ImageCard;
