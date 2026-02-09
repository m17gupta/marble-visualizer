import { ActiveFilter, SortField, SortOrder } from '@/components/swatchBook/interfaces';
import { AppDispatch, RootState } from '@/redux/store';
import { ChevronDown, Download, Edit, Eye, Filter, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FilterDropdown } from '../products/FilterComp';

const ShowMaterials = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const { isFetchedProductMaterial, product_material } = useSelector((state: RootState) => state.materialsdetails)

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                            <div className="flex gap-3">
                                <button
                                    // onClick={handleExport}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                                <button
                                    // onClick={handleImport}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Import
                                </button>


                                <button
                                    onClick={() => navigate('/admin/addmaterials')} className=" text-sm flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                                    // onChange={(e) => {
                                    //   dispatch(handlePerPageChange(Number(e.target.value)));
                                    // }}
                                    //value={filteringData.item_per_page}
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
                                    // onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Add filter
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {showFilterDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowFilterDropdown(false)}
                                        />
                                        {/* <FilterDropdown
                    categories={categories}
                    brands={brands}
                    activeFilters={activeFilters}
                    onAddFilter={addFilter}
                    onClose={() => setShowFilterDropdown(false)}
                  /> */}
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
                                        // onClick={() => removeFilter(filter.type, filter.id)}
                                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}

                            {/* {(activeFilters.length > 0 || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear all
              </button>
            )} */}

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
                                        //  onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center">
                                                title
                                                {/* {getSortIcon("name")} */}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                        //  onClick={() => handleSort("product_category_id")}
                                        >
                                            <div className="flex items-center   ">
                                                segment_type
                                                {/* {getSortIcon("product_category_id")} */}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                        //  onClick={() => handleSort("brand_id")}
                                        >
                                            <div className="flex items-center">
                                                category
                                                {/* {getSortIcon("brand_id")} */}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Color
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Origin
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Finish
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Polished
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thickness
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Weight
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Density
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                        //  onClick={() => handleSort("base_price")}
                                        >
                                            <div className="flex items-center">
                                                price
                                                {/* {getSortIcon("base_price")} */}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Media
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {product_material.map((product) => {
                                        const imageURL = product?.media ?? ""
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
                                                            {product.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                   {product.segment_type}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product?.category}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product?.category}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.color || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.origin_country || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.finish_type || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.polished ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.thickness || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.size || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.weight || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.density || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {product.description || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.basic_price
                                                        ? `$${product.basic_price.toFixed(2)}`
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
                                                           // onClick={() => handleView(product.id!)}
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
                                                           // onClick={() => handleDelete(product.id!)}
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

                        {product_material.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No products found
                            </div>
                        )}

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                1 — {product_material.length} of {product_material.length} results
                            </span>
                            <div className="flex gap-2">
                                <button
                                    // onClick={() => {
                                    //     dispatch(
                                    //         handlePageChange({
                                    //             type: "prev",
                                    //             value: filteringData.current_page,
                                    //             total: total,
                                    //         })
                                    //     );
                                    // }}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Prev
                                </button>
                                <button
                                    // onClick={() => {
                                    //     dispatch(
                                    //         handlePageChange({
                                    //             type: "next",
                                    //             value: filteringData.current_page,
                                    //             total: total,
                                    //         })
                                    //     );
                                    // }}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShowMaterials