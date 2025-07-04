import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { IoTimerOutline } from "react-icons/io5";

const ProjectHistory = () => {
  const [open, setOpen] = React.useState(false);
  return (
    //     <div>
    //       <Popover open={open} onOpenChange={setOpen}>
    //   <PopoverTrigger asChild>
    //     <div

    //     >
    //       <button className="text-sm text-blue-600 border border-blue-700 bg-transparent me-2 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md">
    //         <IoTimerOutline className="text-lg" /> History
    //       </button>
    //     </div>
    //   </PopoverTrigger>

    //   <PopoverContent
    //     className="w-[260px] p-3 rounded-xl shadow-lg"
    //     sideOffset={8}
    //     onMouseEnter={() => setOpen(true)}
    //     onMouseLeave={() => setOpen(false)}
    //   >
    //     {/* Search Box */}
    //     <input
    //       type="text"
    //       placeholder="Search history..."
    //       className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring focus:ring-blue-200"
    //     />

    //     {/* List of Items */}
    //     <ul className="space-y-2 text-sm">
    //       {[
    //         "Change cabinet color to dark grey and floor to marble finish white",
    //         "Change wall colors",
    //       ].map((item, index) => (
    //         <li
    //           key={index}
    //           className="flex items-start justify-between text-gray-800 hover:bg-gray-50 px-2 py-1 rounded-md"
    //         >
    //           <div className="flex items-start gap-2">
    //             <IoTimerOutline className="mt-1 text-gray-500 text-sm" />
    //             <span>{item}</span>
    //           </div>
    //           <button className="text-gray-500 hover:text-red-500 text-sm mt-1">
    //             &times;
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   </PopoverContent>
    // </Popover>

    //     </div>

    <Popover>
      <PopoverTrigger asChild>
          <button className="text-sm text-blue-600 border border-gray-300 bg-transparent me-2 flex items-center justify-center gap-1 px-3 py-2 rounded-md">
             <IoTimerOutline className="text-lg" /> History
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
          <div className="flex align-middle justify-between p-3 hover:bg-gray-100  rounded-md">
            <div className="flex items-center gap-2">
            <IoTimerOutline className="text-lg" />
            <p>chnage wall colors</p>
            </div>
             <span className="ms-2 text-lg text-gray-500">&times;</span>
          </div>

          <div className="flex align-middle justify-between p-3 hover:bg-gray-100  rounded-md">
            <div className="flex items-center gap-2">
            <IoTimerOutline className="text-lg" />
            <p>chnage wall colors</p>
            </div>
             <span className="ms-2 text-lg text-gray-500">&times;</span>
          </div>
       </div>

      </PopoverContent>
    </Popover>




  );
};

export default ProjectHistory;
