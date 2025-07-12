
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RootState } from "@/redux/store";
import React from "react";
import { IoTimerOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const ProjectHistory = () => {
  const [open, setOpen] = React.useState(false);
  const { genAiImages, loading, error, isFetchingGenAiImages } = useSelector((state: RootState) => state.genAi);


  return (


    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm text-blue-600 border border-gray-300 bg-transparent me-2 flex items-center justify-center gap-1 px-3 py-2 rounded-md">
          <IoTimerOutline className="text-lg" /> History
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl shadow-lg">
        <div className="grid gap-4 border-b  p-3 pb-0">
          <input
            type="text"
            placeholder="Search history..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>


        <div className="p-3">
          {
            !isFetchingGenAiImages && genAiImages.length === 0 ? (
              <div className="text-center text-gray-500">
                No history available
              </div>
            ) : (
              genAiImages.map((image, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <IoTimerOutline className="text-lg" />
                    <p>{image.prompt}</p>
                  </div>
                  <span className="ms-2 text-lg text-gray-500">&times;</span>
                </div>
              ))
            )
          }
          <div className="flex align-middle justify-between p-3 hover:bg-gray-100  rounded-md">
            <div className="flex items-center gap-2">
              <IoTimerOutline className="text-lg" />
              <p>chnage wall colors</p>
            </div>
            <span className="ms-2 text-lg text-gray-500">&times;</span>
          </div>
          {/* 
          <div className="flex align-middle justify-between p-3 hover:bg-gray-100  rounded-md">
            <div className="flex items-center gap-2">
            <IoTimerOutline className="text-lg" />
            <p>chnage wall colors</p>
            </div>
             <span className="ms-2 text-lg text-gray-500">&times;</span>
          </div> */}
        </div>

      </PopoverContent>
    </Popover>




  );
};

export default ProjectHistory;
