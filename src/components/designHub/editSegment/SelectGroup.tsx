import { MasterGroupModel } from "@/models/jobModel/JobModel";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Prop={
  segType: string;
  onChange: (value: string) => void;
}
const SelectGroup = ({ segType, onChange }: Prop) => {
  const dispatch = useDispatch();
  const [groupArray, setGroupArray] = React.useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const { masterArray } = useSelector(
    (state: RootState) => state.masterArray
  );
 

  useEffect(() => {
    if (masterArray && masterArray.length > 0 && segType) {
      const groupmaster= masterArray.find(item=>item.name===segType)
      if (groupmaster) {
        const totalGroups = groupmaster.allSegments.map((seg) => seg.groupName);
        setGroupArray(totalGroups);
      }
    } else {
      setGroupArray([]);
    }
  }, [masterArray,segType]);




  const handleGroup = (value: string) => {
    setGroupName(value);
    onChange(value);
  };
  return (
    <>
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">Select Group</h4>
          <button
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold"
            // onClick={handleAddGroup}
          >
            +
          </button>
        </div>
        <div className="relative w-full">
          <select
            value={groupName}
            onChange={(e) => handleGroup(e.target.value)}
            className="w-full appearance-none rounded-md border border-1 border-gray-300 px-4 py-1.5 text-sm bg-gray-100 pr-10 text-gray-800 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
          >
            <option value="" disabled>
              Select Group Name
            </option>
            {groupArray &&
              groupArray.map((opt) => {
                return (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                );
              })}
          </select>

          {/* Dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0  right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectGroup;
