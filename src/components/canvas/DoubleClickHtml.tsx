
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { modelPoint } from './CanavasImage';


type Props={
    doubleClickPoint:modelPoint
    onClose:()=>void
}
const DoubleClickHtml = ({ doubleClickPoint, onClose }: Props) => {
  const [visible, setVisible] = useState(true);
  const buttons = [
    

    {
      id: "edit-segment",
      tooltip: "Edit Segment",
      icon: (
        <img
          src="/assets/image/line-md--edit-twotone.svg"
          alt="Edit Segment"
          className="h-5 w-5"
        />
      ),
    },
    {
      id: "edit-annotation",
      tooltip: "Edit Annotation",

      icon: (
        <img
          src="/assets/image/carbon--area.svg"
          alt="Edit"
          className="h-5 w-5"
        />
      ),
    },
    {
      id: "delete-segment",
      tooltip: "Delete Segment",
      icon: (
        <img
          src="/assets/image/line-md--trash.svg"
          alt="Delete Segment"
          className="h-5 w-5"
        />
      ),
    },
    {
      id: "information",
      tooltip: "Information",
      icon: (
        <img
          src="/assets/image/solar--info-square-linear.svg"
          alt="Information"
          className="h-5 w-5"
        />
      ),
    },
  ];
   const [active, setActive] = useState<string | null>(null);
  if (!visible) return null;
  return (
    <>
      <TooltipProvider>
        <div
          className="relative"
          style={{
            position: "absolute",
            top: doubleClickPoint.y,
            left: doubleClickPoint.x,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            padding: "5px 5px 5px 5px",
            borderRadius: "5px",
            zIndex: 100,
            minWidth: 'fit-content',
          }}
        >
          {/* Close (X) icon absolutely positioned in the popup */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-1 right-1 p-1 rounded hover:bg-gray-200 focus:outline-none"
            style={{ lineHeight: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L14 14M14 6L6 14" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Button row */}
          <div className="flex items-center justify-center gap-2 px-4 py-2">
            {buttons.map((btn) => {
              return (
                <Tooltip key={btn.id}>
                  <TooltipTrigger asChild>
                    <button
                      // onClick={() => handleOptionSelect(btn.id)}
                      className={`px-3 py-1 rounded-md border 1 transition-colors focus:outline-none focus:ring-0 focus:ring-blue-400
                      ${
                        active === btn.id
                          ? "bg-blue-50 text-white border-blue-50"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {btn.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{btn.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

export default DoubleClickHtml