import React, { useEffect, useState } from "react";
import DataTable from "../components/shared/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { LoadingSpinner } from "../components/Projects/ProjectModal";
import { CircleArrowLeft } from "lucide-react";
import { MaterialConnection } from "@/components/swatchBook/interfaces";
import {
  addNewConnectionInTable,
  adminFetchMaterialConnection,
  handlecancelconnection,
  handleSelectViewConnection,
  handlesortingConnection,
  updateConnectionInTable,
} from "../reduxslices/adminMaterialConnectionSlice";
import { adminFetchBrands } from "../reduxslices/MaterialBrandSlice";
import { adminFetchCategory } from "../reduxslices/adminMaterialCategorySlice";
import { adminFetchMaterialSegments } from "../reduxslices/adminMaterialSegment";

// Define the structure for a material connection

const MaterialConnections: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: connections,
    currentConnection,
    isLoading,
    sortfield,
    sortorder,
  } = useSelector((state: RootState) => state.materialconnection);
  const [page, setPage] = useState<string>("default");

  const handleMaterialPageSelection = (type: string) => {
    setPage(type);
  };

  // Mock data for now - in a real app, this would come from an API
  useEffect(() => {
    dispatch(
      adminFetchMaterialConnection({ order: sortorder, orderby: sortfield })
    );
  }, [sortfield, sortorder]);

  const handleSorting = (field: string, order: string) => {
    dispatch(handlesortingConnection(field));
  };

  const actions = [
    {
      label: "View",
      onClick: (row: MaterialConnection) => {
        handleMaterialPageSelection("view");
        dispatch(handleSelectViewConnection(row));
      },
      variant: "primary" as const,
    },
    {
      label: "Edit",
      onClick: (row: MaterialConnection) => {
        handleMaterialPageSelection("edit");
        dispatch(handleSelectViewConnection(row));
      },
      variant: "secondary" as const,
    },
    {
      label: "Delete",
      onClick: (row: MaterialConnection) => {
        console.log("Delete connection:", row);
        // Add delete logic here
      },
      variant: "danger" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {page === "default" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Material Connections
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {connections.length || 0}
                  </p>
                </div>
                <div className="text-2xl">🔗</div>
              </div>
            </div>
            <button
              onClick={() => handleMaterialPageSelection("add")}
              className="col-span-1/2 col-start-4 rounded-lg border border-gray-200 h-10 bg-black text-white hover:bg-white hover:text-black transition-colors duration-200"
            >
              Add Connection
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              title="Material Connections"
              data={connections}
              columnMappings={{
                id: {
                  label: "Connection ID",
                  sortable: true,
                  filterable: true,
                },
                brand_id: {
                  label: "Brand",
                  sortable: true,
                  filterable: true,
                },
                category_id: {
                  label: "Category",
                  sortable: true,
                  filterable: true,
                },
                material_segment_id: {
                  label: "Segment",
                  sortable: true,
                  filterable: true,
                },
              }}
              actions={actions}
              searchable={true}
              pagination={true}
              sortingFunction={handleSorting}
              sortfield={sortfield}
              sortorder={sortorder}
            />
          )}
        </>
      )}

      {(page === "add" || page === "edit") && (
        <ConnectionAddPage type={page} onClick={handleMaterialPageSelection} />
      )}

      {page === "view" && (
        <ConnectionViewPage onClick={handleMaterialPageSelection} />
      )}
    </div>
  );
};

export default MaterialConnections;

// Add Connection Component
const ConnectionAddPage = ({
  onClick,
  type,
}: {
  onClick: (type: string) => void;
  type: string;
}) => {
  const { currentConnection, adding } = useSelector(
    (state: RootState) => state.materialconnection
  );
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<MaterialConnection>({
    brand_id:
      typeof currentConnection?.brand_id === "object" &&
      currentConnection.brand_id.id !== undefined
        ? currentConnection.brand_id.id
        : currentConnection?.brand_id || 0,
    category_id:
      typeof currentConnection?.category_id === "object" &&
      currentConnection.category_id.id !== undefined
        ? currentConnection.category_id.id
        : currentConnection?.category_id || 0,
    material_segment_id:
      typeof currentConnection?.material_segment_id === "object" &&
      currentConnection.material_segment_id.id !== null &&
      currentConnection.material_segment_id.id !== undefined
        ? currentConnection.material_segment_id.id
        : currentConnection?.material_segment_id || 0,
  });
  const { list: brands } = useSelector((state: RootState) => state.adminBrands);
  const { list: categories } = useSelector(
    (state: RootState) => state.adminMaterials
  );

  const { list: segments, isLoading: segmentsLoading } = useSelector(
    (state: RootState) => state.adminMaterialSegmemt
  );
  useEffect(() => {
    if (!segments || segments.length === 0) {
      dispatch(adminFetchMaterialSegments({ orderby: "name", order: "asec" }));
    }
  }, []);

  useEffect(() => {
    if (!brands || brands.length === 0) {
      dispatch(adminFetchBrands({ orderby: "name", order: "asec" }));
    }
  }, []);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData, type);
    if (
      formData.brand_id == 0 ||
      formData.category_id == 0 ||
      formData.material_segment_id == 0
    ) {
      return;
    }

    if (type == "add") {
      dispatch(addNewConnectionInTable(formData));
      setFormData({
        category_id: 0,
        material_segment_id: 0,
        brand_id: 0,
      });
    } else if (type == "edit" && currentConnection?.id != undefined) {
      dispatch(
        updateConnectionInTable({ product: formData, id: currentConnection.id })
      );
      setFormData({
        category_id: 0,
        material_segment_id: 0,
        brand_id: 0,
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center mb-6">
        <button onClick={() => onClick("default")} className="mr-4">
          <CircleArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {type === "add" ? "Add New Connection" : "Edit Connection"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              name="brand_id"
              value={String(formData.brand_id)}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category_id"
              value={String(formData.category_id)}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segment
            </label>
            <select
              name="material_segment_id"
              value={String(formData.material_segment_id)}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select Segment</option>
              {segments &&
                segments.map((segment) => (
                  <option key={segment.id} value={segment.id!}>
                    {segment.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              dispatch(handlecancelconnection());
              onClick("default");
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {type === "add" ? "Create Connection" : "Update Connection"}
          </button>
        </div>
      </form>
    </div>
  );
};

// View Connection Component
const ConnectionViewPage = ({
  onClick,
}: {
  onClick: (type: string) => void;
}) => {
  // Mock data for viewing
  const connection = {
    id: 1,
    brand_name: "Nike",
    category_name: "Athletic",
    segment_name: "Sportswear",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center mb-6">
        <button onClick={() => onClick("default")} className="mr-4">
          <CircleArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Connection Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Connection ID
            </label>
            <p className="text-lg text-gray-900">{connection.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <p className="text-lg text-gray-900">{connection.brand_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <p className="text-lg text-gray-900">{connection.category_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Segment
            </label>
            <p className="text-lg text-gray-900">{connection.segment_name}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                connection.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {connection.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Created Date
            </label>
            <p className="text-lg text-gray-900">
              {new Date(connection.created_at).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Modified
            </label>
            <p className="text-lg text-gray-900">
              {new Date(connection.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
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
          Edit Connection
        </button>
      </div>
    </div>
  );
};
