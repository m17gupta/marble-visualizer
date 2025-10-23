import { useEffect, useState } from "react";
import { Button } from "./Button";
import { SearchAndSelect } from "./SearchandSelect";
import { supabase } from "@/lib/supabase";
import { AttributeId } from "../interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MultiSelectDropdown } from "./SelectMultiple";

interface AttributeAddProps {
  selected?: AttributeId[];
  setSelected?: any;
  handleSaveAttributesValues: (selected: AttributeId[]) => void;
  productype: string;
}

export const AttributesAdd = ({
  selected,
  setSelected,
  handleSaveAttributesValues,
  productype,
}: AttributeAddProps) => {
  const [attributes, setAttributes] = useState<AttributeId[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const { data, error } = await supabase
          .from("product_attributes")
          .select("*");

        if (!error) {
          const modified = data?.map((d: AttributeId) => {
            return { ...d, visible: true, is_variant_value: false };
          });
          setAttributes(modified);
        }
      } catch (error) {}
    };
    fetchAttributes();
  }, []);

  const handleExpansion = (id: number) => {
    if (id == expanded) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };

  const handleadditiontoselectedValue = (
    id: number,
    selectedvalue: (string | number)[]
  ) => {
    if (selected !== undefined) {
      const index = selected.findIndex((d) => d.id == id);
      const copied = structuredClone(selected);
      copied[index].selected_values = selectedvalue;
      setSelected(copied);
    }
  };

  const handlecreateValueinPossibleValues = (
    id: number,
    possibleValue: string | number
  ) => {
    if (selected !== undefined) {
      const index = selected.findIndex((d) => d.id == id);
      const copied = structuredClone(selected);
      if (copied[index].possible_values == null) {
        copied[index].possible_values = [];
      }
      if (!copied[index].possible_values?.includes(possibleValue)) {
        copied[index].possible_values?.push(possibleValue);
      } else {
        copied[index].possible_values.filter((d) => d != possibleValue);
      }
      setSelected(copied);
    }
  };

  const handleCheckAndUncheck = (id: number, name: string) => {
    if (selected !== undefined) {
      const copied = [...selected];
      const index = copied.findIndex((d) => d.id == id);
      if (name == "visible") {
        if (copied[index].visible) {
          copied[index].visible = false;
        } else {
          copied[index].visible = true;
        }
      } else {
        if (copied[index].is_variant_value) {
          copied[index].is_variant_value = false;
        } else {
          copied[index].is_variant_value = true;
        }
      }
      setSelected(copied);
    }
  };

  const handleSave = () => {
    if (selected !== undefined) {
      handleSaveAttributesValues(selected);
    }
  };

  const handleDeleteAttribute = (idx: number) => {
    setSelected((prev: any) =>
      prev.filter((d: any, index: number) => index != idx)
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="flex gap-2">
        <Button variant="primary" className="h-10">
          Add Attribute
        </Button>
        {attributes.length > 0 && (
          <SearchAndSelect
            selected={selected!}
            setSelected={setSelected}
            options={attributes}
            placeholder="Select Attribute"
          />
        )}
      </div>
      <div className="">
        {selected !== undefined &&
          selected.length > 0 &&
          selected.map((d: any, index: number) => {
            const options = d.possible_values;
            const selectedValues = d.selected_values;

            return (
              <div className="flex mt-1 flex-col border-2 rounded-lg p-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>{d.name}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteAttribute(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                    <button onClick={() => handleExpansion(d.id)}>
                      {expanded == d.id ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Expandable Content */}
                {expanded && expanded == d.id && (
                  <div className="flex">
                    <div className="flex flex-col text-sm space-y-2">
                      <span>Name:</span>
                      <h4 className="font-semibold">{d.name}</h4>

                      <div className="flex items-center gap-2">
                        <input
                          onChange={() =>
                            handleCheckAndUncheck(d.id, "visible")
                          }
                          name="visible"
                          checked={d.visible}
                          type="checkbox"
                          id={`visible-${d.id}`}
                        />
                        <label htmlFor={`visible-${d.id}`}>Visible</label>
                      </div>

                      {productype != "simple" && (
                        <div className="flex items-center gap-2">
                          <input
                            checked={d.is_variant_value}
                            onChange={() =>
                              handleCheckAndUncheck(d.id, "is_variant")
                            }
                            name="is_variant_value"
                            type="checkbox"
                            id={`variation-${d.id}`}
                          />
                          <label htmlFor={`variation-${d.id}`}>
                            Variations
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <MultiSelectDropdown
                        options={options == null ? [] : options}
                        defaultSelected={selectedValues}
                        setSelected={setSelected}
                        onSelectionChange={handleadditiontoselectedValue}
                        allvalues={d}
                        onAddInPossible={handlecreateValueinPossibleValues}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <Button onClick={handleSave} size="sm" variant="primary" className="w-20">
        Save
      </Button>
    </div>
  );
};
