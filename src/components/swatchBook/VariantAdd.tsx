import { Plus, Save, X } from "lucide-react";

export const VariantAdd = ({
  handleAddVariant,
  variants,
  handleEditVariant,
  handleDeleteVariant,
  isAddingVariant,
  setIsAddingVariant,
  editingVariantIndex,
  currentVariant,
  handleVariantInputChange,
  selectedFeatureData,
  checked,
  groups,
  renderAttributeInput,
  handleSaveVariant,
  handleGroupToggle,
}: any) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Product Variants
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage different variations of your product
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center shadow-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </button>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Existing Variants */}
        {variants.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Existing Variants
            </h3>
            <div className="space-y-4">
              {variants.map((variant: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          SKU
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          {variant.sku}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Stock
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          {variant.stock}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditVariant(index)}
                        className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(index)}
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Variant Form */}
        {isAddingVariant && (
          <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingVariantIndex !== null
                  ? "Edit Variant"
                  : "Add New Variant"}
              </h3>
              <button
                onClick={() => setIsAddingVariant(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Basic Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Variant SKU *
                  </label>
                  <input
                    type="text"
                    value={currentVariant.sku}
                    onChange={(e) =>
                      handleVariantInputChange("sku", e.target.value)
                    }
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter variant SKU"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={currentVariant.stock}
                    onChange={(e) =>
                      handleVariantInputChange(
                        "stock",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>
              </div>

              {/* Attribute Configuration */}
              {selectedFeatureData && groups.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Attribute Configuration
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure detailed attributes for this product variant
                  </p>

                  {/* Attribute Groups */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">
                      Select Attribute Groups
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groups.map((group: any) => (
                        <label
                          key={group.id}
                          className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked.some(
                              (d: any) => d.attribute_group_id === group.id
                            )}
                            onChange={() => handleGroupToggle(group.id)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-semibold text-gray-700">
                            {group.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Attributes Inside Groups */}
                  {checked.length > 0 && (
                    <div className="space-y-6">
                      {checked.map((checkedGroup: any) => {
                        const group = groups.find(
                          (g: any) => g.id === checkedGroup.attribute_group_id
                        );
                        return (
                          <div
                            key={checkedGroup.attribute_group_id}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                          >
                            <h4 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-300">
                              {group?.name} Attributes
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {checkedGroup.attributes
                                .sort(
                                  (a: any, b: any) =>
                                    a.sort_order - b.sort_order
                                )
                                .map((attribute: any) =>
                                  renderAttributeInput(attribute)
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingVariant(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVariant}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center shadow-lg transition-all duration-200"
                  disabled={!currentVariant.sku || currentVariant.stock < 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingVariantIndex !== null
                    ? "Update Variant"
                    : "Save Variant"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {variants.length === 0 && !isAddingVariant && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No variants added yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first product variant with specific
              attributes.
            </p>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center mx-auto shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Variant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
