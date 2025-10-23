// import { useEffect, useState } from "react";

// import { DynamicForm, EnhancedAttributeInput, FormField } from "./CustomInputs";
// import { supabase } from "@/lib/supabase";
// import { Trash } from "lucide-react";

// export interface VariantModal {
//   id?: number | null;
//   product_id?: number | null;
//   sku: string;
//   price: number;
//   stock: number;
//   variant?: any[];
//   [key: string]: string | number | any[] | null | undefined;
// }

// const productField: FormField[] = [
//   {
//     id: "name",
//     label: "Product Name",
//     type: "text",
//     placeholder: "Enter product name",
//     required: true,
//   },
//   {
//     id: "brand_id",
//     label: "Brand",
//     type: "select",
//     required: true,
//     options: [
//       { value: 1, label: "Apple" },
//       { value: 2, label: "Samsung" },
//       { value: 3, label: "Google" },
//       { value: 4, label: "Microsoft" },
//     ],
//   },
//   {
//     id: "product_category_id",
//     label: "Category",
//     type: "select",
//     required: true,
//     options: [
//       { value: 1, label: "Electronics" },
//       { value: 2, label: "Clothing" },
//       { value: 3, label: "Home & Garden" },
//       { value: 4, label: "Sports" },
//     ],
//   },
//   {
//     id: "product_attribute_set_id",
//     label: "Attribute Set",
//     type: "select",
//     required: true,
//     options: [
//       { value: 1, label: "Basic Attributes" },
//       { value: 2, label: "Advanced Attributes" },
//       { value: 3, label: "Premium Attributes" },
//     ],
//   },
//   {
//     id: "description",
//     label: "Description",
//     type: "textarea",
//     placeholder: "Enter product description",
//     rows: 4,
//   },
//   {
//     id: "base_price",
//     label: "Base Price",
//     type: "number",
//     placeholder: "0.00",
//     required: true,
//     min: 0,
//     defaultValue: 0,
//   },
//   {
//     id: "photo",
//     label: "Product Photo",
//     type: "file",
//     accept: "image/*",
//   },
// ];

// interface Product {
//   id?: number;
//   name: string;
//   brand_id: number;
//   product_category_id: number;
//   product_attribute_set_id: number;
//   description?: string;
//   photo?: string;
//   base_price: number;
// }

// const SwatchAddPage = () => {
//   const [step, setStep] = useState(1);
//   const [product, setProduct] = useState<Record<string, any>>({});
//   const [attributes, setAttributes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [productFields, setProductFields] = useState<FormField[]>([]);

//   useEffect(() => {
//     const fetchAttibutes = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("product_attributes")
//           .select("*");
//         if (!error) {
//           setAttributes(data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchBrandsandCategories = async () => {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from("product_brand")
//           .select("*");
//         const { data: cat, error: err } = await supabase
//           .from("product_categories")
//           .select("*");
//         if (!error && !err) {
//           const copied = structuredClone(productField);
//           const option = data.map((d) => {
//             return {
//               value: d.id,
//               label: d.name,
//             };
//           });

//           const option2 = cat.map((d) => {
//             return {
//               value: d.id,
//               label: d.name,
//             };
//           });
//           const index = copied.findIndex((d) => d.id == "brand_id");
//           const index2 = copied.findIndex((d) => d.id == "product_category_id");
//           copied[index].options = option;
//           copied[index2].options = option2;
//           setProductFields(copied);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };

//     fetchAttibutes();
//     fetchBrandsandCategories();
//   }, []);

//   const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
//   const [attributeValues, setAttributeValues] = useState<Record<number, any[]>>(
//     {}
//   );

//   const handleAddAttribute = (attributeId: number) => {
//     if (!selectedAttributes.includes(attributeId)) {
//       setSelectedAttributes([...selectedAttributes, attributeId]);
//       setAttributeValues({
//         ...attributeValues,
//         [attributeId]: [],
//       });
//     }
//   };

//   const handleRemoveAttribute = (attributeId: number) => {
//     setSelectedAttributes(
//       selectedAttributes.filter((id) => id !== attributeId)
//     );
//     const newAttributeValues = { ...attributeValues };
//     delete newAttributeValues[attributeId];
//     setAttributeValues(newAttributeValues);
//   };

//   const handleAttributeValuesChange = (attributeId: number, values: any[]) => {
//     setAttributeValues({
//       ...attributeValues,
//       [attributeId]: values,
//     });
//   };

//   const handleNext = () => {
//     if (step == 2) {
//       const finalData = {
//         product,
//         attributes: attributeValues,
//       };

//       let final: {
//         [key: string]: any[];
//       } = {};

//       let localCount = 1;

//       for (let [attrId, values] of Object.entries(finalData.attributes)) {
//         const finalattributes = (values as any[])
//           .filter((d) => d.isVariant)
//           .map((d) => ({
//             id: localCount++,
//             product_id: finalData.product.id ?? 1,
//             attribute_id: attrId,
//             value: d.value,
//             is_variant_value: d.isVariant,
//           }));

//         if (attributes.length > 0) {
//           const attrib = attributes.find((d) => d.id == attrId);
//           const key = attrib.name;
//           final[key] = finalattributes; // only include if non-empty
//         }
//       }

//       setVary(final);
//       console.log(final);
//     }
//     setStep(step + 1);
//   };

//   const handlePrev = () => {
//     setStep(step - 1);
//   };

//   const [variant, setVariant] = useState<VariantModal[]>([]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//     index: number
//   ) => {
//     const copied = structuredClone(variant);
//     const { name, value, type } = e.target;
//     const singleVariant = copied[index];

//     if (!singleVariant) return;

//     const key = name as keyof VariantModal;

//     if (type === "number") {
//       singleVariant[key] = Number(value) as VariantModal[typeof key];
//     } else if (type === "select-one") {
//       singleVariant[key] = value as VariantModal[typeof key];
//     } else {
//       singleVariant[key] = value as VariantModal[typeof key];
//     }

//     setVariant(copied);
//   };

//   const handleAddVariant = () => {
//     setVariant([...variant, { sku: "", price: 0, stock: 0, variant: [] }]);
//   };

//   const deleteVariant = (id: number) => {
//     const copied = structuredClone(variant);
//     const filtered = copied.filter((d, index) => index !== id);
//     console.log(filtered);
//     setVariant(filtered);
//   };

//   const [vary, setVary] = useState<{ [key: string]: any }>({});

//   const handleSubmit = () => {
//     console.log(variant);
//   };

//   const getSelectedAttributeObjects = () => {
//     return selectedAttributes
//       .map((id) => attributes.find((attr) => attr.id === id))
//       .filter(Boolean);
//   };

//   const handleVariantSelect = (
//     attributeName: string,
//     selectedOptionId: number,
//     index: number
//   ) => {
//     const optionsForAttribute = vary[attributeName] || [];
//     const selectedOption = optionsForAttribute.find(
//       (opt: any) => opt.id === selectedOptionId
//     );
//     if (!selectedOption) return;

//     const copied = structuredClone(variant);
//     const singleVariant = copied[index];

//     const newVariant = (singleVariant.variant || []).filter(
//       (v: any) => v.attribute !== attributeName
//     );

//     newVariant.push({
//       attribute: attributeName,
//       value: selectedOption,
//     });

//     singleVariant.variant = newVariant;
//     setVariant(copied);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Enhanced Product Creator
//           </h1>
//           <div className="flex justify-center items-center space-x-4">
//             <div
//               className={`flex items-center ${
//                 step >= 1 ? "text-blue-600" : "text-gray-400"
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                   step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
//                 }`}
//               >
//                 1
//               </div>
//               <span className="ml-2">Product Info</span>
//             </div>
//             <div className="w-12 h-1 bg-gray-300"></div>
//             <div
//               className={`flex items-center ${
//                 step >= 2 ? "text-blue-600" : "text-gray-400"
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                   step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
//                 }`}
//               >
//                 2
//               </div>
//               <span className="ml-2">Attributes</span>
//             </div>
//             <div className="w-12 h-1 bg-gray-300"></div>
//             <div
//               className={`flex items-center ${
//                 step >= 3 ? "text-blue-600" : "text-gray-400"
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                   step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"
//                 }`}
//               >
//                 3
//               </div>
//               <span className="ml-2">Review</span>
//             </div>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {step === 1 && "Product Information"}
//               {step === 2 && "Product Attributes"}
//               {step === 3 && "Review & Submit"}
//             </h2>
//             <p className="text-gray-600 mt-2">
//               {step === 1 && "Enter basic product details"}
//               {step === 2 &&
//                 "Add attributes with variant and non-variant values"}
//               {step === 3 && "Review all information before submitting"}
//             </p>
//           </div>

//           <div className="p-8">
//             {step === 1 && !loading ? (
//               <DynamicForm
//                 fields={productFields}
//                 formData={product}
//                 setFormData={setProduct}
//                 className=""
//               />
//             ) : (
//               <>Loading</>
//             )}

//             {step === 2 && (
//               <div className="space-y-6">
//                 {/* Attribute Selection */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">
//                     Available Attributes
//                   </h3>
//                   <div className="flex flex-wrap gap-3">
//                     {attributes.map((attr) => (
//                       <button
//                         key={attr.id}
//                         onClick={() => handleAddAttribute(attr.id)}
//                         disabled={selectedAttributes.includes(attr.id)}
//                         className={`px-4 py-2 rounded-lg border transition-colors ${
//                           selectedAttributes.includes(attr.id)
//                             ? "bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed"
//                             : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                         }`}
//                       >
//                         {attr.name} ({attr.data_type})
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 {/* Selected Attributes */}
//                 {getSelectedAttributeObjects().length > 0 && (
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">
//                       Configure Attributes
//                     </h3>
//                     {getSelectedAttributeObjects().map((attr) => (
//                       <EnhancedAttributeInput
//                         key={attr.id}
//                         attribute={attr}
//                         values={attributeValues[attr.id] || []}
//                         onChange={handleAttributeValuesChange}
//                         onRemove={handleRemoveAttribute}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Variant Choose</h3>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex gap-2">
//                       <button onClick={handleAddVariant}>Manually Add</button>
//                       <button>Generate</button>
//                       <button>Mass Action</button>
//                     </div>

//                     {variant.length > 0 &&
//                       variant.map((single: any, index: number) => {
//                         return (
//                           <div className="p-2 border-2 border-black mt-2">
//                             <button onClick={() => deleteVariant(index)}>
//                               <Trash />
//                             </button>
//                             {(
//                               Object.keys(single!) as (keyof typeof single)[]
//                             ).map((d: any) => {
//                               let label =
//                                 d.charAt(0).toUpperCase() + d.slice(1);
//                               if (label !== "Variant") {
//                                 return (
//                                   <InputTypeNumberandText
//                                     handleInputChange={handleChange}
//                                     type={d == "sku" ? "text" : "number"}
//                                     label={label}
//                                     name={d}
//                                     required={true}
//                                     value={single[d]}
//                                     placeholder={`Enter ${label}`}
//                                     min={0}
//                                     index={index}
//                                   />
//                                 );
//                               }
//                             })}
//                             {Object.entries(vary).map(
//                               ([attributeName, options]: any) => {
//                                 const selected = single.variant?.find(
//                                   (v: any) => v.attribute === attributeName
//                                 )?.value?.id;

//                                 return (
//                                   <div key={attributeName}>
//                                     <label className="block mb-1 font-medium">
//                                       {attributeName}
//                                     </label>
//                                     <select
//                                       value={selected || ""}
//                                       onChange={(e) =>
//                                         handleVariantSelect(
//                                           attributeName,
//                                           Number(e.target.value),
//                                           index
//                                         )
//                                       }
//                                       className="w-full p-2 border rounded"
//                                     >
//                                       <option value="">
//                                         Select {attributeName}
//                                       </option>
//                                       {options.map((opt: any) => (
//                                         <option key={opt.id} value={opt.id}>
//                                           {opt.value}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>
//                                 );
//                               }
//                             )}
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-center gap-4">
//           {step > 1 && (
//             <button
//               onClick={handlePrev}
//               className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               Previous
//             </button>
//           )}

//           {step < 3 ? (
//             <button
//               onClick={handleNext}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Submit Product
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SwatchAddPage;

// export const InputTypeNumberandText = ({
//   handleInputChange,
//   type,
//   label,
//   required,
//   value,
//   placeholder,
//   min,
//   name,
//   index,
// }: any) => {
//   const baseClasses =
//     "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400";
//   return (
//     <>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={value}
//         onChange={(e) => handleInputChange(e, index)}
//         placeholder={placeholder}
//         required={required}
//         min={min}
//         className={baseClasses}
//       />
//     </>
//   );
// };

// export const InputSelect = ({
//   handleInputChange,
//   label,
//   required,
//   value,
//   options,
//   name,
// }: any) => {
//   console.log("===>>", options);
//   const baseClasses =
//     "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400";
//   return (
//     <>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <select
//         id={name}
//         value={value}
//         name={name}
//         onChange={(e) => handleInputChange(e)}
//         required={required}
//         className={`${baseClasses} bg-white`}
//       >
//         {options?.map((option: any) => (
//           <option key={option.id} value={option.value}>
//             {option.value}
//           </option>
//         ))}
//       </select>
//     </>
//   );
// };
