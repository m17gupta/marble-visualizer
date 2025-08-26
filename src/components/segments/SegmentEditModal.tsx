import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddSegLists from "../canvas/canvasAddNewSegment/AddSegLists";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { MasterModel } from "@/models/jobModel/JobModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import {
  changeGroupSegment,
  updateAddSegMessage,
  updateIsSegmentEdit,
  updateSegmentById,
} from "@/redux/slices/segmentsSlice";
import {
  changeGroupSelectedSegment,
  deletedChangeGroupSegment,
} from "@/redux/slices/MasterArraySlice";
import { set } from "date-fns";
import { MaterialSegmentModel } from "@/models/materialSegment/MaterialSegmentModel";

interface EditSegmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SegmentModal, new_master: MaterialSegmentModel) => void;
}
const SegmentEditModal = ({ open, onClose, onSave }: EditSegmentModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [segType, setSegType] = useState("");
  const [allcatogories, setAllCategories] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [shortName, setShortName] = useState("");
  const [childName, setChildName] = useState("");
  const [groupArray, setGroupArray] = useState<string[]>([]);
  const [selectedCatogory, setSelectedCategory] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [new_master, setNewMaster] = useState<MaterialSegmentModel | null>(
    null
  );
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const { selectedSegment, masterArray } = useSelector(
    (state: RootState) => state.masterArray
  );
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    if (
      selectedSegment &&
      selectedSegment.segment_type &&
      selectedSegment.group_label_system &&
      selectedSegment.short_title &&
      selectedSegment.title
    ) {
      setSegType(selectedSegment.segment_type);
      setGroupName(selectedSegment.group_label_system);
      setShortName(selectedSegment.short_title);
    }
  }, [selectedSegment]);

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
        // const uniqueGroups = Array.from(new Set(allGrp.flat()))
        setNewMaster(newMaster);
        setGroupArray(grpArry);
        setShortName(`${short_title}${count + 1}`);
        setGroupName(`${segType}1`);
        // setSegmentCount(count);
      } else {
        setNewMaster(newMaster);
        setGroupArray([`${segType}1`]);
        setShortName(`${short_title}${1}`);
        setGroupName(`${segType}1`);
        // setSegmentCount(1);
      }
    } else {
      setNewMaster(newMaster);
      setGroupName(`${segType}1`);
      setGroupArray([`${segType}1`]);
      setShortName(`${short_title}${1}`);
    }
  };
  // update the categories
  useEffect(() => {
    if (segments && segments.length > 0 && segType && isUpdated) {
      const seg = segments.find((seg) => seg.name === segType);
      const categories = seg?.categories || [];
      const uniqueCategories = Array.from(new Set(categories));
      setAllCategories(uniqueCategories);
      // setShortTitle(seg?.short_code || "");
      if (masterArray && seg?.short_code && seg && seg.name) {
        handleSegGroupName(masterArray, segType, seg?.short_code, seg);
      }
    }
  }, [segments, segType, masterArray, isUpdated]);

  const handleAddGroup = () => {
    setIsUpdated(true);
    const groupLength = groupArray.length;
    const newGroupName = `${segType}${groupLength + 1}`;
    setGroupArray([...groupArray, newGroupName]);
    toast.success(`Group ${newGroupName} added successfully!`);
  };

  const handleSave = async () => {
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
    onSave(newSegment, new_master);
    setGroupArray([]);
    setShortName("");
    setGroupName("");
    setNewMaster(null);
    setIsUpdated(false);
    // update in Db
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(val) => {
          if (!val) onClose();
        }}
      >
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] p-0 flex flex-col h-full"
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6">
            <SheetHeader className="border-b pb-3 pt-6">
              <SheetTitle className="text-xl pb-2 -mt-1">
                Edit Segment
              </SheetTitle>
              <SheetDescription>
                <AddSegLists
                  segType={segType}
                  groupName={groupName}
                  shortName={shortName}
                />
              </SheetDescription>
            </SheetHeader>

            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Select segment type</h4>
              </div>
              <Select
                value={segType}
                onValueChange={(value) => {
                  setSegType(value);
                  setIsUpdated(true);
                  //handleSegTypeChange(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {segments &&
                      segments.map((group, index) => (
                        <SelectItem key={index} value={group.name}>
                          {group.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Select Group</h4>
                <button
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold"
                  onClick={handleAddGroup}
                >
                  +
                </button>
              </div>
              <Select value={groupName} onValueChange={setGroupName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groupArray &&
                      groupArray.map((group, index) => (
                        <SelectItem key={index} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full pt-6">
              <h4 className="font-semibold pb-3">Categories</h4>
              <Select
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
              </Select>

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
                          // onClick={() => handleRemove(item)}
                          className="w-5 h-5 ps-1 cursor-pointer"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer fixed to bottom */}
          <SheetFooter className="border-t px-6 py-4 flex justify-end gap-3">
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleSave}
            >
              Submit
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SegmentEditModal;
