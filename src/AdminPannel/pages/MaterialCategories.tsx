import React, { useEffect, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { LoadingSpinner } from "../components/Projects/ProjectModal";
import { CircleArrowLeft } from "lucide-react";
import { CSVImportModal } from "../components/Projects/CSVImportModalProps";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  addNewCatergoryInTable,
  adminFetchCategory,
  deleteCategoryInTable,
  handleSelectViewCategories,
  handlesortingcategroies,
  ProductCategory,
  updateCategoryInTable,
} from "../reduxslices/adminMaterialCategorySlice";

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

const MaterialCategories: React.FC = () => {
  const { isLoading, list, sortfield, sortorder } = useSelector(
    (state: RootState) => state.adminMaterials
  );

  console.log(list);

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
        .from("product_categories")
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
    dispatch(adminFetchCategory({ orderby: sortfield, order: sortorder }));
  }, [sortfield, sortorder]);

  const actions = [
    {
      label: "View",
      onClick: async (row: ProductCategory) => {
        handleMaterialPageSelection("view");
        dispatch(handleSelectViewCategories(row));
      },
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: (row: ProductCategory) => {
        handleMaterialPageSelection("edit");
        dispatch(handleSelectViewCategories(row));
      },
      variant: "secondary" as const,
    },
    {
      label: "Delete",
      onClick: async (row: ProductCategory) => {
        if (window.confirm("Do you want to delete this category?")) {
         
          const response = await dispatch(
            deleteCategoryInTable(row?.id??0)
          ).unwrap();
          if (response) {
            toast.success("The selected category was deleted successfully");
          }
        }
      },
      variant: "danger" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={handleClose}
        onImport={handleImport}
        title="Import Categories"
      />
      {page == "default" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white  rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Material Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {list.length || 0}
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
                Add Categories
              </button>

              <button
                onClick={() => handleOpen()}
                className="rounded-lg border border-gray-200 h-10 bg-green-800 text-white hover:bg-white hover:text-green-800 transition-colors duration-200"
              >
                Import Categories
              </button>
            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              title="All Categories"
              data={list}
              columnMappings={{
                id: { label: "Category ID", sortable: true, filterable: true },
                name: {
                  label: "Category Name",
                  sortable: true,
                  filterable: true,
                },
                sort_order: {
                  label: "Sort Order",
                  sortable: true,
                  filterable: true,
                },
                // description: {
                //   label: "Description",
                //   sortable: false,
                //   filterable: true,
                // },
                // status: { label: "Status", sortable: true, filterable: true },
                // created_at: {
                //   label: "Created Date",
                //   sortable: true,
                //   filterable: false,
                // },
                // updated_at: {
                //   label: "Last Modified",
                //   sortable: true,
                //   filterable: false,
                // },
                // category_id: {
                //   label: "Category",
                //   sortable: false,
                //   filterable: false,
                // },
                material_segment_id: {
                  label: "Material Segment",
                  sortable: false,
                  filterable: false,
                },
                brand_id: {
                  label: "Brand",
                  sortable: false,
                  filterable: false,
                },
              }}
              actions={actions}
              searchable={true}
              pagination={true}
              sortingFunction={handlesortingcategroies}
              sortfield={sortfield}
              sortorder={sortorder}
            />
          )}
        </>
      )}

      {(page == "add" || page == "edit") && (
        <BrandAddPage type={page} onClick={handleMaterialPageSelection} />
      )}

      {page == "view" && (
        <BrandViewPage onClick={handleMaterialPageSelection} />
      )}
    </div>
  );
};

export default MaterialCategories;

export const BrandAddPage = ({ onClick, type }: any) => {
  const { adding, currentCategory } = useSelector(
    (state: RootState) => state.adminMaterials
  );

  const [formData, setFormData] = useState<ProductCategory>({
    name: currentCategory?.name || "",
    icon: currentCategory?.icon || "",
    sort_order: currentCategory?.sort_order || 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const handleInputChangeInBrand = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (
    data: ProductCategory,
    type: string = "add",
    id: number | null
  ) => {
    try {
      if (data.name == null || data.name == "") {
        return;
      }
      if (type == "edit" && id !== null) {
        dispatch(updateCategoryInTable({ product: data, id: id }));
        onClick("default");
      } else {
        dispatch(addNewCatergoryInTable(data));
        setFormData({});
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
            {type === "edit" ? "Edit Category" : "Add New Category"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === "edit"
              ? "Update category information"
              : "Create a new material category"}
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

            {/* Category Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter category name"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={(e) => handleInputChangeInBrand(e)}
              />
              {!formData.name && (
                <p className="text-xs text-red-500 mt-1">
                  Category name is required
                </p>
              )}
            </div>

            {/* Icon */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Icon{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                placeholder="Enter icon name or URL"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={(e) => handleInputChangeInBrand(e)}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Icon identifier for this category
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
                placeholder="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                value={formData.sort_order}
                onChange={(e) => handleInputChangeInBrand(e)}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Lower numbers appear first in lists
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
            handleSubmit(formData, type, currentCategory?.id!);
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
            ? "Update Category"
            : "Save Category"}
        </button>
      </div>
    </div>
  );
};

export const BrandViewPage = ({ onClick }: any) => {
  const { currentCategory } = useSelector(
    (state: RootState) => state.adminMaterials
  );

  if (!currentCategory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No Category Selected
          </h2>
          <p className="text-gray-500">
            Please select a category to view details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onClick("default")}
              className="self-start rounded-full hover:bg-gray-100 p-2 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
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
            </button>
            {currentCategory.icon && (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl border border-gray-200">
                {currentCategory.icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-gray-600 text-lg">Material Category</p>
            </div>
          </div>
          {currentCategory.id && (
            <div className="text-right">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                ID: {currentCategory.id}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Category Information
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category Name
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {currentCategory.name}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Icon
              </label>
              <div className="flex items-center space-x-3">
                {currentCategory.icon && (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-lg">
                    {currentCategory.icon}
                  </div>
                )}
                <span className="text-gray-900">
                  {currentCategory.icon || "No icon set"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sort Order
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {currentCategory.sort_order}
              </p>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Category Details
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentCategory.sort_order}
              </div>
              <div className="text-sm text-blue-800 font-medium">
                Sort Order
              </div>
            </div>

            {currentCategory.id && (
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  #{currentCategory.id}
                </div>
                <div className="text-sm text-purple-800 font-medium">
                  Category ID
                </div>
              </div>
            )}

            {currentCategory.icon && (
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl text-green-600 mb-2">
                  {currentCategory.icon}
                </div>
                <div className="text-sm text-green-800 font-medium">
                  Category Icon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Properties */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Properties
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategory.id && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ID
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {currentCategory.id}
                  </td>
                </tr>
              )}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Name
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currentCategory.name}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Icon
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    {currentCategory.icon && (
                      <span className="text-lg">{currentCategory.icon}</span>
                    )}
                    <span>{currentCategory.icon || "None"}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Sort Order
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currentCategory.sort_order}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
