import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SelectCategory from "./SelectCategory";
import {
  addEntireSelectedSegment,

  deleteSegmentId,
  resetEditSegment,
  updateChangeOnSelectedSegment,
} from "@/redux/slices/segmentsSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import EditDeleteSegModel from "./EditDeleteSegModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { MdOutlineDelete } from "react-icons/md";
import { updateHoverGroup } from "@/redux/slices/canvasSlice";
import { SegmentService } from "@/services/segment/SegmentService";
import { updateIsCreatedMasterArray } from "@/redux/slices/MasterArraySlice";
import SelectGroups from "./SelectGroup";

const EditDeleteSegment = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Create a state object to track each segment's individual dropdown values
  // const [segmentStates, setSegmentStates] = useState<{
  //   [key: string]: {
  //     segType: string;
  //     groupName: string;
  //     selectedCategory: string;
  //   };
  // }>({});

  const { selectedSegments } = useSelector(
    (state: RootState) => state.segments
  );
  const { selectedGroupSegment, masterArray } = useSelector(
    (state: RootState) => state.masterArray
  );

  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  
  useEffect(() => {
    if (
      selectedGroupSegment &&
      selectedGroupSegment.segments &&
      selectedGroupSegment.segments.length > 0
    ) {
      // make sort by short_title increasing order (case-insensitive, null-safe)
      if (selectedGroupSegment.segments.length > 1) {
        const sortedSegments = [...selectedGroupSegment.segments].sort((a, b) => {
          const titleA = a.short_title?.toLowerCase() || "";
          const titleB = b.short_title?.toLowerCase() || "";
          return titleA.localeCompare(titleB);
        });
        // Only dispatch if sortedSegments are different from current
        const isDifferent = selectedGroupSegment.segments.some((seg, idx) => seg.id !== sortedSegments[idx]?.id);
        if (isDifferent) {
          dispatch(addEntireSelectedSegment(sortedSegments));
        }
      } else {
        dispatch(addEntireSelectedSegment(selectedGroupSegment.segments));
      }
    }
  }, [selectedGroupSegment, dispatch]);

 
  const updateSegmentState = (
    segmentId: string,
    field: "segment_type" | "group_label_system" | "selectedCategory",
    value: string,
    item: SegmentModal
  ) => {
    //console.log(`Updating segment ${segmentId} field ${field} to value:`, value);
    // Check if the value is actually different before updating
    if (field === "group_label_system") {
      const updatedSegment = {
        ...item,
        [field]: value,
        ["group_name_user"]: value,
      };
      dispatch(updateChangeOnSelectedSegment(updatedSegment));
    } else {
      const updatedSegment = { ...item, [field]: value };
      dispatch(updateChangeOnSelectedSegment(updatedSegment));
    }
    const updatedSegment = { ...item, [field]: value };
    dispatch(updateChangeOnSelectedSegment(updatedSegment));
  };

  const handleSelectGroup = (
    segmentId: string,
    value: string,
    item: SegmentModal
  ) => {
    updateSegmentState(segmentId, "segment_type", value, item);
  };

  /** Delete modal state */
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<SegmentModal | null>(
    null
  );

  const handleDeleteSegment = async (seg: SegmentModal) => {
    // console.log("Deleting segment id:", seg.id);
    // toast.success(`${seg.short_title || seg.title || seg.id} deleted`);
    setIsDeleteOpen(false);
    setSegmentToDelete(null);

    const response = await dispatch(deleteSegmentId(seg.id ?? 0)).unwrap();

    if (response) {
      setIsDeleteOpen(false);
      setSegmentToDelete(null);
         dispatch(resetEditSegment())
      dispatch(updateIsCreatedMasterArray(false));
    }
  };

  const handleLeaveGroupHover = () => dispatch(updateHoverGroup(null));

  const handleEachSegmentHover = () => {
    dispatch(updateHoverGroup(null));
  };
  // console.log("Selected Segments:", selectedSegments);

  return (
    <div className="px-3">
      {selectedSegments && selectedSegments.length === 0 ? (
        <span>No segment selected</span>
      ) : (
        selectedSegments?.map((item) => {
          const segmentId = item.id?.toString() || "";
          //  const currentState = getSegmentState(segmentId);
            console.log("ghghhvdhgd", item)
          return (
           
            <Card
              key={item.id}
              className="relative grid items-center w-full max-w-sm gap-0 py-2 mb-2 border-b rounded-lg bg-gray-50 hover:bg-white"
              // onMouseEnter={() =>
              //   handleEachSegmentHover(item.short_title ?? "")
              // }
              onMouseLeave={handleLeaveGroupHover}
            >
              <CardHeader className="pt-3 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 ">
                      <CardTitle className="font-semibold text-blue-600 truncate text-lg ">
                        {item.short_title}
                      </CardTitle>
                    </div>
                  </div>

                  <div className="items-center gap-1 ">
                    <div className="flex justify-between">
                      <label className="mb-1 text-xs text-gray-500">Type</label>
                    </div>
                    <Select
                      // Always provide a string value (empty string when not set)
                      // to keep the component controlled for the lifetime of the element
                      value={item.segment_type ?? ""}
                      onValueChange={(val) =>
                        handleSelectGroup(segmentId, val, item)
                      }
                    >
                      <SelectTrigger className="w-[100px]  h-8 bg-transparent shadow-none">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {segments &&
                            segments.map((opt) => (
                              <SelectItem key={opt.id} value={opt.name ?? ""}>
                                {opt.name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-3">
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    {item.group_label_system && (
                      <SelectGroups
                        segGroupName={item.group_label_system}
                        segType={item.segment_type ?? ""}
                        onChangeGroup={(value: string) =>
                          updateSegmentState(
                            segmentId,
                            "group_label_system",
                            value,
                            item
                          )
                        }
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <SelectCategory
                      okCategory={(cat: string) =>
                        updateSegmentState(
                          segmentId,
                          "selectedCategory",
                          cat,
                          item
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>

              {/* Options menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="absolute flex items-center justify-center px-1 py-1 text-sm font-medium leading-none bg-gray-100 border border-gray-300 rounded-full top-2 right-2"
                    title="Options"
                  >
                    <BsThreeDots />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28" align="start">
                  <DropdownMenuItem
                    onClick={() => {
                      setSegmentToDelete(item); // ✅ set clicked segment
                      setIsDeleteOpen(true);
                    }}
                  >
                    <MdOutlineDelete className="text-lg me-3" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          );
        })
      )}

      {/* Delete Modal */}
      <EditDeleteSegModel
        isOpen={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSegmentToDelete(null);
        }}
        type="segment"
        segment={segmentToDelete ?? undefined}
        onDeleteSegment={handleDeleteSegment}
      />
    </div>
  );
};

export default EditDeleteSegment;
