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
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";

interface Attribute {
  id: number;
  name: string;
}

interface AttributeGroup {
  groupname: string;
  group_attributes: Attribute[];
}

export default function AttributeSetAddModal() {
  const [attributeset, setAttributeSet] = useState<{
    name: string;
    groups: AttributeGroup[];
  }>({
    name: "",
    groups: [],
  });

  const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      const { data, error } = await supabase
        .from("material_attributes")
        .select(`id, name`);
      if (data) setAllAttributes(data);
    };
    fetchAttributes();
  }, []);

  const handleAddGroup = () => {
    setAttributeSet((prev) => ({
      ...prev,
      groups: [
        ...prev.groups,
        {
          groupname: "",
          group_attributes: [],
        },
      ],
    }));
  };

  const handleRemoveGroup = (index: number) => {
    const copied = { ...attributeset };
    copied.groups.splice(index, 1);
    setAttributeSet(copied);
  };

  const handleSaveAttributeSet = async (e: any) => {
    e.stopPropagation();
    const { data, error } = await supabase
      .from("materials_attribute_sets")
      .insert(attributeset)
      .select("*");
    console.log(data);
    if (!error) {
      setAttributeSet({
        name: "",
        groups: [],
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Attribute Set</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Attribute Set</DialogTitle>
        </DialogHeader>

        <div>
          <Label htmlFor="attr-set-name">Name of Attribute Set</Label>
          <Input
            value={attributeset.name}
            onChange={(e) =>
              setAttributeSet((prev) => ({ ...prev, name: e.target.value }))
            }
            id="attr-set-name"
            placeholder="e.g., Paint1"
          />
        </div>

        <div className="mt-4 space-y-4">
          <Button variant="secondary" onClick={handleAddGroup}>
            <PlusIcon className="mr-2" /> Add Group
          </Button>

          {attributeset.groups.map((group, index) => {
            const selectedIds = group.group_attributes.map((a) => a.id);
            const availableAttributes = allAttributes.filter(
              (att) => !selectedIds.includes(att.id)
            );

            return (
              <div
                key={index}
                className="border border-gray-300 p-4 rounded-lg space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Label className="w-2/12">Group Name:</Label>
                  <Input
                    className="w-8/12"
                    value={group.groupname}
                    onChange={(e) => {
                      const copied = { ...attributeset };
                      copied.groups[index].groupname = e.target.value;
                      setAttributeSet(copied);
                    }}
                    placeholder="e.g., Dimensions"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveGroup(index)}
                  >
                    <Cross1Icon />
                  </Button>
                </div>

                <SearchableMultiSelect
                  allAttributes={availableAttributes}
                  selectedAttributes={group.group_attributes}
                  onToggleAttribute={(att: Attribute) => {
                    const copied = { ...attributeset };
                    const alreadySelected = copied.groups[
                      index
                    ].group_attributes.some((a) => a.id === att.id);

                    if (alreadySelected) {
                      copied.groups[index].group_attributes = copied.groups[
                        index
                      ].group_attributes.filter((a) => a.id !== att.id);
                    } else {
                      copied.groups[index].group_attributes.push(att);
                    }
                    setAttributeSet(copied);
                  }}
                />
              </div>
            );
          })}
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
import { Badge } from "@/components/ui/badge";

interface Attribute {
  id: number;
  name: string;
}

function SearchableMultiSelect({
  allAttributes,
  selectedAttributes,
  onToggleAttribute,
}: {
  allAttributes: Attribute[];
  selectedAttributes: Attribute[];
  onToggleAttribute: (att: Attribute) => void;
}) {
  const [open, setOpen] = useState(false);

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
              {allAttributes.length === 0 && (
                <p className="px-4 py-2 text-muted-foreground">
                  No attributes left
                </p>
              )}
              {allAttributes.map((att) => (
                <CommandItem
                  key={att.id}
                  onSelect={() => onToggleAttribute(att)}
                >
                  {att.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedAttributes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAttributes.map((att) => (
            <Badge
              key={att.id}
              className="cursor-pointer"
              onClick={() => onToggleAttribute(att)}
              variant="secondary"
            >
              {att.name} ✕
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
