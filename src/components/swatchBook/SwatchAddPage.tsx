// import React, { useEffect, useState } from "react";
// import { Save, ArrowLeft, ChevronDown, X, Plus } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// // Type definitions
// interface AttributeId {
//   id: number;
//   name: string;
//   unit: string | null;
//   data_type: "text" | "number" | "enum" | "boolean";
//   possible_values: string[] | null;
// }

// interface Attribute {
//   id: number;
//   attribute_group_id: number;
//   attribute_id: AttributeId;
//   sort_order: number;
// }

// interface AttributeGroup {
//   attribute_group_id: number;
//   attributes: Attribute[];
// }

// interface Group {
//   id: number;
//   name: string;
//   attribute_set_id: number;
// }

// interface AttributeSet {
//   id: number;
//   name: string;
// }

// interface AttributeValues {
//   [key: number]: string | number | readonly string[] | boolean | undefined;
// }

// interface SearchTerms {
//   [key: number]: string;
// }

// interface ShowDropdowns {
//   [key: number]: boolean;
// }

// const SwatchAddPage: React.FC = () => {
//   const [attributeSets, setAllAttributeSets] = useState<AttributeSet[]>([]);
//   const [selectedFeatureData, setSelectedFeatureData] =
//     useState<AttributeSet | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [checked, setChecked] = useState<AttributeGroup[]>([]);
//   const [attributeValues, setAttributeValues] = useState<AttributeValues>({});
//   const [searchTerms, setSearchTerms] = useState<SearchTerms>({});
//   const [showDropdowns, setShowDropdowns] = useState<ShowDropdowns>({});
//   const [productdata, setProductData] = useState({
//     product_category_id: 1,
//     brand_id: null,
//   });
//   useEffect(() => {
//     const getAttributeSets = async (): Promise<void> => {
//       try {
//         // Replace with actual Supabase call
//         const { data, error } = await supabase
//           .from("product_attribute_sets")
//           .select("*");
//         if (!error && data) {
//           setAllAttributeSets(data);
//         }
//       } catch (error) {
//         console.error("Error fetching attribute sets:", error);
//       }
//     };

//     getAttributeSets();
//   }, []);

//   const handleFeatureSelect = async (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ): Promise<void> => {
//     const selectedId = parseInt(e.target.value);
//     const matchedAttributeSet = attributeSets.find((d) => d.id === selectedId);

//     if (matchedAttributeSet) {
//       setSelectedFeatureData(matchedAttributeSet);
//       setProductData((prev) => ({
//         ...prev,
//         product_attribute_set_id: matchedAttributeSet.id,
//       }));
//       try {
//         // Replace with actual Supabase call
//         const { data, error } = await supabase
//           .from("product_attribute_groups")
//           .select()
//           .eq("attribute_set_id", matchedAttributeSet.id);
//         if (!error && data) {
//           setGroups(data);
//         }
//       } catch (error) {
//         console.error("Error fetching groups:", error);
//       }
//     }
//   };

//   const handleInputChangeInProductDetails = (e: any) => {
//     setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleGroupToggle = async (id: number): Promise<void> => {
//     const isAlreadyChecked = checked.some(
//       (group) => group.attribute_group_id === id
//     );

//     if (isAlreadyChecked) {
//       setChecked((prev) =>
//         prev.filter((group) => group.attribute_group_id !== id)
//       );
//     } else {
//       try {
//         // Replace with actual Supabase call
//         const { data, error } = await supabase
//           .from("product_attribute_group_attributes")
//           .select(`*, attribute_id(id,name,data_type,unit,possible_values)`)
//           .eq("attribute_group_id", id);
//         if (!error && data) {
//           setChecked((prev) => [
//             ...prev,
//             { attribute_group_id: id, attributes: data },
//           ]);
//         }
//       } catch (error) {
//         console.error("Error fetching group attributes:", error);
//       }
//     }
//   };

//   const handleAttributeChange = (
//     attributeId: number,
//     value: string | number | string[] | boolean
//   ): void => {
//     setAttributeValues((prev) => ({
//       ...prev,
//       [attributeId]: value,
//     }));
//   };

//   const handleEnumValueToggle = (attributeId: number, value: string): void => {
//     const currentValues = (attributeValues[attributeId] as string[]) || [];
//     const isSelected = currentValues.includes(value);

//     if (isSelected) {
//       const newValues = currentValues.filter((v) => v !== value);
//       handleAttributeChange(attributeId, newValues);
//     } else {
//       handleAttributeChange(attributeId, [...currentValues, value]);
//     }
//   };

//   const removeEnumValue = (
//     attributeId: number,
//     valueToRemove: string
//   ): void => {
//     const currentValues = (attributeValues[attributeId] as string[]) || [];
//     const newValues = currentValues.filter((v) => v !== valueToRemove);
//     handleAttributeChange(attributeId, newValues);
//   };

//   const handleSearchChange = (
//     attributeId: number,
//     searchTerm: string
//   ): void => {
//     setSearchTerms((prev) => ({
//       ...prev,
//       [attributeId]: searchTerm,
//     }));
//   };

//   const toggleDropdown = (attributeId: number): void => {
//     setShowDropdowns((prev) => ({
//       ...prev,
//       [attributeId]: !prev[attributeId],
//     }));
//   };

//   const addNewOption = async (
//     attributeId: number,
//     newValue: string,
//     attribute: any
//   ) => {
//     if (newValue.trim()) {
//       const currentValues = (attributeValues[attributeId] as string[]) || [];
//       if (!currentValues.includes(newValue.trim())) {
//         handleAttributeChange(attributeId, [...currentValues, newValue.trim()]);
//       }
//       setSearchTerms((prev) => ({ ...prev, [attributeId]: "" }));
//       setShowDropdowns((prev) => ({ ...prev, [attributeId]: false }));
//     }
//     if (!attribute.attribute_id.possible_values.includes(newValue)) {
//       const copied = [...attribute.attribute_id.possible_values];
//       copied.push(newValue);
//       const { data, error } = await supabase
//         .from("product_attributes")
//         .update({
//           possible_values: copied,
//         })
//         .eq("id", attributeId)
//         .select()
//         .single();
//       if (error) {
//         toast.error("Failed to Insert Data in Values");
//       }
//     }
//   };

//   const renderAttributeInput = (attribute: Attribute): JSX.Element => {
//     const { attribute_id } = attribute;
//     const { id, name, data_type, unit, possible_values } = attribute_id;
//     const currentValue = attributeValues[id] || "";
//     const searchTerm = searchTerms[id] || "";
//     const showDropdown = showDropdowns[id] || false;

//     const inputClasses =
//       "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
//     const labelText = unit ? `${name} (${unit})` : name;

//     switch (data_type) {
//       case "text":
//         return (
//           <div key={id} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {labelText}
//             </label>
//             <input
//               type="text"
//               value={String(currentValue)}
//               onChange={(e) => handleAttributeChange(id, e.target.value)}
//               className={inputClasses}
//               placeholder={`Enter ${name.toLowerCase()}`}
//             />
//           </div>
//         );

//       case "number":
//         return (
//           <div key={id} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {labelText}
//             </label>
//             <input
//               type="number"
//               value={Number(currentValue)}
//               onChange={(e) =>
//                 handleAttributeChange(id, parseFloat(e.target.value) || 0)
//               }
//               className={inputClasses}
//               placeholder={`Enter ${name.toLowerCase()}`}
//               step="any"
//             />
//           </div>
//         );

//       case "enum":
//         const currentEnumValues = (attributeValues[id] as string[]) || [];

//         const filteredOptions =
//           possible_values?.filter((option) =>
//             option.toLowerCase().includes(searchTerm.toLowerCase())
//           ) || [];

//         return (
//           <div key={id} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {labelText}
//             </label>
//             <div className="relative">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => handleSearchChange(id, e.target.value)}
//                   onFocus={() => toggleDropdown(id)}
//                   className={`${inputClasses} pr-10`}
//                   placeholder={`Search and select ${name.toLowerCase()}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => toggleDropdown(id)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent"
//                 >
//                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                 </button>
//               </div>

//               {showDropdown && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                   {filteredOptions.length > 0 && (
//                     <div className="py-1">
//                       {filteredOptions.map((option, index) => (
//                         <button
//                           key={index}
//                           type="button"
//                           onClick={() => {
//                             handleEnumValueToggle(id, option);
//                             setSearchTerms((prev) => ({ ...prev, [id]: "" }));
//                           }}
//                           className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between ${
//                             currentEnumValues.includes(option)
//                               ? "bg-blue-50 text-blue-700"
//                               : ""
//                           }`}
//                         >
//                           <span>{option}</span>
//                           {currentEnumValues.includes(option) && (
//                             <span className="text-blue-600">✓</span>
//                           )}
//                         </button>
//                       ))}
//                     </div>
//                   )}

//                   {searchTerm &&
//                     !filteredOptions.includes(searchTerm) &&
//                     !currentEnumValues.includes(searchTerm) && (
//                       <div className="border-t border-gray-200">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             addNewOption(id, searchTerm, attribute)
//                           }
//                           className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Add "{searchTerm}"
//                         </button>
//                       </div>
//                     )}

//                   {filteredOptions.length === 0 && !searchTerm && (
//                     <div className="px-3 py-2 text-gray-500 text-sm">
//                       No options available
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Selected Values Display */}
//             {currentEnumValues.length > 0 && (
//               <div className="mt-2">
//                 <div className="text-xs text-gray-500 mb-1">
//                   Selected values:
//                 </div>
//                 <div className="flex flex-wrap gap-1">
//                   {currentEnumValues.map((value, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
//                     >
//                       {value}
//                       <button
//                         type="button"
//                         onClick={() => removeEnumValue(id, value)}
//                         className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case "boolean":
//         return (
//           <div key={id} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {labelText}
//             </label>
//             <select
//               value={String(currentValue)}
//               onChange={(e) =>
//                 handleAttributeChange(id, e.target.value == "true")
//               }
//               className={inputClasses}
//             >
//               <option value="">Select...</option>
//               <option value="true">Yes</option>
//               <option value="false">No</option>
//             </select>
//           </div>
//         );

//       default:
//         return (
//           <div key={id} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {labelText}
//             </label>
//             <input
//               type="text"
//               value={String(currentValue)}
//               onChange={(e) => handleAttributeChange(id, e.target.value)}
//               className={inputClasses}
//               placeholder={`Enter ${name.toLowerCase()}`}
//             />
//           </div>
//         );
//     }
//   };

//   const handleSubmit = async () => {
//     console.log("Attribute Values:", productdata);
//     if (!productdata.product_category_id || !productdata.brand_id) {
//       toast.message("Please Enter Product Values");
//       return;
//     }
//     const { data: products, error } = await supabase
//       .from("products")
//       .insert(productdata)
//       .select()
//       .single();
//     if (!error) {
//       const mappedData = Object.entries(attributeValues).map(([key, value]) => {
//         return {
//           product_id: products.id,
//           attribute_id: Number(key),
//           value_text: typeof value === "string" ? value : null,
//           value_number: typeof value === "number" ? value : null,
//           value_boolean: typeof value === "boolean" ? value : null,
//           value_multiple:
//             Array.isArray(value) || typeof value == "object" ? value : null,
//         };
//       });

//       const { data: attribute_values, error } = await supabase
//         .from("product_attribute_values")
//         .insert(mappedData)
//         .select();

//       if (!error) {
//         console.log(attribute_values);
//       } else {
//         toast.message("Not Successful");
//         const { data, error } = await supabase
//           .from("products")
//           .delete()
//           .eq("id", products.id);
//         console.log(data);
//       }
//     }
//     // Handle form submission
//   };

//   const handleCancel = (): void => {
//     // Handle cancel action
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent): void => {
//       const target = event.target as HTMLElement;
//       if (!target.closest(".relative")) {
//         setShowDropdowns({});
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <button className="flex items-center text-gray-600 hover:text-gray-900">
//                 <ArrowLeft className="h-5 w-5 mr-2" />
//                 Back to Products
//               </button>
//               <div className="h-6 border-l border-gray-300"></div>
//               <h1 className="text-xl font-semibold text-gray-900">
//                 Add New Product
//               </h1>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 Save Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         {/* Basic Info */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">
//               Basic Information
//             </h2>
//           </div>
//           <div className="px-6 py-4 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Product Name *"
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={handleInputChangeInProductDetails}
//               />
//               <input
//                 type="text"
//                 placeholder="SKU *"
//                 name="sku"
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={handleInputChangeInProductDetails}
//               />
//               <input
//                 type="text"
//                 placeholder="Brand ID *"
//                 name="brand_id"
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={handleInputChangeInProductDetails}
//               />
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Description *"
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={handleInputChangeInProductDetails}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Feature Selection */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">
//               Product Features
//             </h2>
//           </div>
//           <div className="px-6 py-4 space-y-4">
//             <select
//               onChange={handleFeatureSelect}
//               className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Feature *</option>
//               {attributeSets.map((d) => (
//                 <option key={d.id} value={d.id}>
//                   {d.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Attribute Configuration */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">
//               Attribute Configuration
//             </h2>
//           </div>
//           <div className="px-6 py-4 space-y-6">
//             {selectedFeatureData && groups.length > 0 && (
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-md font-medium mb-4">Group Names</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   {groups.map((group) => (
//                     <div key={group.id} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={checked.some(
//                           (d) => d.attribute_group_id === group.id
//                         )}
//                         onChange={() => handleGroupToggle(group.id)}
//                         className="h-4 w-4 mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <label className="text-sm font-medium text-gray-700">
//                         {group.name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Dynamic Attribute Inputs */}
//                 {checked.map((checkedGroup) => {
//                   const group = groups.find(
//                     (g) => g.id === checkedGroup.attribute_group_id
//                   );
//                   return (
//                     <div key={checkedGroup.attribute_group_id} className="mb-8">
//                       <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                         {group?.name} Attributes
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {checkedGroup.attributes
//                           .sort((a, b) => a.sort_order - b.sort_order)
//                           .map((attribute) => renderAttributeInput(attribute))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SwatchAddPage;



import React, { useEffect, useState } from "react";
import {
  Save,
  ArrowLeft,
  ChevronDown,
  X,
  Plus,
  Upload,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Type definitions
interface AttributeId {
  id: number;
  name: string;
  unit: string | null;
  data_type: "text" | "number" | "enum" | "boolean";
  possible_values: string[] | null;
}

interface Attribute {
  id: number;
  attribute_group_id: number;
  attribute_id: AttributeId;
  sort_order: number;
}

interface AttributeGroup {
  attribute_group_id: number;
  attributes: Attribute[];
}

interface Group {
  id: number;
  name: string;
  attribute_set_id: number;
}

interface AttributeSet {
  id: number;
  name: string;
}

interface AttributeValues {
  [key: number]: string | number | readonly string[] | boolean | undefined;
}

interface SearchTerms {
  [key: number]: string;
}

interface ShowDropdowns {
  [key: number]: boolean;
}

const SwatchAddPage: React.FC = () => {
  const [attributeSets, setAllAttributeSets] = useState<AttributeSet[]>([]);
  const [selectedFeatureData, setSelectedFeatureData] =
    useState<AttributeSet | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [checked, setChecked] = useState<AttributeGroup[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValues>({});
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({});
  const [showDropdowns, setShowDropdowns] = useState<ShowDropdowns>({});
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [productdata, setProductData] = useState({
    product_category_id: 1,
    brand_id: null,
  });

  useEffect(() => {
    const getAttributeSets = async (): Promise<void> => {
      try {
        // Replace with actual Supabase call
        const { data, error } = await supabase
          .from("product_attribute_sets")
          .select("*");
        if (!error && data) {
          setAllAttributeSets(data);
        }
      } catch (error) {
        console.error("Error fetching attribute sets:", error);
      }
    };

    getAttributeSets();
  }, []);

  const handleFeatureSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const selectedId = parseInt(e.target.value);
    const matchedAttributeSet = attributeSets.find((d) => d.id === selectedId);

    if (matchedAttributeSet) {
      setSelectedFeatureData(matchedAttributeSet);
      setProductData((prev) => ({
        ...prev,
        product_attribute_set_id: matchedAttributeSet.id,
      }));
      try {
        // Replace with actual Supabase call
        const { data, error } = await supabase
          .from("product_attribute_groups")
          .select()
          .eq("attribute_set_id", matchedAttributeSet.id);
        if (!error && data) {
          setGroups(data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }
  };

  const handleInputChangeInProductDetails = (e: any) => {
    setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGroupToggle = async (id: number): Promise<void> => {
    const isAlreadyChecked = checked.some(
      (group) => group.attribute_group_id === id
    );

    if (isAlreadyChecked) {
      setChecked((prev) =>
        prev.filter((group) => group.attribute_group_id !== id)
      );
    } else {
      try {
        // Replace with actual Supabase call
        const { data, error } = await supabase
          .from("product_attribute_group_attributes")
          .select(`*, attribute_id(id,name,data_type,unit,possible_values)`)
          .eq("attribute_group_id", id);
        if (!error && data) {
          setChecked((prev) => [
            ...prev,
            { attribute_group_id: id, attributes: data },
          ]);
        }
      } catch (error) {
        console.error("Error fetching group attributes:", error);
      }
    }
  };

  const handleAttributeChange = (
    attributeId: number,
    value: string | number | string[] | boolean
  ): void => {
    setAttributeValues((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  const handleEnumValueToggle = (attributeId: number, value: string): void => {
    const currentValues = (attributeValues[attributeId] as string[]) || [];
    const isSelected = currentValues.includes(value);

    if (isSelected) {
      const newValues = currentValues.filter((v) => v !== value);
      handleAttributeChange(attributeId, newValues);
    } else {
      handleAttributeChange(attributeId, [...currentValues, value]);
    }
  };

  const removeEnumValue = (
    attributeId: number,
    valueToRemove: string
  ): void => {
    const currentValues = (attributeValues[attributeId] as string[]) || [];
    const newValues = currentValues.filter((v) => v !== valueToRemove);
    handleAttributeChange(attributeId, newValues);
  };

  const handleSearchChange = (
    attributeId: number,
    searchTerm: string
  ): void => {
    setSearchTerms((prev) => ({
      ...prev,
      [attributeId]: searchTerm,
    }));
  };

  const toggleDropdown = (attributeId: number): void => {
    setShowDropdowns((prev) => ({
      ...prev,
      [attributeId]: !prev[attributeId],
    }));
  };

  const addNewOption = async (
    attributeId: number,
    newValue: string,
    attribute: any
  ) => {
    if (newValue.trim()) {
      const currentValues = (attributeValues[attributeId] as string[]) || [];
      if (!currentValues.includes(newValue.trim())) {
        handleAttributeChange(attributeId, [...currentValues, newValue.trim()]);
      }
      setSearchTerms((prev) => ({ ...prev, [attributeId]: "" }));
      setShowDropdowns((prev) => ({ ...prev, [attributeId]: false }));
    }
    if (!attribute.attribute_id.possible_values.includes(newValue)) {
      const copied = [...attribute.attribute_id.possible_values];
      copied.push(newValue);
      const { data, error } = await supabase
        .from("product_attributes")
        .update({
          possible_values: copied,
        })
        .eq("id", attributeId)
        .select()
        .single();
      if (error) {
        toast.error("Failed to Insert Data in Values");
      }
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - productImages.length);
    const newUrls: string[] = [];

    newFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      }
    });

    setProductImages((prev) => [...prev, ...newFiles]);
    setImagePreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const renderAttributeInput = (attribute: Attribute): JSX.Element => {
    const { attribute_id } = attribute;
    const { id, name, data_type, unit, possible_values } = attribute_id;
    const currentValue = attributeValues[id] || "";
    const searchTerm = searchTerms[id] || "";
    const showDropdown = showDropdowns[id] || false;

    const inputClasses =
      "w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm";
    const labelText = unit ? `${name} (${unit})` : name;

    switch (data_type) {
      case "text":
        return (
          <div key={id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {labelText}
            </label>
            <input
              type="text"
              value={String(currentValue)}
              onChange={(e) => handleAttributeChange(id, e.target.value)}
              className={inputClasses}
              placeholder={`Enter ${name.toLowerCase()}`}
            />
          </div>
        );

      case "number":
        return (
          <div key={id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {labelText}
            </label>
            <input
              type="number"
              value={Number(currentValue)}
              onChange={(e) =>
                handleAttributeChange(id, parseFloat(e.target.value) || 0)
              }
              className={inputClasses}
              placeholder={`Enter ${name.toLowerCase()}`}
              step="any"
            />
          </div>
        );

      case "enum":
        const currentEnumValues = (attributeValues[id] as string[]) || [];

        const filteredOptions =
          possible_values?.filter((option) =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
          ) || [];

        return (
          <div key={id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {labelText}
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(id, e.target.value)}
                  onFocus={() => toggleDropdown(id)}
                  className={`${inputClasses} pr-12`}
                  placeholder={`Search and select ${name.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() => toggleDropdown(id)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {showDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                  {filteredOptions.length > 0 && (
                    <div className="py-2">
                      {filteredOptions.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            handleEnumValueToggle(id, option);
                            setSearchTerms((prev) => ({ ...prev, [id]: "" }));
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between transition-colors ${
                            currentEnumValues.includes(option)
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                              : ""
                          }`}
                        >
                          <span className="font-medium">{option}</span>
                          {currentEnumValues.includes(option) && (
                            <span className="text-blue-600 font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {searchTerm &&
                    !filteredOptions.includes(searchTerm) &&
                    !currentEnumValues.includes(searchTerm) && (
                      <div className="border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            addNewOption(id, searchTerm, attribute)
                          }
                          className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center font-medium"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add "{searchTerm}"
                        </button>
                      </div>
                    )}

                  {filteredOptions.length === 0 && !searchTerm && (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No options available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Values Display */}
            {currentEnumValues.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Selected values:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentEnumValues.map((value, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium shadow-sm"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() => removeEnumValue(id, value)}
                        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-300 focus:outline-none transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "boolean":
        return (
          <div key={id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {labelText}
            </label>
            <select
              value={String(currentValue)}
              onChange={(e) =>
                handleAttributeChange(id, e.target.value == "true")
              }
              className={inputClasses}
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        );

      default:
        return (
          <div key={id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {labelText}
            </label>
            <input
              type="text"
              value={String(currentValue)}
              onChange={(e) => handleAttributeChange(id, e.target.value)}
              className={inputClasses}
              placeholder={`Enter ${name.toLowerCase()}`}
            />
          </div>
        );
    }
  };

  const handleSubmit = async () => {
    console.log("Attribute Values:", productdata);
    console.log("Product Images:", productImages);
    if (!productdata.product_category_id || !productdata.brand_id) {
      toast.message("Please Enter Product Values");
      return;
    }
    const { data: products, error } = await supabase
      .from("products")
      .insert(productdata)
      .select()
      .single();
    if (!error) {
      const mappedData = Object.entries(attributeValues).map(([key, value]) => {
        return {
          product_id: products.id,
          attribute_id: Number(key),
          value_text: typeof value === "string" ? value : null,
          value_number: typeof value === "number" ? value : null,
          value_boolean: typeof value === "boolean" ? value : null,
          value_multiple:
            Array.isArray(value) || typeof value == "object" ? value : null,
        };
      });

      const { data: attribute_values, error } = await supabase
        .from("product_attribute_values")
        .insert(mappedData)
        .select();

      if (!error) {
        console.log(attribute_values);
      } else {
        toast.message("Not Successful");
        const { data, error } = await supabase
          .from("products")
          .delete()
          .eq("id", products.id);
        console.log(data);
      }
    }
    // Handle form submission
  };

  const handleCancel = (): void => {
    // Handle cancel action
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setShowDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                <ArrowLeft className="h-5 w-5 mr-3" />
                Back to Products
              </button>
              <div className="h-8 border-l border-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new product with detailed attributes
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center shadow-lg transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Basic Info */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Basic Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter the fundamental details of your product
            </p>
          </div>
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  onChange={handleInputChangeInProductDetails}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  SKU *
                </label>
                <input
                  type="text"
                  placeholder="Enter SKU"
                  name="sku"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  onChange={handleInputChangeInProductDetails}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Brand ID *
                </label>
                <input
                  type="text"
                  placeholder="Enter brand ID"
                  name="brand_id"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  onChange={handleInputChangeInProductDetails}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none"
                  onChange={handleInputChangeInProductDetails}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload up to 5 images for your product
            </p>
          </div>
          <div className="px-8 py-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={productImages.length >= 5}
              />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    {productImages.length >= 5
                      ? "Maximum images reached"
                      : "Drop images here or click to upload"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB each ({productImages.length}/5)
                  </p>
                </div>
              </div>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Uploaded Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Selection */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Product Features
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Select the feature set that best describes your product
            </p>
          </div>
          <div className="px-8 py-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Feature Set *
              </label>
              <select
                onChange={handleFeatureSelect}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              >
                <option value="">Select Feature *</option>
                {attributeSets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Attribute Configuration */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Attribute Configuration
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure detailed attributes for your product
            </p>
          </div>
          <div className="px-8 py-8">
            {selectedFeatureData && groups.length > 0 && (
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Select Attribute Groups
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                      <label
                        key={group.id}
                        className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked.some(
                            (d) => d.attribute_group_id === group.id
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

                {/* Dynamic Attribute Inputs */}
                {checked.map((checkedGroup) => {
                  const group = groups.find(
                    (g) => g.id === checkedGroup.attribute_group_id
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
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((attribute) => renderAttributeInput(attribute))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwatchAddPage;
