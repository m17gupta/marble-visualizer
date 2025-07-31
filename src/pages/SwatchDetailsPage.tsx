// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import { motion } from "framer-motion";
// // import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { ArrowLeft, CopyIcon, Layers, Pencil, Save } from "lucide-react";
// // import { RootState } from "@/redux/store";
// // import { supabase } from "@/lib/supabase";
// // import { toast } from "sonner";

// // interface Product {
// //   id: number;
// //   title: string;
// //   description?: string | null;
// //   sku?: string;
// //   material_subcategory_id?: number;
// //   brand_id?: number;
// //   image_url?: string | null;
// //   is_available: boolean;
// //   created_at: string;
// //   attribute_values: Variant[];
// // }

// // interface Variant {
// //   groupname: string;
// //   attributevalues: {
// //     value: string;
// //     metadata: {
// //       id: number;
// //       name: string;
// //       unit_id: number | null;
// //       input_type: string;
// //       material_subcategory_id: {
// //         id: number;
// //         name: string;
// //       };
// //     };
// //   }[];
// //   image_url?: string;
// //   price?: number;
// // }

// // export function SwatchDetailsPage() {
// //   const params = useParams<{ id: string }>();
// //   const id = params.id ? parseInt(params.id) : 0;
// //   const navigate = useNavigate();
// //   const { profile } = useSelector((state: RootState) => state.userProfile);

// //   const [currentSwatch, setCurrentSwatch] = useState<Product | null>(null);
// //   const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [isEditing, setIsEditing] = useState<boolean>(false);

// //   useEffect(() => {
// //     const fetchMaterialById = async (id: number) => {
// //       setLoading(true);
// //       const { data, error } = await supabase
// //         .from("products")
// //         .select("*")
// //         .eq("id", id)
// //         .single();

// //       if (error) {
// //         setError("Swatch not found");
// //       } else {
// //         setCurrentSwatch(data);
// //         setSelectedVariantIndex(0);
// //       }
// //       setLoading(false);
// //     };

// //     if (id) fetchMaterialById(id);
// //   }, [id]);

// //   console.log(currentSwatch);

// //   const handleCopyProduct = async () => {
// //     let copied = { ...currentSwatch };
// //     delete copied.id;
// //     copied.sku = `sku${Date.now()}`;
// //     const { data, error } = await supabase
// //       .from("products")
// //       .insert(copied)
// //       .select();
// //     if (!error) {
// //       toast.success("Product copied successfully!");
// //     } else {
// //       toast.error("Failed to copy product");
// //     }
// //   };

// //   const handleSaveChanges = async () => {
// //     const id = currentSwatch?.id;
// //     const copied = { ...currentSwatch };
// //     delete copied.id;
// //     const { data, error } = await supabase
// //       .from("products")
// //       .update(copied)
// //       .eq("id", id)
// //       .select()
// //       .single();
// //     if (!error) {
// //       setCurrentSwatch(data as Product);
// //       toast.success("Changes saved");
// //       setIsEditing(false);
// //     } else {
// //       toast.error("Failed to Update the Product");
// //     }
// //   };

// //   const handleFieldChange = (field: keyof Product, value: string) => {
// //     setCurrentSwatch((prev) => (prev ? { ...prev, [field]: value } : prev));
// //   };

// //   console.log(currentSwatch);

// //   const handleAttributeChange = async (value: string, index: number) => {
// //     const updatedSwatch = { ...currentSwatch };

// //     updatedSwatch.attribute_values?.[selectedVariantIndex]?.attributevalues?.[
// //       index
// //     ] &&
// //       (updatedSwatch.attribute_values[selectedVariantIndex].attributevalues[
// //         index
// //       ].value = value);

// //     setCurrentSwatch(updatedSwatch as Product);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="space-y-6 p-6">
// //         <Skeleton className="h-10 w-48" />
// //         <Skeleton className="h-6 w-80" />
// //         <Skeleton className="h-60 w-full rounded-xl" />
// //         <Skeleton className="h-4 w-full" />
// //       </div>
// //     );
// //   }

// //   if (error || !currentSwatch) {
// //     return (
// //       <div className="text-center py-12">
// //         <h2 className="text-2xl font-bold mb-4">Swatch not found</h2>
// //         <p className="text-muted-foreground mb-6">
// //           The swatch you're looking for doesn't exist or has been removed.
// //         </p>
// //         <Button onClick={() => navigate("/swatchbook")}>
// //           <ArrowLeft className="h-4 w-4 mr-2" />
// //           Back to SwatchBook
// //         </Button>
// //       </div>
// //     );
// //   }

// //   const variants = currentSwatch.attribute_values;
// //   const selectedVariant = variants[selectedVariantIndex];

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.4 }}
// //       className="space-y-6 p-6"
// //     >
// //       <div className="flex items-center justify-between">
// //         <Button
// //           variant="ghost"
// //           onClick={() => navigate("/app/swatchbook")}
// //           className="flex items-center space-x-2"
// //         >
// //           <ArrowLeft className="h-4 w-4" />
// //           <span>Back to Materials</span>
// //         </Button>

// //         <div className="flex gap-2">
// //           <Button onClick={handleCopyProduct} variant="ghost">
// //             <CopyIcon className="h-4 w-4 mr-1" />
// //             Copy Product
// //           </Button>

// //           {!isEditing ? (
// //             <Button onClick={() => setIsEditing(true)} variant="outline">
// //               <Pencil className="h-4 w-4 mr-1" />
// //               Edit
// //             </Button>
// //           ) : (
// //             <Button onClick={handleSaveChanges} variant="default">
// //               <Save className="h-4 w-4 mr-1" />
// //               Save
// //             </Button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Product Header */}
// //       <Card className="overflow-hidden">
// //         <CardHeader>
// //           <CardTitle className="text-2xl font-bold">
// //             {isEditing ? (
// //               <input
// //                 type="text"
// //                 value={currentSwatch.title}
// //                 onChange={(e) => handleFieldChange("title", e.target.value)}
// //                 className="w-full p-2 border rounded text-lg"
// //               />
// //             ) : (
// //               currentSwatch.title
// //             )}
// //           </CardTitle>
// //           <p className="text-sm text-muted-foreground mt-1">
// //             SKU: {currentSwatch.sku || "N/A"}
// //           </p>
// //         </CardHeader>

// //         {(currentSwatch.image_url || selectedVariant?.image_url) && (
// //           <img
// //             src={selectedVariant.image_url || currentSwatch.image_url!}
// //             alt="Material"
// //             className="w-full h-64 object-cover"
// //           />
// //         )}

// //         <CardContent>
// //           <Label className="text-muted-foreground text-sm">Description</Label>
// //           {isEditing ? (
// //             <textarea
// //               value={currentSwatch.description || ""}
// //               onChange={(e) => handleFieldChange("description", e.target.value)}
// //               className="w-full mt-1 p-2 border rounded text-sm"
// //               rows={3}
// //             />
// //           ) : (
// //             <p className="text-sm mt-1">
// //               {currentSwatch.description || "No description available."}
// //             </p>
// //           )}
// //         </CardContent>
// //       </Card>

// //       {/* Variant Selector */}
// //       {variants.length > 1 && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center">
// //               <Layers className="h-5 w-5 mr-2" />
// //               Select Variant
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <Select
// //               value={selectedVariantIndex.toString()}
// //               onValueChange={(value) => setSelectedVariantIndex(Number(value))}
// //             >
// //               <SelectTrigger className="w-full md:w-1/2">
// //                 <SelectValue placeholder="Select Variant" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 {variants.map((variant, index) => (
// //                   <SelectItem key={index} value={index.toString()}>
// //                     Variant #{index + 1}{" "}
// //                     {variant.price ? ` - ₹${variant.price}` : ""}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Selected Variant Details */}
// //       <Card className="bg-muted/50">
// //         <CardHeader>
// //           <CardTitle className="flex justify-between items-center">
// //             Variant #{selectedVariantIndex + 1}
// //             {selectedVariant.price && (
// //               <Badge className="text-sm">₹{selectedVariant.price}</Badge>
// //             )}
// //           </CardTitle>
// //         </CardHeader>

// //         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //           {selectedVariant.attributevalues.map((attr, i) => {
// //             const value = attr.value;
// //             const name = attr.metadata.name;

// //             if (value.includes(",")) {
// //               const options = value.split(",").map((opt) => opt.trim());
// //               return (
// //                 <div key={i}>
// //                   <Label className="text-sm text-muted-foreground">
// //                     {name}
// //                   </Label>
// //                   <select
// //                     disabled={!isEditing}
// //                     className="w-full mt-1 border rounded p-1 text-sm"
// //                     value={value}
// //                     onChange={(e) =>
// //                       isEditing && handleAttributeChange(e.target.value, i)
// //                     }
// //                   >
// //                     {options.map((opt, idx) => (
// //                       <option key={idx} value={opt}>
// //                         {opt}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               );
// //             }

// //             return (
// //               <div key={i}>
// //                 <Label className="text-sm text-muted-foreground">{name}</Label>
// //                 {isEditing ? (
// //                   <input
// //                     className="w-full mt-1 border rounded p-1 text-sm"
// //                     value={value}
// //                     onChange={(e) => handleAttributeChange(e.target.value, i)}
// //                   />
// //                 ) : (
// //                   <div className="text-sm mt-1">{value}</div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </CardContent>
// //       </Card>
// //     </motion.div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   ArrowLeft,
//   CopyIcon,
//   Layers,
//   Pencil,
//   Save,
//   ChevronDown,
//   X,
// } from "lucide-react";
// import { RootState } from "@/redux/store";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// interface Product {
//   id: number;
//   title: string;
//   description?: string | null;
//   sku?: string;
//   material_subcategory_id?: number;
//   brand_id?: number;
//   image_url?: string | null;
//   is_available: boolean;
//   created_at: string;
//   attribute_values: Variant[];
// }

// interface Variant {
//   groupname: string;
//   attributevalues: {
//     value: string | string[];
//     metadata: {
//       id: number;
//       name: string;
//       unit_id: number | null;
//       input_type: string;
//       attribute_type?: string;
//       material_subcategory_id: {
//         id: number;
//         name: string;
//       };
//     };
//   }[];
//   image_url?: string;
//   price?: number;
// }

// // Searchable Combobox Component for editing arrays
// interface ArrayValueEditorProps {
//   value: string[];
//   onChange: (values: string[]) => void;
//   placeholder?: string;
// }

// const ArrayValueEditor: React.FC<ArrayValueEditorProps> = ({
//   value,
//   onChange,
//   placeholder = "Add values...",
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleAddValue = () => {
//     if (searchTerm.trim() && !value.includes(searchTerm.trim())) {
//       onChange([...value, searchTerm.trim()]);
//       setSearchTerm("");
//       setIsOpen(false);
//     }
//   };

//   const handleRemoveValue = (valueToRemove: string) => {
//     onChange(value.filter((v) => v !== valueToRemove));
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddValue();
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {/* Display current values as tags */}
//       {value.length > 0 && (
//         <div className="flex flex-wrap gap-1">
//           {value.map((val, index) => (
//             <span
//               key={index}
//               className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//             >
//               {val}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveValue(val)}
//                 className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Input for adding new values */}
//       <div className="relative">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder={placeholder}
//           className="w-full border border-gray-300 px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         {searchTerm.trim() && (
//           <button
//             type="button"
//             onClick={handleAddValue}
//             className="absolute right-2 top-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
//           >
//             Add
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Component to display array values as select options (read-only)
// interface ArrayValueDisplayProps {
//   values: string[];
// }

// const ArrayValueDisplay: React.FC<ArrayValueDisplayProps> = ({ values }) => {
//   return (
//     <select
//       disabled
//       className="w-full mt-1 border rounded p-1 text-sm bg-gray-100"
//       value=""
//     >
//       <option value="" disabled>
//         {values.length} option{values.length !== 1 ? "s" : ""} available
//       </option>
//       {values.map((val, index) => (
//         <option key={index} value={val}>
//           {val}
//         </option>
//       ))}
//     </select>
//   );
// };

// export function SwatchDetailsPage() {
//   const params = useParams<{ id: string }>();
//   const id = params.id ? parseInt(params.id) : 0;
//   const navigate = useNavigate();
//   const { profile } = useSelector((state: RootState) => state.userProfile);

//   const [currentSwatch, setCurrentSwatch] = useState<Product | null>(null);
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchMaterialById = async (id: number) => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         setError("Swatch not found");
//       } else {
//         setCurrentSwatch(data);
//         setSelectedVariantIndex(0);
//       }
//       setLoading(false);
//     };

//     if (id) fetchMaterialById(id);
//   }, [id]);

//   console.log(currentSwatch);

//   const handleCopyProduct = async () => {
//     let copied = { ...currentSwatch };
//     delete copied.id;
//     copied.sku = `sku${Date.now()}`;
//     const { data, error } = await supabase
//       .from("products")
//       .insert(copied)
//       .select();
//     if (!error) {
//       toast.success("Product copied successfully!");
//     } else {
//       toast.error("Failed to copy product");
//     }
//   };

//   const handleSaveChanges = async () => {
//     const id = currentSwatch?.id;
//     const copied = { ...currentSwatch };
//     delete copied.id;
//     const { data, error } = await supabase
//       .from("products")
//       .update(copied)
//       .eq("id", id)
//       .select()
//       .single();
//     if (!error) {
//       setCurrentSwatch(data as Product);
//       toast.success("Changes saved");
//       setIsEditing(false);
//     } else {
//       toast.error("Failed to Update the Product");
//     }
//   };

//   const handleFieldChange = (field: keyof Product, value: string) => {
//     setCurrentSwatch((prev) => (prev ? { ...prev, [field]: value } : prev));
//   };

//   const handleAttributeChange = (value: string | string[], index: number) => {
//     if (!currentSwatch) return;

//     const updatedSwatch = { ...currentSwatch };
//     const attributeValues = [...updatedSwatch.attribute_values];
//     const selectedVariant = { ...attributeValues[selectedVariantIndex] };
//     const attributeValuesList = [...selectedVariant.attributevalues];

//     attributeValuesList[index] = {
//       ...attributeValuesList[index],
//       value: value,
//     };

//     selectedVariant.attributevalues = attributeValuesList;
//     attributeValues[selectedVariantIndex] = selectedVariant;
//     updatedSwatch.attribute_values = attributeValues;

//     setCurrentSwatch(updatedSwatch);
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6 p-6">
//         <Skeleton className="h-10 w-48" />
//         <Skeleton className="h-6 w-80" />
//         <Skeleton className="h-60 w-full rounded-xl" />
//         <Skeleton className="h-4 w-full" />
//       </div>
//     );
//   }

//   if (error || !currentSwatch) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold mb-4">Swatch not found</h2>
//         <p className="text-muted-foreground mb-6">
//           The swatch you're looking for doesn't exist or has been removed.
//         </p>
//         <Button onClick={() => navigate("/swatchbook")}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to SwatchBook
//         </Button>
//       </div>
//     );
//   }

//   const variants = currentSwatch.attribute_values;
//   const selectedVariant = variants[selectedVariantIndex];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="space-y-6 p-6"
//     >
//       <div className="flex items-center justify-between">
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/app/swatchbook")}
//           className="flex items-center space-x-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           <span>Back to Materials</span>
//         </Button>

//         <div className="flex gap-2">
//           <Button onClick={handleCopyProduct} variant="ghost">
//             <CopyIcon className="h-4 w-4 mr-1" />
//             Copy Product
//           </Button>

//           {!isEditing ? (
//             <Button onClick={() => setIsEditing(true)} variant="outline">
//               <Pencil className="h-4 w-4 mr-1" />
//               Edit
//             </Button>
//           ) : (
//             <Button onClick={handleSaveChanges} variant="default">
//               <Save className="h-4 w-4 mr-1" />
//               Save
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Product Header */}
//       <Card className="overflow-hidden">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={currentSwatch.title}
//                 onChange={(e) => handleFieldChange("title", e.target.value)}
//                 className="w-full p-2 border rounded text-lg"
//               />
//             ) : (
//               currentSwatch.title
//             )}
//           </CardTitle>
//           <p className="text-sm text-muted-foreground mt-1">
//             SKU: {currentSwatch.sku || "N/A"}
//           </p>
//         </CardHeader>

//         {(currentSwatch.image_url || selectedVariant?.image_url) && (
//           <img
//             src={selectedVariant.image_url || currentSwatch.image_url!}
//             alt="Material"
//             className="w-full h-64 object-cover"
//           />
//         )}

//         <CardContent>
//           <Label className="text-muted-foreground text-sm">Description</Label>
//           {isEditing ? (
//             <textarea
//               value={currentSwatch.description || ""}
//               onChange={(e) => handleFieldChange("description", e.target.value)}
//               className="w-full mt-1 p-2 border rounded text-sm"
//               rows={3}
//             />
//           ) : (
//             <p className="text-sm mt-1">
//               {currentSwatch.description || "No description available."}
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Variant Selector */}
//       {variants.length > 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Layers className="h-5 w-5 mr-2" />
//               Select Variant
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Select
//               value={selectedVariantIndex.toString()}
//               onValueChange={(value) => setSelectedVariantIndex(Number(value))}
//             >
//               <SelectTrigger className="w-full md:w-1/2">
//                 <SelectValue placeholder="Select Variant" />
//               </SelectTrigger>
//               <SelectContent>
//                 {variants.map((variant, index) => (
//                   <SelectItem key={index} value={index.toString()}>
//                     Variant #{index + 1}{" "}
//                     {variant.price ? ` - ₹${variant.price}` : ""}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </CardContent>
//         </Card>
//       )}

//       {/* Selected Variant Details */}
//       <Card className="bg-muted/50">
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             Variant #{selectedVariantIndex + 1}
//             {selectedVariant.price && (
//               <Badge className="text-sm">₹{selectedVariant.price}</Badge>
//             )}
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {selectedVariant.attributevalues.map((attr, i) => {
//             const value = attr.value;
//             const name = attr.metadata.name;
//             const isArrayValue = Array.isArray(value);

//             return (
//               <div key={i} className="space-y-1">
//                 <Label className="text-sm text-muted-foreground">{name}</Label>

//                 {isEditing ? (
//                   isArrayValue ? (
//                     <ArrayValueEditor
//                       value={value as string[]}
//                       onChange={(newValues) =>
//                         handleAttributeChange(newValues, i)
//                       }
//                       placeholder={`Add ${name}...`}
//                     />
//                   ) : (
//                     <input
//                       className="w-full mt-1 border rounded p-1 text-sm"
//                       value={value as string}
//                       onChange={(e) => handleAttributeChange(e.target.value, i)}
//                     />
//                   )
//                 ) : (
//                   <>
//                     {isArrayValue ? (
//                       <ArrayValueDisplay values={value as string[]} />
//                     ) : (
//                       <div className="text-sm mt-1">{value as string}</div>
//                     )}
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

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
} from "lucide-react";
import { RootState } from "@/redux/store";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Cross2Icon } from "@radix-ui/react-icons";

interface Product {
  id: number;
  title: string;
  description?: string | null;
  sku?: string;
  material_subcategory_id?: number;
  brand_id?: number;
  image_url?: string | null;
  is_available: boolean;
  created_at: string;
  attribute_values: Variant[];
}

interface Variant {
  groupname: string;
  attributevalues: {
    value: string | string[];
    metadata: {
      id: number;
      name: string;
      unit_id: number | null;
      input_type: string;
      attribute_type?: string;
      material_subcategory_id: {
        id: number;
        name: string;
      };
    };
  }[];
  image_url?: string;
  price?: number;
}

// Searchable Combobox Component for editing arrays
interface ArrayValueEditorProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const ArrayValueEditor: React.FC<ArrayValueEditorProps> = ({
  value,
  onChange,
  placeholder = "Add values...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddValue = () => {
    if (searchTerm.trim() && !value.includes(searchTerm.trim())) {
      onChange([...value, searchTerm.trim()]);
      setSearchTerm("");
      setIsOpen(false);
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

  return (
    <div className="space-y-2">
      {/* Display current values as tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((val, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {val}
              <button
                type="button"
                onClick={() => handleRemoveValue(val)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
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
          className="w-full border border-gray-300 px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm.trim() && (
          <button
            type="button"
            onClick={handleAddValue}
            className="absolute right-2 top-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
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
}

const ArrayValueDisplay: React.FC<ArrayValueDisplayProps> = ({ values }) => {
  const [selectedValue, setSelectedValue] = useState(values[0] || "");

  return (
    <select
      className="w-full mt-1 border rounded p-1 text-sm bg-white"
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      {values.map((val, index) => (
        <option key={index} value={val}>
          {val}
        </option>
      ))}
    </select>
  );
};

export function SwatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.userProfile);

  const [currentSwatch, setCurrentSwatch] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaterialById = async (id: number) => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Swatch not found");
      } else {
        setCurrentSwatch(data);
        setSelectedVariantIndex(0);
      }
      setLoading(false);
    };

    if (id) fetchMaterialById(id);
  }, [id]);

  console.log(currentSwatch);

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
    delete copied.id;
    const { data, error } = await supabase
      .from("products")
      .update(copied)
      .eq("id", id)
      .select()
      .single();
    if (!error) {
      setCurrentSwatch(data as Product);
      toast.success("Changes saved");
      setIsEditing(false);
    } else {
      toast.error("Failed to Update the Product");
    }
  };

  const handleFieldChange = (field: keyof Product, value: string) => {
    setCurrentSwatch((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAttributeChange = (value: string | string[], index: number) => {
    if (!currentSwatch) return;

    const updatedSwatch = { ...currentSwatch };
    const attributeValues = [...updatedSwatch.attribute_values];
    const selectedVariant = { ...attributeValues[selectedVariantIndex] };
    const attributeValuesList = [...selectedVariant.attributevalues];

    attributeValuesList[index] = {
      ...attributeValuesList[index],
      value: value,
    };

    selectedVariant.attributevalues = attributeValuesList;
    attributeValues[selectedVariantIndex] = selectedVariant;
    updatedSwatch.attribute_values = attributeValues;

    setCurrentSwatch(updatedSwatch);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-80" />
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error || !currentSwatch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Swatch not found</h2>
        <p className="text-muted-foreground mb-6">
          The swatch you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/swatchbook")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to SwatchBook
        </Button>
      </div>
    );
  }

  const variants = currentSwatch.attribute_values;
  const selectedVariant = variants[selectedVariantIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/swatchbook")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Materials</span>
        </Button>

        <div className="flex gap-2">
          <Button onClick={handleCopyProduct} variant="ghost">
            <CopyIcon className="h-4 w-4 mr-1" />
            Copy Product
          </Button>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                className="bg-red-600 hover:bg-red-300"
                onClick={() => {
                  setIsEditing(false);
                }}
                variant="default"
              >
                <Cross2Icon className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} variant="default">
                <Save className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Header */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? (
              <input
                type="text"
                value={currentSwatch.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full p-2 border rounded text-lg"
              />
            ) : (
              currentSwatch.title
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            SKU: {currentSwatch.sku || "N/A"}
          </p>
        </CardHeader>

        {(currentSwatch.image_url || selectedVariant?.image_url) && (
          <img
            src={selectedVariant.image_url || currentSwatch.image_url!}
            alt="Material"
            className="w-full h-64 object-cover"
          />
        )}

        <CardContent>
          <Label className="text-muted-foreground text-sm">Description</Label>
          {isEditing ? (
            <textarea
              value={currentSwatch.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full mt-1 p-2 border rounded text-sm"
              rows={3}
            />
          ) : (
            <p className="text-sm mt-1">
              {currentSwatch.description || "No description available."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Select Variant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedVariantIndex.toString()}
              onValueChange={(value) => setSelectedVariantIndex(Number(value))}
            >
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select Variant" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Variant #{index + 1}{" "}
                    {variant.price ? ` - ₹${variant.price}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Selected Variant Details */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Variant #{selectedVariantIndex + 1}
            {selectedVariant.price && (
              <Badge className="text-sm">₹{selectedVariant.price}</Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedVariant.attributevalues.map((attr, i) => {
            const value = attr.value;
            const name = attr.metadata.name;
            const isArrayValue = Array.isArray(value);

            return (
              <div key={i} className="space-y-1">
                <Label className="text-sm text-muted-foreground">{name}</Label>

                {isEditing ? (
                  isArrayValue ? (
                    <ArrayValueEditor
                      value={value as string[]}
                      onChange={(newValues) =>
                        handleAttributeChange(newValues, i)
                      }
                      placeholder={`Add ${name}...`}
                    />
                  ) : (
                    <input
                      className="w-full mt-1 border rounded p-1 text-sm"
                      value={value as string}
                      onChange={(e) => handleAttributeChange(e.target.value, i)}
                    />
                  )
                ) : (
                  <>
                    {isArrayValue ? (
                      <ArrayValueDisplay values={value as string[]} />
                    ) : (
                      <div className="text-sm mt-1">{value as string}</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
