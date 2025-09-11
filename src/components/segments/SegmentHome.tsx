import React, { useEffect, useState } from "react";
//import SegmentEditModal from "./SegmentEditModal";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  changeGroupSegment,
  updateAddSegMessage,
  updateIsSegmentEdit,
  updateSegmentById,
} from "@/redux/slices/segmentsSlice";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { toast } from "sonner";

const SegmentHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);

  const { isSegmentEdit } = useSelector((state: RootState) => state.segments);

  useEffect(() => {
    if (isSegmentEdit) {
      setIsOpen(isSegmentEdit);
    } else {
      setIsOpen(false);
    }
  }, [isSegmentEdit]);

  const handleCloseEditModal = () => {
    dispatch(updateIsSegmentEdit(false));
    setIsOpen(false);
  };

  const updateSegmentBasedOnId = async (
    segmentData: SegmentModal
  ): Promise<boolean> => {
    const response = await dispatch(updateSegmentById(segmentData));

    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Segment updated successfully!");
      return true;
    } else {
      toast.error("Failed to update segment.");
      return false;
    }
  };



  return (
    <>
      {/* <SegmentEditModal
        open={isOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveSegment}
      /> */}
    </>
  );
};

export default SegmentHome;
