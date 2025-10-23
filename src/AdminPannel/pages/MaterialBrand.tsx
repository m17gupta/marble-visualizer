import React, { useEffect, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { LoadingSpinner } from "../components/Projects/ProjectModal";

import {
  addNewBrandInTable,
  adminFetchBrands,
  fetchCurrentBrandWithStylesJobs,
  handleSelectViewBrand,
  handlesortingbrands,
  ProductBrand,
  updateBrandInTable,
} from "../reduxslices/MaterialBrandSlice";
import { adminFetchCategory } from "../reduxslices/adminMaterialCategorySlice";
import { adminFetchMaterialSegments } from "../reduxslices/adminMaterialSegment";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, X, Plus } from "lucide-react";
import { CSVImportModal } from "../components/Projects/CSVImportModalProps";
import { supabase } from "@/lib/supabase";
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

export type Connection = {
  id?: number;
  category_id: number | null;
  material_segment_id: number | null;
};

const MaterialBrands: React.FC = () => {
  const { isLoading, list, sortfield, sortorder, currentBrand } = useSelector(
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
        .from("product_brand")
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
    dispatch(adminFetchBrands({ orderby: sortfield, order: sortorder }));
  }, [sortfield, sortorder]);

  const actions = [
    {
      label: "View",
      onClick: async (row: ProductBrand) => {
        handleMaterialPageSelection("view");
        await dispatch(fetchCurrentBrandWithStylesJobs(row));
      },
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: async (row: ProductBrand) => {
        // Fetch complete brand data with categories
        try {
          const { data, error } = await supabase
            .from("product_brand")
            .select("*, product_brand_categories(*)")
            .eq("id", row.id)
            .single();

          if (!error && data) {
            dispatch(handleSelectViewBrand(data));
          } else {
            dispatch(handleSelectViewBrand(row));
          }
        } catch (error) {
          console.error("Error fetching brand with categories:", error);
          dispatch(handleSelectViewBrand(row));
        }
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
        title="Import Brands"
      />
      {page == "default" && (
        <>
          <div className="flex items-center justify-between grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white  rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between w-60">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Brands
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {list.length || 0}
                  </p>
                </div>
                <div className="text-2xl">📁</div>
              </div>
            </div>

            <div className="col-span-2 md:justify-end col-start-3 flex md:flex-row flex-col justify-start gap-2">
              {/* <button
                onClick={() => handleMaterialPageSelection("add")}
                className="rounded-lg border border-gray-200 h-10 bg-black text-white hover:bg-white hover:text-black transition-colors duration-200"
              >
                Add Brands
              </button>

              <button
                onClick={() => handleOpen()}
                className="rounded-lg border border-gray-200 h-10 bg-green-800 text-white hover:bg-white hover:text-green-800 transition-colors duration-200"
              >
                Import Brands
              </button> */}

                <button
                    onClick={() => handleMaterialPageSelection("add")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                Add Brands
                </button>
                
  
                <button         
                onClick={() => handleOpen()}
                className=" text-sm flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Import Brands
                </button>

            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              title="All Brands"
              data={list}
              columnMappings={{
                id: { label: "ID", sortable: true, filterable: true },
                name: { label: "Brand Name", sortable: true, filterable: true },
                url: {
                  label: "Website URL",
                  sortable: false,
                  filterable: true,
                },
                logo: { label: "Logo", sortable: false, filterable: false },
                description: {
                  label: "Description",
                  sortable: false,
                  filterable: true,
                },
                created_at: {
                  label: "Created Date",
                  sortable: true,
                  filterable: false,
                },
                updated_at: {
                  label: "Updated Date",
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
                  label: "Brand",
                  sortable: false,
                  filterable: false,
                },
              }}
              actions={actions}
              searchable={true}
              pagination={true}
              // sortingFunction={handlesortingbrands}
              // sortfield={sortfield}
              // sortorder={sortorder}
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

export default MaterialBrands;

export const BrandAddPage = ({ onClick, type }: any) => {
  const { adding, currentBrand } = useSelector(
    (state: RootState) => state.adminBrands
  );

  const { list: categories } = useSelector(
    (state: RootState) => state.adminMaterials
  );

  const { list: segments } = useSelector(
    (state: RootState) => state.adminMaterialSegmemt
  );

  const [formData, setFormData] = useState<ProductBrand>({
    name: currentBrand?.name || "",
    logo: currentBrand?.logo || "",
    url: currentBrand?.url || "",
    description: currentBrand?.description || "",
  });

  const [logoPreview, setLogoPreview] = useState<string>(
    currentBrand?.logo || ""
  );
  const [logoError, setLogoError] = useState<boolean>(false);

  // State for managing connections

  const [connections, setConnections] = useState<Connection[]>([]);
  const [showAddConnection, setShowAddConnection] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  // Fetch categories and segments on mount
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(adminFetchCategory({ orderby: "name", order: "asc" }));
    }
    if (!segments || segments.length === 0) {
      dispatch(adminFetchMaterialSegments({ orderby: "name", order: "asc" }));
    }
  }, []);

  // Load existing connections when editing
  useEffect(() => {
    // const loadConnections = async () => {
    //   if (type === "edit" && currentBrand?.id) {
    //     try {
    //       const { data, error } = await supabase
    //         .from("product_brand_categories")
    //         .select("*")
    //         .eq("brand_id", currentBrand.id);

    //       if (!error && data && data.length > 0) {
    //         setConnections(
    //           data.map((item: any) => ({
    //             id: item.id,
    //             category_id: item.category_id,
    //             material_segment_id: item.material_segment_id,
    //           }))
    //         );
    //         setShowAddConnection(false);
    //       } else {
    //         setConnections([]);
    //         setShowAddConnection(true);
    //       }
    //     } catch (error) {
    //       console.error("Error loading connections:", error);
    //       setShowAddConnection(true);
    //     }
    //   } else if (type === "add") {
    //     setShowAddConnection(true);
    //   }
    // };
    if (currentBrand && currentBrand.product_brand_categories != null) {
      const normalized = currentBrand.product_brand_categories.map((conn) => ({
        ...conn,
        category_id: conn.category_id ?? null,
        material_segment_id: conn.material_segment_id ?? null,
        brand_id: conn.brand_id ?? null,
      }));

      setConnections(normalized);
    }
    // loadConnections();
  }, [type, currentBrand]);

  console.log(connections);

  const handleAddConnection = () => {
    setConnections([
      ...connections,
      { category_id: null, material_segment_id: null },
    ]);
  };

  const handleRemoveConnection = (index: number) => {
    setConnections(connections.filter((_, i) => i !== index));
  };

  const handleConnectionChange = (
    index: number,
    field: "category_id" | "material_segment_id",
    value: number | null
  ) => {
    const updated = [...connections];
    updated[index][field] = value;
    setConnections(updated);
  };

  const handleInputChangeInBrand = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });

    // Update logo preview when logo URL changes
    if (key === "logo") {
      setLogoPreview(value);
      setLogoError(false);
    }
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoError(false);
  };

  const handleSubmit = async (
    data: ProductBrand,
    type: string = "add",
    id: number | null
  ) => {
    try {
      if (data.name == null || data.name == "") {
        return;
      }

      // First save/update the brand
      if (type == "edit" && id !== null) {
        await dispatch(updateBrandInTable({ product: data, id: id }));

        // Save connections
        if (connections.length > 0) {
          await saveConnections(id);
        }

        onClick("default");
      } else {
        const result = await dispatch(addNewBrandInTable(data));

        // Save connections for new brand
        if (
          result.payload &&
          (result.payload as any).id &&
          connections.length > 0
        ) {
          await saveConnections((result.payload as any).id);
        }

        setFormData({});
        setConnections([]);
        onClick("default");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveConnections = async (brandId: number) => {
    try {
      // Delete existing connections
      await supabase
        .from("product_brand_categories")
        .delete()
        .eq("brand_id", brandId);

      // Filter out empty connections and prepare for insert
      const validConnections = connections.filter(
        (conn) => conn.category_id !== null || conn.material_segment_id !== null
      );

      if (validConnections.length > 0) {
        const connectionsToInsert = validConnections.map((conn) => ({
          brand_id: brandId,
          category_id: conn.category_id,
          material_segment_id: conn.material_segment_id,
        }));

        const { error } = await supabase
          .from("product_brand_categories")
          .insert(connectionsToInsert);

        if (error) {
          toast.error("Error saving connections");
          console.error(error);
        } else {
          toast.success("Connections saved successfully");
        }
      }
    } catch (error) {
      console.error("Error saving connections:", error);
      toast.error("Failed to save connections");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "edit" ? "Edit Brand" : "Add New Brand"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === "edit"
              ? "Update brand information"
              : "Create a new brand for your materials"}
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
        {/* Left Column - Add New Brands */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Brands
            </h3>

            {/* Brand Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter brand name"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={(e) => handleInputChangeInBrand(e)}
              />
              {!formData.name && (
                <p className="text-xs text-red-500 mt-1">
                  Brand name is required
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
                placeholder="Add a brief description of the brand"
                rows={4}
                value={formData.description}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-shadow"
                onChange={(e) => handleInputChangeInBrand(e)}
              ></textarea>
            </div>

            {/* Website URL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Website URL{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                placeholder="https://www.brandwebsite.com"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                onChange={(e) => handleInputChangeInBrand(e)}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Enter the brand's official website
              </p>
            </div>
          </div>

          {/* Media Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Media{" "}
              <span className="text-gray-400 text-xs font-normal">
                Optional
              </span>
            </h3>

            {/* Logo URL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Logo URL
              </label>

              {/* Logo Preview Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50">
                {logoPreview && !logoError ? (
                  <div className="space-y-3">
                    <div className="flex justify-center items-center">
                      <img
                        src={logoPreview}
                        alt="Brand logo preview"
                        onError={handleLogoError}
                        onLoad={handleLogoLoad}
                        className="max-h-32 max-w-full object-contain rounded"
                      />
                    </div>
                    <div className="text-xs text-gray-500 break-all px-4">
                      {logoPreview}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600">
                      {logoError ? (
                        <span className="text-red-500">
                          Failed to load image. Please check the URL.
                        </span>
                      ) : (
                        <span>Enter logo URL below to preview</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logo URL Input */}
              <div className="mt-3">
                <input
                  type="url"
                  name="logo"
                  placeholder="https://example.com/logo.png"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                  value={formData.logo}
                  onChange={(e) => handleInputChangeInBrand(e)}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Paste the direct URL to the brand's logo image
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Connection */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connection
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Connect this brand to material categories and segments
            </p>

            {/* Show Add Connection button if no connections exist */}
            {connections.length === 0 && showAddConnection && (
              <button
                type="button"
                onClick={handleAddConnection}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" />
                <span className="block text-sm font-medium text-gray-600 group-hover:text-blue-700">
                  Add Connection
                </span>
                <span className="block text-xs text-gray-400 mt-1">
                  Link category and segment to this brand
                </span>
              </button>
            )}

            {/* Show connections list */}
            {connections.length > 0 && (
              <div className="space-y-4">
                {connections.map((connection, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Connection {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveConnection(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Material Category Select */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Material Category{" "}
                        <span className="text-gray-400 font-normal">
                          Optional
                        </span>
                      </label>
                      <select
                        value={connection.category_id || ""}
                        onChange={(e) =>
                          handleConnectionChange(
                            index,
                            "category_id",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select a category</option>
                        {categories &&
                          categories.map((category: any) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Material Segment Select */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Material Segment{" "}
                        <span className="text-gray-400 font-normal">
                          Optional
                        </span>
                      </label>
                      <select
                        value={connection.material_segment_id || ""}
                        onChange={(e) =>
                          handleConnectionChange(
                            index,
                            "material_segment_id",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select a segment</option>
                        {segments &&
                          segments.map((segment: any) => (
                            <option key={segment.id} value={segment.id}>
                              {segment.color && (
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: segment.color,
                                    marginRight: "6px",
                                  }}
                                />
                              )}
                              {segment.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}

                {/* Add Another Connection Button */}
                <button
                  type="button"
                  onClick={handleAddConnection}
                  className="w-full border border-dashed border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Connection
                </button>
              </div>
            )}
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
            handleSubmit(formData, type, currentBrand?.id!);
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
            ? "Update Brand"
            : "Save Brand"}
        </button>
      </div>
    </div>
  );
};

export const BrandViewPage = ({ onClick }: any) => {
  const { currentBrand } = useSelector((state: RootState) => state.adminBrands);

  if (!currentBrand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No Brand Selected
          </h2>
          <p className="text-gray-500">
            Please select a brand to view details.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onClick("default")}
              className="self-start rounded-full"
            >
              {" "}
              <CircleArrowLeft />
            </button>
            {currentBrand.logo && (
              <img
                src={currentBrand.logo}
                alt={`${currentBrand.name} logo`}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentBrand.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {currentBrand.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              ID: {currentBrand.id}
            </span>
          </div>
        </div>
      </div>

      {/* Brand Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Brand Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">URL:</span>
              <span className="text-gray-900">{currentBrand.url}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Total Styles:</span>
              <span className="text-gray-900 font-semibold">
                {/* {currentBrand.styles?.length || 0} */}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Created:</span>
              <span className="text-gray-900 text-sm">
                {formatDate(currentBrand.created_at!)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Last Updated:</span>
              <span className="text-gray-900 text-sm">
                {formatDate(currentBrand.updated_at!)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {/* {currentBrand.styles?.length || 0} */}
              </div>
              <div className="text-sm text-blue-800 font-medium">Styles</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {/* {currentBrand.styles?.filter((style) => style.status === 1)
                  .length || 0} */}
              </div>
              <div className="text-sm text-green-800 font-medium">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles Section */}
      {/* {currentBrand.styles && currentBrand.styles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Styles</h2>
            <p className="text-gray-600 mt-1">
              Manage and view all styles under this brand
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentBrand.styles.map((style) => (
                <div
                  key={style.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {style.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          style.status === 1 ? "bg-green-400" : "bg-red-400"
                        }`}
                        title={style.status === 1 ? "Active" : "Inactive"}
                      />
                      <span className="text-xs text-gray-500">#{style.id}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {style.description}
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Slug: {style.slug}</span>
                    <span>Order: {style.sort_order}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

      {/* Empty State for Styles */}
      {/* {(!currentBrand.styles || currentBrand.styles.length === 0) && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Styles Found
            </h3>
            <p className="text-gray-500">
              This brand doesn't have any styles configured yet.
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};
