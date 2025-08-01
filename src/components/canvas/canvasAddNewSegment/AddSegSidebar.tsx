import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateAddSegMessage, UpdateOtherSegmentDrawn } from "@/redux/slices/segmentsSlice";
import { toast } from "sonner";

interface AddSegmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
 
}
const AddSegSidebar = ({ open, onClose, onSave }: AddSegmentModalProps) => {

  const [selectedItems, setSelectedItems] = useState<string[]>([]);


  const handleRemove = (item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

    const dispatch = useDispatch();
  const [segType, setSegType] = useState('');
  const [allcatogories, setAllCategories] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [shortName, setShortName] = useState('');
  const [childName, setChildName] = useState('');
 const  [groupArray, setGroupArray] = useState<string[]>([]);
  const { selectedMasterArray } = useSelector((state: RootState) => state.masterArray);
 const [selectedCatogory, setSelectedCategory] = useState<string>('');
 
  useEffect(() => {
    if( selectedMasterArray &&
        selectedMasterArray.name &&
        selectedMasterArray.allSegments &&
        selectedMasterArray.allSegments.length === 0
    ) {
      setSegType(selectedMasterArray.name);
      setAllCategories(selectedMasterArray.categories || []);
      const allSeg = selectedMasterArray.allSegments.length;
      if (allSeg == 0) {
        setGroupArray([`${selectedMasterArray.name}1`]);
        const firstSeg =`${selectedMasterArray.name}1`
        if (firstSeg ) {
          setGroupName(firstSeg);
          setShortName(`${selectedMasterArray.short_code}1`);
          setChildName(firstSeg);
        }
    }
    } else if(selectedMasterArray &&
        selectedMasterArray.name &&
        selectedMasterArray.allSegments &&
        selectedMasterArray.allSegments.length >0){
      setSegType(selectedMasterArray.name);
      
      setAllCategories(selectedMasterArray.categories || []);
      const allSeg = selectedMasterArray.allSegments.length;
      if (allSeg > 0) {
        let count: number = 0;
        const allArray: string[] = [];
        setGroupArray([]);
        selectedMasterArray.allSegments.forEach((seg) => {
          allArray.push(seg.groupName);
          const allSegs= seg.segments.length;
          count= allSegs+count;
       });
       setGroupArray(allArray);
       setGroupName(selectedMasterArray.allSegments[0].groupName);
       setShortName(`${selectedMasterArray.short_code}${count + 1}`);
       setChildName(`${selectedMasterArray.name}${count + 1}`);
    }
    }
  },[selectedMasterArray])



  const handleSave = () => {

    dispatch(UpdateOtherSegmentDrawn({
      segType,
      groupName,
      childName,
      shortName: shortName,
      category:selectedCatogory
    }))
    setGroupName('');
    setShortName(''); 
    setChildName('');
    setSegType('');
    setSelectedCategory('');
    setGroupArray([]);
    dispatch(updateAddSegMessage(" Getting segment details..."));
     onSave()
  };

   const handleAddGroup = () => {
    const groupLength = groupArray.length;
    const newGroupName = `${segType}${groupLength + 1}`;
    setGroupArray([...groupArray, newGroupName]);
     toast.success(`Group ${newGroupName} added successfully!`);
   }

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col h-full">
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6">
          <SheetHeader className="border-b pb-3 pt-6">
            <SheetTitle className="text-xl pb-2 -mt-1">Add Segment</SheetTitle>
            <SheetDescription>
              <AddSegLists 
                segType={segType}
                groupName={groupName}
                shortName={shortName}
              />
            </SheetDescription>
          </SheetHeader>

          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Select Group</h4>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold"
               onClick={handleAddGroup}
              >
                +
              </button>
            </div>
            <Select
              value={groupName}
              onValueChange={setGroupName}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {groupArray && groupArray.map((group, index) => (
                    <SelectItem key={index} value={group}>
                      {group} 
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full pt-6">
            <h4 className="font-semibold pb-3">Categories</h4>
            <Select
              // value={currentSelection}
              // onValueChange={(value) => {
              //   if (value && !selectedItems.includes(value)) {
              //     setSelectedItems((prev) => [...prev, value]);
              //   }
              //   setCurrentSelection("");
              // }}
                value={selectedCatogory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Colors</SelectLabel>
                  {allcatogories && allcatogories.length > 0 && (
                    allcatogories.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))
                  )}
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
          <Button className="bg-black text-white hover:bg-gray-800"
            onClick={handleSave}
          >Submit</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddSegSidebar;
