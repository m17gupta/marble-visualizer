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

export default function AttributeSetAddModal() {
  const [attributeset, setAttributeSet] = useState<{
    name: string;
    category_id: number | null;
  }>({
    name: "",
    category_id: null,
  });

  const [allAttributes, setAllAttributes] = useState<any[]>([]);
  const [product_categories, setProduct_categories] = useState<any[]>([]);

  const [group, setGroup] = useState([]);

  // const handleAddGroup = () => {
  //   const gp = [...group]
  //   gp.push({
  //     name:
  //   })
  // }

  console.log(attributeset);
  useEffect(() => {
    const fetchData = async () => {
      const { data: attributes } = await supabase
        .from("product_attributes")
        .select("id, name");

      const { data: subcats } = await supabase
        .from("product_categories")
        .select("*");

      if (attributes && subcats) {
        setAllAttributes(attributes);
        setProduct_categories(subcats);
      }
    };
    fetchData();
  }, []);

  // const handleToggleAttribute = (attId: number) => {
  //   setAttributeSet((prev) => {
  //     const exists = prev.groups.includes(attId);
  //     return {
  //       ...prev,
  //       groups: exists
  //         ? prev.groups.filter((id) => id !== attId)
  //         : [...prev.groups, attId],
  //     };
  //   });
  // };

  const handleSaveAttributeSet = async (e: any) => {
    e.stopPropagation();

    // const { data, error } = await supabase
    //   .from("materials_attribute_sets")
    //   .insert({
    //     name: attributeset.name,
    //     sub_category_id: attributeset.sub_category_id,
    //     groups: attributeset.groups,
    //   })
    //   .select("*");

    // if (!error) {
    //   setAttributeSet({ name: "", groups: [], sub_category_id: null });
    // }
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
          <Label htmlFor="subcategory">Product Categories</Label>
          <Select
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
              {product_categories.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          <Button>+ Group</Button>
        </div>

        <div className="mt-6">
          <Label>Select Attributes</Label>
          {/* <SearchableMultiSelect
            allAttributes={allAttributes}
            selectedIds={attributeset.groups}
            onToggle={handleToggleAttribute}
          /> */}
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
  allAttributes: any[];
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
            <CommandList className="max-h-60 overflow-y-scroll">
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
