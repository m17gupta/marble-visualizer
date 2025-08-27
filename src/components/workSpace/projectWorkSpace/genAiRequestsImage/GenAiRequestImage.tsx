import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; // <-- Import HoverCard instead of Popover
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
type props={
    imageUrl: string;
    keytitle: string;
    segName: string;
    index: number;
}
const GenAiRequestImage = ({ imageUrl, keytitle, index }: props) => {
  return (

    <HoverCard key={`${keytitle}-${index}`}>
                {/* Replace PopoverTrigger with HoverCardTrigger */}
                <HoverCardTrigger asChild key={imageUrl}>
                  <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#25f474] bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
                    <img
                      src={imageUrl}
                      alt="user-input"
                      className="h-6 w-6 rounded-md object-cover"
                    />
                    <p className="text-sm">WL1 </p>
                    <span
                      className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                      // The onClick for deleting will still work perfectly
                      // onClick={() => handleDelete("wall-1-id")}
                    >
                      &times;
                    </span>
                  </div>
                </HoverCardTrigger>
    
                {/* Replace PopoverContent with HoverCardContent */}
                <HoverCardContent
                  className="w-[240px] rounded-xl p-3 shadow-lg"
                  sideOffset={8}
                >
                  <h6 className="mb-2 text-md font-semibold">wall 1</h6>
                  <img src={imageUrl} alt="seg-img" className="rounded-md" />
                </HoverCardContent>
              </HoverCard>
  )
}

export default GenAiRequestImage