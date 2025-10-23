import { Button } from "./Button";
import { Select } from "./Select";
import { ProductAttributeValue, Variant, Variations } from "../interfaces";
import React, { useCallback, useEffect, useMemo } from "react";

interface variationsProps {
  attributeValues: ProductAttributeValue[];
  handleSaveVariantWithVariations: (data: any) => void;
  variantdetails?: Variant[];
}

export const VariationsAdd = ({
  attributeValues,
  handleSaveVariantWithVariations,
  variantdetails,
}: variationsProps) => {
  const variantAccordingtoAttributeId = useMemo(() => {
    const mapped: any = {};

    for (let att of attributeValues) {
      if (!att.is_variant_value) continue; // ✅ only include variant values

      const key = att.attribute_id!;

      if (!mapped[key]) {
        mapped[key] = [];
      }

      mapped[key].push({
        value: att.value!,
        label: att.value!,
      });
    }
    return mapped;
  }, [attributeValues]);

  const [expanded, setExpanded] = useState<null | number>(null);
  const [variantinfo, setVariantInfo] = useState<Variant[]>([]);

  const handleExpansion = useCallback(
    (id: number) => {
      if (id === expanded) {
        setExpanded(null);
      } else {
        setExpanded(id);
      }
    },
    [expanded]
  );

  useEffect(() => {
    if (variantdetails) {
      setVariantInfo(variantdetails);
    }
  }, []);

  const handleMannualVariation = () => {
    setVariantInfo((prev) => [
      ...prev,
      {
        product_id: null,
        sku: "",
        price: null,
        stock: 0,
        variations: {},
      },
    ]);
  };

  const handleOnChangeVariation = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index: number
  ) => {
    const copied = structuredClone(variantinfo);
    const { name, type, value } = e.target;
    if (copied[index] && name !== undefined) {
      let finalValue;
      if (type == "number") {
        finalValue = Number(value);
      } else if (type == "checkbox") {
        finalValue = value == "false" ? false : true;
      } else {
        finalValue = value;
      }
      copied[index][name as keyof Variant] = finalValue as any;
    }

    setVariantInfo(copied);
  };

  const handleVariantValueSelection = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const copied = structuredClone(variantinfo);

    const { name, value } = e.target;

    const final = attributeValues.find((d: any) => d.value == value);

    const key = Number(name) as keyof Variations;

    if (copied[index].variations !== undefined) {
      copied[index].variations[key] = final as ProductAttributeValue;
      setVariantInfo(copied);
    }
  };

  const handleVariantRemove = (index: number) => {
    const filter = variantinfo.filter((d: any, idx: number) => idx !== index);
    setVariantInfo(filter);
  };

  const handleGenerateVariations = () => {
    const combinations = generateCombinations(variantAccordingtoAttributeId);

    const newVariants: Variant[] = combinations.map((variation) => ({
      product_id: null,
      sku: "",
      price: null,
      stock: 0,
      variations: variation,
    }));

    setVariantInfo(newVariants);

    function generateCombinations(arrays: {
      [key: number]: { value: string; label: string }[];
    }) {
      const keys = Object.keys(arrays);
      if (!keys.length) return [];

      const results: any[] = [];

      function helper(index: number, current: Record<number, any>) {
        const key = Number(keys[index]);

        for (let val of arrays[key]) {
          const finalvalue = attributeValues.find(
            (d: any) => d.value == val.value
          );

          const next = { ...current, [key]: finalvalue };
          if (index === keys.length - 1) {
            results.push(next);
          } else {
            helper(index + 1, next);
          }
        }
      }

      helper(0, {});
      return results;
    }
  };

  return (
    <div className="flex-1">
      {variantAccordingtoAttributeId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Product Variations</h4>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateVariations}
                variant="outline"
                size="sm"
              >
                Generate Variations
              </Button>
              <Button
                onClick={handleMannualVariation}
                variant="outline"
                size="sm"
              >
                Add Manually
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">1 variation available</span>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Expand All
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Collapse All
                </button>
              </div>
            </div>

            {variantinfo.length > 0 &&
              variantinfo.map((variant: Variant, index: number) => {
                return (
                  <ProductVariationCard
                    handleExpansion={handleExpansion}
                    attributes={variant}
                    expanded={expanded}
                    index={index}
                    handleOnChangeVariation={handleOnChangeVariation}
                    variantAccordingtoAttributeId={
                      variantAccordingtoAttributeId
                    }
                    handleVariantValueSelection={handleVariantValueSelection}
                    handleVariantRemove={handleVariantRemove}
                  />
                );
              })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => handleSaveVariantWithVariations(variantinfo)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save changes
            </button>
            <button className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium">
              Cancel
            </button>
            <span className="text-sm text-gray-500">
              1 variation{" "}
              <span className="text-blue-600">(Expand / Close)</span>
            </span>
          </div>
        </div>
      ) : (
        <div>Please Add Attributes</div>
      )}
    </div>
  );
};

import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { any } from "zod";

const ProductVariationCard = ({
  handleExpansion,
  attributes,
  expanded,
  handleOnChangeVariation,
  index,
  variantAccordingtoAttributeId,
  handleVariantValueSelection,
  handleVariantRemove,
}: any) => {
  const [stockStatus, setStockStatus] = useState("instock");
  const [shippingClass, setShippingClass] = useState("parent");

  return (
    <div className=" w-full max-w-6xl mx-auto bg-gray-50">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header Section */}

        <div
          className=""
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            handleExpansion(index);
          }}
        >
          <div className="flex items-center p-2 justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                #{index + 1}
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex gap-2"
              >
                {Object.keys(variantAccordingtoAttributeId).map((d: any) => {
                  let options = variantAccordingtoAttributeId[d];
                  return (
                    <Select
                      value={attributes.variations[d]?.value ?? ""}
                      onChange={handleVariantValueSelection}
                      options={options}
                      placeholder="Choose default size..."
                      name={d}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
            <div
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
              }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => handleVariantRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {expanded !== null && expanded == index && (
          <div className="p-6">
            <div className="flex gap-6">
              {/* Left Column - Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-blue-600 rounded flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="8.5" cy="8.5" r="2.5" />
                    <path
                      d="M21 15l-5-5L5 21"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="flex-1 space-y-4">
                {/* Checkboxes Row */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enabled</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Manage stock?</span>
                  </label>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Side */}
                  <div className="space-y-4">
                    {/* Regular Price */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Regular price ($)
                      </label>
                      <input
                        name="price"
                        onChange={(e) => handleOnChangeVariation(e, index)}
                        type="number"
                        value={attributes.price}
                        placeholder="Variation price (required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    {/* Stock Status */}
                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        Stock status
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <select
                        value={stockStatus}
                        // onChange={(e) => {
                        //   handleOnChangeVariation(e, index);
                        //   setStockStatus(e.target.value);
                        // }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="instock">In stock</option>
                        <option value="outofstock">Out of stock</option>
                        <option value="onbackorder">On backorder</option>
                      </select>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        Weight (lbs)
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        Stock (lbs)
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={attributes.stock}
                        onChange={(e) => handleOnChangeVariation(e, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    {/* Shipping Class */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Shipping class
                      </label>
                      <select
                        value={shippingClass}
                        onChange={(e) => setShippingClass(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="parent">Same as parent</option>
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        Description
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="space-y-4">
                    {/* SKU */}
                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        SKU
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <input
                        name="sku"
                        onChange={(e) => handleOnChangeVariation(e, index)}
                        type="text"
                        value={attributes.sku}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    {/* GTIN, UPC, EAN, or ISBN */}
                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        GTIN, UPC, EAN, or ISBN
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Sale price ($){" "}
                        <a
                          href="#"
                          className="text-blue-600 text-xs hover:underline"
                        >
                          Schedule
                        </a>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    {/* Dimensions */}
                    <div>
                      <label className=" text-sm text-gray-700 mb-1 flex items-center gap-1">
                        Dimensions (L×W×H) (in)
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Length"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Width"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Height"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariationCard;
