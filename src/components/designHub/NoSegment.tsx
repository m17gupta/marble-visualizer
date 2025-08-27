import React from 'react'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateIsNewMasterArray } from '@/redux/slices/segmentsSlice';
const NoSegment = () => {
    const dispatch = useDispatch<AppDispatch>();

     const handleAddSegment = () => {
    dispatch(updateIsNewMasterArray(true));
   
  };
  return (

   <>
     <div className=" flex flex-col items-center justify-center grid items-start content-center h-[90%] w-full">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button
                   variant="outline"
                   className="rounded-full w-24 h-24 mx-auto mb-4"
                   onClick={handleAddSegment}
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="70"
                     height="70"
                     viewBox="0 0 24 24"
                   >
                     <path fill="currentColor" fill-opacity="0" d="M10 14h4v6h-4Z">
                       <animate
                         fill="freeze"
                         attributeName="fill-opacity"
                         begin="1.1s"
                         dur="0.15s"
                         values="0;0.3"
                       />
                     </path>
                     <g
                       fill="none"
                       stroke="currentColor"
                       stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke-width="2"
                     >
                       <path
                         stroke-dasharray="16"
                         stroke-dashoffset="16"
                         d="M5 21h14"
                       >
                         <animate
                           fill="freeze"
                           attributeName="stroke-dashoffset"
                           dur="0.2s"
                           values="16;0"
                         />
                       </path>
                       <path
                         stroke-dasharray="14"
                         stroke-dashoffset="14"
                         d="M5 21v-13M19 21v-13"
                       >
                         <animate
                           fill="freeze"
                           attributeName="stroke-dashoffset"
                           begin="0.2s"
                           dur="0.2s"
                           values="14;0"
                         />
                       </path>
                       <path
                         stroke-dasharray="24"
                         stroke-dashoffset="24"
                         d="M9 21v-8h6v8"
                       >
                         <animate
                           fill="freeze"
                           attributeName="stroke-dashoffset"
                           begin="0.4s"
                           dur="0.4s"
                           values="24;0"
                         />
                       </path>
                       <path
                         stroke-dasharray="28"
                         stroke-dashoffset="28"
                         d="M2 10l10 -8l10 8"
                       >
                         <animate
                           fill="freeze"
                           attributeName="stroke-dashoffset"
                           begin="0.5s"
                           dur="0.6s"
                           values="28;0"
                         />
                       </path>
                     </g>
                   </svg>
                 </Button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Add Segment</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
   
           <p className="text-gray-500 mb-2 text-center">
             No segments available. Please add a segment.
           </p>
   
           <Button
             className="btn-primary bg-primary hover:bg-primary/90 text-white hover:text-white w-32 mx-auto"
             variant="outline"
             size="sm"
             onClick={handleAddSegment}
           >
             Select Segment
           </Button>
         </div>
   </>
  )
}

export default NoSegment