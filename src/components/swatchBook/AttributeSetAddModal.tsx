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
// import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";

// interface Attribute {
//   id: number;
//   name: string;
//   input_type: string;
//   material_subcategory_id: {
//     id: number;
//     name: string;
//   };
//   unit_id: {
//     name: string;
//     symbol: string;
//   };
// }

// interface AttributeGroup {
//   groupname: string;
//   group_attributes: Attribute[];
// }

// interface Subcategory {
//   id: number;
//   name: string;
//   category_id: number;
// }

// export default function AttributeSetAddModal() {
//   const [attributeset, setAttributeSet] = useState<{
//     name: string;
//     groups: AttributeGroup[];
//     sub_category_id: number | null;
//   }>({
//     name: "",
//     groups: [],
//     sub_category_id: null,
//   });

//   const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
//   const [allsubcat, setAllSubCat] = useState<any[]>([]);
//   useEffect(() => {
//     const fetchAttributes = async () => {
//       const { data, error } = await supabase
//         .from("material_attributes")
//         .select(`*,material_subcategory_id(name,id),unit_id(name, symbol)`);

//       const { data: subcatRecord } = await supabase
//         .from("material_subcategories")
//         .select("*");
//       if (data && subcatRecord) {
//         setAllAttributes(data);
//         setAllSubCat(subcatRecord);
//       }
//     };
//     fetchAttributes();
//   }, []);

//   const handleAddGroup = () => {
//     setAttributeSet((prev) => ({
//       ...prev,
//       groups: [
//         ...prev.groups,
//         {
//           groupname: "",
//           group_attributes: [],
//         },
//       ],
//     }));
//   };

//   const handleRemoveGroup = (index: number) => {
//     const copied = { ...attributeset };
//     copied.groups.splice(index, 1);
//     setAttributeSet(copied);
//   };

//   const handleSaveAttributeSet = async (e: any) => {
//     e.stopPropagation();

//     const attributesetToInsert = {
//       ...attributeset,
//       groups: attributeset.groups.map((group) => ({
//         groupname: group.groupname,
//         group_attributes: group.group_attributes.map((attr) => attr.id),
//       })),
//     };

//     const { data, error } = await supabase
//       .from("materials_attribute_sets")
//       .insert(attributesetToInsert)
//       .select("*");

//     //  const { data, error } = await supabase
//     //    .from("materials_attribute_sets")
//     //    .insert(attributeset)
//     //    .select("*");

//     if (!error) {
//       setAttributeSet({
//         name: "",
//         groups: [],
//         sub_category_id: null,
//       });
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Attribute Set</Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl w-full overflow-y-auto max-h-[90vh]">
//         <DialogHeader>
//           <DialogTitle>Add Attribute Set</DialogTitle>
//         </DialogHeader>

//         <div>
//           <Label htmlFor="attr-set-name">Name of Attribute Set</Label>
//           <Input
//             value={attributeset.name}
//             onChange={(e) =>
//               setAttributeSet((prev) => ({ ...prev, name: e.target.value }))
//             }
//             id="attr-set-name"
//             placeholder="e.g., Paint1"
//           />
//         </div>

//         <div>
//           <Label htmlFor="subcategory">Material Sub-Category</Label>
//           <Select
//             onValueChange={(value: string) => {
//               setAttributeSet((prev) => ({
//                 ...prev,
//                 sub_category_id: Number(value),
//               }));
//             }}
//           >
//             <SelectTrigger id="subcategory">
//               <SelectValue placeholder="Select a Subcategory" />
//             </SelectTrigger>
//             <SelectContent>
//               {allsubcat.map((s: Subcategory) => (
//                 <SelectItem key={s.id} value={s.id.toString()}>
//                   {s.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="mt-4 space-y-4">
//           <Button variant="secondary" onClick={handleAddGroup}>
//             <PlusIcon className="mr-2" /> Add Group
//           </Button>

//           {attributeset.groups.map((group, index) => {
//             // const selectedIds = group.group_attributes.map((a) => a.id);
//             const selectedIds = attributeset.groups.flatMap((g) =>
//               g.group_attributes.map((a) => a.id)
//             );
//             const availableAttributes = allAttributes.filter(
//               (att) => !selectedIds.includes(att.id)
//             );

//             return (
//               <div
//                 key={index}
//                 className="border border-gray-300 p-4 rounded-lg space-y-3"
//               >
//                 <div className="flex items-center gap-2">
//                   <Label className="w-2/12">Group Name:</Label>
//                   <Input
//                     className="w-8/12"
//                     value={group.groupname}
//                     onChange={(e) => {
//                       const copied = { ...attributeset };
//                       copied.groups[index].groupname = e.target.value;
//                       setAttributeSet(copied);
//                     }}
//                     placeholder="e.g., Dimensions"
//                   />
//                   <Button
//                     variant="ghost"
//                     onClick={() => handleRemoveGroup(index)}
//                   >
//                     <Cross1Icon />
//                   </Button>
//                 </div>

//                 <SearchableMultiSelect
//                   allAttributes={availableAttributes}
//                   selectedAttributes={group.group_attributes}
//                   onToggleAttribute={(att: Attribute) => {
//                     const copied = { ...attributeset };
//                     const alreadySelected = copied.groups[
//                       index
//                     ].group_attributes.some((a) => a.id === att.id);

//                     if (alreadySelected) {
//                       copied.groups[index].group_attributes = copied.groups[
//                         index
//                       ].group_attributes.filter((a) => a.id !== att.id);
//                     } else {
//                       copied.groups[index].group_attributes.push(att);
//                     }
//                     setAttributeSet(copied);
//                   }}
//                 />
//               </div>
//             );
//           })}
//         </div>

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
// import { Badge } from "@/components/ui/badge";
// import { Select } from "@radix-ui/react-select";
// import {
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";

// interface Attribute {
//   id: number;
//   name: string;
// }

// function SearchableMultiSelect({
//   allAttributes,
//   selectedAttributes,
//   onToggleAttribute,
// }: {
//   allAttributes: Attribute[];
//   selectedAttributes: Attribute[];
//   onToggleAttribute: (att: Attribute) => void;
// }) {
//   const [open, setOpen] = useState(false);

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
//             <CommandList className="max-h-60 overflow-y-auto">
//               {allAttributes.length === 0 && (
//                 <p className="px-4 py-2 text-muted-foreground">
//                   No attributes left
//                 </p>
//               )}
//               {allAttributes.map((att) => (
//                 <CommandItem
//                   key={att.id}
//                   onSelect={() => onToggleAttribute(att)}
//                 >
//                   {att.name}
//                 </CommandItem>
//               ))}
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>

//       {selectedAttributes.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {selectedAttributes.map((att) => (
//             <Badge
//               key={att.id}
//               className="cursor-pointer"
//               onClick={() => onToggleAttribute(att)}
//               variant="secondary"
//             >
//               {att.name} ✕
//             </Badge>
//           ))}
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

// Types
interface Attribute {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

export default function AttributeSetAddModal() {
  const [attributeset, setAttributeSet] = useState<{
    name: string;
    groups: number[]; // Only store attribute IDs
    sub_category_id: number | null;
  }>({
    name: "",
    groups: [],
    sub_category_id: null,
  });

  const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
  const [allSubcats, setAllSubcats] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: attributes } = await supabase
        .from("material_attributes")
        .select("id, name");

      const { data: subcats } = await supabase
        .from("material_subcategories")
        .select("*");

      if (attributes && subcats) {
        setAllAttributes(attributes);
        setAllSubcats(subcats);
      }
    };
    fetchData();
  }, []);

  const handleToggleAttribute = (attId: number) => {
    setAttributeSet((prev) => {
      const exists = prev.groups.includes(attId);
      return {
        ...prev,
        groups: exists
          ? prev.groups.filter((id) => id !== attId)
          : [...prev.groups, attId],
      };
    });
  };

  const handleSaveAttributeSet = async (e: any) => {
    e.stopPropagation();

    const { data, error } = await supabase
      .from("materials_attribute_sets")
      .insert({
        name: attributeset.name,
        sub_category_id: attributeset.sub_category_id,
        groups: attributeset.groups,
      })
      .select("*");

    if (!error) {
      setAttributeSet({ name: "", groups: [], sub_category_id: null });
    }
  };

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
          <Label htmlFor="subcategory">Material Sub-Category</Label>
          <Select
            onValueChange={(value) =>
              setAttributeSet((prev) => ({
                ...prev,
                sub_category_id: Number(value),
              }))
            }
          >
            <SelectTrigger id="subcategory">
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              {allSubcats.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          <Label>Select Attributes</Label>
          <SearchableMultiSelect
            allAttributes={allAttributes}
            selectedIds={attributeset.groups}
            onToggle={handleToggleAttribute}
          />
        </div>

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
}: {
  allAttributes: Attribute[];
  selectedIds: number[];
  onToggle: (id: number) => void;
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
            <CommandList className="max-h-60 overflow-y-auto">
              {available.length === 0 && (
                <p className="px-4 py-2 text-muted-foreground">
                  No attributes left
                </p>
              )}
              {available.map((att) => (
                <CommandItem key={att.id} onSelect={() => onToggle(att.id)}>
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
                onClick={() => onToggle(att!.id)}
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
