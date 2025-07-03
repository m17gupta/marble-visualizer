import React from "react";
import { Download, Expand, X } from "lucide-react"; // Optional, or use inline SVGs
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import sampleImg from "@/assets/kitchen.jpg"; // Replace with your actual image path

const ImageCard: React.FC = () => {
 
   const {list} = useSelector((state: RootState) => state.jobs);

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
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
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
      <img
        src={list[0]?.full_image || "https://via.placeholder.com/800x600"} // Replace with actual image URL
        alt={list[0]?.title || "Image Preview"}
        className="rounded-md object-contain max-h-[480px]"
      />
    </div>
  );
};

export default ImageCard;
