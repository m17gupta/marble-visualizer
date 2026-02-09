import React, { useEffect, useState } from "react";
import { X, Upload, CircleCheckBig } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  adminProductSave,
  // adminProductSave,
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
import { AddMaterialModel } from "./AddMaterialModel";
import { adminFetchMaterialSegments } from "@/AdminPannel/reduxslices/adminMaterialSegment";

interface autogenModal {
  price: null | number;
  stock: null | number;
}

const MarbleColors = [
  { label: "Beige", value: "beige" },
  { label: "Black", value: "black" },
  { label: "Brown", value: "brown" },
  { label: "Green", value: "green" },
  { label: "Grey", value: "grey" },
  { label: "Red", value: "red" },
  { label: "White", value: "white" },
  { label: "Yellow", value: "yellow" }
];

const MarbleCountries = [
  { label: "China", value: "china" },
  { label: "Egypt", value: "egypt" },
  { label: "Greece", value: "greece" },
  { label: "India", value: "india" },
  { label: "Iran", value: "iran" },
  { label: "Italy", value: "italy" },
  { label: "Oman", value: "oman" },
  { label: "Pakistan", value: "pakistan" },
  { label: "Spain", value: "spain" },
  { label: "Turkey", value: "turkey" },
  { label: "Vietnam", value: "vietnam" }
];


const AddMateraiForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Track touched state for required fields
  const [touched, setTouched] = useState({
    title: false,
    basic_price: false,
    segment_type: false,
    category: false,
    color: false,
    origin_country: false,
  });
  const {
    product,
    error,
    loading,
    selected,
    variant: variants,
    availableAttributes,

    brand,
    segments,
  } = useSelector((state: RootState) => state.materialsdetails);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const handleOpenImport = () => {
    setIsImportOpen((prev) => !prev);
  };


  const { list: SegmentList, isFetchedSegment } = useSelector((state: RootState) => state.adminMaterialSegmemt);

  const [material, setMaterial] = useState<AddMaterialModel>({
    title: "",
    basic_price: null,
    description: "",
    media: "",
    segment_type: "",
    category: "",
    color: "",
    origin_country: "",
    finish_type: "",
    polished: false,
    thickness: "",
    size: "",
    weight: null,
    density: null,
  })
  const [category, setCategory] = useState<string[]>([]);

  console.log("material", material);
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

  // update the material segmnet 
  useEffect(() => {
    if (!isFetchedSegment) {
      dispatch(adminFetchMaterialSegments({ orderby: "id", order: "desc" }));
    }
  }, [SegmentList, isFetchedSegment]);

  const handleProductChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    console.log("name", name);
    console.log("value", value);
    console.log("type", type);
    setMaterial(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value
    }));

    if (name === "segment_type") {
      const selectedSegment = SegmentList.find((item) => item.name === value);
      const categoriesList = selectedSegment?.categories || [];

      console.log("selected categories", categoriesList);
      setCategory([...categoriesList]);

      // Reset material category when segment changes
      setMaterial(prev => ({
        ...prev,
        category: ""
      }));
    }
  };

  // Mark field as touched on key up
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.currentTarget;
    setTouched((prev) => ({ ...prev, [name]: true }));
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
      if (t.length > 0) {
        setMaterial(prev => ({ ...prev, media: t[0] }));
      }
      dispatch(handleuploadInUploadImages(t));
      setUploadProgress(0);
    } else {
      let url = await handleUploadToS3(file!?.[0]);
      dispatch(handleFileUploadInSlice({ imageUrl: url, index: index }));
      setUploadProgress(0);
    }
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
        console.log("image uploaded url", url)
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

  const handleAddValue = (attrIdx: number, value: string) => {
    dispatch(handleAddValueInSlice({ attrIdx, value }));
  };

  const handleRemoveValue = (attrIdx: number, value: string | number) => {
    dispatch(handleRemoveValueInSlice({ attrIdx, value }));
  };


  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    // Validate required details fields
    if (!material.title || material.title.trim() === "") {
      errors.push("Product name is required");
    }

    if (!material.segment_type) {
      errors.push("Material segment is required");
    }

    if (!material.category) {
      errors.push("Product category is required");
    }

    if (!material.color) {
      errors.push("Color is required");
    }

    if (material.basic_price === null || material.basic_price === undefined || material.basic_price < 0) {
      errors.push("Valid base price is required");
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
      const resposne = await dispatch(
        adminProductSave(material)
      ).unwrap();

      toast.success("Product saved successfully!", {
        description: "Your product has been saved with all variants.",
        duration: 3000,
      });
      navigate("/admin/materials");
    } catch (error) {
      toast.error("Failed to save product", {
        description:
          "Please try again or contact support if the problem persists.",
        duration: 4000,
      });
    }
  };


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
                    name="title"
                    value={material.title || ""}
                    onChange={handleProductChange}
                    onKeyUp={handleKeyUp}
                    placeholder="e.g. Carrara Marble"
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${(!material.title || material.title.trim() === "") && touched.title
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {(!material.title || material.title.trim() === "") && touched.title && (
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
                    onKeyUp={handleKeyUp}
                    type="number"
                    step="0.01"
                    name="basic_price"
                    value={material?.basic_price || ""}
                    placeholder="Enter Price $ 0.00"
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${(!material?.basic_price) && touched.basic_price
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {(!material.basic_price) && touched.basic_price && (
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
                    value={material?.description || ""}
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
                {material.media && (
                  <div className="relative group inline-block">
                    <img
                      src={material.media}
                      alt="Product image"
                      className="w-24 h-24 object-cover rounded border border-gray-300"
                    />
                    <button
                      onClick={() => setMaterial(prev => ({ ...prev, media: "" }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center p-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-xs text-gray-500">
                  {isUploading ? `Uploading... ${uploadProgress}%` : "Click to upload material image"}
                </p>
              </label>
            </div>



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
                    name="segment_type"
                    value={material.segment_type || ""}
                    onChange={handleProductChange}
                    onKeyUp={handleKeyUp}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${!material.segment_type && touched.segment_type
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="">Select Segment</option>
                    {SegmentList.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {!material.segment_type && touched.segment_type && (
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
                    name="category"
                    value={material.category || ""}
                    onChange={handleProductChange}
                    onKeyUp={handleKeyUp}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${!material.category && touched.category
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="">Select category</option>
                    {category.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {!material.category && touched.category && (
                    <p className="text-red-500 text-xs mt-1">
                      Product category is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="color"
                    value={material.color || ""}
                    onChange={handleProductChange}
                    onKeyUp={handleKeyUp}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${!material.color && touched.color
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="">Select Color</option>
                    {MarbleColors.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {!material.color && touched.color && (
                    <p className="text-red-500 text-xs mt-1">
                      Color is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin Country
                  </label>
                  <select
                    name="origin_country"
                    value={material.origin_country || ""}
                    onChange={handleProductChange}
                    onKeyUp={handleKeyUp}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm ${!material.origin_country && touched.origin_country
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="">Select Color</option>
                    {MarbleCountries.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={material.size || ""}
                    onChange={handleProductChange}
                    placeholder="e.g. 24x24"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Finish Type
                  </label>
                  <input
                    type="text"
                    name="finish_type"
                    value={material.finish_type || ""}
                    onChange={handleProductChange}
                    placeholder="e.g. Polished"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thickness
                  </label>
                  <input
                    type="text"
                    name="thickness"
                    value={material.thickness || ""}
                    onChange={handleProductChange}
                    placeholder="e.g. 20mm"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="polished"
                    name="polished"
                    checked={material.polished || false}
                    onChange={(e) => setMaterial(prev => ({ ...prev, polished: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="polished" className="text-sm font-medium text-gray-700">
                    Polished
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={material.weight || ""}
                      onChange={handleProductChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Density
                    </label>
                    <input
                      type="number"
                      name="density"
                      value={material.density || ""}
                      onChange={handleProductChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMateraiForm;
