import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Prop = {
 
 
  segGroupName:string
  segType: string;
  onChangeGroup: (value: string) => void;
};

const SelectGroups = ({segGroupName,segType, onChangeGroup }: Prop) => {
  const [groupArray, setGroupArray] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>(segGroupName);

  const { selectedSegments } = useSelector((state: RootState) => state.segments);
  const { masterArray } = useSelector((state: RootState) => state.masterArray);


useEffect(()=>{
  if(segGroupName){
    setGroupName(segGroupName)
  }
},[segGroupName])




  // Preselect from first selected segment (if present)
  // useEffect(() => {
  // //   if (selectedSegments && selectedSegments.length > 0) {
  // //     const first = selectedSegments[0];
  // //     const pre = first?.group_label_system || "";
  // //     setGroupName(pre);
  // //     console.log("Preselecting group:", pre);
  // //  //  onChangeGroup(pre);
  // //   }
  // //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedSegments]);



  // Load group list from masterArray based on segType
  useEffect(() => {
    if (Array.isArray(masterArray) && segType) {
      const groupMaster = masterArray.find((item) => item.name === segType);
      const totalGroups = groupMaster?.allSegments?.map((seg: any) => seg.groupName) ?? [];
      setGroupArray(totalGroups);
      // if current selected doesn't exist anymore, reset
     // setGroupName((prev) => (prev && totalGroups.includes(prev) ? prev : ""));
    } else {
      setGroupArray([]);
     
    }
  }, [masterArray, segType]);

  const handleGroup = (value: string) => {
    console.log("Selected group:", value);
    setGroupName(value);
    onChangeGroup(value);
  };

  const handleAddGroup = () => {
    const length = groupArray?.length ?? 0;
    const newGroupName = `${segType}${length + 1}`;
    setGroupArray((prev) => [...prev, newGroupName]);
    // (original behavior) don't auto-select; only notify
    toast.success(`Group ${newGroupName} added successfully!`);
  };

  return (
    <div className="pt-2">
      <div className="flex items-center justify-start mb-2">
        <label className="mb-1 text-xs text-gray-500 pe-2 focus:ring-0 focus:outline-none ">Group</label>
        <button
          type="button"
          onClick={handleAddGroup}
          className="flex items-center justify-center p-2 w-2 h-4 text-lg font-bold text-blue-600 bg-white border border-purple-300 rounded-full"
          aria-label="Add group"
          title="Add group"
        >
          +
        </button>
      </div>

  {/* shadcn Select */}
  {/* Keep the Select controlled by always passing a string (empty when not selected) */}
  <Select value={groupName ?? ""} onValueChange={handleGroup}>
        <SelectTrigger 
        className="w-full h-8"
        >
          {/* border-0 bg-transparent shadow-none outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 */}
          {/* w-full mt-2 h-8 */}
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {groupArray.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectGroups;
