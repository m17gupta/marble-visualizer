// import React, { useEffect, useState } from "react";
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
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { Badge } from "@/components/ui/badge";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Cross1Icon } from "@radix-ui/react-icons";
// import { toast } from "sonner";
// import { boolean } from "zod";

// // Types

// function helper(rawData: any) {
//   const grouped: any = {};

//   for (const item of rawData) {
//     const group = item.attribute_group_id;
//     const attrId = item.attribute_id.id;

//     if (!grouped[group.id]) {
//       grouped[group.id] = {
//         name: group.name,
//         attribute_set_id: null,
//         sort_order: group.sort_order,
//         attribute_ids: [],
//       };
//     }

//     grouped[group.id].attribute_ids.push(attrId);
//   }

//   // Convert to array
//   const finalArray = Object.values(grouped);

//   return finalArray;
// }

// interface product_attributes_groups {
//   name: string;
//   attribute_set_id: number | null;
//   sort_order: number | null;
//   attribute_ids?: number[];
// }

// export default function AttributeSetAddModal() {
//   const [attributeset, setAttributeSet] = useState<{
//     name: string;
//     category_id: number | null;
//   }>({
//     name: "",
//     category_id: 0,
//   });

//   const [allAttributes, setAllAttributes] = useState<any[]>([]);
//   const [product_categories, setProduct_categories] = useState<any[]>([]);

//   const [group, setGroup] = useState<product_attributes_groups[]>([]);
//   const [preDefined, setPredfined] = useState<any[]>([]);
//   const handleAddGroup = () => {
//     const gp = [...group];
//     gp.push({
//       name: "",
//       attribute_set_id: null,
//       sort_order: null,
//       attribute_ids: [],
//     });
//     setGroup(gp);
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: attributes } = await supabase
//         .from("product_attributes")
//         .select("id, name");

//       const { data: subcats } = await supabase
//         .from("product_categories")
//         .select("*");

//       const { data: p_att_group_att } = await supabase
//         .from("product_attribute_group_attributes")
//         .select(
//           `id, attribute_group_id(id,name,sort_order), attribute_id(id,name)`
//         );
//       if (attributes && subcats && p_att_group_att) {
//         setAllAttributes(attributes);
//         setProduct_categories(subcats);
//         setPredfined(helper(p_att_group_att));
//       }
//     };
//     fetchData();
//   }, []);

//   const handleToggleAttribute = (attId: number, index: number) => {
//     const findContains = [...group];
//     const isIncluded = findContains[index].attribute_ids?.includes(attId);
//     if (isIncluded) {
//       findContains[index].attribute_ids = findContains[
//         index
//       ].attribute_ids?.filter((d) => d !== attId);
//       setGroup(findContains);
//     } else {
//       findContains[index].attribute_ids?.push(attId);
//       setGroup(findContains);
//     }
//   };

//   const handleSaveAttributeSet = async (e: any) => {
//     e.stopPropagation();
//     const product_attribute_set = {
//       name: attributeset.name,
//       category_id: attributeset.category_id,
//     };
//     const { data: product, error: error_set } = await supabase
//       .from("product_attribute_sets")
//       .insert(product_attribute_set)
//       .select()
//       .single();
//     if (product?.id!) {
//       const product_attribute_groups = group.map(
//         (g: product_attributes_groups) => {
//           return {
//             name: g.name,
//             attribute_set_id: product?.id,
//             sort_order: g.sort_order,
//           };
//         }
//       );
//       const { data: groups_ids, error: group_error } = await supabase
//         .from("product_attribute_groups")
//         .insert(product_attribute_groups)
//         .select("id, name");

//       if (!group_error) {
//         const product_attribute_groups_attributes = group
//           .map((d) => d.attribute_ids)
//           .flat();
//         const newArray = [];
//         for (let i = 0; i < groups_ids.length; i++) {
//           let id = groups_ids[i].id;
//           for (let j = 0; j < product_attribute_groups_attributes.length; j++) {
//             newArray.push({
//               attribute_group_id: id,
//               attribute_id: product_attribute_groups_attributes[j],
//             });
//           }
//         }
//         const { data, error } = await supabase
//           .from("product_attribute_group_attributes")
//           .insert(newArray)
//           .select();
//         if (!error) {
//           toast.success("Attribute Set is Created");
//           setGroup([]);
//           setAttributeSet({
//             name: "",
//             category_id: 0,
//           });
//         }
//       }
//     }
//   };

//   const handleAddPreDefinedGroup = (e: any) => {
//     console.log(e.target.value);
//     const copy = [...group];
//     const isPresent = copy.find((d: any) => d.name == e.target.vaue);
//     if (isPresent == undefined) {
//       copy.push([...preDefined].find((d: any) => (d.name = e.target.value)));
//       setGroup(copy);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Attribute Set</Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-xl w-full overflow-y-auto max-h-[90vh]">
//         <DialogHeader>
//           <DialogTitle>Add Attribute Set</DialogTitle>
//         </DialogHeader>

//         <div>
//           <Label htmlFor="attr-set-name">Name</Label>
//           <Input
//             id="attr-set-name"
//             value={attributeset.name}
//             onChange={(e) =>
//               setAttributeSet((prev) => ({ ...prev, name: e.target.value }))
//             }
//             placeholder="e.g., Paint Attributes"
//           />
//         </div>

//         <div className="mt-4">
//           <Label htmlFor="subcategory">Product Categories</Label>
//           <Select
//             value={String(attributeset.category_id)}
//             onValueChange={(value) =>
//               setAttributeSet((prev) => ({
//                 ...prev,
//                 category_id: Number(value),
//               }))
//             }
//           >
//             <SelectTrigger id="subcategory">
//               <SelectValue placeholder="Select Product Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={String(0)}>Please Select Category</SelectItem>
//               {product_categories.map((s) => (
//                 <SelectItem key={s.id} value={s.id.toString()}>
//                   {s.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="mt-6 flex items-center gap-1">
//           <div className="">
//             <Label>Select Attributes</Label>
//             <select
//               onChange={(e: any) => {
//                 handleAddPreDefinedGroup(e);
//               }}
//               className="border rounded px-2 py-1 text-sm"
//             >
//               {preDefined.map((d: any, idx: number) => {
//                 const isSelected = group.find((g: any) => g.name === d.name);
//                 return (
//                   <option
//                     key={idx}
//                     value={d.name}
//                     className={`${isSelected ? "bg-green-200" : "bg-gray-300"}`}
//                     disabled={isSelected && isSelected !== undefined}
//                   >
//                     {d.name}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           <Button onClick={handleAddGroup}>+ Group</Button>
//         </div>

//         {group.map((d: any, index: number) => {
//           return (
//             <div key={index} className="">
//               <div className="flex gap-1 items-center">
//                 <Label className="w-3/12" htmlFor="groupname">
//                   Group Name
//                 </Label>
//                 <Input
//                   id="groupname"
//                   value={d.name}
//                   onChange={(e) => {
//                     const copy = [...group];
//                     copy[index].name = e.target.value;
//                     copy[index].sort_order = index + 1;
//                     setGroup(copy);
//                   }}
//                   placeholder="e.g., Paint Attributes"
//                   className="w-8/12"
//                 />
//                 <Button
//                   onClick={() => {
//                     setGroup((prev) =>
//                       [...prev].filter((d, idx) => idx !== index)
//                     );
//                   }}
//                 >
//                   <Cross1Icon />
//                 </Button>
//               </div>
//               <div className="mt-6">
//                 <Label>Select Attributes</Label>
//                 <SearchableMultiSelect
//                   allAttributes={allAttributes}
//                   selectedIds={group?.[index].attribute_ids!}
//                   onToggle={handleToggleAttribute}
//                   index={index}
//                 />
//               </div>
//             </div>
//           );
//         })}

//         <DialogFooter>
//           <Button
//             type="submit"
//             onClick={handleSaveAttributeSet}
//             className="bg-green-900 text-white hover:bg-green-800"
//           >
//             Save Attribute Set
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function SearchableMultiSelect({
//   allAttributes,
//   selectedIds,
//   onToggle,
//   index,
// }: {
//   allAttributes: any[];
//   selectedIds: number[];
//   onToggle: (id: number, idx: number) => void;
//   index: number;
// }) {
//   const [open, setOpen] = useState(false);
//   const available = allAttributes.filter((a) => !selectedIds.includes(a.id));

//   return (
//     <div className="w-full space-y-2">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             className="w-full justify-between"
//           >
//             Select Attributes
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="p-0 w-full max-w-md">
//           <Command>
//             <CommandInput placeholder="Search attributes..." />
//             <CommandList className="max-h-60  min-h-[2rem] overflow-y-auto">
//               {available.length === 0 && (
//                 <p className="px-4 py-2 text-muted-foreground">
//                   No attributes left
//                 </p>
//               )}
//               {available.map((att) => (
//                 <CommandItem
//                   key={att.id}
//                   onSelect={() => onToggle(att.id, index)}
//                 >
//                   {att.name}
//                 </CommandItem>
//               ))}
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>

//       {selectedIds.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {selectedIds
//             .map((id) => allAttributes.find((a) => a.id === id))
//             .filter(Boolean)
//             .map((att) => (
//               <Badge
//                 key={att!.id}
//                 className="cursor-pointer"
//                 onClick={() => onToggle(att!.id, index)}
//                 variant="secondary"
//               >
//                 {att!.name} ✕
//               </Badge>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { boolean } from "zod";

// Types

function helper(rawData: any) {
  const grouped: any = {};

  for (const item of rawData) {
    const group = item.attribute_group_id;
    const attrId = item.attribute_id.id;

    if (!grouped[group.id]) {
      grouped[group.id] = {
        name: group.name,
        attribute_set_id: null,
        sort_order: group.sort_order,
        attribute_ids: [],
      };
    }

    grouped[group.id].attribute_ids.push(attrId);
  }

  // Convert to array
  const finalArray = Object.values(grouped);

  return finalArray;
}

interface product_attributes_groups {
  name: string;
  attribute_set_id: number | null;
  sort_order: number | null;
  attribute_ids?: number[];
}

export default function AttributeSetAddModal() {
  const [attributeset, setAttributeSet] = useState<{
    name: string;
    category_id: number | null;
  }>({
    name: "",
    category_id: 0,
  });

  const [allAttributes, setAllAttributes] = useState<any[]>([]);
  const [product_categories, setProduct_categories] = useState<any[]>([]);

  const [group, setGroup] = useState<product_attributes_groups[]>([]);
  const [preDefined, setPredfined] = useState<any[]>([]);
  const [preDefinedOpen, setPreDefinedOpen] = useState(false);

  const handleAddGroup = () => {
    const gp = [...group];
    gp.push({
      name: "",
      attribute_set_id: null,
      sort_order: null,
      attribute_ids: [],
    });
    setGroup(gp);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: attributes } = await supabase
        .from("product_attributes")
        .select("id, name");

      const { data: subcats } = await supabase
        .from("product_categories")
        .select("*");

      const { data: p_att_group_att } = await supabase
        .from("product_attribute_group_attributes")
        .select(
          `id, attribute_group_id(id,name,sort_order), attribute_id(id,name)`
        );
      if (attributes && subcats && p_att_group_att) {
        setAllAttributes(attributes);
        setProduct_categories(subcats);
        setPredfined(helper(p_att_group_att));
      }
    };
    fetchData();
  }, []);

  const handleToggleAttribute = (attId: number, index: number) => {
    const findContains = [...group];
    const isIncluded = findContains[index].attribute_ids?.includes(attId);
    if (isIncluded) {
      findContains[index].attribute_ids = findContains[
        index
      ].attribute_ids?.filter((d) => d !== attId);
      setGroup(findContains);
    } else {
      findContains[index].attribute_ids?.push(attId);
      setGroup(findContains);
    }
  };

  const handleSaveAttributeSet = async (e: any) => {
    e.stopPropagation();
    const product_attribute_set = {
      name: attributeset.name,
      category_id: attributeset.category_id,
    };
    const { data: product, error: error_set } = await supabase
      .from("product_attribute_sets")
      .insert(product_attribute_set)
      .select()
      .single();
    if (product?.id!) {
      const product_attribute_groups = group.map(
        (g: product_attributes_groups) => {
          return {
            name: g.name,
            attribute_set_id: product?.id,
            sort_order: g.sort_order,
          };
        }
      );
      const { data: groups_ids, error: group_error } = await supabase
        .from("product_attribute_groups")
        .insert(product_attribute_groups)
        .select("id, name");

      if (!group_error) {
        const product_attribute_groups_attributes = group
          .map((d) => d.attribute_ids)
          .flat();
        const newArray = [];
        for (let i = 0; i < groups_ids.length; i++) {
          let id = groups_ids[i].id;
          for (let j = 0; j < product_attribute_groups_attributes.length; j++) {
            newArray.push({
              attribute_group_id: id,
              attribute_id: product_attribute_groups_attributes[j],
            });
          }
        }
        const { data, error } = await supabase
          .from("product_attribute_group_attributes")
          .insert(newArray)
          .select();
        if (!error) {
          toast.success("Attribute Set is Created");
          setGroup([]);
          setAttributeSet({
            name: "",
            category_id: 0,
          });
        }
      }
    }
  };

  const handleAddPreDefinedGroup = (selectedGroup: any) => {
    const copy = [...group];
    const isPresent = copy.find((d: any) => d.name === selectedGroup.name);
    if (isPresent === undefined) {
      // Create a deep copy of the selected group to avoid reference issues
      const groupToAdd = {
        name: selectedGroup.name,
        attribute_set_id: null,
        sort_order: selectedGroup.sort_order,
        attribute_ids: [...(selectedGroup.attribute_ids || [])],
      };
      copy.push(groupToAdd);
      setGroup(copy);
      setPreDefinedOpen(false);
    }
  };

  // Filter out already selected predefined groups
  const availablePreDefinedGroups = preDefined.filter(
    (preDefGroup) => !group.some((g) => g.name === preDefGroup.name)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Attribute Set</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Attribute Set</DialogTitle>
        </DialogHeader>

        <div>
          <Label htmlFor="attr-set-name">Name</Label>
          <Input
            id="attr-set-name"
            value={attributeset.name}
            onChange={(e) =>
              setAttributeSet((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Paint Attributes"
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="subcategory">Product Categories</Label>
          <Select
            value={String(attributeset.category_id)}
            onValueChange={(value) =>
              setAttributeSet((prev) => ({
                ...prev,
                category_id: Number(value),
              }))
            }
          >
            <SelectTrigger id="subcategory">
              <SelectValue placeholder="Select Product Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={String(0)}>Please Select Category</SelectItem>
              {product_categories.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex-1">
            <Label>Add Predefined Group</Label>
            <Popover open={preDefinedOpen} onOpenChange={setPreDefinedOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={availablePreDefinedGroups.length === 0}
                >
                  {availablePreDefinedGroups.length === 0
                    ? "No predefined groups available"
                    : "Select predefined group"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full max-w-md">
                <Command>
                  <CommandInput placeholder="Search predefined groups..." />
                  <CommandList className="max-h-60 min-h-[2rem] overflow-y-auto">
                    {availablePreDefinedGroups.length === 0 && (
                      <p className="px-4 py-2 text-muted-foreground">
                        No predefined groups available
                      </p>
                    )}
                    {availablePreDefinedGroups.map((preDefGroup, idx) => (
                      <CommandItem
                        key={idx}
                        onSelect={() => handleAddPreDefinedGroup(preDefGroup)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {preDefGroup.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {preDefGroup.attribute_ids?.length || 0} attributes
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            className="border-2 self-end"
            onClick={handleAddGroup}
            variant="outline"
          >
            + New Group
          </Button>
        </div>

        {group.map((d: any, index: number) => {
          return (
            <div key={index} className="border rounded-lg p-4 mt-4">
              <div className="flex gap-2 items-center mb-4">
                <Label className="w-3/12" htmlFor={`groupname-${index}`}>
                  Group Name
                </Label>
                <Input
                  id={`groupname-${index}`}
                  value={d.name}
                  onChange={(e) => {
                    const copy = [...group];
                    copy[index].name = e.target.value;
                    copy[index].sort_order = index + 1;
                    setGroup(copy);
                  }}
                  placeholder="e.g., Paint Attributes"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setGroup((prev) =>
                      [...prev].filter((d, idx) => idx !== index)
                    );
                  }}
                >
                  <Cross1Icon />
                </Button>
              </div>
              <div>
                <Label>Select Attributes</Label>
                <SearchableMultiSelect
                  allAttributes={allAttributes}
                  selectedIds={group?.[index].attribute_ids!}
                  onToggle={handleToggleAttribute}
                  index={index}
                />
              </div>
            </div>
          );
        })}

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSaveAttributeSet}
            className="bg-green-900 text-white hover:bg-green-800"
          >
            Save Attribute Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SearchableMultiSelect({
  allAttributes,
  selectedIds,
  onToggle,
  index,
}: {
  allAttributes: any[];
  selectedIds: number[];
  onToggle: (id: number, idx: number) => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const available = allAttributes.filter((a) => !selectedIds.includes(a.id));

  return (
    <div className="w-full space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            Select Attributes
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full max-w-md">
          <Command>
            <CommandInput placeholder="Search attributes..." />
            <CommandList className="max-h-60  min-h-[2rem] overflow-y-auto">
              {available.length === 0 && (
                <p className="px-4 py-2 text-muted-foreground">
                  No attributes left
                </p>
              )}
              {available.map((att) => (
                <CommandItem
                  key={att.id}
                  onSelect={() => onToggle(att.id, index)}
                >
                  {att.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds
            .map((id) => allAttributes.find((a) => a.id === id))
            .filter(Boolean)
            .map((att) => (
              <Badge
                key={att!.id}
                className="cursor-pointer"
                onClick={() => onToggle(att!.id, index)}
                variant="secondary"
              >
                {att!.name} ✕
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
