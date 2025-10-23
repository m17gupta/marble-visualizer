import { useState } from "react";
import { Filter, X, Search, ChevronDown } from "lucide-react";
import {
  MaterialBrand,
  MaterialCategory,
} from "@/components/swatchBook/interfaces";

interface FilterDropDownProps {
  categories: MaterialCategory[];
  brands: MaterialBrand[];
  activeFilters: any[];
  onAddFilter: any;
  onClose?: any;
}

export const FilterDropdown = ({
  categories,
  brands,
  activeFilters,
  onAddFilter,
}: FilterDropDownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"categories" | "brands">(
    "categories"
  );

  const filteredCategories = (categories || []).filter((cat) =>
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBrands = (brands || []).filter((brand) =>
    brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("categories");
            setSearchTerm("");
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "categories"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Categories
          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
            {(categories || []).length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("brands");
            setSearchTerm("");
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "brands"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Brands
          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
            {(brands || []).length}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-64 overflow-y-auto">
        {activeTab === "categories" ? (
          filteredCategories.length > 0 ? (
            <div className="p-2">
              {filteredCategories.map((cat) => {
                const isActive = activeFilters.some(
                  (f) => f.type === "category" && f.id === cat.id
                );
                return (
                  <button
                    key={`cat-${cat.id}`}
                    onClick={() =>
                      !isActive && onAddFilter("category", cat.id, cat.name)
                    }
                    disabled={isActive}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{cat.name}</span>
                      {isActive && (
                        <span className="text-xs text-gray-500">Active</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No categories found
            </div>
          )
        ) : filteredBrands.length > 0 ? (
          <div className="p-2">
            {filteredBrands.map((brand) => {
              const isActive = activeFilters.some(
                (f) => f.type === "brand" && f.id === brand.id
              );
              return (
                <button
                  key={`brand-${brand.id}`}
                  onClick={() =>
                    !isActive && onAddFilter("brand", brand.id, brand.name)
                  }
                  disabled={isActive}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{brand.name}</span>
                    {isActive && (
                      <span className="text-xs text-gray-500">Active</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            No brands found
          </div>
        )}
      </div>
    </div>
  );
};
