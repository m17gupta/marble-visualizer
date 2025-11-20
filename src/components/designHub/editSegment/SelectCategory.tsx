import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  okCategory: (cat: string) => void;
};
const SelectCategory = ({ okCategory }: Props) => {
  const [allcatogories, setAllCategories] = useState<string[]>([]);
  const [selectedCatogory, setSelectedCategory] = useState<string>("");
  const { selectedMasterArray } = useSelector(
    (state: RootState) => state.masterArray
  );
  const { selectedSegments } = useSelector(
    (state: RootState) => state.segments
  );

  /// set selected category if selectedSegments changes
  useEffect(() => {
    if (selectedSegments && selectedSegments.length > 0) {
      const firstSegmentTitle = selectedSegments[0].title || "";
      setSelectedCategory((prev) => {
        if (prev !== firstSegmentTitle) {
          okCategory(firstSegmentTitle);
          return firstSegmentTitle;
        }
        return prev;
      });
    } else {
      setSelectedCategory("");
    }
  }, [selectedSegments]);

  useEffect(() => {
    if (selectedMasterArray && selectedMasterArray.categories) {
      const categories = selectedMasterArray.categories || [];
      setAllCategories(categories);
    } else {
      setAllCategories([]);
    }
  }, [selectedMasterArray]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    okCategory(cat);
  }
  return (
    <>
      <div className="pt-2">
        <h4 className="font-semibold pb-3 text-sm">Categories</h4>
        <div className="relative w-full">
          <select
            value={selectedCatogory}
            onChange={(e) => handleSelectCategory(e.target.value)}
            className="w-full appearance-none rounded-md border border-1 border-gray-300 px-4 py-1.5 text-sm bg-gray-100 pr-10 text-gray-800 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
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
