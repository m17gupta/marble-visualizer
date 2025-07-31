import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddSegLists from "./AddSegLists";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoMdClose } from "react-icons/io";

const AddSegSidebar = () => {
  const [goal, setGoal] = React.useState(350);
  const options = ["Red", "Green", "Blue", "Yellow", "Black"];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = useState("");

  const handleRemove = (item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-house-plus"
          >
            <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475" />
            <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
            <path d="M15 18h6" />
            <path d="M18 15v6" />
          </svg>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col h-full">
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6">
          <SheetHeader className="border-b pb-3 pt-6">
            <SheetTitle className="text-xl pb-2 -mt-1">Add Segment</SheetTitle>
            <SheetDescription>
              <AddSegLists />
            </SheetDescription>
          </SheetHeader>

          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Select Group</h4>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold">
                +
              </button>
            </div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full pt-6">
            <h4 className="font-semibold pb-3">Categories</h4>
            <Select
              value={currentSelection}
              onValueChange={(value) => {
                if (value && !selectedItems.includes(value)) {
                  setSelectedItems((prev) => [...prev, value]);
                }
                setCurrentSelection("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Colors</SelectLabel>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedItems.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-600">Selected Values:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {item}
                      <IoMdClose
                        onClick={() => handleRemove(item)}
                        className="w-5 h-5 ps-1 cursor-pointer"
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer fixed to bottom */}
        <SheetFooter className="border-t px-6 py-4 flex justify-end gap-3">
          <Button className="bg-black text-white hover:bg-gray-800">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddSegSidebar;
