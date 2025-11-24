import { useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Pencil,
  Trash2,
  Search,
  X,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ActiveFilter,
  Product,
  SortField,
  SortOrder,
} from "@/components/swatchBook/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  adminDeleteProduct,
  adminFetchMaterial,
  handleAddFilters,
  handlePageChange,
  handlePerPageChange,
  handleRemoverFilters,
} from "@/AdminPannel/reduxslices/adminMaterialLibSlice";
import { getMaterialByPaginationArgs } from "@/AdminPannel/services/Material/AdminMaterialLibService";
import { adminFetchBrands } from "@/AdminPannel/reduxslices/MaterialBrandSlice";
import { adminFetchCategory } from "@/AdminPannel/reduxslices/adminMaterialCategorySlice";
import { FilterDropdown } from "./FilterComp";
import { newPath, path } from "./EditMaterialModal";
import { toast } from "sonner";

export const MaterialLibrary = () => {
  const navigate = useNavigate();
  const {
    materials: products,
    loading,
    error,
    filteringData,
    total,
  } = useSelector((state: RootState) => state.materialsdetails);
  const { list: brands } = useSelector((state: RootState) => state.adminBrands);
  const { list: categories } = useSelector(
    (state: RootState) => state.adminMaterials
  );
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField || !sortOrder) return 0; // no sorting

    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle nested objects like brand_id or product_category_id
    if (typeof aValue === "object" && aValue !== null) aValue = aValue.name;
    if (typeof bValue === "object" && bValue !== null) bValue = bValue.name;

    // Handle undefined/null
    aValue = aValue ?? "";
    bValue = bValue ?? "";

    if (typeof aValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  useEffect(() => {
    if (loading == null) {
      dispatch(adminFetchMaterial(filteringData));
    }
    if (brands.length <= 0) {
      dispatch(adminFetchBrands({ orderby: "name", order: "asc" }));
    }
    if (categories.length <= 0) {
      dispatch(adminFetchCategory({ orderby: "name", order: "asc" }));
    }
  }, [filteringData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    if (sortOrder === "asc") {
      return <ChevronUp className="w-4 h-4 ml-1 text-gray-600" />;
    }
    return <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />;
  };

  const addFilter = (type: "category" | "brand", id: number, name: string) => {
    const exists = activeFilters.some((f) => f.type === type && f.id === id);
    if (!exists) {
      setActiveFilters([...activeFilters, { type, id, name }]);
      dispatch(
        handleAddFilters({
          type: type,
          values: [...activeFilters, { type, id, name }],
        })
      );
    }
    setShowFilterDropdown(false);
  };

  const removeFilter = (type: "category" | "brand", id: number) => {
    const newFilters = activeFilters.filter(
      (f) => !(f.type === type && f.id === id)
    );
    setActiveFilters(newFilters);
    dispatch(handleRemoverFilters({ type, values: newFilters }));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  const location = useLocation();
  console.log(location);

  const handleView = (productId: number) => {
    if (location.pathname == "/app/materials") {
      navigate(`${location.pathname}/${productId}`);
    } else {
      navigate(`/admin/material/${productId}`);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        const resposnse= await dispatch(adminDeleteProduct(productId)).unwrap()
        console.log("deleet product ", resposnse)
        if(resposnse){
          toast.info(`The product with ID ${productId} is deleted.`)
        }
    }
  };

  const handleExport = () => {
    console.log("Export products");
  };

  const handleImport = () => {
    console.log("Import products");
  };

  const handleCreate = () => {
    console.log("Create new product");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export 
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              

              <button   onClick={handleCreate} className=" text-sm flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create 
              </button>
              {/* <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 flex items-center gap-2"
              >

                <Plus className="w-4 h-4" />
                Create
              </button> */}

                    

            </div>
          </div>



          {/* Filters and Search Row */}
          <div className="flex items-center gap-3">
            <div className=" text-sm px-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <select
                onChange={(e) => {
                  dispatch(handlePerPageChange(Number(e.target.value)));
                }}
                value={filteringData.item_per_page}
                className="focus:outline-none px-3 py-2"
              >
                {[5, 10, 20, 50, 100, 200].map((d) => {
                  return (
                    <option value={d} key={d}>
                      {d} Per Page
                    </option>
                  );
                })}
              </select>
            </div>
            {/* Add Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Add filter
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilterDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFilterDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  <FilterDropdown
                    categories={categories}
                    brands={brands}
                    activeFilters={activeFilters}
                    onAddFilter={addFilter}
                    onClose={() => setShowFilterDropdown(false)}
                  />
                </>
              )}
            </div>

            {/* Active Filters */}
            {activeFilters.map((filter, idx) => (
              <div
                key={`${filter.type}-${filter.id}-${idx}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg"
              >
                <span className="text-xs opacity-75">
                  {filter.type === "category" ? "Category" : "Brand"}:
                </span>
                <span className="font-medium">{filter.name}</span>
                <button
                  onClick={() => removeFilter(filter.type, filter.id)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {(activeFilters.length > 0 || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear all
              </button>
            )}

            {/* Search */}
            <div className="ml-auto flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg min-w-[300px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Product
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort("product_category_id")}
                  >
                    <div className="flex items-center">
                      Collection
                      {getSortIcon("product_category_id")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort("brand_id")}
                  >
                    <div className="flex items-center">
                      Brand
                      {getSortIcon("brand_id")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort("base_price")}
                  >
                    <div className="flex items-center">
                      Price
                      {getSortIcon("base_price")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => {
                  const imageURL = product?.gallery?.[0] ?? ""
                  console.log("gallert image", imageURL)
                    // product?.bucket_path == "default" && product.new_bucket != 1
                    //   ? `${path}/${product.photo}`
                    //   : product.photo?.startsWith("https")
                    //   ? product.photo
                    //   : `${newPath}/${product?.photo}`;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400"
                            src={imageURL}
                            alt=""
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {typeof product.product_category_id === "object"
                          ? product.product_category_id?.name
                          : ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {typeof product.brand_id === "object"
                          ? product.brand_id?.name
                          : ""}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {product.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.base_price
                          ? `$${product.base_price.toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleView(product.id!)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/addmaterials/${product.id!}`)
                            }
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="View"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id!)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              1 — {products.length} of {products.length} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  dispatch(
                    handlePageChange({
                      type: "prev",
                      value: filteringData.current_page,
                      total: total,
                    })
                  );
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Prev
              </button>
              <button
                onClick={() => {
                  dispatch(
                    handlePageChange({
                      type: "next",
                      value: filteringData.current_page,
                      total: total,
                    })
                  );
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
