import React, { useState } from "react";
import LeftPage from "./mobilePage/LeftPage";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import StudioMainTabs from "@/components/studio/studioMainTabs/StudioMainTabs";

const styles = [
  "Modern",
  "Scandinavian",
  "Urban",
  "Digital Nomad",
  "Maximalist Modern",
  "Victorian",
  "Traditional",
  "Industrial",
  "Contemporary",
];

const StudioPageMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out rounded-t-xl border-t z-50 ${
        isOpen ? "max-h-[80vh]" : "max-h-[56px]"
      } overflow-hidden`}
    >
      {/* Toggle Button */}
    <div
  className="flex justify-center items-center h-14 cursor-pointer"
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? (
   
      <IoIosArrowDown className="text-5xl" />
  ) : (
  <IoIosArrowUp className="text-5xl " />
  )}
</div>

      {/* Drawer Content */}
      <div className="px-0 pb-6 overflow-y-auto max-h-[calc(80vh-56px)]">
         {/* <LeftPage /> */}
         <StudioMainTabs/>
      </div>
    </div>
  );
};

export default StudioPageMobile;
