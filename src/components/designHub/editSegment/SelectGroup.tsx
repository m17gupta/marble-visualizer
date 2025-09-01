import { MasterGroupModel } from "@/models/jobModel/JobModel";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectGroup = () => {
  const dispatch = useDispatch();
  const [groupArray, setGroupArray] = React.useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );
  const totalGroups = selectedMasterArray?.allSegments.map(
    (d: MasterGroupModel) => d.groupName
  );

  useEffect(() => {
    if (totalGroups && totalGroups.length > 0) {
      setGroupArray(totalGroups);
    } else {
      setGroupArray([]);
    }
  }, [totalGroups]);

  // update selected group
  useEffect(() => {
    if (selectedGroupSegment) {
      setGroupName(selectedGroupSegment.groupName);
    }
  }, [selectedGroupSegment]);

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
            onChange={(e) => setGroupName(e.target.value)}
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
