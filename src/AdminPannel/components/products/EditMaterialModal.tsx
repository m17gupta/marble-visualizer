import {
  Brand,
  ProductAttributeValue,
} from "@/components/swatchBook/interfaces";
import { Button } from "@/components/swatchBook/NewProductPage/Button";
import { Card } from "@/components/swatchBook/NewProductPage/Card";
import { Input } from "@/components/swatchBook/NewProductPage/InputText";
import {
  ProductModalInterface,
  SelectOption,
} from "@/components/swatchBook/NewProductPage/ProductAdd";
import { Select } from "@/components/swatchBook/NewProductPage/Select";
import {
  DirectS3UploadService,
  UploadProgress,
} from "@/components/uploadImageS3";
import { supabase } from "@/lib/supabase";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface ModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
  activeSection: string | null;
  data?: any;
  id: number | undefined | null;
}

export const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
export const newPath =
  "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/165";

export const EditMaterialModal = ({
  closeModal,
  isModalOpen,
  activeSection,
  data,
  id,
}: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black bg-opacity-40" onClick={closeModal}></div>

      {/* Right-side Modal */}
      {/* <div
        className={`w-full max-w-md bg-white h-full shadow-xl transform transition-transform duration-300 ease-out 
        ${isModalOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{activeSection} Editor</h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {activeSection === "Product" && <ProductEdit data={data} />}

          {activeSection === "Media" && <ImageEdit id={id} data={data} />}

          {activeSection === "Attributes" && <AttributeEdit data={data} />}

          {activeSection === "Variant" && (
            <div>
              <h3 className="text-sm font-medium mb-2">Edit Organize</h3>
            
            </div>
          )}
        </div>
      </div> */}
      <div
        className={`
    h-full bg-white shadow-xl transform transition-transform duration-300 ease-out
    ${isModalOpen ? "translate-x-0" : "translate-x-full"}
    ${activeSection === "Variant" ? "w-full max-w-full" : "w-full max-w-md"}
  `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{activeSection} Editor</h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {activeSection === "Product" && <ProductEdit data={data} />}

          {activeSection === "Media" && <ImageEdit id={id} data={data} />}

          {activeSection === "Attributes" && <AttributeEdit data={data} />}

          {activeSection === "Variant" && <VariantEdit data={data} />}
        </div>
      </div>
    </div>
  );
};

export const ProductEdit = ({ data }: any) => {
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [category, setCategory] = useState<SelectOption[]>([]);
  const [product, setProduct] = useState<ProductModalInterface>({
    name: data.name || "",
    product_category_id: data.product_category_id.id || null,
    brand_id: data.brand_id.id || null,
    description: data.description || "",
  });

  const [loading, setLoading] = useState<null | string>(null);

  useEffect(() => {
    const getBrandAndCategory = async () => {
      try {
        setLoading("normal");
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
      } finally {
        setLoading(null);
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

  const handleSave = async (id: number) => {
    try {
      setLoading("button");
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        console.log(data);
      } else {
        toast.error("Error in updating Product");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(null);
    }
  };

  if (loading == "normal") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-medium mb-2">Edit Product</h3>

      <Card className="p-2 shadow-none border-none">
        <div className="flex flex-col gap-1">
          <Input
            value={product.name ? product.name : ""}
            name="name"
            onChange={(e) => handleProductChange(e)}
            type="text"
            placeholder="Enter product name..."
            className=""
          />
          <Select
            value={product.brand_id ? String(product.brand_id) : ""}
            placeholder="Select Brand"
            onChange={(e) => handleProductChange(e)}
            options={brands.length > 0 ? brands : []}
            name="brand_id"
            className="w-full"
          />
          <Select
            value={
              product.product_category_id
                ? String(product.product_category_id)
                : ""
            }
            onChange={(e) => handleProductChange(e)}
            options={category.length > 0 ? category : []}
            name="product_category_id"
            placeholder="Select Product Category"
            className="w-full"
          />
        </div>
      </Card>

      <Button
        onClick={() => handleSave(data.id)}
        disabled={loading == "button"}
        className="flex items-center gap-2"
      >
        {loading == "button" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
};

export const AttributeEdit = ({ data }: any) => {
  const [loading, setLoading] = useState<null | string>(null);
  const [selectAttribute, setSelectedAttribute] = useState<string>("");
  const attributesOptions = Object.keys(data).map((key: string) => {
    return {
      value: key,
      label: key,
    };
  });

  const [attributeValues, setAttributeValues] = useState<any[]>([]);

  const [attributeValueId, setAttributeValueId] = useState<
    null | string | number
  >(null);

  const [editData, setEditData] = useState<ProductAttributeValue>({
    id: null,
    value: "",
    visible: false,
    product_id: null,
  });

  const handleAttributeSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = data[e.target.value];
    setSelectedAttribute(e.target.value);
    const finalMapped = value.map((d: any) => {
      return {
        value: d.id,
        label: d.value,
      };
    });
    setAttributeValues(finalMapped);
  };

  const handleSaveAttributeValues = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    const attrvalue = data[selectAttribute].find(
      (d: any) => d.id == Number(value)
    );
    setAttributeValueId(Number(value));
    if (attrvalue) {
      setEditData((prev) => {
        return {
          ...prev,
          id: attrvalue.id,
          value: attrvalue.value,
          visible: attrvalue.visible,
          product_id: attrvalue.product_id,
        };
      });
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value, type } = e.target;
    const key = name as keyof ProductAttributeValue;
    const copied = structuredClone(editData);
    if (type == "text" || type == "textarea") {
      copied[key] = value as any;
    } else {
      copied[key] = Number(value) as any;
    }
    setEditData(copied);
  };

  const handleSave = async () => {
    try {
      setLoading("button");
      const final = {
        value: editData.value,
        visible: editData.visible,
      };
      const { data, error } = await supabase
        .from("product_attribute_values_duplicate")
        .update(final)
        .eq("id", editData.id)
        .select("*")
        .single();
      if (data && !error) {
        toast.success("Product Attribute Value Update");
        console.log(data);
      } else {
        toast.error("Product Attribute Value Not Updated");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(null);
    }
  };

  console.log(data);

  if (loading == "normal") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-medium mb-2">Edit Product</h3>

      <Card className="p-2 shadow-none border-none">
        <div className="flex flex-col gap-1">
          <Select
            value={selectAttribute}
            placeholder="Select Attribute"
            onChange={(e) => handleAttributeSelection(e)}
            options={attributesOptions.length > 0 ? attributesOptions : []}
            name="brand_id"
            className="w-full"
          />
          <Select
            value={String(attributeValueId)}
            onChange={(e) => handleSaveAttributeValues(e)}
            options={attributeValues.length > 0 ? attributeValues : []}
            name="product_category_id"
            placeholder="Select Product Category"
            className="w-full"
          />
          {editData ? (
            <>
              <Input
                value={editData.value ? String(editData.value) : ""}
                name="value"
                onChange={(e) => handleEditChange(e)}
                type="text"
                placeholder="Enter product name..."
                className=""
              />
              <Select
                value={String(editData.visible ? 1 : 0)}
                onChange={(e) => handleEditChange(e)}
                options={[
                  { value: "0", label: "False" },
                  { value: "1", label: "True" },
                ]}
                name="visible"
                className="w-full"
              />
            </>
          ) : (
            <>Select Above Settings</>
          )}
        </div>
      </Card>

      <Button
        onClick={() => handleSave()}
        disabled={loading == "button"}
        className="flex items-center gap-2"
      >
        {loading == "button" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
};

interface ImageEditProps {
  data?: string;
  id?: any; // image url
}

export const ImageEdit: React.FC<ImageEditProps> = ({ data, id }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadedFile] = useState<null | File>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | undefined>(data);

  const { profile, allUserProfiles } = useSelector(
    (state: RootState) => state.userProfile
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!DirectS3UploadService.isConfigured()) {
      toast.error(
        "AWS credentials not configured. Please set your environment variables."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await DirectS3UploadService.uploadFile(
        uploadFile,
        profile?.id,
        (progress: UploadProgress) => {
          setUploadProgress(progress.percentage || 0);
        }
      );

      if (result.success) {
        const url = result.fileUrl;
        setImageUrl(url);
        console.log("====>>>>", url);
        const { data, error } = await supabase
          .from("products")
          .update({
            photo: uploadFile.name,
            new_bucket: 1,
          })
          .eq("id", id)
          .select("*")
          .single();
        console.log(data);
        toast.success("File uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in Uploading");
    } finally {
      setIsUploading(false);
      setUploadedFile(null);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 p-4 border rounded-md">
      <h2 className="text-lg font-semibold">Image Edit</h2>

      {/* Preview */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Preview"
          className="w-40 h-40 object-cover border rounded-md"
        />
      ) : (
        <div className="w-40 h-40 flex items-center justify-center border rounded-md text-gray-400">
          No Image
        </div>
      )}

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !uploadFile}
        className={`px-4 py-2 rounded-md text-white ${
          isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {/* Progress bar */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

import { Save, X, Image as ImageIcon } from "lucide-react";

interface VariantEditProps {
  data: any[];
}

export const VariantEdit = ({ data }: VariantEditProps) => {
  const mappedName: Record<string, string> = {
    id: "ID",
    product_id: "Product ID",
    sku: "SKU",
    stock: "Stock",
    image_url: "Image",
    price: "Price",
  };

  const [variantData, setVariantData] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const headersVariant =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (d) => d !== "variant_attribute_values" && d !== "product_id"
        )
      : [];

  useEffect(() => {
    setVariantData(data ?? []);
    setHasChanges(false);
  }, [data]);

  const handleChange = (rowId: number, key: string, value: any) => {
    setVariantData((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [key]: key === "stock" || key === "price" ? Number(value) : value,
            }
          : row
      )
    );
    setHasChanges(true);
  };

  const handleDelete = async (rowId: number) => {
    if (!confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", rowId);

    if (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete variant");
    } else {
      setVariantData((prev) => prev.filter((row) => row.id !== rowId));
      toast.success("Variant deleted successfully");
    }
  };

  const handleSave = async () => {
    const copied = structuredClone(variantData).map((d) => ({
      id: d.id,
      sku: d.sku,
      image_url: d.image_url,
      price: d.price,
      stock: d.stock,
    }));

    for (let i of copied) {
      const id = i.id;
      delete i.id;
      const { data, error } = await supabase
        .from("product_variants")
        .update(i)
        .eq("id", id);

      if (error) {
        console.error("Update error:", error);
      } else {
        console.log(data);
        toast.success("Variant Updated");
      }
    }

    setHasChanges(false);
  };

  const getInputType = (key: string) => {
    if (key === "stock" || key === "price") return "number";
    if (key === "image_url") return "url";
    return "text";
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Variants</h3>
          <p className="text-sm text-gray-500 mt-1">
            Update variant details and click save to apply changes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              {headersVariant.map((header) => (
                <th
                  key={header}
                  className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {mappedName[header] ?? header}
                </th>
              ))}
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {variantData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {headersVariant.map((key) => {
                  const value = row[key];
                  const inputType = getInputType(key);

                  // Special handling for image_url
                  if (key === "image_url") {
                    return (
                      <td key={key} className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {value && (
                            <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                              <img
                                src={value}
                                alt="Variant"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <input
                            type="url"
                            value={value ?? ""}
                            onChange={(e) =>
                              handleChange(row.id, key, e.target.value)
                            }
                            placeholder="https://..."
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </td>
                    );
                  }
                  if (key === "id") {
                    return (
                      <td key={key} className="py-3 px-4">
                        <span className="text-sm text-gray-500">{value}</span>
                      </td>
                    );
                  }

                  // Handle price with currency symbol
                  if (key === "price") {
                    return (
                      <td key={key} className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={value ?? ""}
                            onChange={(e) =>
                              handleChange(row.id, key, e.target.value)
                            }
                            placeholder="0.00"
                            className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </td>
                    );
                  }

                  // Default input
                  return (
                    <td key={key} className="py-3 px-4">
                      <input
                        type={inputType}
                        value={value ?? ""}
                        onChange={(e) =>
                          handleChange(row.id, key, e.target.value)
                        }
                        placeholder={`Enter ${key}`}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                  );
                })}
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
