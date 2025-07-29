import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";

// Type definitions
interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface UnitData {
  name: string;
  symbol: string;
}

interface Attribute {
  id: number;
  name: string;
  input_type: "text" | "number" | "select";
  unit_id?: UnitData;
  options?: string[];
}

interface AttributeValue {
  value: number | string;
  unit: string | null;
  keyname: string;
}

interface ProductVariant {
  [key: string]: AttributeValue | number | string;
  price: number;
}

interface ProductData {
  title: string;
  description: string;
  sku: string;
  material_subcategory_id: number | null;
  brand_id: number;
  image_url?: string;
  is_available: boolean;
  attribute_values: ProductVariant[];
}

interface SwatchBookAddModalProps {
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edit?: number | null;
}

interface CurrentVariant {
  [key: string]: AttributeValue | number | null;
  price: number | null;
}

export default function SwatchBookAddModal({
  categories,
  open,
  onOpenChange,
  edit,
}: SwatchBookAddModalProps): JSX.Element {
  const [selectionfn, setSelectionfn] = useState<ProductData>({
    title: "",
    description: "",
    sku: "",
    material_subcategory_id: null,
    brand_id: 2,
    is_available: true,
    attribute_values: [],
  });

  const [subcat, setSubCat] = useState<Subcategory[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [materialid, setMaterialId] = useState<number | null>(null);

  // Current variant being built
  const [currentVariant, setCurrentVariant] = useState<CurrentVariant>({
    price: null,
  });

  useEffect(() => {
    const updateEdit = async (): Promise<void> => {
      if (!edit) return;

      const { data, error } = await supabase
        .from("products")
        .select(
          `title, description, material_subcategory_id, brand_id, is_available, attribute_values, sku`
        )
        .eq("id", edit)
        .single();

      if (error) {
        console.error("Failed to fetch product:", error.message);
        return;
      }

      if (data) {
        setSelectionfn({
          title: data.title || "",
          description: data.description || "",
          sku: data.sku || "",
          material_subcategory_id: data.material_subcategory_id || null,
          brand_id: data.brand_id || 2,
          is_available: data.is_available ?? true,
          attribute_values: data.attribute_values || [],
        });

        // Fetch the subcategory to get its category_id
        const { data: subcatRecord } = await supabase
          .from("material_subcategories")
          .select("*")
          .eq("id", data.material_subcategory_id)
          .single();

        if (subcatRecord) {
          setMaterialId(subcatRecord.category_id);

          if (subcatRecord.category_id) {
            // Fetch all subcategories under that category
            const { data: subcategories } = await supabase
              .from("material_subcategories")
              .select("*")
              .eq("category_id", subcatRecord.category_id);

            setSubCat(subcategories || []);
          }
        }

        // Fetch attributes for the subcategory
        const { data: attributeData } = await supabase
          .from("material_attributes")
          .select(`*,unit_id(name, symbol)`)
          .eq("material_subcategory_id", data.material_subcategory_id);

        setAttributes(attributeData || []);
      }
    };

    updateEdit();
  }, [edit]);

  console.log(selectionfn);

  useEffect(() => {
    if (!open && !edit) {
      // Reset only if the modal is closed and not in edit mode
      setSelectionfn({
        title: "",
        description: "",
        sku: "",
        material_subcategory_id: null,
        brand_id: 2,
        is_available: true,
        attribute_values: [],
      });
      setSubCat([]);
      setAttributes([]);
      setImage(null);
      setMaterialId(null);
      setCurrentVariant({
        price: null,
      });
    }
  }, [open, edit]);

  const handleSelectCategory = async (id: string): Promise<void> => {
    const categoryId = Number(id);
    const { data } = await supabase
      .from("material_subcategories")
      .select("*")
      .eq("category_id", categoryId);
    setSubCat(data || []);
  };

  const handleSelectSubCategory = async (id: string): Promise<void> => {
    const subcatId = Number(id);
    setSelectionfn((prev) => ({ ...prev, material_subcategory_id: subcatId }));
    const { data } = await supabase
      .from("material_attributes")
      .select(`*,unit_id(name, symbol)`)
      .eq("material_subcategory_id", subcatId);
    setAttributes(data || []);
    // Reset current variant when subcategory changes
    setCurrentVariant({
      price: null,
    });
  };

  const handleAttributeChange = (
    attrName: string,
    value: number | string | null,
    unit: string | null | undefined,
    keyname: string
  ): void => {
    console.log(unit, value);
    setCurrentVariant((prev) => ({
      ...prev,
      [attrName]: {
        value: value || "",
        unit: unit || "",
        keyname,
      },
    }));
  };

  const handleVariantAdd = (): void => {
    // Validate that we have at least price
    if (currentVariant.price === null) {
      toast.error("Please fill in Price");
      return;
    }

    // Create the variant object
    const newVariant: ProductVariant = {
      price: currentVariant.price as number,
    };

    // Add all attribute values to the variant
    attributes.forEach((attr) => {
      const attrValue = currentVariant[attr.name] as AttributeValue;
      if (attrValue) {
        newVariant[attr.name] = attrValue;
      }
    });

    setSelectionfn((prev) => ({
      ...prev,
      attribute_values: [...prev.attribute_values, newVariant],
    }));

    // Reset current variant
    const resetVariant: CurrentVariant = {
      price: null,
    };

    // Reset all attribute fields
    attributes.forEach((attr) => {
      resetVariant[attr.name] = {
        value: 0,
        unit: "",
        keyname: attr.name,
      };
    });

    setCurrentVariant(resetVariant);
  };

  const handleVariantRemove = (index: number): void => {
    setSelectionfn((prev) => ({
      ...prev,
      attribute_values: prev.attribute_values.filter((_, idx) => idx !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    selectionfn: ProductData,
    edit: number | undefined | null
  ): Promise<void> => {
    e.preventDefault();
    if (edit) {
      const { data, error } = await supabase
        .from("products")
        .update({ ...selectionfn })
        .eq("id", edit)
        .single();

      return;
    }
    const { data, error } = await supabase
      .from("products")
      .insert({ ...selectionfn })
      .single();

    if (!error) {
      // ✅ Reset form fields
      setSelectionfn({
        title: "",
        description: "",
        sku: "",
        material_subcategory_id: null,
        brand_id: 2,
        is_available: true,
        attribute_values: [],
      });
      setSubCat([]);
      setAttributes([]);
      setImage(null);
      setCurrentVariant({
        price: null,
      });
    }
  };

  const handleInputChange = (
    field: keyof ProductData,
    value: string | number | boolean
  ): void => {
    setSelectionfn((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader className="">
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product Title */}
          <div>
            <Label htmlFor="title">Product Title</Label>
            <Input
              value={selectionfn.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("title", e.target.value)
              }
              id="title"
              placeholder="Enter product title"
            />
          </div>

          {/* SKU */}
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              value={selectionfn.sku}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("sku", e.target.value)
              }
              id="sku"
              placeholder="e.g., WALL123"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Material Category</Label>
            <Select
              value={materialid?.toString()}
              onValueChange={handleSelectCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a Material Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: Category) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div>
            <Label htmlFor="subcategory">Material SubCategory</Label>
            <Select
              value={selectionfn.material_subcategory_id?.toString() || ""}
              onValueChange={handleSelectSubCategory}
            >
              <SelectTrigger id="subcategory">
                <SelectValue placeholder="Select a Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcat.map((s: Subcategory) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description - spans full width */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              value={selectionfn.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("description", e.target.value)
              }
              id="description"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Variant Builder Section */}
          {attributes && attributes.length > 0 && (
            <div className="md:col-span-2 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Add Product Variant
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Price */}
                <div>
                  <Label htmlFor="variant-price">Price</Label>
                  <Input
                    value={
                      currentVariant.price === null
                        ? ""
                        : currentVariant.price.toString()
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCurrentVariant((prev) => ({
                        ...prev,
                        price: e.target.value ? Number(e.target.value) : null,
                      }));
                    }}
                    id="variant-price"
                    type="number"
                    placeholder="e.g., 99.99"
                  />
                </div>

                {/* Attributes */}
                {attributes.map((attr: Attribute) => (
                  <VariantAttributeInput
                    key={attr.id}
                    attribute={attr}
                    value={
                      typeof currentVariant[attr.name] === "object" &&
                      currentVariant[attr.name] !== null
                        ? (currentVariant[attr.name] as AttributeValue).value
                        : null
                    }
                    unit={
                      typeof currentVariant[attr.name] === "object" &&
                      currentVariant[attr.name] !== null
                        ? (currentVariant[attr.name] as AttributeValue).unit
                        : null
                    }
                    onChange={(value, unit) =>
                      handleAttributeChange(attr.name, value, unit, attr.name)
                    }
                  />
                ))}
              </div>

              <Button onClick={handleVariantAdd} className="w-full">
                Add Variant
              </Button>
            </div>
          )}

          {/* Display Added Variants */}
          {selectionfn.attribute_values.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
              <div className="space-y-3">
                {selectionfn.attribute_values.map((variant, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 flex-1">
                        <div>
                          <span className="font-medium">Price:</span>{" "}
                          {variant.price}
                        </div>
                        {Object.entries(variant).map(([key, value]) => {
                          if (key === "price") return null;
                          if (typeof value === "object" && value !== null) {
                            const attrValue = value as AttributeValue;
                            return (
                              <div key={key}>
                                <span className="font-medium">
                                  {attrValue.keyname}:
                                </span>{" "}
                                {attrValue.value}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <Button
                        onClick={() => handleVariantRemove(index)}
                        className="bg-transparent hover:bg-transparent shadow-none hover:border-none border-none text-red-500"
                      >
                        <Cross1Icon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e, selectionfn, edit)}
            className="bg-transparent border border-green-900 text-black hover:text-white hover:bg-green-900 hover:border-0"
          >
            Add Material
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// VariantAttributeInput Component for building variants
interface VariantAttributeInputProps {
  attribute: Attribute;
  value: number | string | null;
  unit: string | null;
  onChange: (
    value: number | string | null,
    unit: string | null | undefined
  ) => void;
}

function VariantAttributeInput({
  attribute,
  value,
  unit,
  onChange,
}: VariantAttributeInputProps): JSX.Element {
  return (
    <div className="space-y-2">
      <Label htmlFor={`variant-attr-${attribute.id}`}>
        {attribute.name}
        {attribute.unit_id && (
          <span className="text-muted-foreground text-sm ml-1">
            ({attribute.unit_id.symbol})
          </span>
        )}
      </Label>

      <Input
        id={`variant-attr-${attribute.id}`}
        type={attribute.input_type}
        value={value === null ? "" : value.toString()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value ? e.target.value : null;
          onChange(newValue, attribute.unit_id?.name);
        }}
        placeholder={`Enter ${attribute.name}`}
      />
    </div>
  );
}

// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { X } from "lucide-react";
// import { Cross1Icon } from "@radix-ui/react-icons";

// export default function SwatchBookAddModal({
//   categories,
//   open,
//   onOpenChange,
//   edit,
// }: any) {
//   const [selectionfn, setSelectionfn] = useState<{
//     title: string;
//     description: string;
//     sku: string;
//     material_subcategory_id: number | null;
//     brand_id: number;
//     image_url?: string;
//     price: {
//       size: {
//         value: number | null;
//         unit: string | null;
//       };
//       price: number | null;
//     }[];
//     is_available: boolean;
//     attribute_values: {
//       [key: string]: {
//         value: string;
//         unit: string;
//       }[];
//     };
//   }>({
//     title: "",
//     description: "",
//     sku: "",
//     material_subcategory_id: null,
//     brand_id: 1,
//     price: [],
//     is_available: true,
//     attribute_values: {},
//   });
//   const [subcat, setSubCat] = useState<any[] | null>([]);
//   const [attributes, setAttributes] = useState<any[] | null>([]);
//   const [image, setImage] = useState<string | null>(null);
//   const [materialid, setMaterialId] = useState<number | null>(null);
//   const [variantData, setVariantData] = useState<{
//     size: {
//       value: number | null;
//       unit: string | null;
//     };
//     price: number | null;
//   }>({
//     size: {
//       value: null,
//       unit: null,
//     },
//     price: null,
//   });

//   useEffect(() => {
//     const updateEdit = async () => {
//       if (!edit) return;

//       const { data, error } = await supabase
//         .from("products")
//         .select(
//           `title, description, material_subcategory_id, brand_id, price, is_available, attribute_values, sku`
//         )
//         .eq("id", edit)
//         .single();

//       if (error) {
//         console.error("Failed to fetch product:", error.message);
//         return;
//       }

//       setSelectionfn({
//         title: data.title || "",
//         description: data.description || "",
//         sku: data.sku || "",
//         material_subcategory_id: data.material_subcategory_id || null,
//         brand_id: data.brand_id || 1,
//         price: data.price || [],
//         is_available: data.is_available ?? true,
//         attribute_values: data.attribute_values || {},
//       });

//       // Fetch the subcategory to get its category_id
//       const { data: subcatRecord } = await supabase
//         .from("material_subcategories")
//         .select("*")
//         .eq("id", data.material_subcategory_id)
//         .single();
//       setMaterialId(subcatRecord.category_id);

//       if (subcatRecord?.category_id) {
//         // Fetch all subcategories under that category
//         const { data: subcategories } = await supabase
//           .from("material_subcategories")
//           .select("*")
//           .eq("category_id", subcatRecord.category_id);

//         setSubCat(subcategories || []);
//       }

//       // Fetch attributes for the subcategory
//       const { data: attributeData } = await supabase
//         .from("material_attributes")
//         .select(`*,unit_id(name, symbol)`)
//         .eq("material_subcategory_id", data.material_subcategory_id);

//       setAttributes(attributeData || []);
//     };

//     updateEdit();
//   }, [edit]);

//   console.log(selectionfn);

//   useEffect(() => {
//     if (!open && !edit) {
//       // Reset only if the modal is closed and not in edit mode
//       setSelectionfn({
//         title: "",
//         description: "",
//         sku: "",
//         material_subcategory_id: null,
//         brand_id: 1,
//         price: [],
//         is_available: true,
//         attribute_values: {},
//       });
//       setSubCat([]);
//       setAttributes([]);
//       setImage(null);
//       setMaterialId(null);
//     }
//   }, [open, edit]);

//   const handleSelectCategory = async (id: string) => {
//     const categoryId = Number(id);
//     const { data } = await supabase
//       .from("material_subcategories ")
//       .select("*")
//       .eq("category_id", categoryId);
//     setSubCat(data);
//   };

//   const handleSelectSubCategory = async (id: string) => {
//     const subcatId = Number(id);
//     setSelectionfn((prev) => ({ ...prev, material_subcategory_id: subcatId }));
//     const { data } = await supabase
//       .from("material_attributes")
//       .select(`*,unit_id(name, symbol)`)
//       .eq("material_subcategory_id", subcatId);
//     setAttributes(data);
//   };

//   const handleAttrAdd = (name: string, unit: string, value: string) => {
//     if (!value) return;
//     setSelectionfn((prev) => ({
//       ...prev,
//       attribute_values: {
//         ...prev.attribute_values,
//         [name]: [...(prev.attribute_values[name] || []), { unit, value }],
//       },
//     }));
//   };

//   const handleAttrRemove = (name: string, index: number) => {
//     setSelectionfn((prev) => {
//       const updated = [...(prev.attribute_values[name] || [])];
//       updated.splice(index, 1);
//       return {
//         ...prev,
//         attribute_values: {
//           ...prev.attribute_values,
//           [name]: updated,
//         },
//       };
//     });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: any, selectionfn: any) => {
//     e.preventDefault();

//     const { data, error } = await supabase
//       .from("products")
//       .insert({ ...selectionfn })
//       .single();

//     if (!error) {
//       // ✅ Reset form fields
//       setSelectionfn({
//         title: "",
//         description: "",
//         sku: "",
//         material_subcategory_id: null,
//         brand_id: 1,
//         price: [],
//         is_available: true,
//         attribute_values: {},
//       });
//       setSubCat([]);
//       setAttributes([]);
//       setImage(null); // if image is used in future
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl w-full overflow-y-auto max-h-[90vh]">
//         <DialogHeader className="">
//           <DialogTitle>Add New Material</DialogTitle>
//         </DialogHeader>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//           {/* Product Title */}
//           <div>
//             <Label htmlFor="title">Product Title</Label>
//             <Input
//               value={selectionfn.title}
//               onChange={(e: any) => {
//                 const copied = { ...selectionfn };
//                 copied.title = e.target.value;
//                 setSelectionfn(copied);
//               }}
//               id="title"
//               placeholder="Enter product title"
//             />
//           </div>

//           {/* SKU */}
//           <div>
//             <Label htmlFor="sku">SKU</Label>
//             <Input
//               value={selectionfn.sku}
//               onChange={(e: any) => {
//                 const copied = { ...selectionfn };
//                 copied.sku = e.target.value;
//                 setSelectionfn(copied);
//               }}
//               id="sku"
//               placeholder="e.g., WALL123"
//             />
//           </div>

//           {/* Price */}
//           <div className="flex flex-col gap-1">
//             <div className="flex gap-1">
//               <div>
//                 <Label htmlFor="price">Price</Label>
//                 <Input
//                   value={variantData.price == null ? "" : variantData.price}
//                   onChange={(e: any) => {
//                     const copied = { ...variantData };
//                     copied.price = e.target.value;
//                     setVariantData(copied);
//                   }}
//                   id="price"
//                   type="number"
//                   placeholder="e.g., 99.99"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="size">Size</Label>
//                 <Input
//                   value={
//                     variantData.size.value == null ? "" : variantData.size.value
//                   }
//                   onChange={(e: any) => {
//                     const copied = { ...variantData };
//                     copied.size.value = e.target.value;
//                     setVariantData(copied);
//                   }}
//                   id="price"
//                   type="number"
//                   placeholder="e.g., 5.0"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="unit">Unit</Label>
//                 <Input
//                   value={
//                     variantData.size.unit == null ? "" : variantData.size.unit
//                   }
//                   onChange={(e: any) => {
//                     const copied = { ...variantData };
//                     copied.size.unit = e.target.value;
//                     setVariantData(copied);
//                   }}
//                   id="price"
//                   type="string"
//                   placeholder="Liter,Meter etc."
//                 />
//               </div>
//               <div className="flex flex-col justify-center items-start h-full">
//                 <div className="h-1/2"></div>
//                 <Button
//                   onClick={() => {
//                     const copied = { ...selectionfn };
//                     selectionfn.price.push(variantData!);
//                     setSelectionfn(copied);
//                     setVariantData({
//                       size: {
//                         value: null,
//                         unit: null,
//                       },
//                       price: null,
//                     });
//                   }}
//                 >
//                   Add
//                 </Button>
//               </div>
//             </div>
//             <ul className="flex gap-1 w-full flex-wrap">
//               {selectionfn.price.length !== 0 &&
//                 selectionfn.price.map((d: any, index: number) => {
//                   return (
//                     <li className="flex bg-gray-400 rounded-sm items-center">
//                       <div className="flex flex-col shrink-0 p-2 ">
//                         <span>Price: {d.price}</span>
//                         <span>
//                           Size: {d.size.value} {d.size.unit}
//                         </span>
//                       </div>
//                       <Button
//                         onClick={() => {
//                           const finalFiltered = selectionfn.price.filter(
//                             (d, idx) => idx !== index
//                           );
//                           const copied = { ...selectionfn };
//                           copied.price = finalFiltered;
//                           setSelectionfn(copied);
//                         }}
//                         className="bg-transparent hover:bg-transparent shadow-none hover:border-none border-none"
//                       >
//                         <Cross1Icon />
//                       </Button>
//                     </li>
//                   );
//                 })}
//             </ul>
//           </div>
//           {/* Category */}
//           <div>
//             <Label htmlFor="category">Material Category</Label>
//             <Select
//               value={
//                 subcat?.find((d) => d.id === materialid)?.category_id // safe access
//               }
//               onValueChange={handleSelectCategory}
//             >
//               <SelectTrigger id="category">
//                 <SelectValue placeholder="Select a Material Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((cat: any) => (
//                   <SelectItem key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Subcategory */}
//           <div>
//             <Label htmlFor="subcategory">Material SubCategory</Label>
//             <Select
//               value={
//                 subcat?.find(
//                   (d) => d.id === selectionfn.material_subcategory_id
//                 )?.id // safe access
//               }
//               onValueChange={handleSelectSubCategory}
//             >
//               <SelectTrigger id="subcategory">
//                 <SelectValue placeholder="Select a Subcategory" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subcat?.map((s: any) => (
//                   <SelectItem key={s.id} value={s.id}>
//                     {s.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           {/* Upload Image */}
//           {/* <div>
//             <Label htmlFor="image">Upload Image</Label>
//             <Input
//               id="image"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//             {image && (
//               <img
//                 src={image}
//                 alt="Preview"
//                 className="mt-2 w-32 h-32 object-cover rounded border"
//               />
//             )}
//           </div> */}

//           {/* Description - spans full width */}
//           <div className="md:col-span-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               value={selectionfn.description}
//               onChange={(e: any) => {
//                 const copied = { ...selectionfn };
//                 copied.description = e.target.value;
//                 setSelectionfn(copied);
//               }}
//               id="description"
//               placeholder="Enter product description"
//               rows={3}
//             />
//           </div>

//           {/* Attributes - spans full width */}
//           <div className="md:col-span-2 grid gap-4">
//             {attributes?.map((attr: any) => (
//               <AttributeInput
//                 key={attr.id}
//                 attribute={attr}
//                 values={selectionfn.attribute_values[attr.name] || []}
//                 onAdd={handleAttrAdd}
//                 onRemove={handleAttrRemove}
//               />
//             ))}
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             type="submit"
//             onClick={(e) => handleSubmit(e, selectionfn)}
//             className="bg-transparent border border-green-900 text-black hover:text-white hover:bg-green-900 hover:border-0"
//           >
//             Add Material
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // AttributeInput Component
// interface Attribute {
//   id: number;
//   name: string;
//   input_type: "text" | "number" | "select";
//   unit_id?: {
//     name: string;
//     symbol: string;
//   };
//   options?: string[];
// }

// interface AttributeInputProps {
//   attribute: Attribute;
//   values: {
//     value: string;
//     unit: string;
//   }[];
//   onAdd: (name: string, unit: string, value: string) => void;
//   onRemove: (name: string, index: number) => void;
// }

// function AttributeInput({
//   attribute,
//   values,
//   onAdd,
//   onRemove,
// }: AttributeInputProps) {
//   const [inputValue, setInputValue] = useState("");

//   const handleAdd = () => {
//     if (inputValue.trim()) {
//       onAdd(attribute.name, attribute.unit_id?.symbol || "", inputValue.trim());
//       setInputValue("");
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <Label htmlFor={`attr-${attribute.id}`}>
//         {attribute.name}
//         {attribute.unit_id && (
//           <span className="text-muted-foreground text-sm ml-1">
//             ({attribute.unit_id.symbol})
//           </span>
//         )}
//       </Label>

//       {attribute.input_type === "select" && attribute.options ? (
//         <Select
//           onValueChange={(val) =>
//             onAdd(attribute.name, attribute.unit_id?.symbol || "", val)
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder={`Select ${attribute.name}`} />
//           </SelectTrigger>
//           <SelectContent>
//             {attribute.options.map((opt) => (
//               <SelectItem key={opt} value={opt}>
//                 {opt}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       ) : (
//         <div className="flex gap-2">
//           <Input
//             id={`attr-${attribute.id}`}
//             type={attribute.input_type}
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//           />
//           <Button type="button" onClick={handleAdd}>
//             Add
//           </Button>
//         </div>
//       )}

//       {/* Display Added Values */}
//       <div className="flex flex-wrap gap-2">
//         {values.map((val, idx) => (
//           <span
//             key={idx}
//             className="flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded-full"
//           >
//             {val.value}
//             <button
//               className="ml-1 text-red-500 hover:text-red-700"
//               onClick={() => onRemove(attribute.name, idx)}
//               type="button"
//             >
//               <X className="w-3 h-3" />
//             </button>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }
