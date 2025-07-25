import React, { useEffect, useState } from "react";
import { Download, Expand, X } from "lucide-react"; // Optional, or use inline SVGs
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useParams } from "react-router-dom";
import { fetchJobsByProject } from "@/redux/slices/jobSlice";
// import sampleImg from "@/assets/kitchen.jpg"; // Replace with your actual image path

const ImageCard: React.FC = () => {
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);

  const param = useParams();
  const id = param.id !== undefined ? parseInt(param.id) : 0;
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const findProject = projects.find((d) => d.id == id);
  const handleFullscreen = () => {
    console.log("Fullscreen clicked");
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    // link.href = sampleImg;
    link.download = "image.jpg";
    link.click();
  };

  const handleClose = () => {
    console.log("Close clicked");
  };

  return (
    <div className="border rounded-md bg-white shadow-sm p-2 relative w-full mx-auto">
      {/* Action icons in top-right */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
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
      </div>

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
