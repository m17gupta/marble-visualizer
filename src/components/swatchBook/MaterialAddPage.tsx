import React, { useEffect, useState } from "react";
import { X, Upload, CircleCheckBig } from "lucide-react";
import { ProductAttributeValue, Variant } from "./interfaces";
import { supabase } from "@/lib/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  adminProductSave,
  handleAddAttributeInSlice,
  handleAddInCategorySegmentBrand,
  handleAddValueInSlice,
  handleAttributeSelectInSlice,
  handleavailableattributes,
  handleCheckUncheck,
  handleFileUploadInSlice,
  handleforUpdateSelectAttributes,
  handleGenerateRandomSKUInSlice,
  handleImageDrag,
  handleImageInProduct,
  handleProductInSlicesChange,
  handleRemoveAttributeInSlice,
  handleRemoveFromUploadImages,
  handleRemoveValueInSlice,
  handleuploadInUploadImages,
  handleVariantInSliceChange,
  variantSet,
} from "@/AdminPannel/reduxslices/adminMaterialLibSlice";
import { AdminMaterialLibService } from "@/AdminPannel/services/Material/AdminMaterialLibService";
import { CSVImportModal } from "@/AdminPannel/components/Projects/CSVImportModalProps";
import {
  DirectS3UploadService,
  UploadProgress,
} from "@/components/uploadImageS3";
import { ToastAction } from "@radix-ui/react-toast";

interface autogenModal {
  price: null | number;
  stock: null | number;
}

const ProductAddEditPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    product,
    error,
    loading,
    selected,
    variant: variants,
    availableAttributes,
    category,
    brand,
    segments,
  } = useSelector((state: RootState) => state.materialsdetails);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const handleOpenImport = () => {
    setIsImportOpen((prev) => !prev);
  };

  const { id } = useParams();

  const [saveLoading, setSaveLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dropdownStates, setDropdownStates] = useState<{
    [key: number]: {
      isOpen: boolean;
      searchTerm: string;
    };
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        if (!product.product_category_id) {
          toast.message("Select Category First");
          return;
        }
        const { data, error } = await supabase
          .from("product_attributes")
          .select("*")
          .eq("category_id", product.product_category_id);

        if (!error) {
          dispatch(handleavailableattributes(data));

          for (let i = 0; i < data.length; i++) {
            dispatch(
              handleAttributeSelectInSlice({ idx: i, attrId: data[i].id })
            );
          }
        }
      } catch (error) {
        console.error("Error in Getting Attributes");
      }
    };
    if (product.product_category_id) {
      fetchAttributes();
    }
  }, [product.product_category_id]);

  useEffect(() => {
    const getBrandAndCategory = async () => {
      try {
        const { data: material, error: materr } = await supabase
          .from("material_segments")
          .select("*");
        const { data: category, error: err } = await supabase
          .from("product_categories")
          .select("*");
        const { data: brands, error: branderr } = await supabase
          .from("product_brand")
          .select("*");

        if (!err && !branderr && !materr) {
          dispatch(
            handleAddInCategorySegmentBrand({
              type: "product_categories",
              value: category.map((d: any) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              }),
            })
          );

          dispatch(
            handleAddInCategorySegmentBrand({
              type: "product_brand",
              value: brands.map((d: any) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              }),
            })
          );

          dispatch(
            handleAddInCategorySegmentBrand({
              type: "material_segments",
              value: material.map((d: any) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              }),
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (category.length <= 0 && brand.length <= 0 && segments.length <= 0) {
      getBrandAndCategory();
    }
  }, []);

  useEffect(() => {
    const fetchCurrentProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "*,product_attribute_values_duplicate(id,attribute_id(*), value, is_variant_value, visible)"
        )
        .eq("id", Number(id))
        .single();

      const t = Object.entries(data!);
      for (let i of t) {
        const mapped = {
          material_segment_id: "material_segment_id",
          product_category_id: "category_id",
        };
        const [key, value] = i;
        if (key == "product_attribute_values_duplicate") {
          continue;
        }
        let results = null;
        if (key == "material_segment_id" || key == "product_category_id") {
          results = await AdminMaterialLibService.SelectCatgeoryBrandSegment({
            name: mapped[key as keyof typeof mapped],
            id: Number(value),
          });
        }
        dispatch(
          handleProductInSlicesChange({
            name: key,
            value,
            type: typeof value,
            results: results?.data,
          })
        );
      }

      if (error) {
        toast.error(`Error in Fetching Product with ID: ${id}`);
      }

      const selectedAttributes = data.product_attribute_values_duplicate;

      const grouped = Object.values(
        selectedAttributes.reduce((acc: any, item: any) => {
          const attrId = item.attribute_id.id;
          if (!acc[attrId]) {
            acc[attrId] = {
              ...item.attribute_id,
              selected_values: [],
            };
          }
          acc[attrId].selected_values.push(item.value);
          if (item.is_variant_value) {
            acc[attrId].is_variant_value = true;
          }
          return acc;
        }, {})
      );

      dispatch(handleforUpdateSelectAttributes(grouped));

      const { data: variants, error: err } = await supabase
        .from("product_variants")
        .select(`*,variant_attribute_values(id,value(*))`)
        .eq("product_id", Number(id));

      console.log(variants);
    };

    fetchCurrentProduct();
  }, [id]);

  const handleProductChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const mapped = {
      material_segment_id: "material_segment_id",
      product_category_id: "category_id",
    };
    let results = null;

    if (name == "material_segment_id" || name == "product_category_id") {
      results = await AdminMaterialLibService.SelectCatgeoryBrandSegment({
        name: mapped[name as keyof typeof mapped],
        id: Number(value),
      });
    }

    dispatch(
      handleProductInSlicesChange({ name, value, type, results: results?.data })
    );
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string = "Normal",
    index?: number
  ) => {
    const file = e.target.files;
    if (file && file.length <= 0) return;

    if (type == "Normal") {
      let t: string[] = [];
      for (let i = 0; i < file!?.length; i++) {
        let url = await handleUploadToS3(file!?.[i]);
        t.push(url!);
      }
      if (!product.photo) {
        dispatch(handleImageInProduct(t[0]));
      }
      dispatch(handleuploadInUploadImages(t));
      setUploadProgress(0);
    } else {
      let url = await handleUploadToS3(file!?.[0]);
      dispatch(handleFileUploadInSlice({ imageUrl: url, index: index }));
      setUploadProgress(0);
    }
  };

  const [dragindex, setDragIndex] = useState<null | number>(null);
  const [dragoverindex, setDragOverindex] = useState<null | number>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    if (product.gallery!?.length <= 0) {
      return;
    }
    const updatedImages = [...product.gallery!];
    const draggedItem = updatedImages[dragindex!];
    updatedImages[dragindex!] = updatedImages[dragoverindex!];
    updatedImages[dragoverindex!] = draggedItem;
    console.log(updatedImages);
    dispatch(handleImageDrag(updatedImages));
    setDragIndex(null);
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
    setDragOverindex(index);
  };

  const handleUploadToS3 = async (selectedFile: File) => {
    if (!selectedFile) {
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
        selectedFile,
        undefined,
        (progress: UploadProgress) => {
          setUploadProgress(progress.percentage || 0);
        }
      );

      if (result.success) {
        const url = result.fileUrl;
        toast.success("File uploaded successfully!");
        return url;
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in Uploading");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    dispatch(handleRemoveFromUploadImages(index));
  };

  useEffect(() => {
    const variantAttributes = selected.filter(
      (attr) =>
        attr.is_variant_value &&
        attr.selected_values &&
        attr.selected_values.length > 0
    );
    if (variantAttributes.length === 0) {
      dispatch(variantSet([]));
      return;
    }

    const combinations: Variant[] = [];

    const generateCombos = (
      index: number,
      current: Record<number, ProductAttributeValue>
    ) => {
      if (index === variantAttributes.length) {
        combinations.push({
          product_id: null,
          sku: "",
          price: null,
          stock: 0,
          image_url: "",
          variations: { ...current },
          checked: true,
        });
        return;
      }

      const attr = variantAttributes[index];
      (attr.selected_values || []).forEach((value) => {
        generateCombos(index + 1, {
          ...current,
          [attr.id as keyof any]: {
            product_id: null,
            attribute_id: attr.id,
            value,
            is_variant_value: true,
            visible: true,
          },
        });
      });
    };

    generateCombos(0, {});
    dispatch(variantSet(combinations));
  }, [selected]);

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    dispatch(handleVariantInSliceChange({ index, field, value }));
  };

  const handleAddAttribute = () => {
    if (!product.product_category_id) {
      toast.message("Select Category First");
      return;
    }
    dispatch(handleAddAttributeInSlice());
  };

  const handleAttributeSelect = (idx: number, attrId: number) => {
    dispatch(handleAttributeSelectInSlice({ idx, attrId }));
  };

  const handleRemoveAttribute = (idx: number) => {
    dispatch(handleRemoveAttributeInSlice(idx));
  };

  const handleAddValue = (attrIdx: number, value: string) => {
    dispatch(handleAddValueInSlice({ attrIdx, value }));
  };

  const handleRemoveValue = (attrIdx: number, value: string | number) => {
    dispatch(handleRemoveValueInSlice({ attrIdx, value }));
  };

  const toggleDropdown = (attrIdx: number) => {
    setDropdownStates((prev) => ({
      ...prev,
      [attrIdx]: {
        ...prev[attrIdx],
        isOpen: !prev[attrIdx]?.isOpen,
        searchTerm: prev[attrIdx]?.searchTerm || "",
      },
    }));
  };

  const updateSearchTerm = (attrIdx: number, searchTerm: string) => {
    setDropdownStates((prev) => ({
      ...prev,
      [attrIdx]: {
        ...prev[attrIdx],
        searchTerm,
        isOpen: true,
      },
    }));
  };

  const closeDropdown = (attrIdx: number) => {
    setDropdownStates((prev) => ({
      ...prev,
      [attrIdx]: {
        ...prev[attrIdx],
        isOpen: false,
        searchTerm: "",
      },
    }));
  };

  const selectValue = (attrIdx: number, value: string) => {
    handleAddValue(attrIdx, value);
    closeDropdown(attrIdx);
  };

  const addCustomValue = async (attrIdx: number, value: string) => {
    try {
      if (value.trim()) {
        handleAddValue(attrIdx, value.trim());
        const cloned = structuredClone(selected);
        let single = cloned.find((d, i) => i == attrIdx);
        const { data: exists, error: err } = await supabase
          .from("product_attributes")
          .select("*")
          .eq("id", single?.id)
          .contains("possible_values", JSON.stringify([value]));

        if (exists && exists.length > 0) {
          toast.message("Already Present");
        } else {
          single?.possible_values!.push(value);
          const { data, error } = await supabase
            .from("product_attributes")
            .update({ possible_values: single?.possible_values })
            .eq("id", single?.id)
            .select("*");
          if (!error && data.length > 0) {
            toast.success("Added in Possible Values");
          } else {
            toast.error("No Added");
          }
        }

        closeDropdown(attrIdx);
        if (error) {
          toast.error("Failed to add in Possible_values");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    // Validate required details fields
    if (!product.name || product.name.trim() === "") {
      errors.push("Product name is required");
    }

    if (!product.material_segment_id) {
      errors.push("Material segment is required");
    }

    if (!product.product_category_id) {
      errors.push("Product category is required");
    }

    if (!product.brand_id) {
      errors.push("Brand is required");
    }

    // Validate variants if they exist
    if (variants.length > 0) {
      const checkedVariants = variants.filter((v) => v.checked);
      if (checkedVariants.length === 0) {
        errors.push("At least one variant must be selected");
      }

      checkedVariants.forEach((variant, index) => {
        if (!variant.sku || variant.sku.trim() === "") {
          errors.push(`SKU is required for variant ${index + 1}`);
        }
        if (
          variant.price === null ||
          variant.price === undefined ||
          variant.price < 0
        ) {
          errors.push(`Valid price is required for variant ${index + 1}`);
        }
        if (
          variant.stock === null ||
          variant.stock === undefined ||
          variant.stock < 0
        ) {
          errors.push(
            `Valid stock quantity is required for variant ${index + 1}`
          );
        }
      });
    }

    if (errors.length > 0) {
      toast.error("Validation Failed", {
        description: (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="text-sm">
                • {error}
              </div>
            ))}
          </div>
        ),
        duration: 5000,
      });
      return;
    }

    try {
      await dispatch(
        adminProductSave({
          product,
          selected,
          variants,
        })
      ).unwrap();

      toast.success("Product saved successfully!", {
        description: "Your product has been saved with all variants.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to save product", {
        description:
          "Please try again or contact support if the problem persists.",
        duration: 4000,
      });
    }
  };

  const handlecheckanduncheckinproductvariantion = (idx: number) => {
    dispatch(handleCheckUncheck({ idx, type: "variant" }));
  };

  const [randomGen, setRandomGen] = useState<autogenModal>({
    price: null,
    stock: null,
  });

  const handleChangeInputOfRandomGen = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const copied = structuredClone(randomGen);
    copied[name as keyof autogenModal] = Number(value);
    setRandomGen(copied);
  };

  const handleGenerateRandomSKU = (
    arr: any[],
    { price, stock }: autogenModal
  ) => {
    let values = {
      price,
      stock,
    };
    dispatch(handleGenerateRandomSKUInSlice({ arr, values }));
  };

  let stringofSKUGeneration = selected
    .filter((d) => d.is_variant_value)
    .map((d) => d.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={handleOpenImport}
        onImport={() => console.log("yes")}
      />

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Add Product
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleOpenImport}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>

              <button         
              onClick={handleSave}
              disabled={saveLoading} 
              className=" text-sm flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {saveLoading ? "Saving..." : "Save Product"}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* General Section */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">General</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleProductChange}
                    placeholder="Winter jacket"
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                      !product.name || product.name.trim() === ""
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {(!product.name || product.name.trim() === "") && (
                    <p className="text-red-500 text-xs mt-1">
                      Product name is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    onChange={handleProductChange}
                    type="number"
                    step="0.01"
                    name="base_price"
                    value={product.base_price || ""}
                    placeholder="Enter Price $ 0.00"
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                      !product.base_price
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {!product.base_price && (
                    <p className="text-red-500 text-xs mt-1">
                      Base Price is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400">Optional</span>
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleProductChange}
                    rows={4}
                    placeholder="A warm and cozy jacket"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Media <span className="text-gray-400">Optional</span>
              </h3>
              <div className="mb-4 space-x-2">
                {product.gallery &&
                  product.gallery.length > 0 &&
                  product.gallery.map((d: any, index: number) => {
                    return (
                      <div key={d} className="relative group inline-block">
                        <img
                          src={d}
                          alt="Product image"
                          className={`w-24 max-w-sm h-24 object-cover rounded border ${
                            product.photo == d
                              ? "border-2 border-red-500"
                              : "border-none"
                          }`}
                        />
                        <button
                          onClick={() => handleRemoveImage(0)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center p-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <button
                          onClick={() => {
                            dispatch(handleImageInProduct(d));
                          }}
                          className="absolute bottom-2 left-[38%] bg-gray text-green-800 rounded-full shadow-md p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                        >
                          <CircleCheckBig size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    );
                  })}
              </div>

              <div className="mb-4 space-x-2">
                {product.gallery &&
                  product.gallery.length > 0 &&
                  product.gallery.map((d: any, index: number) => {
                    return (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={() => handleDragEnd()}
                        key={d}
                        className="relative group inline-block"
                      >
                        <img
                          src={d}
                          alt="Product image"
                          className={`w-24 max-w-sm h-24 object-cover rounded border ${
                            product.photo == d
                              ? "border-2 border-red-500"
                              : "border-none"
                          }`}
                        />
                        <button
                          onClick={() => handleRemoveImage(0)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center p-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <button
                          onClick={() => {
                            dispatch(handleImageInProduct(d));
                          }}
                          className="absolute bottom-2 left-[38%] bg-gray text-green-800 rounded-full shadow-md p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                        >
                          <CircleCheckBig size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    );
                  })}
              </div>

              <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  multiple
                  className="hidden"
                />
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-xs text-gray-500">
                  Drag and drop an image here or click to upload.
                </p>
              </label>
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <span className="text-sm font-medium text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Options */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Product options</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Define the options for the product, e.g. color, size, etc.
                  </p>
                </div>
                <button
                  onClick={handleAddAttribute}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 font-medium"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {selected.map((attr, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          {attr.name === "" ? (
                            <select
                              onChange={(e) =>
                                handleAttributeSelect(
                                  idx,
                                  Number(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select attribute...
                              </option>
                              {availableAttributes
                                .filter(
                                  (a) => !selected.find((s) => s.id === a.id)
                                )
                                .map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.name}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={attr.name}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Values
                          </label>
                          <div className="space-y-2">
                            {attr && (
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search or add value..."
                                  value={dropdownStates[idx]?.searchTerm || ""}
                                  onChange={(e) =>
                                    updateSearchTerm(idx, e.target.value)
                                  }
                                  onFocus={() => toggleDropdown(idx)}
                                  className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const value =
                                        e.currentTarget.value.trim();
                                      if (value) {
                                        addCustomValue(idx, value);
                                      }
                                    } else if (e.key === "Escape") {
                                      closeDropdown(idx);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleDropdown(idx)}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:border-none focus:outline-none border-none hover:text-gray-600 bg-transparent"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>

                                {dropdownStates[idx]?.isOpen && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => closeDropdown(idx)}
                                    />
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                                      {(() => {
                                        const searchTerm =
                                          dropdownStates[
                                            idx
                                          ]?.searchTerm?.toLowerCase() || "";
                                        const availableValues =
                                          attr.possible_values?.filter(
                                            (val) =>
                                              !attr.selected_values?.includes(
                                                val
                                              ) &&
                                              val
                                                .toString()
                                                .toLowerCase()
                                                .includes(searchTerm)
                                          ) || [];

                                        const hasExactMatch =
                                          availableValues.some(
                                            (val) =>
                                              val.toString().toLowerCase() ===
                                              searchTerm
                                          );

                                        return (
                                          <>
                                            {availableValues.length > 0 && (
                                              <>
                                                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                                                  Existing Values
                                                </div>
                                                {availableValues.map(
                                                  (val, i) => (
                                                    <button
                                                      key={i}
                                                      type="button"
                                                      onClick={() =>
                                                        selectValue(
                                                          idx,
                                                          val.toString()
                                                        )
                                                      }
                                                      className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                    >
                                                      {val}
                                                    </button>
                                                  )
                                                )}
                                              </>
                                            )}

                                            {searchTerm && !hasExactMatch && (
                                              <>
                                                {availableValues.length > 0 && (
                                                  <div className="border-b" />
                                                )}
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    addCustomValue(
                                                      idx,
                                                      searchTerm
                                                    )
                                                  }
                                                  className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                                                >
                                                  <span className="text-blue-500">
                                                    +
                                                  </span>
                                                  Add "{searchTerm}"
                                                </button>
                                              </>
                                            )}

                                            {availableValues.length === 0 &&
                                              !searchTerm && (
                                                <div className="px-3 py-2 text-sm text-gray-500 italic">
                                                  No available values. Type to
                                                  add a new one.
                                                </div>
                                              )}
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {attr.selected_values &&
                              attr.selected_values.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded min-h-[42px] bg-white items-center">
                                  {attr.selected_values?.map((val, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                                    >
                                      {val}
                                      <button
                                        onClick={() =>
                                          handleRemoveValue(idx, val)
                                        }
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attr.is_variant_value || false}
                            onChange={() => {
                              dispatch(
                                handleCheckUncheck({
                                  idx: idx,
                                  type: "selected",
                                })
                              );
                            }}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          Use for variants
                        </label>
                        <button
                          onClick={() => handleRemoveAttribute(idx)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          × Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants Preview */}
            {variants.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Product variants</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This ranking will affect the variants' order in your
                    storefront.
                  </p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-gray-700">
                    <thead className="w-full bg-gray-50 border-b">
                      <tr>
                        <th className="w-8 p-3 text-left">
                          <input type="checkbox" defaultChecked />
                        </th>
                        {variants.length > 0 &&
                          Object.keys(variants[0].variations!).map((key) => {
                            const name = availableAttributes.find(
                              (d: any) => d.id == key
                            )?.name;
                            return (
                              <th
                                key={key}
                                className="p-3 text-left font-medium"
                              >
                                {name}
                              </th>
                            );
                          })}
                        <th className="p-3 text-left font-medium">Combined</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y w-full">
                      {variants.map((variant, idx) => {
                        const variantLabel = Object.values(variant.variations!)
                          .map((v) => v.value)
                          .join(" / ");

                        return (
                          <tr key={idx} className="">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={variant.checked}
                                onChange={() =>
                                  handlecheckanduncheckinproductvariantion(idx)
                                }
                              />
                            </td>

                            {Object.values(variant.variations!).map((v, i) => (
                              <td key={i} className="">
                                <p className="w-full px-2 py-1.5 text-sm">
                                  {v.value}
                                </p>
                              </td>
                            ))}

                            <td className="">
                              <p className="w-full px-2 py-1.5 text-sm">
                                {variantLabel}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Tip:</span> Variants left
                    unchecked won't be created. You can always create and edit
                    variants afterwards but this list fits the variations in
                    your product options.
                  </p>
                </div>
              </div>
            )}

            {/* Variants Configuration */}
            {variants.length > 0 && (
              <div className="bg-white rounded-lg border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold mb-2">
                    Configure Variants
                  </h3>
                  <p className="text-sm text-gray-500">
                    Set SKU, pricing, and inventory for each variant
                  </p>
                </div>

                <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      onChange={handleChangeInputOfRandomGen}
                      type="number"
                      name="stock"
                      placeholder="Enter Stock"
                      value={randomGen.stock || ""}
                      className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <input
                      onChange={handleChangeInputOfRandomGen}
                      type="number"
                      step="0.01"
                      name="price"
                      value={randomGen.price || ""}
                      placeholder="Enter Price $ 0.00"
                      className="w-38 px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() =>
                        handleGenerateRandomSKU(
                          stringofSKUGeneration,
                          randomGen
                        )
                      }
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                      Auto Generate
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">Bulk Actions</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          {selected
                            .filter((a) => a.is_variant_value)
                            .map((a) => a.name)
                            .join(" / ")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Image URL
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y bg-white">
                      {variants
                        .map((variant, realIndex) => ({ variant, realIndex }))
                        .filter(({ variant }) => variant.checked)
                        .map(({ variant, realIndex }) => {
                          const variantLabel = Object.values(
                            variant.variations!
                          )
                            .map((v) => v.value)
                            .join(" / ");

                          return (
                            <tr key={realIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {variantLabel}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={variantLabel}
                                  readOnly
                                  className="w-full px-2 py-1.5 border border-blue-200 bg-blue-50 rounded text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      realIndex,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                  placeholder="SKU"
                                  className={`w-28 px-2 py-1.5 border rounded text-sm ${
                                    !variant.sku || variant.sku.trim() === ""
                                      ? "border-red-300 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-blue-500"
                                  }`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={
                                    variant.stock != null ? variant.stock : 0
                                  }
                                  onChange={(e) =>
                                    handleVariantChange(
                                      realIndex,
                                      "stock",
                                      Number(e.target.value)
                                    )
                                  }
                                  placeholder="0"
                                  className={`w-20 px-2 py-1.5 border rounded text-sm ${
                                    variant.stock === null ||
                                    variant.stock === undefined ||
                                    variant.stock < 0
                                      ? "border-red-300 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-blue-500"
                                  }`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={variant.price || ""}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        realIndex,
                                        "price",
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="0.00"
                                    className={`w-24 px-2 py-1.5 border rounded text-sm ${
                                      variant.price === null ||
                                      variant.price === undefined ||
                                      variant.price < 0
                                        ? "border-red-300 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {/* <div className="flex items-center gap-2">
                                  {variant.image_url && (
                                    <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={variant.image_url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <input
                                    type="text"
                                    value={variant.image_url}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        realIndex,
                                        "image_url",
                                        e.target.value
                                      )
                                    }
                                    placeholder="https://..."
                                    className="flex-1 min-w-[150px] px-2 py-1.5 border border-gray-300 rounded text-sm"
                                  />
                                </div> */}
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0 relative">
                                    {variant.image_url ? (
                                      <img
                                        src={variant.image_url}
                                        alt="Variant"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                        No Image
                                      </div>
                                    )}
                                  </div>

                                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 border border-gray-300 rounded transition">
                                    Upload
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        handleFileUpload(
                                          e,
                                          "Variant",
                                          realIndex
                                        );
                                      }}
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Organize */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Organize</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="material_segment_id"
                    value={String(product.material_segment_id) || ""}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${
                      !product.material_segment_id
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select Segment</option>
                    {segments.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {!product.material_segment_id && (
                    <p className="text-red-500 text-xs mt-1">
                      Material segment is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="product_category_id"
                    value={String(product.product_category_id) || ""}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${
                      !product.product_category_id
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select category</option>
                    {category.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {!product.product_category_id && (
                    <p className="text-red-500 text-xs mt-1">
                      Product category is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brands <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand_id"
                    value={String(product.brand_id) || ""}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${
                      !product.brand_id
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select Brand</option>
                    {brand.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {!product.brand_id && (
                    <p className="text-red-500 text-xs mt-1">
                      Brand is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags <span className="text-gray-400">Optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Add tags..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAddEditPage;
