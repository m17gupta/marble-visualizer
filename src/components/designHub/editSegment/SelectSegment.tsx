import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { updateHoverGroup } from "@/redux/slices/canvasSlice";
import { editSelectedSegment } from "@/redux/slices/segmentsSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};
const SelectSegment = () => {
  const dispatch = useDispatch();
  const { selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const { selectedSegments } = useSelector(
    (state: RootState) => state.segments
  );

  const [userSelectedSegment, setUserSelectedSegment] = useState<
    SegmentModal[]
  >([]);

  const [selectedSeg, setSelectedSeg] = useState<number[]>([]);

  // update selected Segment
  useEffect(() => {
    if (selectedSegments && selectedSegments.length > 0) {
      const segmentIds = selectedSegments
        .map((seg) => seg.id)
        .filter((id): id is number => id !== undefined);
      if (segmentIds && segmentIds.length > 0) {
        setSelectedSeg(segmentIds);
      }
    } else {
      setSelectedSeg([]);
    }
  }, [selectedSegments]);

  const handleSelectSegment = (opt: SegmentModal, seg_id: number) => {
    //  console.log("selected segment id", seg_id, opt);
    // if (selectedSeg.includes(seg_id)) {
    //   setSelectedSeg(selectedSeg.filter(id => id !== seg_id));
    // } else {
    //   setSelectedSeg([...selectedSeg, seg_id]);
    // }
    dispatch(editSelectedSegment(opt));
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

  // hover segment
  const handleMouseEnter = (segTitle: string) => {
    dispatch(updateHoverGroup([segTitle]));
  };

  const handleMouseLeave = () => {
    dispatch(updateHoverGroup(null));
  };
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
                     onMouseEnter={() => {
                  handleMouseEnter(opt.short_title??"");
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  if (typeof opt.id !== "number") return;
                  handleSelectSegment(opt, opt.id);
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
