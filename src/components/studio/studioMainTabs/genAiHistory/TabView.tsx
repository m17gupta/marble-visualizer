
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GenAiChat } from '@/models/genAiModel/GenAiModel'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
type Props={
    genAi:GenAiChat
}
const TabView = ({ genAi }: Props) => {
    return (
        <>
            <LazyLoadImage
                src={genAi.master_image_path}
                alt="Before"
                className="w-full rounded-xl object-cover"
            />

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
                <img
                    src={genAi.output_image}
                    alt="After"
                    className="w-full rounded-xl object-cover"
                />
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