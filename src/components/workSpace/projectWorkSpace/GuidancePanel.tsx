import React, { useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import AddInspiration from "./AddInspiration";
import { useDispatch, useSelector } from "react-redux";
import { getIsAddInspiration, setIsAddInspiration } from "@/redux/slices/visualizerSlice/workspaceSlice";

const GuidancePanel: React.FC = () =>{
  
  const dispatch = useDispatch();

   const getIsAddInspirations= useSelector(getIsAddInspiration)
  const [isModel, setIsModel] = React.useState(false);


  // update the model open and closing

  useEffect(() => {
    if(getIsAddInspirations){
     
    setIsModel(getIsAddInspirations);
    }else{
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

  const handleSubmit = (data: any) => {
    console.log("Submitted data:", data);
    
    // Handle the submitted data here
    // For example, you can dispatch an action to save the inspiration
    // dispatch(saveInspiration(data));
  };
  return(
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

      <button className="text-sm text-gray-700 py-1 hover:text-gray-900 h-8 px-4 bg-white border border-gray-300 hover:border-gray-500 shadow-sm  rounded-md transition-colors duration-200 ease-in-out">
        Spa <span>&times;</span>
      </button>

      <button className="text-sm text-gray-700 py-1 hover:text-gray-900 h-8 px-4 bg-white border border-gray-300 hover:border-gray-500 shadow-sm  rounded-md transition-colors duration-200 ease-in-out">
        Spa <span>&times;</span>
      </button>

      <button className="text-sm text-gray-700 py-1 hover:text-gray-900 h-8 px-4 bg-white border border-gray-300 hover:border-gray-500 shadow-sm  rounded-md transition-colors duration-200 ease-in-out">
        Spa <span>&times;</span>
      </button>

      <button className="text-sm text-gray-700 py-1 hover:text-gray-900 h-8 px-4 bg-white border border-gray-300 hover:border-gray-500 shadow-sm  rounded-md transition-colors duration-200 ease-in-out">
        Spa <span>&times;</span>
      </button>
    </div>

    <div className="flex justify-between items-between">
      <div className="flex items-center">
        <button className="text-sm text-blue-600  border bg-blue-100 me-2">History</button>
        <AddInspiration
        isOpen={isModel}
        onClose={handleCloseModel}
        onSubmit={handleSubmit}
        />
        <button className="text-sm border  border border-gray-300 flex align-middle gap-1"
        onClick={handleAddInspirational}
        > <CiImageOn className="text-lg"/> Add Inspiration</button>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Visualize
      </button>
    </div>
  </div>
);
}
export default GuidancePanel;
