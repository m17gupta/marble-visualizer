import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SelectCategory = () => {
  const { selectedMasterArray } = useSelector(
    (state: RootState) => state.masterArray
  );
  const [allcatogories, setAllCategories] = useState<string[]>([]);
  const [selectedCatogory, setSelectedCategory] = useState<string>("");
  useEffect(() => {
    if (selectedMasterArray && selectedMasterArray.categories) {
      const categories = selectedMasterArray.categories || [];
      setAllCategories(categories);
    } else {
      setAllCategories([]);
    }
  }, [selectedMasterArray]);

  return (
    <>
      <div className="pt-2">
        <h4 className="font-semibold pb-3">Categories</h4>
        <div className="relative w-full">
          <select
            value={selectedCatogory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none rounded-md border-2 border-black bg-white px-4 py-2 pr-10 text-gray-800 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
          >
            <option value="" disabled>
              Select Category
            </option>
            {allcatogories &&
              allcatogories.length > 0 &&
              allcatogories.map((opt) => {
                return (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </>
  );
};

export default SelectCategory;
