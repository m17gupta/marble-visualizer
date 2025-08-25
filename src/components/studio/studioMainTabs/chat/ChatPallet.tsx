"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import FilterSwatch from "../searchSwatch/FilterSwatch";

const ChatPallet: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ONE open state, not duplicated

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <button
                type="button"
                className="text-base hover:text-purple-600 transition p-0 inline-flex items-center px-1 py-1"
                aria-label="Open Materials"
                onClick={() => setIsSheetOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-bricks"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5zM3 4v2h4.5V4zm5.5 0v2H13V4zM3 10v2h4.5v-2zm5.5 0v2H13v-2zM1 1v2h3.5V1zm4.5 0v2h5V1zm6 0v2H15V1zM1 7v2h3.5V7zm4.5 0v2h5V7zm6 0v2H15V7zM1 13v2h3.5v-2zm4.5 0v2h5v-2zm6 0v2H15v-2z" />
                </svg>
              </button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Pallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <FilterSwatch setIsSheetOpen={setIsSheetOpen} />
    </Sheet>
  );
};

export default ChatPallet;
