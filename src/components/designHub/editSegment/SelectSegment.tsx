import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SelectSegment = () => {
     const { selectedGroupSegment } = useSelector(
        (state: RootState) => state.masterArray
      );
     const [userSelectedSegment, setUserSelectedSegment] = useState<
        SegmentModal[]
      >([]);

        const [selectedSeg, setSelectedSeg] = useState<number[]>([]);

      const handleSelectSegment = (seg_id: number) => {
        if (selectedSeg.includes(seg_id)) {
          setSelectedSeg(selectedSeg.filter(id => id !== seg_id));
        } else {
          setSelectedSeg([...selectedSeg, seg_id]);
        }
      };
     useEffect(() => {
        if (
          selectedGroupSegment &&
          selectedGroupSegment.segments &&
          selectedGroupSegment.segments.length > 0
        ) {
          setUserSelectedSegment(selectedGroupSegment.segments);
        }
      }, [selectedGroupSegment]);
  return (
    <>
      <div
        role="radiogroup"
        aria-label="Select color group"
        className="flex flex-wrap gap-2"
      >
        {userSelectedSegment.map((opt: SegmentModal) => {
          if (typeof opt.id !== "number") return null;
          const checked = selectedSeg.includes(opt.id);
          return (
            <label
              key={opt.id}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold leading-none transition-colors cursor-pointer
                      focus-visible:outline-none bg-gray-50 focus-visible:ring-2 focus-visible:ring-purple-400
                      ${
                        checked
                          ? "bg-purple-100 text-black-200 border border-purple-800 shadow-sm "
                          : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                      }
                    `}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  if (typeof opt.id !== "number") return;
                  handleSelectSegment(opt.id);
                }}
                className="accent-purple-600 w-4 h-4"
              />
              {opt.short_title}
            </label>
          );
        })}
      </div>
    </>
  );
};

export default SelectSegment;
