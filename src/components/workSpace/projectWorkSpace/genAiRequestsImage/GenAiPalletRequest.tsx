import { newPalletRequest } from '@/models/genAiModel/GenAiModel';
import React, { useEffect, useState } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type props={
   requestData:newPalletRequest
    keytitle: string;
   onDelete: (item: newPalletRequest) => void; 
}
const GenAiPalletRequest = ({ requestData, keytitle, onDelete }: props) => {
  return (
      <HoverCard key={`${keytitle}-${requestData.palletUrl}`}>
                {/* Replace PopoverTrigger with HoverCardTrigger */}
                <HoverCardTrigger asChild key={requestData.palletUrl}>
                  <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#25f474] bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
                    <img
                      src={requestData.palletUrl}
                      alt="user-input"
                      className="h-6 w-6 rounded-md object-cover"
                    />
                   { requestData.title && <p className="text-sm">{requestData.title}</p>}
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
                 {requestData && <h6 className="mb-2 text-md font-semibold">{requestData.title}</h6>}
                  <img src={requestData.palletUrl} alt="seg-img" className="rounded-md" />
                </HoverCardContent>
              </HoverCard>
  )
}

export default GenAiPalletRequest