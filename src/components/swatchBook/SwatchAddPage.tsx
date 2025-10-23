import React, { useEffect, useState } from "react";
import { Plus, Info, Link2, Settings, Eye, Copy, Save } from "lucide-react";
import {
  ProductModalInterface,
  ProductVariation,
  SelectOption,
  SidebarItemData,
} from "./NewProductPage/ProductAdd";
import { Button } from "./NewProductPage/Button";
import { Card } from "./NewProductPage/Card";
import { Input } from "./NewProductPage/InputText";
import { TextArea } from "./NewProductPage/InputArea";
import { CollapsibleSection } from "./NewProductPage/CollapsibleSection";
import { Select } from "./NewProductPage/Select";
import { SidebarItem } from "./NewProductPage/SideBarItem";
import { supabase } from "@/lib/supabase";
import { productTypeOptions, sidebarItems } from "./NewProductPage/DefaultData";
import { VariationsAdd } from "./NewProductPage/VariantionAdd";
import { AttributesAdd } from "./NewProductPage/AttributesAdd";
import { AttributeId, ProductAttributeValue, Variant } from "./interfaces";
import { toast } from "sonner";

const ProductEditPage: React.FC = () => {
  const [slug, setSlug] = useState<string>("premium-wireless-headphones");
  const [productype, setProductype] = useState<string>("simple");
  const [product, setProduct] = useState<ProductModalInterface>({
    name: "",
    product_attribute_set_id: null,
    product_category_id: null,
    brand_id: null,
    description: "",
    photo: "Behr__Rushing_Stream_MjAzODkw.jpg",
    bucket_path: "default",
    new_bucket: 0,
  });
  const [selected, setSelected] = useState<AttributeId[]>([]);

  const [productsettingsactivetab, setProductSettingActiveTab] = useState<
    string | null
  >("Attributes");

  const handleproductsettingsactivetab = (label: string) => {
    setProductSettingActiveTab(label);
  };

  const [category, setCategory] = useState<SelectOption[]>([]);

  const [brand, setBrands] = useState<SelectOption[]>([]);

  const [varaintwithvariations, setVariantWithVariations] = useState<any[]>([]);

  const [saveloading, setSaveLoading] = useState(false);

  const handleSaveVariantWithVariations = (data: any) => {
    setVariantWithVariations(data);
  };

  useEffect(() => {
    const getBrandAndCategory = async () => {
      try {
        const { data: category, error: err } = await supabase
          .from("product_categories")
          .select("*");
        const { data: brands, error: branderr } = await supabase
          .from("product_brand")
          .select("*");

        if (!err && !branderr) {
          setCategory(
            category.map((d: any) => {
              return {
                value: d.id,
                label: d.name,
              };
            })
          );
          setBrands(
            brands.map((d: any) => {
              return {
                value: d.id,
                label: d.name,
              };
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    getBrandAndCategory();
  }, []);

  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value, type } = e.target;
    const key = name as keyof ProductModalInterface;
    const copied = structuredClone(product);
    if (type == "text" || type == "textarea") {
      copied[key] = value as any;
    } else {
      copied[key] = Number(value) as any;
    }
    setProduct(copied);
  };

  const handleSlugChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setSlug(e.target.value);
  };

  const [attributeValues, setAttributeValues] =
    useState<ProductAttributeValue[]>();

  const handleSaveAttributesValues = (selected: AttributeId[]) => {
    const attributeValues: ProductAttributeValue[] = selected.flatMap(
      (d: AttributeId) =>
        (d.selected_values ?? []).map((val: string | number) => ({
          product_id: null,
          attribute_id: d.id,
          value: val,
          is_variant_value: d.is_variant_value ?? false,
          visible: d.visible ?? true,
        }))
    );
    setAttributeValues(attributeValues);
  };

  const handleProductSave = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select("*")
        .single();
      if (error) {
        return [null, error.message];
      } else {
        return [data.id, null];
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSaveAttributesInDatabase = async (
    id: number
  ): Promise<[ProductAttributeValue[] | null, string | null]> => {
    try {
      const mappedarray = attributeValues?.map((d) => {
        return {
          ...d,
          product_id: id,
        };
      });

      const { data, error } = await supabase
        .from("product_attribute_values_duplicate")
        .insert(mappedarray)
        .select("*");
      if (error) {
        return [null, error.message];
      } else {
        return [data, null];
      }
    } catch (error) {
      throw error;
    }
  };

  const handleVariantSave = async (
    attrvalues: any[],
    varaintwithvariations: any[],
    productid: number
  ) => {
    try {
      let variantArray = [];
      for (let vary of varaintwithvariations) {
        let toSaveinDb = {
          product_id: productid,
          sku: vary.sku,
          price: vary.price,
          stock: vary.stock,
        };

        let variations = Object.entries(vary.variations) as [
          string,
          ProductAttributeValue
        ][];

        const { data, error } = await supabase
          .from("product_variants")
          .insert(toSaveinDb)
          .select("*")
          .single();

        if (error) {
          toast.error(`Error in Saving ${toSaveinDb.sku}`);
        } else {
          for (let variation of variations) {
            const getData = attrvalues.find(
              (d) => d.value == variation[1].value
            );

            if (getData?.attribute_id && getData.value) {
              variantArray.push({
                variant_id: data.id,
                attribute_id: getData.attribute_id,
                // value: getData.value,
                value: getData.id,
              });
            }
          }
        }
      }
      return variantArray;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmitFinal = async () => {
    try {
      setSaveLoading(true);
      const [id, err] = await handleProductSave();
      if (err) {
        toast.error(err);
        return;
      }
      const [data, attributesaveerror] = await handleSaveAttributesInDatabase(
        id
      );
      if (attributesaveerror) {
        // use can delete product too but save for now
        toast.error(attributesaveerror);
        return;
      }
      let variantinDBS;
      if (data !== null) {
        variantinDBS = await handleVariantSave(data, varaintwithvariations, id);
      }
      const { data: variantsave, error: variantsaveerror } = await supabase
        .from("variant_attribute_values")
        .insert(variantinDBS)
        .select("*");

      if (variantsaveerror) {
        toast.error("Issue in Saving Variant Attribute Values");
      } else {
        console.log(variantsave);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">
                Manage your product details and settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" icon={Eye}>
                Preview
              </Button>
              <Button variant="secondary" icon={Copy}>
                Duplicate
              </Button>
              <Button variant="outline" icon={Plus}>
                Add New Product
              </Button>
              <Button
                onClick={handleSubmitFinal}
                variant="success"
                disabled={saveloading} // prevent multiple clicks
              >
                {saveloading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Product Name */}
            <Card className="p-6">
              <div className="">
                <Input
                  value={product.name!}
                  name="name"
                  onChange={(e) => handleProductChange(e)}
                  label="Product Name"
                  type="text"
                  placeholder="Enter product name..."
                  className="text-2xl font-semibold border-0 focus:ring-0 p-0 bg-transparent"
                />
                <div className="flex gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Brand:
                    </label>
                    <Select
                      value={product.brand_id ? String(product.brand_id) : ""}
                      onChange={handleProductChange}
                      options={brand}
                      name="brand_id"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Category:
                    </label>
                    <Select
                      value={
                        product.product_category_id
                          ? String(product.product_category_id)
                          : ""
                      }
                      onChange={handleProductChange}
                      options={category}
                      name="product_category_id"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Product Description */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Description
                  </h3>
                  <Button variant="outline" size="sm" icon={Plus}>
                    Add Media
                  </Button>
                </div>
                <TextArea
                  value={
                    product.description != undefined
                      ? String(product.description)
                      : ""
                  }
                  onChange={handleProductChange}
                  placeholder="Describe your product in detail. What makes it special? What are its key features and benefits?"
                  rows={8}
                  name="description"
                  className="text-gray-700"
                />
                <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <span>Characters: {product?.description?.length}</span>
                  <span>Last edited: September 27, 2025 at 5:43 AM</span>
                </div>
              </div>
            </Card>

            {/* Product Data */}
            <CollapsibleSection
              title="Product Configuration"
              icon={Settings}
              defaultOpen={true}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Product Type
                    </label>
                    <Select
                      value={productype}
                      onChange={(e) => {
                        setProductype(e.target.value);
                      }}
                      options={productTypeOptions}
                    />
                  </div>
                </div>

                {/* Product Settings Section */}
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Settings size={18} className="text-blue-600" />
                      Product Settings
                    </h4>
                    <div className="space-y-1">
                      {sidebarItems
                        .filter((item) => {
                          if (
                            item.label.toLowerCase() === "variations" &&
                            productype === "simple"
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((item: SidebarItemData, index: number) => (
                          <SidebarItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            active={productsettingsactivetab == item.label}
                            badge={item.badge}
                            onClick={handleproductsettingsactivetab}
                          />
                        ))}
                    </div>
                  </div>
                  {productsettingsactivetab == "Variations" &&
                    attributeValues != undefined &&
                    attributeValues?.length > 0 && (
                      <VariationsAdd
                        handleSaveVariantWithVariations={
                          handleSaveVariantWithVariations
                        }
                        attributeValues={attributeValues}
                        variantdetails={varaintwithvariations}
                      />
                    )}
                  {productsettingsactivetab == "Attributes" && (
                    <AttributesAdd
                      selected={selected}
                      setSelected={setSelected}
                      handleSaveAttributesValues={handleSaveAttributesValues}
                      productype={productype}
                    />
                  )}
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
