
import { setCanvasType } from "@/redux/slices/canvasSlice";
import { updateGenAiImageGenerateMode } from "@/redux/slices/visualizerSlice/genAiSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export  const SwtichMode = () => {
  const dispatch= useDispatch()
  const [checked, setChecked] = React.useState(false);
  useEffect(()=>{
    if(checked){
      dispatch(updateGenAiImageGenerateMode("ai_mode"))
      dispatch(setCanvasType("onxModel"))
    }else{
      dispatch(updateGenAiImageGenerateMode("api_mode"))
      dispatch(setCanvasType("hover"))
    }
  },[checked])
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="airplane-mode" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            id="airplane-mode"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors duration-200 ${checked ? 'bg-blue-500' : ''}`}
          ></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`}
          ></div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-900">{checked?"Ai Mode":"Api Mode"}</span>
      </label>
    </div>
  );
}
