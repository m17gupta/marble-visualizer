import { MasterModel } from "@/models/jobModel/JobModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { MaterialSegmentModel } from "@/models/materialSegment/MaterialSegmentModel";
import { changeGroupSegment, resetEditSegment, updateAddSegMessage, updateClearEditCanvas, updateIsDeleteSegModal, updateMultipleSegment } from "@/redux/slices/segmentsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { updateMasterArrayonEditSegment, updateSelectedSegment } from "@/redux/slices/MasterArraySlice";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import { on } from "events";
import { Badge } from "@/components/ui/badge";
import SelectSegment from "./SelectSegment";
import SelectGroup from "./SelectGroup";
import SelectCategory from "./SelectCategory";

interface SegmentEditCompProps {
  optionEdit?: string;
  onCancel: () => void;
}

export const SegmentEditComp = ({
 
  optionEdit,
  onCancel,
}: SegmentEditCompProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );
  const [segType, setSegType] = useState("");
  const [selectedSeg, setSelectedSeg] = useState<number[]>([]);
  const [allcatogories, setAllCategories] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [shortName, setShortName] = useState("");
  const [childName, setChildName] = useState("");
  const [groupArray, setGroupArray] = useState<string[] | undefined>([]);
  const [selectedCatogory, setSelectedCategory] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [new_master, setNewMaster] = useState<MaterialSegmentModel | null>(
    null
  );
    const [selSeg, setSelSeg] = useState("");


  const [isUpdated, setIsUpdated] = useState(false);

  const [userSelectedSegment, setUserSelectedSegment] = useState<
    SegmentModal[]
  >([]);
  const [editSeg, setEditSeg] = useState<SegmentModal | null>(null);
   const {selectedSegments} = useSelector(
         (state: RootState) => state.segments
       );
 
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );

  // update currentSelectedGroupSegment
  useEffect(() => {
    if (
      selectedGroupSegment &&
      selectedGroupSegment.segments &&
      selectedGroupSegment.segments.length > 0
    ) {
      setUserSelectedSegment(selectedGroupSegment.segments);
    }
  }, [selectedGroupSegment]);

// update the seg Type
useEffect(() => {
  if (selectedSegments && selectedSegments.length > 0) {
    const segment = selectedSegments[0];
    if (segment.segment_type) {
      setSegType(segment.segment_type);
    }
    // handleSegmetName();
  }
}, [selectedSegments]);
 
  const handleSegGroupName = (
    masterArray: MasterModel[],
    segType: string,
    short_title: string,
    newMaster: MaterialSegmentModel
  ) => {
    if (masterArray && masterArray.length > 0 && segType && short_title) {
      const grpArry: string[] = [];
      let count: number = 0;
      masterArray.map((master) => {
        const allSeg = master.allSegments;
        if (allSeg && allSeg.length > 0 && master.name === segType) {
          allSeg.forEach((seg) => {
            grpArry.push(seg.groupName);
            const allSegs = seg.segments.length;
            count = allSegs + count;
          });
        }
      });
      if (grpArry && grpArry.length > 0) {
        setNewMaster(newMaster);
        setGroupArray(grpArry);
        setShortName(`${short_title}${count + 1}`);
        setGroupName(`${segType}1`);
      } else {
        setNewMaster(newMaster);
        setGroupArray([`${segType}1`]);
        setShortName(`${short_title}${1}`);
        setGroupName(`${segType}1`);
      }
    } else {
      setNewMaster(newMaster);
      setGroupName(`${segType}1`);
      setGroupArray([`${segType}1`]);
      setShortName(`${short_title}${1}`);
    }
  };

  // useEffect(() => {
  //   if (segments && segments.length > 0 && segType && isUpdated) {
  //     const seg = segments.find((seg) => seg.name === segType);
  //     const categories = seg?.categories || [];
  //     const uniqueCategories = Array.from(new Set(categories));
  //     setAllCategories(uniqueCategories);
  //     if (masterArray && seg?.short_code && seg && seg.name) {
  //       handleSegGroupName(masterArray, segType, seg?.short_code, seg);
  //     }
  //   }
  // }, [segments, segType, masterArray, isUpdated]);
   const handleSelectGroup = (value: string) => {
     setSegType(value);
   };

  const handleAddGroup = () => {
    setIsUpdated(true);
    if (groupArray != undefined) {
      const groupLength = groupArray.length;
      const newGroupName = `${segType}${groupLength + 1}`;
      setGroupArray([...groupArray, newGroupName]);
      toast.success(`Group ${newGroupName} added successfully!`);
    }
  };
  const handleSegSelection = (segment: SegmentModal) => {
    setShortName(segment.short_title || "");
    setSegType(segment.segment_type || "");
    setEditSeg(segment);
  };

  const handleSave =  () => {
    console.log("Saving segment with details:");
    console.log("segType", segType);
    console.log("groupName", groupName);
    console.log("shortName", shortName);
    console.log("selectedSegment", selectedSegments);

    // console.log("new_master", new_master);

    if (
      !segType ||
      !groupName 
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if(selectedSegments&& selectedSegments.length>0 ){
      const firstSegment = selectedSegments[0];
      const groupname=firstSegment?.group_label_system??"";
      const segtype=firstSegment?.segment_type??"";
      if(groupname===groupName && segtype===segtype){
        console.log("No changes detected in group name or segment type.");
        handleUpdateSegment(selectedSegments);
      }
    }
    // const newSegment = {
    //   id: selectedSegment.id,
    //   job_id: selectedSegment.job_id,
    //   title: selectedCatogory,
    //   segment_type: segType,
    //   group_label_system: groupName,
    //   short_title: shortName,
    //   group_name_user: groupName,
    //   annotation_type: selectedSegment.annotation_type,
    //   segment_bb_float: selectedSegment.segment_bb_float,
    //   annotation_points_float: selectedSegment.annotation_points_float,
    //   seg_perimeter: selectedSegment.seg_perimeter,
    //   seg_area_sqmt: selectedSegment.seg_area_sqmt,
    //   seg_skewx: selectedSegment.seg_skewx,
    //   seg_skewy: selectedSegment.seg_skewy,
    //   created_at: selectedSegment.created_at,
    //   updated_at: new Date().toISOString(),
    //   group_desc: selectedSegment.group_desc,
    // } as SegmentModal;

    // dispatch(updateAddSegMessage(" Updating segment details..."));
    // // onSave(newSegment, new_master);

    // setGroupArray([]);
    // setShortName("");
    // setGroupName("");
    // setNewMaster(null);
    // setIsUpdated(false);
  };

  const handleUpdateSegment = async(segment: SegmentModal[]) => {
 
    try{
      const response= await  dispatch(updateMultipleSegment(segment)).unwrap();
      console.log("Update segment response:", response);
      if(response && response.success){
        dispatch(updateClearEditCanvas(true));
        toast.success("Segment updated successfully");
        dispatch(changeGroupSegment(segment));
        dispatch(updateMasterArrayonEditSegment(segment));
        dispatch(resetEditSegment());
        onCancel();
      }
    }catch(error){  
      console.error("Error updating segment:", error);
      toast.error("Failed to update segment. Please try again.");
    }
  }
  const handleReAnnotation = () => {
      if(selectedSegments&& selectedSegments.length>1 ){
        toast.error("Please select only one segment to re-annotate");
      }else if (selectedSegments && selectedSegments.length === 1) {
        const segment = selectedSegments[0];
        if (segment.short_title) {
          dispatch(updateSelectedSegment(segment));
          dispatch(setCanvasType("reannotation"));
          onCancel();
        }
      }

    //   dispatch(updateSelectedSegment(segment));
    //   dispatch(setCanvasType("reannotation"));
    // Implement your re-annotation logic here
  };

  // delete segment
  const handleDelete = () => {
     if(selectedSegments&& selectedSegments.length>0){
           dispatch(updateIsDeleteSegModal(true));
       }
       else if (selectedSegments && selectedSegments.length === 0) {
         toast.error("Please select a segment to delete");
       }
  }
  return (
    <div className="w-full bg-white  rounded-lg shadow  py-2 flex flex-col overflow-y-auto max-h-[70vh] sm:max-h-[70vh]">
      {/* Header */}
      <div className="pb-3">
        <div className="flex items-center justify-between border-b pb-2 px-4">
          <h5 className="text-md font-semibold">Edit Segment:</h5>

          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600"
          >
            {userSelectedSegment[0]?.group_label_system}
          </Badge>
        </div>

        <div className="pt-2 px-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-regular text-sm">choose segment to edit</h4>
          </div>
          <div className="flex flex-col gap-2 w-full px-1 py-2 rounded-lg  max-h-56 overflow-y-auto custom-scrollbar">
            {userSelectedSegment.length === 0 && (
              <span className="text-gray-400 text-sm">
                No segments available
              </span>
            )}

            <SelectSegment
             
            />

          </div>
        </div>
      </div>

      <div className="px-3">

           {/* Select segment type */}
        {optionEdit === "edit-segment" && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Select Segment Type</h4>
            </div>
            <div className="relative w-full">
              <select
                value={segType}
                onChange={(e) => handleSelectGroup(e.target.value)}
                className="w-full appearance-none rounded-md border border-1  border-gray-300 bg-gray-100 px-4 py-1.5 text-sm pr-10 text-gray-800 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              >
                <option value="" disabled>
                  Select Segment Type
                </option>
                {segments &&
                  segments.map((opt) => {
                    return (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    );
                  })}
              </select>

              {/* Dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
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
        )}
        {/* Select Group */}
        {optionEdit === "edit-segment" && (
            <SelectGroup
              segType={segType}
              onChange={(value) => {setGroupName(value)}}
            />
        )}

     

        {/* Categories */}
        {optionEdit === "edit-segment" && (
          <SelectCategory
            okCategory={(cat) => {
              setSelectedCategory(cat);
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t mt-6 pt-2 px-3 flex justify-end gap-3">
        {/* edit Segment */}
        {optionEdit === "edit-segment" && (
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleSave}
          >
            Edit
          </Button>
        )}

        {/* edit ReAnnotation */}
        {optionEdit === "edit-annotation" && (
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleReAnnotation}
          >
            ReAnnotate
          </Button>
        )}

        {/* delete segment   */}

        {optionEdit === "edit-segment" && (
          <Button
            className="bg-black text-white hover:bg-gray-800"
             onClick={handleDelete}
          >
            Delete
          </Button>
        )}

        {/* edit ReAnnotation */}
        {optionEdit === "information" && (
          <Button
            className="bg-black text-white hover:bg-gray-800"
            //onClick={handleSave}
          >
            Get Information
          </Button>
        )}

        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

