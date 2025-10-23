import React, { useEffect, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { LoadingSpinner } from "../components/Projects/ProjectModal";
import { CircleArrowLeft, Plus, X } from "lucide-react";
import {
  MaterialAttributes as MaterialAttributesModal,
  MaterialConnection,
} from "@/components/swatchBook/interfaces";
import {
  addNewAttributeInTable,
  adminFetchMaterialAttributes,
  handlecancelAttribute,
  handleSelectViewAttribute,
  handlesortingAttribute,
  updateAttributeInTable,
} from "../reduxslices/adminMaterialAttributeSlice";
import { adminFetchCategory } from "../reduxslices/adminMaterialCategorySlice";
import { CSVImportModal } from "../components/Projects/CSVImportModalProps";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Define the structure for a material connection

const MaterialAttributes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, currentAttribute, isLoading, sortfield, sortorder, adding } =
    useSelector((state: RootState) => state.materialattibutes);
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

  useEffect(() => {
    dispatch(
      adminFetchMaterialAttributes({ order: sortorder, orderby: sortfield })
    );
  }, [sortfield, sortorder]);

  const handleSorting = (field: string, order: string) => {
    dispatch(handlesortingAttribute(field));
  };

  const actions = [
    {
      label: "View",
      onClick: (row: MaterialAttributesModal) => {
        handleMaterialPageSelection("view");
        dispatch(handleSelectViewAttribute(row));
      },
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: (row: MaterialAttributesModal) => {
        handleMaterialPageSelection("edit");
        dispatch(handleSelectViewAttribute(row));
      },
      variant: "secondary" as const,
    },
    {
      label: "Delete",
      onClick: (row: MaterialAttributesModal) => {
        console.log("Delete connection:", row);
        // Add delete logic here
      },
      variant: "danger" as const,
    },
  ];

  const handleImport = async (importdata: any[]) => {
    try {
      const { data, error } = await supabase
        .from("product_attributes")
        .insert(importdata)
        .select("*");

      if (error) {
        toast.error("Error in Importing Data");
      } else {
        toast.success("Data Imported Successfuly");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={handleClose}
        onImport={handleImport}
        title="Import Attribute"
        type="attributes"
      />
      {page === "default" && (
        <>
          <div className="flex items-center justify-between">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Material Connections
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {list.length || 0}
                  </p>
                </div>
                <div className="text-2xl">🔗</div>
              </div>
            </div>
            <div className="flex gap-2">
             


              <button
                onClick={() => handleMaterialPageSelection("add")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                  Add Attribute
              </button>
              

              <button         
                onClick={() => handleOpen()}
                className=" text-sm flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Import Attribute
              </button>

            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              title="Material Attributes"
              data={list}
              columnMappings={{
                id: {
                  label: "Attribute ID",
                  sortable: true,
                  filterable: true,
                },
                name: {
                  label: "Name",
                  sortable: true,
                  filterable: true,
                },
                unit: {
                  label: "Unit",
                  sortable: false,
                  filterable: false,
                },
                possible_values: {
                  label: "Possible Values",
                  sortable: false,
                  filterable: false,
                },
                category_id: {
                  label: "Category",
                  sortable: true,
                  filterable: true,
                },
              }}
              actions={actions}
              searchable={true}
              pagination={true}
              // sortingFunction={handleSorting}
              // sortfield={sortfield}
              // sortorder={sortorder}
            />
          )}
        </>
      )}

      {(page === "add" || page === "edit") && (
        <AttributeAddPage type={page} onClick={handleMaterialPageSelection} />
      )}

      {page === "view" && (
        <AttributeViewPage onClick={handleMaterialPageSelection} />
      )}
    </div>
  );
};

export default MaterialAttributes;

const AttributeAddPage = ({
  onClick,
  type,
}: {
  onClick: (type: string) => void;
  type: string;
}) => {
  const { currentAttribute, adding } = useSelector(
    (state: RootState) => state.materialattibutes
  );

  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<MaterialAttributesModal>({
    name: currentAttribute ? currentAttribute.name : "",
    unit: currentAttribute ? currentAttribute.unit : "",
    possible_values:
      currentAttribute &&
      currentAttribute.possible_values != null &&
      currentAttribute?.possible_values!.length > 0
        ? currentAttribute.possible_values
        : [],
    category_id:
      typeof currentAttribute?.category_id === "object" &&
      currentAttribute.category_id != null &&
      currentAttribute.category_id!.id !== undefined
        ? currentAttribute.category_id!.id
        : currentAttribute?.category_id || 0,
  });

  const [newValue, setNewValue] = useState("");

  const { list: categories } = useSelector(
    (state: RootState) => state.adminMaterials
  );

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(adminFetchCategory({ orderby: "name", order: "asec" }));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("_id") ? parseInt(value) : value,
    }));
  };

  const handleAddValue = () => {
    if (
      newValue.trim() &&
      !formData.possible_values!.includes(newValue.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        possible_values: [...prev.possible_values!, newValue.trim()],
      }));
      setNewValue("");
    }
  };

  const handleRemoveValue = (valueToRemove: string | number) => {
    setFormData((prev) => ({
      ...prev,
      possible_values: prev.possible_values!.filter(
        (value) => value !== valueToRemove
      ),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.category_id === 0 || !formData.name!.trim()) {
      return;
    }

    if (type === "add") {
      dispatch(addNewAttributeInTable(formData));
      setFormData({
        name: "",
        unit: "",
        possible_values: [],
        category_id: 0,
      });
      onClick("default");
    } else if (type === "edit" && currentAttribute?.id !== undefined) {
      dispatch(
        updateAttributeInTable({
          product: formData,
          id: currentAttribute.id,
        })
      );
      onClick("default");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "add" ? "Add New Attribute" : "Edit Attribute"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === "add"
              ? "Create a new material attribute"
              : "Update attribute information"}
          </p>
        </div>
        <button
          onClick={() => {
            dispatch(handlecancelAttribute());
            onClick("default");
          }}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Layout - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - General Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                General
              </h3>

              {/* Attribute Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Color, Size, Weight, Finish"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                  required
                />
                {!formData.name && (
                  <p className="text-xs text-red-500 mt-1">
                    Attribute name is required
                  </p>
                )}
              </div>

              {/* Unit */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Unit{" "}
                  <span className="text-gray-400 text-xs font-normal">
                    Optional
                  </span>
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., kg, cm, mm, inches"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Measurement unit for this attribute
                </p>
              </div>
            </div>

            {/* Possible Values Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Values{" "}
                <span className="text-gray-400 text-xs font-normal">
                  Optional
                </span>
              </h3>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Possible Values
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a value (e.g., Red, Large, Glossy)"
                    className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={handleAddValue}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Press Enter or click Add to include a value
                </p>
              </div>

              {formData.possible_values != null &&
                formData.possible_values!.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {formData.possible_values!.length} value(s) added
                    </p>
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.possible_values != null &&
                        formData.possible_values!.map((value, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm"
                          >
                            <span className="text-sm text-gray-700">
                              {value}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveValue(value)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Right Column - Organize */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Organize
              </h3>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={String(formData.category_id)}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                  required
                >
                  <option value={0}>Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formData.category_id === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Category selection is required
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  Select which category this attribute belongs to
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              dispatch(handlecancelAttribute());
              onClick("default");
            }}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={adding || !formData.name || formData.category_id === 0}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
              adding || !formData.name || formData.category_id === 0
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
              : type === "add"
              ? "Create Attribute"
              : "Update Attribute"}
          </button>
        </div>
      </form>
    </div>
  );
};

const AttributeViewPage = ({
  onClick,
}: {
  onClick: (type: string) => void;
}) => {
  const { currentAttribute, adding } = useSelector(
    (state: RootState) => state.materialattibutes
  );

  if (!currentAttribute) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <button onClick={() => onClick("default")} className="mr-4">
            <CircleArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            Attribute Details
          </h2>
        </div>
        <p className="text-gray-500">No attribute selected</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center mb-6">
        <button onClick={() => onClick("default")} className="mr-4">
          <CircleArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Attribute Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attribute ID
            </label>
            <p className="text-lg text-gray-900">{currentAttribute.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="text-lg text-gray-900">{currentAttribute.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <p className="text-lg text-gray-900">
              {currentAttribute.unit || "N/A"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <p className="text-lg text-gray-900">
              {typeof currentAttribute.category_id === "object" &&
              currentAttribute.category_id !== null
                ? currentAttribute.category_id.name
                : "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category ID
            </label>
            <p className="text-lg text-gray-900">
              {typeof currentAttribute.category_id === "object" &&
              currentAttribute.category_id !== null
                ? currentAttribute.category_id.id
                : currentAttribute.category_id || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Possible Values
        </label>
        {currentAttribute.possible_values &&
        currentAttribute.possible_values.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentAttribute.possible_values.map((value, index) => (
              <span
                key={index}
                className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
              >
                {value}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No possible values defined</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => onClick("default")}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back to List
        </button>
        <button
          onClick={() => onClick("edit")}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Edit Attribute
        </button>
      </div>
    </div>
  );
};
