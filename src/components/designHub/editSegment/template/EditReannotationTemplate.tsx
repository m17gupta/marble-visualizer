import { Badge } from "@/components/ui/badge";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectSegment from "../SelectSegment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { changeGroupSegment, resetEditSegment, setActiveOption, updateClearEditCanvas, updateMultipleSegment } from "@/redux/slices/segmentsSlice";
import { updateMasterArrayonEditSegment, updateMasterArrayonEditSegment2, updateMasterArrayonEditSegment3, updateSelectedGroupSegmentAfterEdit, updateSelectedGroupSegmentAfterEdit2, updateSelectedSegment } from "@/redux/slices/MasterArraySlice";
import { setCanvasType, updateChangeSegType, updateEditSegmentsOncanvas, updateIsEditSegments } from "@/redux/slices/canvasSlice";

const EditReannotationTemplate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [segType, setSegType] = useState("");

  const [groupName, setGroupName] = useState("");
  const { isEditSegments } = useSelector((state: RootState) => state.canvas);
  const [userSelectedSegment, setUserSelectedSegment] = useState<
    SegmentModal[]
  >([]);
   const { allSegments } = useSelector((state: RootState) => state.segments);
  
  const { selectedSegments } = useSelector(
    (state: RootState) => state.segments
  );

  // update the seg Type
  useEffect(() => {
    if (selectedSegments && selectedSegments.length > 0) {
      const segment = selectedSegments[0];
      if (segment.segment_type) {
        setSegType(segment.segment_type);
        setGroupName(segment.group_label_system || "");
      }
      // handleSegmetName();
    }
  }, [selectedSegments]);
  const handleSave = () => {
    if (!segType || !groupName) {
      toast.error("Please fill all fields");
      return;
    }

    if (selectedSegments && selectedSegments.length > 0) {
      const firstSegment = selectedSegments[0];
      const groupname = firstSegment?.group_label_system ?? "";
      const segtype = firstSegment?.segment_type ?? "";
      const prevShortTitleArr = selectedSegments
        .map((seg) => seg.short_title)
        .filter((title): title is string => title != null);
      console.log("prevShortTitleArr:", prevShortTitleArr);
      if (groupname === groupName && segtype === segType) {
        handleUpdateSegment(
          selectedSegments,
          groupName,
          segType,
          prevShortTitleArr
        );
      } else if (groupname !== groupName && segtype === segType) {
        const updatedSegments = selectedSegments.map((seg) => ({
          ...seg,
          group_label_system: groupName,
        }));

        handleUpdateSegment(
          updatedSegments,
          groupname,
          segType,
          prevShortTitleArr
        );
      } else if (groupname === groupName && segtype !== segType) {
        const updatedSegments = selectedSegments.map((seg) => ({
          ...seg,
          segment_type: segType,
        }));

        handleUpdateSegment(
          updatedSegments,
          groupName,
          segType,
          prevShortTitleArr
        );
      } else if (groupname !== groupName && segtype !== segType) {
        console.log("Both group and seg type are changed");
        const selectSeg = allSegments.filter((s) => s.segment_type === segType);
        const seglength = selectSeg.length;
        const short_T = selectSeg[0]?.short_title?.replace(/\d/g, "") ?? "";
        // console.log("short_T:", short_T, "seglength:", seglength);
        // all previous short Array

        // update short title
        const updatedSegments = selectedSegments.map((seg) => ({
          ...seg,
          group_label_system: groupName,
          segment_type: segType,
          short_title: `${short_T}${seglength + 1}`,
        }));
        //  console.log("updatedSegments:", updatedSegments);
        handleUpdateSegment(
          updatedSegments,
          groupname,
          segtype,
          prevShortTitleArr
        );
      }
    }
  };

  const handleUpdateSegment = async (
    segment: SegmentModal[],
    groupName: string, // old groupName
    segType: string, // old segType
    prevShortTitleArr: string[] // previous short title array for the new seg type
  ) => {
    try {
      const segGrpName = segment[0]?.group_label_system;
      const segTypeName = segment[0]?.segment_type;
      const response = await dispatch(updateMultipleSegment(segment)).unwrap();
    //  console.log("Update segment response:", response);
      if (response && response.success) {
        dispatch(updateClearEditCanvas(true));
        toast.success("Segment updated successfully");
        // edit in segment slice
        dispatch(changeGroupSegment(segment));

        // edit in master array
        if (groupName === segGrpName && segType === segTypeName) {
          // console.log("No changes in group and seg type master Arrray");
          dispatch(
            updateMasterArrayonEditSegment({
              updatedSegment: segment,
              groupName,
              segType,
            })
          );

          dispatch(updateIsEditSegments(false));
         
        } else if (groupName !== segGrpName && segType === segTypeName) {
          dispatch(
            updateMasterArrayonEditSegment2({
              updatedSegment: segment,
              groupName,
              segType,
            })
          );
        } else if (groupName !== segGrpName && segType !== segTypeName) {
          dispatch(
            updateMasterArrayonEditSegment3({
              updatedSegment: segment,
              groupName,
              segType,
            })
          );

          dispatch(updateChangeSegType(prevShortTitleArr)); // update changeSegType in canvas slice
        }

        // update selected group segment into master Array
        if (groupName === segGrpName && segType === segTypeName) {
          dispatch(updateSelectedGroupSegmentAfterEdit(segment));
        } else {
          dispatch(
            updateSelectedGroupSegmentAfterEdit2({ segment, groupName })
          );
        }
        // update on canvas slice
        dispatch(updateEditSegmentsOncanvas(segment));
        // reset all
        dispatch(resetEditSegment());
        
      }
    } catch (error) {
      console.error("Error updating segment:", error);
      toast.error("Failed to update segment. Please try again.");
    }
  };

  const handleReAnnotation = () => {
    if (selectedSegments && selectedSegments.length > 1) {
      toast.error("Please select only one segment to re-annotate");
    } else if (selectedSegments && selectedSegments.length === 1) {
      const segment = selectedSegments[0];
      if (segment.short_title) {
        dispatch(updateSelectedSegment(segment));
        dispatch(setCanvasType("reannotation"));
        // onCancel();
      }
    }
    
 
  };

  const handleCancel  =()=>{
    dispatch(updateClearEditCanvas(true));
      dispatch(setActiveOption("pallet"))
  }
  return (
    <>
      {" "}
      <div className="pb-3">
        <div className="flex items-center justify-between px-4 pb-2 border-b">
          {!isEditSegments ? (
            <h5 className="font-semibold text-md">Edit Segment:</h5>
          ) : (
            <h5 className="font-semibold text-md">Reannotation Segment:</h5>
          )}

          <Badge
            variant="secondary"
            className="text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-600"
          >
            {userSelectedSegment[0]?.group_label_system}
          </Badge>
        </div>

        <div className="px-3 pt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">
              choose segment to  edit or ReAnnotate
            </h4>
          </div>
          <div className="flex flex-col w-full gap-2 px-1 py-2 overflow-y-auto rounded-lg max-h-56 custom-scrollbar">
            {userSelectedSegment.length === 0 && (
              <span className="text-sm text-gray-400">
                No segments available
              </span>
            )}
            <SelectSegment />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-end gap-3 px-3 pt-2 mt-6 border-t">
        {/* edit Segment */}
        {isEditSegments && (
          <Button
            className="text-white bg-black hover:bg-gray-800"
            onClick={handleSave}
          >
            save changes
          </Button>
        )}

        {/* edit ReAnnotation */}
        {!isEditSegments && (
          <Button
            className="text-white bg-black hover:bg-gray-800"
            onClick={handleReAnnotation}
          >
            ReAnnotate
          </Button>
        )}

     

    

        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default EditReannotationTemplate;
