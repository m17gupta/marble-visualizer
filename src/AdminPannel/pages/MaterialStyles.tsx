import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { LoadingSpinner } from "../components/Projects/ProjectModal";

import {
  addNewBrandStyleInTable,
  adminFetchBrandsStyles,
  handleSelectViewBrandStyle,
  handlesortingbrands,
  ProductBrand,
  StylesModal,
  updateBrandInTable,
  updateBrandStyleInTable,
} from "../reduxslices/MaterialBrandSlice";
import { StyleModel } from "@/models/swatchBook/styleModel/StyleModel";
import { supabase } from "@/lib/supabase";
import { CSVImportModal } from "../components/Projects/CSVImportModalProps";
import { toast } from "sonner";

interface ProjectUser {
  id: number;
  full_name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold" | string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  user_id: ProjectUser;
}

interface ChartData {
  date: string;
  count: number;
}

const MaterialBrandStyles: React.FC = () => {
  const { isLoading, sortfield, sortorder, style_arr } = useSelector(
    (state: RootState) => state.adminBrands
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
        .from("product_brand_styles")
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
    dispatch(adminFetchBrandsStyles({ orderby: sortfield, order: sortorder }));
  }, [sortfield, sortorder]);

  const actions = [
    {
      label: "View",
      onClick: (row: StylesModal) => {
        dispatch(handleSelectViewBrandStyle(row));
        handleMaterialPageSelection("view");
      },
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: async (row: StylesModal) => {
        dispatch(handleSelectViewBrandStyle(row));
        handleMaterialPageSelection("edit");
      },
      variant: "secondary" as const,
    },
    {
      label: "Delete",
      onClick: (row: ProductBrand) => console.log("Delete project:", row),
      variant: "danger" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={handleClose}
        onImport={handleImport}
        title="Import Styles"
      />
      {page == "default" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white  rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Brand Styles
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {style_arr.length || 0}
                  </p>
                </div>
                <div className="text-2xl">📁</div>
              </div>
            </div>

            <div className="col-span-2 md:justify-end col-start-3 flex md:flex-row flex-col justify-start">
              <button
                onClick={() => handleMaterialPageSelection("add")}
                className="rounded-lg border border-gray-200 h-10 bg-black text-white hover:bg-white hover:text-black transition-colors duration-200"
              >
                Add Brand Styles
              </button>

              <button
                onClick={() => handleOpen()}
                className="rounded-lg border border-gray-200 h-10 bg-green-800 text-white hover:bg-white hover:text-green-800 transition-colors duration-200"
              >
                Import Styles
              </button>
            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              title="All Brand Styles"
              data={style_arr}
              columnMappings={{
                id: { label: "Style ID", sortable: true, filterable: true },
                product_brand_id: {
                  label: "Brand",
                  sortable: true,
                  filterable: true,
                },
                title: {
                  label: "Style Title",
                  sortable: true,
                  filterable: true,
                },
                slug: { label: "Slug", sortable: false, filterable: true },
                description: {
                  label: "Description",
                  sortable: false,
                  filterable: true,
                },
                sort_order: {
                  label: "Sort Order",
                  sortable: true,
                  filterable: false,
                },
                status: { label: "Status", sortable: true, filterable: true },
                created_at: {
                  label: "Created Date",
                  sortable: true,
                  filterable: false,
                },
                updated_at: {
                  label: "Last Modified",
                  sortable: true,
                  filterable: false,
                },
                category_id: {
                  label: "Category",
                  sortable: false,
                  filterable: false,
                },
                material_segment_id: {
                  label: "Material Segment",
                  sortable: false,
                  filterable: false,
                },
                brand_id: {
                  label: "Brand Reference",
                  sortable: false,
                  filterable: false,
                },
              }}
              actions={actions}
              searchable={true}
              pagination={true}
              sortingFunction={handlesortingbrands}
              sortfield={sortfield}
              sortorder={sortorder}
            />
          )}
        </>
      )}

      {(page == "add" || page == "edit") && (
        <BrandStyleAddPage type={page} onClick={handleMaterialPageSelection} />
      )}

      {page == "view" && (
        <BrandStyleViewPage onClick={handleMaterialPageSelection} />
      )}
    </div>
  );
};

export default MaterialBrandStyles;

export const BrandStyleAddPage = ({ onClick, type }: any) => {
  const { adding, list, currentStyle } = useSelector(
    (state: RootState) => state.adminBrands
  );

  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<StylesModal>({
    product_brand_id: currentStyle?.product_brand_id.id || null,
    title: currentStyle?.title || "",
    slug: currentStyle?.slug || "",
    description: currentStyle?.description || "",
    sort_order: currentStyle?.sort_order || 0,
    status: currentStyle?.status || 1,
  });

  const [brandOptions, setBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase.from("product_brand").select("*");
      if (!error) {
        setBrands(data);
      } else {
        return null;
      }
    };
    fetchBrands();
  }, [list]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const key = e.target.name;
    let value: any = e.target.value;
    if (key === "sort_order") value = parseInt(value) || 0;
    setFormData({ ...formData, [key]: value });
  };

  const handleBrandSelect = (e: any) => {
    setFormData({
      ...formData,
      product_brand_id: Number(e?.target?.value) || null,
    });
  };

  const handleSubmit = async (
    data: StylesModal,
    type: string = "add",
    id: number | null
  ) => {
    try {
      if (!data.title || !data.slug) return;

      if (type === "edit" && id !== null) {
        dispatch(updateBrandStyleInTable({ product: data, id }));
      } else {
        dispatch(addNewBrandStyleInTable(data));
        setFormData({
          product_brand_id: null,
          title: "",
          slug: "",
          description: "",
          sort_order: 0,
          status: 1,
        });
      }
      if (!adding) {
        onClick("default");
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
            {type === "edit" ? "Edit Brand Style" : "Add New Brand Style"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === "edit"
              ? "Update brand style information"
              : "Create a new style for a brand"}
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

            {/* Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="Enter style title"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
              {!formData.title && (
                <p className="text-xs text-red-500 mt-1">
                  Style title is required
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
                placeholder="Add a brief description of the style"
                rows={4}
                value={formData.description}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-shadow"
                onChange={handleInputChange}
              ></textarea>
            </div>

            {/* Slug */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                placeholder="e.g., modern-classic, contemporary"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
              {!formData.slug && (
                <p className="text-xs text-red-500 mt-1">Slug is required</p>
              )}
              <p className="text-xs text-gray-500 mt-1.5">
                URL-friendly identifier (lowercase, no spaces)
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Organize */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Organize
            </h3>

            {/* Parent Brand */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.product_brand_id || ""}
                onChange={handleBrandSelect}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
              >
                <option value="">Select brand</option>
                {brandOptions.length >= 0 &&
                  brandOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
              {!formData.product_brand_id && (
                <p className="text-xs text-red-500 mt-1">
                  Brand selection is required
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1.5">
                Select which brand this style belongs to
              </p>
            </div>

            {/* Sort Order */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Sort Order{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                min="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Lower numbers appear first in lists
              </p>
            </div>

            {/* Status */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status!}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Inactive styles won't be available for selection
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
            handleSubmit(formData, type, currentStyle?.id!);
          }}
          disabled={
            adding ||
            !formData.title ||
            !formData.slug ||
            !formData.product_brand_id
          }
          type="submit"
          className={`px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
            adding ||
            !formData.title ||
            !formData.slug ||
            !formData.product_brand_id
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
            ? "Update Style"
            : "Save Style"}
        </button>
      </div>
    </div>
  );
};

export const BrandStyleViewPage = ({ onClick }: any) => {
  const { currentStyle } = useSelector((state: RootState) => state.adminBrands);

  console.log(currentStyle);

  if (!currentStyle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No Style Selected
          </h2>
          <p className="text-gray-500 mb-4">
            Please select a style to view details.
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

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
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
              Style: {currentStyle.title}
            </h1>
            <p className="text-gray-600 mt-1">Style ID: #{currentStyle.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(currentStyle.status!)}
        </div>
      </div>

      {/* Style Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Style Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Style Information
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {currentStyle.title}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Slug
                </label>
                <p className="text-lg text-gray-900 font-mono">
                  {currentStyle.slug}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>
              <p className="text-gray-900 leading-relaxed">
                {currentStyle.description || "No description available"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentStyle.sort_order}
                </div>
                <div className="text-sm text-blue-800 font-medium">
                  Sort Order
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  #{currentStyle.id}
                </div>
                <div className="text-sm text-purple-800 font-medium">
                  Style ID
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Information Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Associated Brand
          </h2>

          {currentStyle.product_brand_id && (
            <div className="space-y-4">
              {/* Brand Logo and Name */}
              <div className="text-center pb-4 border-b border-gray-200">
                {currentStyle.product_brand_id.logo && (
                  <img
                    src={currentStyle.product_brand_id.logo}
                    alt={`${currentStyle.product_brand_id.name} logo`}
                    className="w-16 h-16 mx-auto rounded-lg object-cover border border-gray-200 mb-3"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <h3 className="text-lg font-bold text-gray-900">
                  {currentStyle.product_brand_id.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {currentStyle.product_brand_id.description}
                </p>
              </div>

              {/* Brand Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">
                    Brand ID:
                  </span>
                  <span className="text-sm text-gray-900 font-semibold">
                    #{currentStyle.product_brand_id.id}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">
                    URL:
                  </span>
                  <span className="text-sm text-gray-900 font-mono">
                    {currentStyle.product_brand_id.url}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
