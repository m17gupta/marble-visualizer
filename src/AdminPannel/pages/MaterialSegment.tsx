import React, { useEffect, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { LoadingSpinner } from "../components/Projects/ProjectModal";

import { supabase } from "@/lib/supabase";
import { CSVImportModal } from "../components/Projects/CSVImportModalProps";
import { toast } from "sonner";
import {
  adminFetchMaterialSegments,
  handlesortingsegments,
  handleSelectViewSegments,
  addNewSegmentInTable,
  updateSegmentInTable,
} from "../reduxslices/adminMaterialSegment";
import type { MaterialSegment } from "@/components/swatchBook/interfaces";
import { Plus, Upload } from "lucide-react";

const MaterialSegment: React.FC = () => {
  const { isLoading, sortfield, sortorder, list } = useSelector(
    (state: RootState) => state.adminMaterialSegmemt
  );

  const [page, setPage] = useState<string>("default");
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);

  const handleMaterialPageSelection = (type: string) => {
    setPage(type);
  };

  const handleOpen = () => {
    setIsImportOpen(true);
  };

  const handleClose = () => {
    setIsImportOpen(false);
  };

  const handleImport = async (importdata: any[]) => {
    try {
      const { data, error } = await supabase
        .from("material_segments")
        .insert(importdata)
        .select("*");

      if (error) {
        toast.error("Error in Importing Data");
      } else {
        toast.success("Data Imported Successfully");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      adminFetchMaterialSegments({ orderby: sortfield, order: sortorder })
    );
  }, [sortfield, sortorder]);

  const actions = [
    {
      label: "View",
      onClick: (row: MaterialSegment) => {
        dispatch(handleSelectViewSegments(row));
        handleMaterialPageSelection("view");
      },
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: async (row: MaterialSegment) => {
        dispatch(handleSelectViewSegments(row));
        handleMaterialPageSelection("edit");
      },
      variant: "secondary" as const,
    },
    {
      label: "Delete",
      onClick: (row: MaterialSegment) => console.log("Delete segment:", row),
      variant: "danger" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={handleClose}
        onImport={handleImport}
        title="Import Segments"
      />
      {page == "default" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white  rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Material Segments
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {list.length || 0}
                  </p>
                </div>
                <div className="text-2xl">📁</div>
              </div>
            </div>

      <div className="col-span-2 col-start-3 flex justify-start items-center md:justify-end gap-2">
  <button
    onClick={() => handleMaterialPageSelection("add")}
    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 h-9"
  >
    <Upload className="w-4 h-4" />
    Add Segment Type
  </button>

  <button
    onClick={() => handleOpen()}
    className="text-sm flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors h-9"
  >
    <Plus className="w-4 h-4 mr-1" />
    Import Segments
  </button>
</div>

          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              title="All Material Segments"
              data={list}
              columnMappings={{
                id: { label: "Segment ID", sortable: true, filterable: true },
                name: {
                  label: "Name",
                  sortable: true,
                  filterable: true,
                },
                color: {
                  label: "Color",
                  sortable: true,
                  filterable: true,
                },
                color_code: {
                  label: "Color Code",
                  sortable: false,
                  filterable: false,
                },
                icon: {
                  label: "Icon",
                  sortable: false,
                  filterable: false,
                },
                icon_svg: {
                  label: "Icon Svg",
                  sortable: false,
                  filterable: false,
                },
                index: { label: "Index", sortable: true, filterable: true },
                is_active: {
                  label: "Active Status",
                  sortable: true,
                  filterable: false,
                },
                is_visible: {
                  label: "Visible Status",
                  sortable: true,
                  filterable: false,
                },
                description: {
                  label: "Description",
                  sortable: false,
                  filterable: false,
                },
                short_code: {
                  label: "Short Form",
                  sortable: false,
                  filterable: false,
                },
              }}
              actions={actions}
              searchable={true}
              pagination={true}
              sortingFunction={handlesortingsegments}
              sortfield={sortfield}
              sortorder={sortorder}
            />
          )}
        </>
      )}

      {(page == "add" || page == "edit") && (
        <MaterialSegmentAddPage
          type={page}
          onClick={handleMaterialPageSelection}
        />
      )}

      {page == "view" && (
        <MaterialSegmentViewPage onClick={handleMaterialPageSelection} />
      )}
    </div>
  );
};

export default MaterialSegment;

export const MaterialSegmentAddPage = ({ onClick, type }: any) => {
  const { adding, currentSegment } = useSelector(
    (state: RootState) => state.adminMaterialSegmemt
  );

  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<MaterialSegment>({
    name: currentSegment?.name || "",
    color: currentSegment?.color || "",
    color_code: currentSegment?.color_code || "",
    icon: currentSegment?.icon || "",
    icon_svg: currentSegment?.icon_svg || "",
    description: currentSegment?.description || "",
    short_code: currentSegment?.short_code || "",
    index: currentSegment?.index || 0,
    is_active: currentSegment?.is_active ?? true,
    is_visible: currentSegment?.is_visible ?? true,
  });

  useEffect(() => {
    if (type === "edit" && currentSegment) {
      setFormData({
        name: currentSegment.name || "",
        color: currentSegment.color || "",
        color_code: currentSegment.color_code || "",
        icon: currentSegment.icon || "",
        icon_svg: currentSegment.icon_svg || "",
        description: currentSegment.description || "",
        short_code: currentSegment.short_code || "",
        index: currentSegment.index || 0,
        is_active: currentSegment.is_active ?? true,
        is_visible: currentSegment.is_visible ?? true,
      });
    } else if (type === "add") {
      setFormData({
        name: "",
        color: "",
        color_code: "",
        icon: "",
        icon_svg: "",
        description: "",
        short_code: "",
        index: 0,
        is_active: true,
        is_visible: true,
      });
    }
  }, [type, currentSegment]);
  // No brand fetching needed for material segments

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const key = e.target.name as keyof MaterialSegment;
    let value: any = e.target.value;

    if (key === "index") value = parseInt(value) || 0;
    if (key === "is_active" || key === "is_visible")
      value = e.target.value === "true";

    setFormData({ ...formData, [key]: value });
  };

  // Handle color picker change - update color_code only
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const colorValue = e.target.value;
    setFormData({ ...formData, color_code: colorValue });
  };

  const handleSubmit = async (
    data: MaterialSegment,
    type: string = "add",
    id?: number
  ) => {
    try {
      if (!data.name) return;
      if (type === "edit" && id !== undefined) {
        dispatch(updateSegmentInTable({ product: data, id }));
      } else {
        dispatch(addNewSegmentInTable(data));
        setFormData({
          name: "",
          color: "",
          color_code: "",
          icon: "",
          icon_svg: "",
          description: "",
          short_code: "",
          index: 0,
          is_active: true,
          is_visible: true,
        });
      }
      if (!adding) {
        // onClick("default");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "edit" ? "Edit Segment" : "Add New Segment"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === "edit"
              ? "Update segment information"
              : "Create a new material segment type"}
          </p>
        </div>
        <button
          onClick={() => onClick("default")}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Form Layout - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - General Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              General
            </h3>

            {/* Segment Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                placeholder="Enter segment name"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
              {!formData.name && (
                <p className="text-xs text-red-500 mt-1">
                  Segment name is required
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </label>
              <textarea
                name="description"
                placeholder="Add a brief description"
                rows={4}
                value={formData.description}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-shadow"
                onChange={handleInputChange}
              ></textarea>
            </div>

            {/* Short Code */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Short Code{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </label>
              <input
                type="text"
                name="short_code"
                value={formData.short_code || ""}
                placeholder="e.g., SF, HF, WC"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Abbreviated identifier for this segment
              </p>
            </div>
          </div>

          {/* Media/Visual Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visual{" "}
              <span className="text-gray-400 text-xs font-normal">
                Optional
              </span>
            </h3>

            {/* Color Section */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color || ""}
                placeholder="Enter color name"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
            </div>

            {/* Color Code */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Color Code
              </label>
              <div className="flex gap-3">
                {/* Color Picker */}
                <div className="flex-shrink-0">
                  <input
                    type="color"
                    value={formData.color_code || "#25f474"}
                    className="w-16 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    onChange={handleColorPickerChange}
                    title="Pick a color"
                  />
                </div>
                {/* Color Code Input */}
                <input
                  type="text"
                  name="color_code"
                  value={formData.color_code || ""}
                  placeholder="#25f474"
                  className="flex-grow border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono transition-shadow"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Icon Fields */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Icon URL
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon || ""}
                  placeholder="https://example.com/icon.png"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                  onChange={handleInputChange}
                />
                {/* Icon Preview */}
                {formData.icon && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">
                      Preview:
                    </span>
                    <img
                      src={formData.icon}
                      alt="Icon preview"
                      className="w-10 h-10 object-contain border border-gray-300 rounded bg-white"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const errorMsg = document.createElement("span");
                          errorMsg.className = "text-xs text-red-500";
                          errorMsg.textContent = "Failed to load icon";
                          parent.appendChild(errorMsg);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Icon SVG
              </label>
              <div className="space-y-2">
                <textarea
                  name="icon_svg"
                  value={formData.icon_svg || ""}
                  placeholder='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>'
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono resize-none transition-shadow"
                  onChange={handleInputChange}
                />
                {/* SVG Preview */}
                {formData.icon_svg && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">
                      Preview:
                    </span>
                    <div
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded bg-white"
                      dangerouslySetInnerHTML={{ __html: formData.icon_svg }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Organize */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Organize
            </h3>

            {/* Index */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Display Order{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </label>
              <input
                type="number"
                name="index"
                value={formData.index || 0}
                min="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Lower numbers appear first in lists
              </p>
            </div>

            {/* Active Status */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Active Status
              </label>
              <select
                name="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Inactive segments won't be available for selection
              </p>
            </div>

            {/* Visible Status */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Visibility
              </label>
              <select
                name="is_visible"
                value={formData.is_visible ? "true" : "false"}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
              >
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Hidden segments won't appear in public views
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={() => onClick("default")}
          type="button"
          className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={(e: any) => {
            e.preventDefault();
            handleSubmit(formData, type, currentSegment?.id!);
          }}
          disabled={adding || !formData.name}
          type="submit"
          className={`px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
            adding || !formData.name
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {adding && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {adding
            ? "Saving..."
            : type === "edit"
            ? "Update Segment"
            : "Save Segment"}
        </button>
      </div>
    </div>
  );
};

export const MaterialSegmentViewPage = ({ onClick }: any) => {
  const { currentSegment } = useSelector(
    (state: RootState) => state.adminMaterialSegmemt
  );

  if (!currentSegment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No Segment Selected
          </h2>
          <p className="text-gray-500 mb-4">
            Please select a material segment to view details.
          </p>
          <button
            onClick={() => onClick("default")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (isActive?: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
        Inactive
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onClick("default")}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            title="Go back"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Segment: {currentSegment.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Segment ID: #{currentSegment.id}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(currentSegment.is_active)}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            {currentSegment.is_visible ? "Visible" : "Hidden"}
          </span>
        </div>
      </div>

      {/* Segment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Segment Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Segment Information
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {currentSegment.name}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Short Code
                </label>
                <p className="text-lg text-gray-900 font-mono">
                  {currentSegment.short_code || "N/A"}
                </p>
              </div>
            </div>

            {/* Color Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  {currentSegment.color && (
                    <div
                      className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                      style={{ backgroundColor: currentSegment.color }}
                    />
                  )}
                  <span className="text-gray-900 font-mono">
                    {currentSegment.color || "N/A"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Color Code
                </label>
                <div className="flex items-center space-x-3">
                  {currentSegment.color_code && (
                    <div
                      className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                      style={{ backgroundColor: currentSegment.color_code }}
                    />
                  )}
                  <span className="text-gray-900 font-mono">
                    {currentSegment.color_code || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>
              <p className="text-gray-900 leading-relaxed">
                {currentSegment.description || "No description available"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentSegment.index || 0}
                </div>
                <div className="text-sm text-blue-800 font-medium">Index</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  #{currentSegment.id}
                </div>
                <div className="text-sm text-purple-800 font-medium">
                  Segment ID
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Icon and Additional Information Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Visual Elements
          </h2>

          <div className="space-y-6">
            {/* Icon Display */}
            <div className="text-center pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Icon
              </label>
              {currentSegment.icon_svg ? (
                <div className="flex justify-center mb-3">
                  <div
                    className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg border"
                    dangerouslySetInnerHTML={{
                      __html: currentSegment.icon_svg,
                    }}
                  />
                </div>
              ) : currentSegment.icon ? (
                <div className="flex justify-center mb-3">
                  <img
                    src={currentSegment.icon}
                    alt={`${currentSegment.name} icon`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400">
                    No Icon
                  </div>
                </div>
              )}
            </div>

            {/* Status Information */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">
                  Active Status:
                </span>
                {getStatusBadge(currentSegment.is_active)}
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">
                  Visibility:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    currentSegment.is_visible
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentSegment.is_visible ? "Visible" : "Hidden"}
                </span>
              </div>

              {currentSegment.icon && (
                <div className="py-2">
                  <span className="text-sm font-medium text-gray-600 block mb-1">
                    Icon URL:
                  </span>
                  <span className="text-xs text-gray-500 font-mono break-all">
                    {currentSegment.icon}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
