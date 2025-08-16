
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
import { addHouseImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import { setCurrentInspTab } from "@/redux/slices/InspirationalSlice/InspirationTabSlice";
type Props={
    genAi:GenAiChat
}
const TabView = ({ genAi }: Props) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleMasterImage = (imagePath: string) => {
       
        dispatch(addHouseImage(imagePath));
        dispatch(setCurrentInspTab("chat"));
    };
    return (
        <>
            <div className="relative">
                <LazyLoadImage
                    src={genAi.master_image_path}
                    alt="Before"
                    className="w-full rounded-xl object-cover"
                />
                {/* <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow-sm"
                onClick={() => handleMasterImage(genAi.master_image_path)}
                >
                    <TbHomePlus />
                </div> */}
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
                />
                <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow-sm"
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