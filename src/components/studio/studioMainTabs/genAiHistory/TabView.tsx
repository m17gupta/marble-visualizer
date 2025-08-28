
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GenAiChat } from '@/models/genAiModel/GenAiModel'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { TbHomePlus } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addHouseImage, addInspirationImage, addPaletteImage, addPrompt, setCurrentGenAiImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import { setCurrentInspTab } from "@/redux/slices/InspirationalSlice/InspirationTabSlice";
import { setIsGenerated } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";
type Props={
    genAi:GenAiChat
}
const TabView = ({ genAi }: Props) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleMasterImage = (imagePath: string) => {
       
        dispatch(addHouseImage(imagePath));
        dispatch(setCurrentInspTab("chat"));
    };

      const handleImageSwitch = () => {
    
        // dispatch(setIsGenerated(true));
        dispatch(setCurrentGenAiImage(genAi));
        dispatch(setCurrentTabContent("compare"));
        dispatch(addInspirationImage(genAi.reference_img));
        dispatch(addPaletteImage(genAi.palette_image_path));
        dispatch(addHouseImage(genAi.master_image_path));
        dispatch(addPrompt(genAi.user_input_text));
    
    
      };
    return (
        <>
            <div className="relative">
                <LazyLoadImage
                    src={genAi.master_image_path}
                    alt="Before"
                    className="w-full rounded-xl object-cover"
                />
              
            </div>
            
            <div
                className="rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm"
                style={{
                    border: "1.5px solid transparent",
                    background:
                        "linear-gradient(#fff,#fff) padding-box, linear-gradient(90deg,#7c3aed,#6366f1) border-box",
                }}>
                {genAi.user_input_text || "No user input text provided."}
            </div>

            <div className="relative">
                <LazyLoadImage
                    src={genAi.output_image}
                    alt="After"
                    className="w-full rounded-xl object-cover"
                    onClick={handleImageSwitch}
                />
                <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow-sm cursor-pointer"
                onClick={() => handleMasterImage(genAi.output_image)}
                >
                    <TbHomePlus className="text-lg"/>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>

                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Copy image URL</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </>
    )
}

export default TabView