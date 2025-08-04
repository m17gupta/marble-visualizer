import { RootState } from "@/redux/store";
import React  from "react";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
// import sampleImg from "@/assets/kitchen.jpg"; // Replace with your actual image path

const ImageCard: React.FC = () => {
  // const { currentImageUrl } = useSelector((state: RootState) => state.studio);

  const param = useParams();
  const id = param.id !== undefined ? parseInt(param.id) : 0;
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const findProject = projects.find((d) => d.id == id);

 

  return (
    <div className="border rounded-md bg-white shadow-sm p-2 relative w-full mx-auto">
      
      {/* Image section */}
      {!findProject || findProject.jobData == undefined ? (
 <Skeleton className="h-[90vh] w-[100%] rounded-2" />
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
