import { RootState } from "@/redux/store";
import { ChevronDown, ArrowLeft, Info } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface WallSelectionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTabData: any;
  handleSelectMaterial: (data: any, name: string) => void;
  finaldata: number[] | undefined;
  expanded: string | undefined;
}

export const WallSelectionModal = ({
  isOpen,
  setIsOpen,
  activeTabData,
  handleSelectMaterial,
  finaldata,
  expanded,
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

  const SwatchTile = ({
    swatch,
    finaldata,
  }: {
    swatch: any;
    finaldata: number[];
  }) => {
    const isPresent = finaldata?.includes(swatch.id);
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
        <button
          className={`absolute top-1 right-1 w-5 h-5  rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 ${
            isPresent ? "bg-black" : "bg-white"
          }`}
          onClick={() => handleSelectMaterial(swatch, expanded!)}
        >
          <Info size={12} className="text-gray-500" />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0  w-96 -mt-0 pt-0 bg-white shadow-xl border-r z-50 transition-all duration-1000 ease-in-out ${
        isOpen ? "translate-x-[25vw]" : "-translate-x-[100%]"
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
            <SwatchTile
              key={swatch.id}
              swatch={swatch}
              finaldata={finaldata!}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
