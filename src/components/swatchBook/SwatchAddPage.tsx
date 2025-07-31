// import React, { useEffect, useState } from "react";
// import { Save, ArrowLeft, ChevronDown, X } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// // Type definitions
// interface Unit {
//   name: string;
//   symbol: string;
// }

// interface MaterialSubcategory {
//   id: number;
//   name: string;
// }

// interface MinimalAttribute {
//   id: number;
//   name: string;
//   unit_id: Unit | null;
//   input_type: string;
//   material_subcategory_id: MaterialSubcategory;
//   attribute_type?: string;
//   value?: string[];
// }

// interface AttributeGroup {
//   groupname: string;
//   group_attributes: MinimalAttribute[];
// }

// interface AttributeSets {
//   id: number;
//   name: string;
//   groups: AttributeGroup[];
//   sub_category_id: number | null;
// }

// interface AttributeDetail {
//   unit: string | null;
//   value: string | number | null;
//   keyname: string;
// }

// interface AttributeValueWithMetadata {
//   value: string | number | string[];
//   metadata: MinimalAttribute;
// }

// interface GroupedAttributeValues {
//   groupname: string;
//   attributevalues: AttributeValueWithMetadata[];
// }

// interface FormData {
//   title: string;
//   sku: string;
//   brand_id: string;
//   selectedFeature: string;
//   selectedGroups: string[]; // groupname instead of index
//   attributeValues: Record<number, string | string[]>; // key: attribute.id
//   attribute_values: GroupedAttributeValues[];
//   material_subcategory_id: number | null | undefined;
//   description?: string;
// }

// // Searchable Combobox Component
// interface SearchableComboboxProps {
//   options: string[];
//   value: string[];
//   onChange: (values: string[]) => void;
//   placeholder?: string;
//   allowCustom?: boolean;
// }

// const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
//   options,
//   value,
//   onChange,
//   placeholder = "Search and select options...",
//   allowCustom = true,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [customOptions, setCustomOptions] = useState<string[]>([]);

//   const allOptions = [...options, ...customOptions];
//   const filteredOptions = allOptions.filter(
//     (option) =>
//       option.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       !value.includes(option)
//   );

//   const handleAddCustomOption = () => {
//     if (searchTerm.trim() && !allOptions.includes(searchTerm.trim())) {
//       const newOption = searchTerm.trim();
//       setCustomOptions([...customOptions, newOption]);
//       onChange([...value, newOption]);
//       setSearchTerm("");
//       setIsOpen(false);
//     }
//   };

//   const handleSelectOption = (option: string) => {
//     onChange([...value, option]);
//     setSearchTerm("");
//     setIsOpen(false);
//   };

//   const handleRemoveOption = (optionToRemove: string) => {
//     onChange(value.filter((v) => v !== optionToRemove));
//   };

//   return (
//     <div className="relative">
//       {/* Selected values display */}
//       {value.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-2">
//           {value.map((selectedValue) => (
//             <span
//               key={selectedValue}
//               className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//             >
//               {selectedValue}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveOption(selectedValue)}
//                 className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Search input */}
//       <div className="relative">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onFocus={() => setIsOpen(true)}
//           placeholder={placeholder}
//           className="w-full border border-gray-300 px-3 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
//       </div>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//           {filteredOptions.length > 0 ? (
//             filteredOptions.map((option) => (
//               <button
//                 key={option}
//                 type="button"
//                 onClick={() => handleSelectOption(option)}
//                 className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
//               >
//                 {option}
//               </button>
//             ))
//           ) : searchTerm.trim() && allowCustom ? (
//             <button
//               type="button"
//               onClick={handleAddCustomOption}
//               className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-blue-600"
//             >
//               Add "{searchTerm.trim()}"
//             </button>
//           ) : (
//             <div className="px-3 py-2 text-gray-500">No options found</div>
//           )}
//         </div>
//       )}

//       {/* Click outside to close */}
//       {isOpen && (
//         <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
//       )}
//     </div>
//   );
// };

// const SwatchAddPage: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     title: "",
//     sku: "",
//     brand_id: "",
//     description: "",
//     material_subcategory_id: null,
//     selectedFeature: "",
//     selectedGroups: [],
//     attributeValues: {},
//     attribute_values: [],
//   });

//   const [attributeSets, setAllAttributeSets] = useState<AttributeSets[]>([]);
//   const [selectedFeatureData, setSelectedFeatureData] =
//     useState<AttributeSets | null>(null);

//   useEffect(() => {
//     const fetchAttributeSets = async () => {
//       const { data, error } = await supabase
//         .from("materials_attribute_sets")
//         .select("*");
//       if (!error && data) {
//         setAllAttributeSets(data);
//       }
//     };
//     fetchAttributeSets();
//   }, []);

//   const handleInputChange = (
//     field: keyof FormData,
//     value: string | string[] | Record<number, string | string[]>
//   ): void => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleFeatureSelect = async (featureId: string) => {
//     const feature =
//       attributeSets.find((f) => f.id === parseInt(featureId)) || null;

//     const details = feature?.groups;
//     for (let i = 0; i < details?.length!; i++) {
//       for (let j = 0; j < details[i].group_attributes.length!; j++) {
//         const { data, error } = await supabase
//           .from("material_attributes")
//           .select(`*, unit_id(name, symbol)`)
//           .eq("id", details[i].group_attributes[j])
//           .single();

//         details[i].group_attributes[j] = data;
//       }
//     }
//     setSelectedFeatureData(feature);
//     setFormData((prev) => ({
//       ...prev,
//       material_subcategory_id: feature?.sub_category_id,
//       selectedFeature: featureId,
//       selectedGroups: [],
//       attributeValues: {},
//     }));
//   };

//   console.log(attributeSets);

//   const handleGroupToggle = (groupname: string): void => {
//     setFormData((prev) => {
//       const isSelected = prev.selectedGroups.includes(groupname);
//       const newSelectedGroups = isSelected
//         ? prev.selectedGroups.filter((name) => name !== groupname)
//         : [...prev.selectedGroups, groupname];

//       const newAttributeValues = { ...prev.attributeValues };
//       if (isSelected && selectedFeatureData) {
//         const group = selectedFeatureData.groups.find(
//           (g) => g.groupname === groupname
//         );
//         group?.group_attributes.forEach((attr) => {
//           delete newAttributeValues[attr.id];
//         });
//       }

//       return {
//         ...prev,
//         selectedGroups: newSelectedGroups,
//         attributeValues: newAttributeValues,
//       };
//     });
//   };

//   const handleAttributeChange = (
//     attributeId: number,
//     value: string | string[]
//   ): void => {
//     setFormData((prev) => ({
//       ...prev,
//       attributeValues: {
//         ...prev.attributeValues,
//         [attributeId]: value,
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedFeatureData) {
//       toast.error("Please select Data set");
//       return;
//     }

//     const groupedAttributes: GroupedAttributeValues[] = formData.selectedGroups
//       .map((groupname) => {
//         const group = selectedFeatureData.groups.find(
//           (g) => g.groupname === groupname
//         );
//         if (!group) return null;

//         const attributevalues: AttributeValueWithMetadata[] =
//           group.group_attributes
//             .map((attr) => {
//               const enteredValue = formData.attributeValues[attr.id];
//               if (
//                 enteredValue === undefined ||
//                 enteredValue === "" ||
//                 (Array.isArray(enteredValue) && enteredValue.length === 0)
//               )
//                 return null;
//               return {
//                 value: enteredValue,
//                 metadata: attr,
//               };
//             })
//             .filter(Boolean) as AttributeValueWithMetadata[];

//         return {
//           groupname,
//           attributevalues,
//         };
//       })
//       .filter(Boolean) as GroupedAttributeValues[];

//     const { data, error } = await supabase
//       .from("products")
//       .insert({
//         attribute_values: groupedAttributes,
//         title: formData.title,
//         sku: formData.sku,
//         brand_id: formData.brand_id,
//         material_subcategory_id: formData.material_subcategory_id,
//         description: formData.description,
//       })
//       .select();

//     if (!error) {
//       setFormData({
//         title: "",
//         sku: "",
//         brand_id: "",
//         material_subcategory_id: null,
//         selectedFeature: "",
//         selectedGroups: [],
//         attributeValues: {},
//         attribute_values: [],
//         description: "",
//       });
//       toast.success("Product saved successfully!");
//     } else {
//       toast.error("Failed to Save Data");
//     }
//   };

//   const handleCancel = (): void => {
//     setFormData({
//       title: "",
//       sku: "",
//       brand_id: "",
//       selectedFeature: "",
//       material_subcategory_id: null,
//       selectedGroups: [],
//       attributeValues: {},
//       attribute_values: [],
//     });
//     setSelectedFeatureData(null);
//   };

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
//                 placeholder="Product Name *"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange("title", e.target.value)}
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 placeholder="SKU *"
//                 value={formData.sku}
//                 onChange={(e) => handleInputChange("sku", e.target.value)}
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 s
//                 placeholder="Brand ID *"
//                 value={formData.brand_id}
//                 onChange={(e) => handleInputChange("brand_id", e.target.value)}
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 placeholder="Description *"
//                 value={formData.description}
//                 onChange={(e) =>
//                   handleInputChange("description", e.target.value)
//                 }
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md"
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
//               value={formData.selectedFeature}
//               onChange={(e) => handleFeatureSelect(e.target.value)}
//               className="w-full border border-gray-300 px-3 py-2 rounded-md"
//             >
//               <option value="">Select Feature *</option>
//               {attributeSets.map((set) => (
//                 <option key={set.id} value={set.id}>
//                   {set.name}
//                 </option>
//               ))}
//             </select>

//             {selectedFeatureData && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {selectedFeatureData.groups.map((group) => (
//                   <div key={group.groupname} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.selectedGroups.includes(
//                         group.groupname
//                       )}
//                       onChange={() => handleGroupToggle(group.groupname)}
//                       className="h-4 w-4 mr-2"
//                     />
//                     <label className="text-sm font-medium text-gray-700">
//                       {group.groupname}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Attribute Configuration */}
//         {selectedFeatureData && formData.selectedGroups.length > 0 && (
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-900">
//                 Attribute Configuration
//               </h2>
//             </div>
//             <div className="px-6 py-4 space-y-6">
//               {selectedFeatureData.groups.map((group) => {
//                 if (!formData.selectedGroups.includes(group.groupname))
//                   return null;
//                 return (
//                   <div
//                     key={group.groupname}
//                     className="border border-gray-200 rounded-lg p-4"
//                   >
//                     <h3 className="text-md font-medium mb-4">
//                       {group.groupname}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {group.group_attributes.map((attr) => (
//                         <div key={attr.id}>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             {attr.name}
//                             {attr.unit_id && (
//                               <span className="text-gray-500 ml-1">
//                                 ({attr.unit_id.symbol})
//                               </span>
//                             )}
//                           </label>
//                           {attr.attribute_type === "flexible" ? (
//                             <SearchableCombobox
//                               options={attr.value || []}
//                               value={
//                                 Array.isArray(formData.attributeValues[attr.id])
//                                   ? (formData.attributeValues[
//                                       attr.id
//                                     ] as string[])
//                                   : []
//                               }
//                               onChange={(values) =>
//                                 handleAttributeChange(attr.id, values)
//                               }
//                               placeholder={`Search ${attr.name}...`}
//                             />
//                           ) : (
//                             <input
//                               type={
//                                 attr.input_type === "number" ? "number" : "text"
//                               }
//                               value={
//                                 typeof formData.attributeValues[attr.id] ===
//                                 "string"
//                                   ? (formData.attributeValues[
//                                       attr.id
//                                     ] as string)
//                                   : ""
//                               }
//                               onChange={(e) =>
//                                 handleAttributeChange(attr.id, e.target.value)
//                               }
//                               className="w-full border border-gray-300 px-3 py-2 rounded-md"
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SwatchAddPage;

import React, { useEffect, useState } from "react";
import { Save, ArrowLeft, ChevronDown, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Type definitions
interface Unit {
  name: string;
  symbol: string;
}

interface MaterialSubcategory {
  id: number;
  name: string;
}

interface MinimalAttribute {
  id: number;
  name: string;
  unit_id: Unit | null;
  input_type: string;
  material_subcategory_id: MaterialSubcategory;
  attribute_type?: string;
  value?: string[];
}

interface AttributeGroup {
  groupname: string;
  group_attributes: MinimalAttribute[];
}

interface AttributeSets {
  id: number;
  name: string;
  groups: AttributeGroup[];
  sub_category_id: number | null;
}

interface AttributeValueWithMetadata {
  value: string | number | string[];
  metadata: MinimalAttribute;
}

interface GroupedAttributeValues {
  groupname: string;
  attributevalues: AttributeValueWithMetadata[];
}

interface FormData {
  title: string;
  sku: string;
  brand_id: string;
  selectedFeature: string;
  selectedGroups: string[];
  attributeValues: Record<number, string | string[]>;
  attribute_values: GroupedAttributeValues[];
  material_subcategory_id: number | null | undefined;
  description?: string;
}

// Searchable Combobox Component
interface SearchableComboboxProps {
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Search and select options...",
  allowCustom = true,
}) => {
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2" />
      <div className="relative">
        <input
          type="text"
          value={""}
          onChange={() => {}}
          onFocus={() => {}}
          placeholder={placeholder}
          className="w-full border border-gray-300 px-3 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto" />
      <div className="fixed inset-0 z-0" />
    </div>
  );
};

const SwatchAddPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    sku: "",
    brand_id: "",
    description: "",
    material_subcategory_id: null,
    selectedFeature: "",
    selectedGroups: [],
    attributeValues: {},
    attribute_values: [],
  });

  const [attributeSets, setAllAttributeSets] = useState<AttributeSets[]>([]);
  const [selectedFeatureData, setSelectedFeatureData] =
    useState<AttributeSets | null>(null);

  useEffect(() => {
    const getAttributSets = async () => {
      const { data, error } = await supabase
        .from("materials_attribute_sets")
        .select("*");
      console.log(data);
      if (!error) {
        setAllAttributeSets(data);
      }
    };
    getAttributSets();
  }, []);

  const handleInputChange = () => {};
  const handleFeatureSelect = (e: any) => {
    const data = attributeSets.find((d) => d.id == e.target.value);
    console.log(data);
  };

  console.log(selectedFeatureData);
  const handleGroupToggle = () => {};
  const handleAttributeChange = () => {};
  const handleSubmit = () => {};
  const handleCancel = () => {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Products
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Product
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Product Name *" />
              <input type="text" placeholder="SKU *" />
              <input type="text" placeholder="Brand ID *" />
              <input type="text" placeholder="Description *" />
            </div>
          </div>
        </div>

        {/* Feature Selection */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Product Features
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <select
              onChange={handleFeatureSelect}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="No">Select Feature *</option>
              {attributeSets.map((d: any) => {
                return (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Attribute Configuration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Attribute Configuration
            </h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Dynamically render selected group attributes here */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium mb-4">Group Name</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Attribute inputs */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwatchAddPage;
