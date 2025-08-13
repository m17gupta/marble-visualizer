import { RootState } from "@/redux/store";
import { ChevronDown, ArrowLeft, Info } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface WallSelectionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTabData: any;
}

export const WallSelectionModal = ({
  isOpen,
  setIsOpen,
  activeTabData,
}: WallSelectionModalProps) => {
  const {
    materials,
    wallMaterials,
    doorMaterials,
    roofMaterials,
    windowMaterials,
    trimMaterials,
  } = useSelector((state: RootState) => state.materials);

  const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
  const newPath = "https://betadzinly.s3.us-east-2.amazonaws.com/material/";

  let materialsdata = null;

  switch (activeTabData.name) {
    case "Wall":
      materialsdata = wallMaterials;
      break;
    case "Window":
      materialsdata = windowMaterials;
      break;
    case "Roof":
      materialsdata = roofMaterials;
      break;
    case "Trim":
      materialsdata = trimMaterials;
      break;
    case "Door":
      materialsdata = doorMaterials;
      break;
    default:
      materialsdata = materials;
  }

  const wallSwatches = [
    { id: 1, type: "siding", color: "#4A5568", pattern: "horizontal-lines" },
    { id: 2, type: "wood", color: "#8B4513", pattern: "wood-grain" },
    { id: 3, type: "concrete", color: "#9CA3AF", pattern: "smooth" },
    { id: 4, type: "stone", color: "#6B7280", pattern: "stone-texture" },
    { id: 5, type: "brick", color: "#92400E", pattern: "brick" },
    { id: 6, type: "stucco", color: "#E5E7EB", pattern: "textured" },
    { id: 7, type: "concrete", color: "#D1D5DB", pattern: "smooth" },
    { id: 8, type: "stone", color: "#F3F4F6", pattern: "natural-stone" },
    { id: 9, type: "wood", color: "#451A03", pattern: "dark-wood" },
    { id: 10, type: "composite", color: "#78716C", pattern: "composite" },
    { id: 11, type: "cedar", color: "#DC2626", pattern: "cedar-shake" },
    { id: 12, type: "composite", color: "#374151", pattern: "composite-dark" },
    { id: 13, type: "vinyl", color: "#F9FAFB", pattern: "vinyl-siding" },
    { id: 14, type: "metal", color: "#4B5563", pattern: "corrugated" },
    { id: 15, type: "fiber", color: "#6B7280", pattern: "fiber-cement" },
  ];

  const SwatchTile = ({ swatch }: { swatch: any }) => {
    return (
      <div className="relative">
        <div className="w-24 h-20 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <img
            src={
              swatch?.bucket_path === "default"
                ? `${path}/${swatch.photo}`
                : `${newPath}/${swatch.bucket_path}`
            }
            alt={swatch.title}
          />
        </div>
        <button className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50">
          <Info size={12} className="text-gray-500" />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 h-full w-96 -mt-0 pt-0 bg-white shadow-xl border-r z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-[404px]" : "-translate-x-[100%]"
      }`}
      style={{ left: 0 }}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center">
        <button
          onClick={() => setIsOpen(false)}
          className="mr-3 p-1 hover:bg-gray-100 rounded"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h4 className="font-semibold text-lg">Wall</h4>
      </div>

      {/* Swatch Section */}
      <div className="px-4 ">
        <h5 className="font-medium text-gray-800 mb-3">Swatch</h5>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto">
          {materialsdata!.map((swatch) => (
            <SwatchTile key={swatch.id} swatch={swatch} />
          ))}
        </div>
      </div>
    </div>
  );
};
