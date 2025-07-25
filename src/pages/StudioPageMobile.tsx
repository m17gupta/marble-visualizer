import React, { useState } from "react";
import LeftPage from "./mobilePage/LeftPage";


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
        <div className="w-8 h-1.5 bg-gray-400 rounded-full" />
      </div>

      {/* Drawer Content */}
      <div className="px-4 pb-6 overflow-y-auto max-h-[calc(80vh-56px)]">
         <LeftPage />
      </div>
    </div>
  );
};

export default StudioPageMobile;
