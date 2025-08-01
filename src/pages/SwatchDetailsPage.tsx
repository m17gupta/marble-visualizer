import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CopyIcon,
  Layers,
  Pencil,
  Save,
  ChevronDown,
  X,
  Package,
  Palette,
  Clock,
  Ruler,
  Weight,
  Eye,
  Info,
  Edit3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { RootState } from "@/redux/store";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Cross2Icon } from "@radix-ui/react-icons";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  sku?: string;
  brand_id?: number;
  product_category_id?: number;
  product_attribute_set_id?: number;
  image_url?: string | null;
  is_available?: boolean;
  created_at: string;
}

interface AttributeValue {
  id: number;
  product_id: number;
  attribute_id: {
    id: number;
    name: string;
    unit: string | null;
  };
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  value_multiple: string[] | null;
}

// Get icon for attribute based on name
const getAttributeIcon = (attributeName: string) => {
  const name = attributeName.toLowerCase();
  if (name.includes("color") || name.includes("finish")) return Palette;
  if (name.includes("time") || name.includes("dry")) return Clock;
  if (name.includes("weight")) return Weight;
  if (
    name.includes("length") ||
    name.includes("width") ||
    name.includes("thickness") ||
    name.includes("coverage")
  )
    return Ruler;
  return Info;
};

// Get color class for attribute based on name
const getAttributeColor = (attributeName: string) => {
  const name = attributeName.toLowerCase();
  if (name.includes("color"))
    return "bg-gradient-to-r from-pink-500 to-rose-500";
  if (name.includes("finish"))
    return "bg-gradient-to-r from-purple-500 to-indigo-500";
  if (name.includes("time") || name.includes("dry"))
    return "bg-gradient-to-r from-blue-500 to-cyan-500";
  if (name.includes("weight"))
    return "bg-gradient-to-r from-gray-500 to-slate-500";
  if (name.includes("coverage"))
    return "bg-gradient-to-r from-green-500 to-emerald-500";
  return "bg-gradient-to-r from-amber-500 to-orange-500";
};

// Searchable Combobox Component for editing arrays
interface ArrayValueEditorProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  attributeName?: string;
  attributeId?: number;
}

const ArrayValueEditor: React.FC<ArrayValueEditorProps> = ({
  value,
  onChange,
  placeholder = "Add values...",
  attributeName = "",
  attributeId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddValue = async () => {
    if (searchTerm.trim() && !value.includes(searchTerm.trim())) {
      onChange([...value, searchTerm.trim()]);
      const { data, error } = await supabase
        .from("product_attributes")
        .select()
        .eq("id", attributeId)
        .single();
      if (
        data.possible_values !== null &&
        !data.possible_values.includes(searchTerm.trim())
      ) {
        data.possible_values.push(searchTerm.trim());
        const { error } = await supabase
          .from("product_attributes")
          .update({ possible_values: data.possible_values })
          .eq("id", attributeId);

        if (!error) {
          toast.success("Success");
        }
      }
      setSearchTerm("");
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const isColorAttribute = attributeName.toLowerCase().includes("color");

  return (
    <div className="space-y-3">
      {/* Display current values as tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((val, index) => (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              key={index}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                isColorAttribute
                  ? "bg-gray-100 text-gray-800 border border-gray-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              } transition-all hover:shadow-sm`}
            >
              {isColorAttribute && (
                <div
                  className="w-3 h-3 rounded-full mr-2 border border-white shadow-sm"
                  style={{ backgroundColor: val }}
                />
              )}
              {val}
              <button
                type="button"
                onClick={() => handleRemoveValue(val)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Input for adding new values */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {searchTerm.trim() && (
          <button
            type="button"
            onClick={handleAddValue}
            className="absolute right-2 top-1.5 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

// Component to display array values as select options (read-only)
interface ArrayValueDisplayProps {
  values: string[];
  attributeName?: string;
}

const ArrayValueDisplay: React.FC<ArrayValueDisplayProps> = ({
  values,
  attributeName = "",
}) => {
  const [selectedValue, setSelectedValue] = useState(values[0] || "");
  const isColorAttribute = attributeName.toLowerCase().includes("color");

  return (
    <div className="space-y-2">
      <select
        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        {values.map((val, index) => (
          <option key={index} value={val}>
            {val}
          </option>
        ))}
      </select>

      {/* Show all values as chips below */}
      <div className="flex flex-wrap gap-2">
        {values.map((val, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              val === selectedValue
                ? "bg-blue-100 text-blue-800 ring-2 ring-blue-200"
                : "bg-gray-100 text-gray-600"
            } transition-all`}
          >
            {isColorAttribute && (
              <div
                className="w-2.5 h-2.5 rounded-full mr-1.5 border border-white shadow-sm"
                style={{ backgroundColor: val }}
              />
            )}
            {val}
          </span>
        ))}
      </div>
    </div>
  );
};

export function SwatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.userProfile);
  const [currentSwatch, setCurrentSwatch] = useState<Product | null>(null);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaterialById = async (id: number) => {
      setLoading(true);
      const { data: products, error } = await supabase
        .from("products")
        .select(`*`)
        .eq("id", id)
        .single();

      if (error) {
        setError("Product not found");
      } else {
        const { data, error } = await supabase
          .from("product_attribute_values")
          .select(`*,attribute_id(id,name,unit)`)
          .eq("product_id", id);

        if (error) {
          toast.message("Not Found Attributes");
        }
        setAttributeValues(data || []);
        setCurrentSwatch(products);
      }
      setLoading(false);
    };

    if (id) fetchMaterialById(id);
  }, [id]);

  const handleCopyProduct = async () => {
    let copied = { ...currentSwatch };
    delete copied.id;
    copied.sku = `sku${Date.now()}`;
    const { data, error } = await supabase
      .from("products")
      .insert(copied)
      .select();
    if (!error) {
      toast.success("Product copied successfully!");
    } else {
      toast.error("Failed to copy product");
    }
  };

  const handleSaveChanges = async () => {
    const id = currentSwatch?.id;
    const copied = { ...currentSwatch };
    console.log(copied);
    delete copied.id;
    const { data, error } = await supabase
      .from("products")
      .update(copied)
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setCurrentSwatch(data as Product);
      const finalArray = [];
      for (const update of attributeValues) {
        const id = update.id;
        const { data, error } = await supabase
          .from("product_attribute_values")
          .update({
            value_number: update.value_number,
            value_boolean: update.value_boolean,
            value_multiple: update.value_multiple,
            value_text: update.value_text,
          })
          .eq("id", id)
          .select(`*,attribute_id(id,name,unit)`)
          .single();

        finalArray.push(data);
      }
      setAttributeValues(finalArray);
      toast.success("Changes saved");
      setIsEditing(false);
    } else {
      toast.error("Failed to Update the Product");
    }
  };

  const handleFieldChange = (field: keyof Product, value: string) => {
    setCurrentSwatch((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAttributeChange = (
    value: string | string[] | number | boolean,
    attrId: number
  ) => {
    setAttributeValues((prev) =>
      prev.map((attr) => {
        if (attr.attribute_id.id === attrId) {
          const updated = { ...attr };
          if (Array.isArray(value)) {
            updated.value_multiple = value;
          } else if (typeof value === "string") {
            updated.value_text = value;
          } else if (typeof value === "number") {
            updated.value_number = value;
          } else if (typeof value === "boolean") {
            updated.value_boolean = value;
          }
          return updated;
        }
        return attr;
      })
    );
  };

  const getValue = (attr: AttributeValue) => {
    if (attr.value_multiple) return attr.value_multiple;
    if (attr.value_text) return attr.value_text;
    if (attr.value_number !== null) return attr.value_number;
    if (attr.value_boolean !== null) return attr.value_boolean;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-60 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentSwatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Product not found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/swatchbook")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/swatchbook")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Products</span>
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleCopyProduct}
              variant="ghost"
              className="bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 transition-all"
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              Duplicate
            </Button>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all transform hover:scale-105"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {isEditing ? (
                            <input
                              type="text"
                              value={currentSwatch.name}
                              onChange={(e) =>
                                handleFieldChange("name", e.target.value)
                              }
                              className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg px-4 py-2 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
                              placeholder="Product name"
                            />
                          ) : (
                            currentSwatch.name
                          )}
                        </CardTitle>
                        <p className="text-blue-100 text-sm mt-1">
                          SKU: {currentSwatch.sku || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-white/20 text-white border-white/30">
                        ID: {currentSwatch.id}
                      </Badge>
                      {currentSwatch.is_available ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white">
                          <XCircle className="h-3 w-3 mr-1" />
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {currentSwatch.image_url && (
                  <div className="relative">
                    <img
                      src={currentSwatch.image_url}
                      alt="Product"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <CardContent className="p-6">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Description
                  </Label>
                  {isEditing ? (
                    <textarea
                      value={currentSwatch.description || ""}
                      onChange={(e) =>
                        handleFieldChange("description", e.target.value)
                      }
                      className="w-full p-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={4}
                      placeholder="Enter product description..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {currentSwatch.description || "No description available."}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Attributes Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Layers className="h-6 w-6 mr-3 text-blue-600" />
                    Product Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {attributeValues.map((attr) => {
                      const value = getValue(attr);
                      const IconComponent = getAttributeIcon(
                        attr.attribute_id.name
                      );
                      const colorClass = getAttributeColor(
                        attr.attribute_id.name
                      );
                      const isArrayValue = Array.isArray(value);

                      return (
                        <motion.div
                          key={attr.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="relative group"
                        >
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:border-gray-200">
                            <div className="flex items-center mb-4">
                              <div
                                className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center mr-3 shadow-sm`}
                              >
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <Label className="text-sm font-semibold text-gray-800">
                                  {attr.attribute_id.name}
                                </Label>
                                {attr.attribute_id.unit && (
                                  <p className="text-xs text-gray-500">
                                    Unit: {attr.attribute_id.unit}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {isEditing ? (
                                <>
                                  {isArrayValue ? (
                                    <ArrayValueEditor
                                      value={value as string[]}
                                      onChange={(newValues) =>
                                        handleAttributeChange(
                                          newValues,
                                          attr.attribute_id.id
                                        )
                                      }
                                      attributeId={attr.attribute_id.id}
                                      placeholder={`Add ${attr.attribute_id.name.toLowerCase()}...`}
                                      attributeName={attr.attribute_id.name}
                                    />
                                  ) : typeof value === "boolean" ? (
                                    <select
                                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                      value={value ? "true" : "false"}
                                      onChange={(e) =>
                                        handleAttributeChange(
                                          e.target.value === "true",
                                          attr.attribute_id.id
                                        )
                                      }
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  ) : typeof value === "number" ? (
                                    <input
                                      type="number"
                                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                      value={value || ""}
                                      onChange={(e) =>
                                        handleAttributeChange(
                                          parseFloat(e.target.value) || 0,
                                          attr.attribute_id.id
                                        )
                                      }
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                      value={(value as string) || ""}
                                      onChange={(e) =>
                                        handleAttributeChange(
                                          e.target.value,
                                          attr.attribute_id.id
                                        )
                                      }
                                    />
                                  )}
                                </>
                              ) : (
                                <>
                                  {isArrayValue ? (
                                    <ArrayValueDisplay
                                      values={value as string[]}
                                      attributeName={attr.attribute_id.name}
                                    />
                                  ) : typeof value === "boolean" ? (
                                    <div
                                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                        value
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {value ? (
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                      ) : (
                                        <XCircle className="h-4 w-4 mr-1" />
                                      )}
                                      {value ? "Yes" : "No"}
                                    </div>
                                  ) : (
                                    <div className="text-lg font-semibold text-gray-800">
                                      {value}{" "}
                                      {attr.attribute_id.unit && (
                                        <span className="text-sm text-gray-500 font-normal">
                                          {attr.attribute_id.unit}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Product ID</span>
                    <Badge variant="secondary">{currentSwatch.id}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Brand ID</span>
                    <Badge variant="secondary">
                      {currentSwatch.brand_id || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Category ID</span>
                    <Badge variant="secondary">
                      {currentSwatch.product_category_id || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(currentSwatch.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-2">
                <CardContent className="p-0">
                  <img
                    src={
                      currentSwatch.image_url ||
                      "https://images.unsplash.com/photo-1523895665936-7bfe172b757d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt="Product"
                    className="w-full h-auto rounded-md object-cover"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Eye className="h-5 w-5 mr-2" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Total Attributes</span>
                    <span className="text-2xl font-bold">
                      {attributeValues.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Array Attributes</span>
                    <span className="text-2xl font-bold">
                      {
                        attributeValues.filter((attr) =>
                          Array.isArray(getValue(attr))
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Numeric Values</span>
                    <span className="text-2xl font-bold">
                      {
                        attributeValues.filter(
                          (attr) => typeof getValue(attr) === "number"
                        ).length
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions Card */}
            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-all"
                    onClick={() => window.print()}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Print Details
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-all"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(currentSwatch, null, 2)
                      )
                    }
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy JSON
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 transition-all"
                    onClick={() => {
                      const data = {
                        product: currentSwatch,
                        attributes: attributeValues,
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `product-${currentSwatch.id}-export.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </motion.div> */}
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200"
        >
          <p>
            Product created on{" "}
            <span className="font-medium text-gray-700">
              {new Date(currentSwatch.created_at).toLocaleString()}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
