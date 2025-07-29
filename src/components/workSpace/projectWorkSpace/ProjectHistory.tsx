
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GenAiChat } from "@/models/genAiModel/GenAiModel";
import { addHouseImage, addInspirationImage, addPaletteImage, addPrompt, setCurrentGenAiImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import { RootState } from "@/redux/store";
import React from "react";
import { IoTimerOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const ProjectHistory = () => {

  const { genAiImages, isFetchingGenAiImages } = useSelector((state: RootState) => state.genAi);
  const dispatch = useDispatch();
  const handleGenAiImageClick = (image: GenAiChat) => {
 
    dispatch(setCurrentGenAiImage(image));

    // add inspiration image to the state
    dispatch(addInspirationImage(image.reference_img));
    dispatch(addPaletteImage(image.palette_image_path));
    dispatch(addHouseImage(image.master_image_path));
    dispatch(addPrompt(image.prompt));

  }

  return (


    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm text-blue-600 border  border-blue-600 bg-transparent me-2 flex items-center justify-center gap-1 md:px-3 md:py-2 px-3 py-1 rounded-md">
          <IoTimerOutline className="text-lg" /> <span className="hidden md:block">History</span>
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
                <div
                    key={index}
                    onClick={() => handleGenAiImageClick(image)}
                    className="flex items-center justify-between p-3 rounded-md cursor-pointer 
                              transition-all duration-150 
                              hover:bg-gray-100 hover:shadow-md 
                              active:bg-gray-200 active:shadow-md"
                  >
                    <div className="flex items-start gap-2 w-full max-w-[calc(100%-2rem)]">
                      <IoTimerOutline className="text-2xl shrink-0 mt-1 text-gray-600" />
                      <p className="text-sm text-gray-800 break-words line-clamp-3">{image.prompt}</p>
                    </div>
                    <span className="ms-2 text-lg text-gray-500 cursor-pointer">&times;</span>
                  </div>


              ))
            )
          }



        </div>

      </PopoverContent>
    </Popover>




  );
};

export default ProjectHistory;
