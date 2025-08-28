import { MasterModel } from "@/models/jobModel/JobModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { MaterialSegmentModel } from "@/models/materialSegment/MaterialSegmentModel";
import { updateAddSegMessage } from "@/redux/slices/segmentsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { updateSelectedSegment } from "@/redux/slices/MasterArraySlice";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import { on } from "events";

interface SegmentEditCompProps {
 
  totalGroups?: string[];
    optionEdit?: string;
    onCancel: () => void;
}

export const SegmentEditComp = ({
  totalGroups,
  optionEdit,
  onCancel    
}: SegmentEditCompProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {selectedGroupSegment} = useSelector((state: RootState) => state.masterArray);
  const [segType, setSegType] = useState("");
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
  const [userSelectedSegment, setUserSelectedSegment] = useState<SegmentModal[]>([]);
  const [editSeg, setEditSeg] = useState<SegmentModal | null>(null);
  useEffect(() => {
    setGroupArray(totalGroups);
  }, []);

  // update currentSelectedGroupSegment
  useEffect(() => {
    if(selectedGroupSegment &&
         selectedGroupSegment.segments &&
        selectedGroupSegment.segments.length > 0) {
      setUserSelectedSegment(selectedGroupSegment.segments);
    }
  }, [selectedGroupSegment]);
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );

//   const finalSegments = currentSelectedGroupSegment.segments.map(
//     (d: any) => d.short_title
//   );

  const [selSeg, setSelSeg] = useState("");

  const { selectedSegment, masterArray } = useSelector(
    (state: RootState) => state.masterArray
  );

  const [isUpdated, setIsUpdated] = useState(false);

//   useEffect(() => {
//     if (
//       selectedSegment &&
//       selectedSegment.segment_type &&
//       selectedSegment.group_label_system &&
//       selectedSegment.short_title &&
//       selectedSegment.title
//     ) {
//       // setSegType(selectedSegment.segment_type);
//       setSegType(currentSelectedGroupSegment.segments[0].segment_type);
//       setGroupName(currentSelectedGroupSegment.segments[0].group_label_system);
//       setShortName(currentSelectedGroupSegment.segments[0].short_title);
//       const categories = segments.find(
//         (d) => d.name == currentSelectedGroupSegment.segments[0].segment_type
//       )?.categories;
//       setAllCategories(categories!);
//       // handleSegmetName();
//     }
//   }, [currentSelectedGroupSegment]);

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

  const handleSave = async () => {

    console.log("Saving segment with details:")
    console.log("segType",segType)
    console.log("groupName",groupName)
    console.log("shortName",shortName)
    console.log("selectedSegment",selectedSegment)
    console.log("new_master",new_master)

    if (
      !segType ||
      !groupName ||
      !shortName ||
      !selectedSegment ||
      !new_master
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const newSegment = {
      id: selectedSegment.id,
      job_id: selectedSegment.job_id,
      title: selectedCatogory,
      segment_type: segType,
      group_label_system: groupName,
      short_title: shortName,
      group_name_user: groupName,
      annotation_type: selectedSegment.annotation_type,
      segment_bb_float: selectedSegment.segment_bb_float,
      annotation_points_float: selectedSegment.annotation_points_float,
      seg_perimeter: selectedSegment.seg_perimeter,
      seg_area_sqmt: selectedSegment.seg_area_sqmt,
      seg_skewx: selectedSegment.seg_skewx,
      seg_skewy: selectedSegment.seg_skewy,
      created_at: selectedSegment.created_at,
      updated_at: new Date().toISOString(),
      group_desc: selectedSegment.group_desc,
    } as SegmentModal;

    dispatch(updateAddSegMessage(" Updating segment details..."));
    // onSave(newSegment, new_master);

    setGroupArray([]);
    setShortName("");
    setGroupName("");
    setNewMaster(null);
    setIsUpdated(false);
  };


    const handleReAnnotation = () => {
        console.log("Re-annotation clicked",shortName);
        if(shortName===editSeg?.short_title){
            dispatch(updateSelectedSegment(editSeg));
            dispatch(setCanvasType("reannotation"));
            onCancel();
        }
        
    //   dispatch(updateSelectedSegment(segment));
    //   dispatch(setCanvasType("reannotation"));
      // Implement your re-annotation logic here
    };
  return (
    <div className="w-full bg-white  rounded-lg shadow px-4 py-2 flex flex-col ">
      {/* Header */}
      <div className="border-b pb-3">
        <h4 className="text-xl font-semibold">
          Edit Segment: <span>{userSelectedSegment[0]?.group_label_system}</span>
        </h4>
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">choose segment to edit</h4>
          </div>
          <div className="flex flex-col gap-2 w-full px-1 py-2 bg-gray-50 rounded-lg border border-gray-200 max-h-56 overflow-y-auto custom-scrollbar">
            {userSelectedSegment.length === 0 && (
              <span className="text-gray-400 text-sm">No segments available</span>
            )}
            {userSelectedSegment.map((opt: SegmentModal) => (
              <label key={opt.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-blue-50 rounded px-2">
                <input
                  type="radio"
                  name="segment-single-select"
                  checked={shortName === opt.short_title}
                  onChange={() => handleSegSelection(opt)}
                  className="accent-blue-600 w-4 h-4 rounded-full border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-800 font-medium">{opt.short_title}</span>
              </label>
            ))}
          </div>
        </div>
      </div>


           {/* Select Group */}
    {optionEdit==="edit-segment"  && <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">Select Group</h4>
          <button
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold"
            onClick={handleAddGroup}
          >
            +
          </button>
        </div>
        <div className="relative w-full">
          <select
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full appearance-none rounded-md border-2 border-black bg-white px-4 py-2 pr-10 text-gray-800 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
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
        
      </div>}
      {/* Select segment type */}
      {optionEdit==="edit-segment"  && <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">Select Segment Type</h4>
        </div>
        <div className="relative w-full">
          <select
            value={segType}
            onChange={(e) => setSegType(e.target.value)}
            className="w-full appearance-none rounded-md border-2 border-black bg-white px-4 py-2 pr-10 text-gray-800 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
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
}
    

      {/* Categories */}
      {optionEdit==="edit-segment"  &&
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
        {/* <Select
          value={selectedCatogory}
          onValueChange={(value) => {
            setSelectedCategory(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {allcatogories &&
                allcatogories.length > 0 &&
                allcatogories.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}

        {selectedItems.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-gray-600">
              Selected Values:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {item}
                  <IoMdClose
                    className="w-5 h-5 ps-1 cursor-pointer"
                    // onClick={() => handleRemove(item)}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      }

      {/* Footer */}
      <div className="border-t mt-6 pt-4 flex justify-end gap-3">

        {/* edit Segment */}
       {optionEdit==="edit-segment"  &&  <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={handleSave}
        >
          Submit
        </Button>}

         {/* edit ReAnnotation */}
         {optionEdit==="edit-annotation"  &&  <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={ handleReAnnotation}
        >
          ReAnnotate
        </Button>}



        {/* delete segment   */}

        {optionEdit==="delete-segment"  &&  <Button
          className="bg-black text-white hover:bg-gray-800"
         // onClick={handleSave}
        >
          Delete
        </Button>}

        {/* edit ReAnnotation */}
        {optionEdit==="information"  &&  <Button
          className="bg-black text-white hover:bg-gray-800"
          //onClick={handleSave}
        >
          Get Information
        </Button>}



        <Button variant="outline"
          onClick={onCancel}
        >Cancel</Button>
      </div>
    </div>
  );
};