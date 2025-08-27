import React, { useEffect, useState } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; // <-- Import HoverCard instead of Popover
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { RequestPaletteModel } from '@/models/genAiModel/GenAiModel';
import { set } from 'date-fns';
type props={
   requestData:RequestPaletteModel
    keytitle: string;
   onDelete: (item: RequestPaletteModel) => void; 
}
const GenAiRequestImage = ({requestData,keytitle ,onDelete }: props) => {

  const [allSeg, setAllSeg] = useState<string | null>(null);

  useEffect(() => {
    if (requestData.segments && requestData.segments.length > 0) {
      const segments = requestData.segments.map(item => item.toUpperCase()).join('|');
      setAllSeg(segments);
    }else{
      setAllSeg(null);
    }
  }, [requestData]);

  return (

    <HoverCard key={`${keytitle}-${requestData.id}`}>
                {/* Replace PopoverTrigger with HoverCardTrigger */}
                <HoverCardTrigger asChild key={requestData.id}>
                  <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#25f474] bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
                    <img
                      src={requestData.url}
                      alt="user-input"
                      className="h-6 w-6 rounded-md object-cover"
                    />
                   { allSeg && <p className="text-sm">{allSeg}</p>}
                    <span
                      className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                      // The onClick for deleting will still work perfectly
                      onClick={() => onDelete(requestData)}
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
                 {allSeg && <h6 className="mb-2 text-md font-semibold">{allSeg}</h6>}
                  <img src={requestData.url} alt="seg-img" className="rounded-md" />
                </HoverCardContent>
              </HoverCard>
  )
}

export default GenAiRequestImage