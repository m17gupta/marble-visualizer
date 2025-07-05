import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
//import objectimg from "../../../../dist/assets/object-img-f9e-Kvp6.jpeg"; // Adjust the path as necessary
const SidebarObject = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Main Card */}
      <div className="bg-white border rounded-xl p-4 space-y-3 w-100">
        <h3 className="font-semibold text-lg">3. Preserve Objects</h3>
        <p className="text-sm text-gray-600">
          If you want to preserve some parts of the original image, you can scan
          the objects and preserve the original image.
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full mt-3  py-2 border border-gray-300 rounded-xl text-sm text-blue-700 hover:bg-gray-50 transition">
          Preserve Objects
        </button>



       <div className="flex items-center gap-3 pt-2">
        <button className="relative rounded-xl py-1.5 m-0 text-sm border border-gray-300 bg-transparent">
          Wall
          <Badge
            className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white px-2 py-0.5 pt-0 text-xs "
            variant="default">
            x
          </Badge>
        </button>
        <button className="relative rounded-xl py-1.5 m-0 text-sm border border-gray-300 bg-transparent">
          Wall
          <Badge
            className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white px-2 py-0.5 pt-0 text-xs "
            variant="default">
            x
          </Badge>
        </button>
       </div>

       <div className="relative flex border border-gray-300 rounded-xl p-2 align-super justify-between">

        {/* <img src={objectimg} alt="Object Image" className="object-cover"></img> */}
          <span className="absolute -top-3 -right-3 cursor-pointer">
            <IoIosCloseCircleOutline className="text-3xl" />
          </span>
       </div>


      </div>

      {/* Offcanvas Panel - LEFT aligned */}
      <div
        className={`fixed -top-6 h-full w-80 -mt-0 pt-0 bg-white shadow-xl border-r z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-[404px]" : "-translate-x-[100%]"
        }`}
        style={{ left: 0 }}>
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="font-semibold text-base">Preserve Objects </h4>

          <span
            onClick={() => setIsOpen(false)}
            className="cursor-pointer text-3xl text-gray-500 hover:text-black transition">
            <IoIosCloseCircleOutline />
          </span>
          {/* <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black text-xl"
          >
            &times;
          </button> */}
        </div>

        {/* Top actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center gap-1">
            Custom Mask <Plus size={14} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="cursor-pointer hover:underline">Clear All</span>
            <Trash2 size={16} className="text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 text-sm text-gray-700">
          You have preserved some areas / objects. Tap to{" "}
          <span className="text-blue-600 underline cursor-pointer">View</span>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 w-full flex justify-center">
          <button className="bg-blue-400 text-white text-sm font-medium px-10 py-2 rounded-xl">
            Save
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default SidebarObject;
