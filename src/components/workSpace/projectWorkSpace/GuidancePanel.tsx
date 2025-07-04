import React, { useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import AddInspiration from "./AddInspiration";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsAddInspiration,
  setIsAddInspiration,
} from "@/redux/slices/visualizerSlice/workspaceSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ProjectHistory from "./ProjectHistory";
import { HiOutlineSparkles } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FcIdea } from "react-icons/fc";
const GuidancePanel: React.FC = () => {
  const dispatch = useDispatch();

  const getIsAddInspirations = useSelector(getIsAddInspiration);
  const [isModel, setIsModel] = React.useState(false);

  // update the model open and closing

  useEffect(() => {
    if (getIsAddInspirations) {

      setIsModel(getIsAddInspirations);
    } else {
      setIsModel(false);
    }
  }, [getIsAddInspirations]);
  const handleAddInspirational = () => {
    dispatch(setIsAddInspiration(true));
  };


  const handleCloseModel = () => {
    dispatch(setIsAddInspiration(false));
    setIsModel(false);
  };

  const handleSubmit = () => {
    console.log("Submitted data:");

    // Handle the submitted data here
    // For example, you can dispatch an action to save the inspiration
    // dispatch(saveInspiration(data));
  };

  const [open, setOpen] = React.useState(false);
  return (
    <>

    <div className="bg-white border border-gray-50 p-4 rounded-md shadow-md mb-4">

    </div>
      <div className="p-4 bg-white rounded-sm">
        <h2 className="text-lg font-semibold mb-2">AI Guidance</h2>
        <textarea
          className="w-full p-2 ps-0 pt-0 border-0 focus:outline-none focus:ring-0 rounded mb-1 resize-none"
          placeholder="Enter guidance..."
          rows={2}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {/* <span className="flex items-center gap-1 px-2 py-1 bg-[#f1f5f9] text-gray-800 rounded-md text-sm shadow-sm">
   
  
  </span> */}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}>
                <Button variant="outline" className="flex align-middle ">
                  Spa{" "}
                  <span className="ms-2 text-lg text-gray-500">&times;</span>
                </Button>
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="w-[240px] p-3 rounded-xl shadow-lg"
              sideOffset={8}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}>
              <h5 className="text-sm font-semibold mb-2">
                Vintagebrick Alexandria Buff
              </h5>
              <img
                src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Vintagebrick_Alexandria_Buff_MTI5NjAy.jpg"
                alt="seg-img"
                className="w-full   rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-between items-between">
          <div className="flex items-center">
            <ProjectHistory />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-sm text-blue-600 border border-gray-300 bg-transparent me-2 flex items-center justify-center gap-1 px-3 py-2 rounded-md">
                    <HiOutlineSparkles className="text-lg" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black text-white text-xs px-2 py-1 rounded-md">
                  Enhance Guidance
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <AddInspiration
              isOpen={isModel}
              onClose={handleCloseModel}
              onSubmit={handleSubmit}
            />
            <button
              className="text-sm border  border border-gray-300 flex align-middle gap-1"
              onClick={handleAddInspirational}>
              {" "}
              <CiImageOn className="text-lg" /> Add Inspiration
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn bg-transparent rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 p-2">
              <FcIdea className="text-2xl" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Visualize
            </button>
          </div>

        </div>
      </div>

    </>
  );
};
export default GuidancePanel;
