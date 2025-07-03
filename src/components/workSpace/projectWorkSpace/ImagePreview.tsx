import React from "react";
import { Download, Expand, X } from "lucide-react"; // Optional, or use inline SVGs
// import sampleImg from "@/assets/kitchen.jpg"; // Replace with your actual image path

const ImageCard: React.FC = () => {
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
        src="https://images.renovateai.app/ren/resize:fit:600000:600000:0/watermark:0:re/plain/s3://renovate-ai/1966ab9b-93ad-4e06-a379-f63b38ba6f00"
        alt="Preview"
        className="rounded-md object-contain max-h-[480px] m-auto"
      />
    </div>
  );
};

export default ImageCard;
