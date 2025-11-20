import React, { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import {
  SegmentInfoPanelProps,
  SegmentField as SegmentFieldType,
  TabType,
} from "./types";
import { SegmentTabs } from "./SegmentTabs";
import { SegmentField } from "./SegmentField";
import { SegmentImage } from "./SegmentImage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import SelectSegType from "./SelectSegType";
import ShowAllSegments from "./ShowAllSegments";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import SegmentAttribute from "./SegmentAttribute";
import { resetInformationState } from "@/redux/slices/InformationSlice";

type Props = {
  onClose: () => void;
  open: boolean;
};
export const SegmentInfoPanel = ({ onClose, open }: Props) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [segmentData, setSegmentData] = useState<SegmentModal | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const { selectedSegment ,segmentType,multiSelectedSegmentTypes} = useSelector(
    (state: RootState) => state.information
  );

  
  const { list: jobList } = useSelector((state: RootState) => state.jobs);
  const { JsonData } = useSelector((state: RootState) => state.information);
  const handleFieldEdit = (key: string, value: any) => {
    // if (onUpdate) {
    //   onUpdate(key, value);
    // }
  };

  useEffect(() => {
    if (selectedSegment) setSegmentData(selectedSegment);
  }, [selectedSegment]);

  const handleFieldCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleJsonCopy = () => {
    const jsonString = JSON.stringify(JsonData, null, 2);
    navigator.clipboard.writeText(jsonString);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000); // Reset after 2 seconds
  };

  const getSegmentFields = (): SegmentFieldType[] => {
    return [
      {
        key: "group",
        label: "GROUP",
        value: segmentData?.segment_type || "",
        editable: true,
        copyable: true,
      },
      {
        key: "segType",
        label: "SEG TYPE",
        value: segmentData?.group_label_system || "",
        editable: true,
        copyable: true,
      },
      {
        key: "segName",
        label: "SEG NAME",
        value: segmentData?.short_title || "",
        editable: true,
        copyable: true,
      },
      {
        key: "annotationType",
        label: "ANNOTATION TYPE",
        value: segmentData?.annotation_type || "",
        editable: true,
        copyable: true,
      },
      {
        key: "annotation",
        label: "ANNOTATION",
        value: segmentData?.annotation_points_float?.join(", ") || "",
        editable: true,
        copyable: true,
      },
      {
        key: "bbAnnotationInt",
        label: "BB ANNOTATION_INT",
        value: segmentData?.segment_bb_float?.join(", ") || "",
        editable: true,
        copyable: true,
      },
    ];
  };

  const handleClose = () => {
   
    dispatch(resetInformationState());
     onClose();
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "information":
        return (
          <div className="space-y-4 flex gap-4">
            {/* Image Section */}
            {jobList && jobList.length > 0 && (
              <SegmentImage
                imageUrl={jobList[0].full_image}
                alt={`${jobList[0].full_image} `}
                className="mb-6 w-[40%] flex-shrink-0"
              />
            )}

            {/* Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-[60%]">
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-x-auto max-h-[60vh] custom-scrollbar ">
                {getSegmentFields()
                  .slice(0, 5)
                  .map((field) => (
                    <SegmentField
                      key={field.key}
                      field={field}
                      onEdit={handleFieldEdit}
                      onCopy={handleFieldCopy}
                    />
                  ))}

           {getSegmentFields()
                  .slice(5)
                  .map((field) => (
                    <SegmentField
                      key={field.key}
                      field={field}
                      onEdit={handleFieldEdit}
                      onCopy={handleFieldCopy}
                    />
                  ))}
              </div>

            
            </div>
          </div>
        );

      case "jsonData":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">JSON Data</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleJsonCopy}
                className="flex items-center gap-2"
              >
                {jsonCopied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy JSON
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono max-h-96">
              {JSON.stringify(JsonData, null, 2)}
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh]">
        {/* <DrawerContent className="[&>div:first-child]:hidden max-h-[90vh]"> */}
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex-shrink-0 border-b border-gray-200 ">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DrawerTitle className="text-xl">
                  Segment Name: {segmentData?.short_title}
                </DrawerTitle>
                {/* <DrawerDescription>
                  View and edit segment information
                </DrawerDescription> */}
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="rounded-lg px-3">
                  <X size={20} />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="flex ">
            <div className="mt-4 w-[30%]">
              <SelectSegType 
              activeTab={activeTab}
              
              />
              <ShowAllSegments 
              activeTab={activeTab}
              />
  
            {activeTab==="jsonData" && 
            (segmentType !=="" ||multiSelectedSegmentTypes.length)  &&
            <SegmentAttribute 
              activeTab={activeTab} />}
            </div>

            {/* Tabs */}
            <div className="mt-4 w-[70%]">
              <SegmentTabs
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as TabType)}
              />
              <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
                {renderTabContent()}
              </div>
            </div>

            {/* Content */}
          </div>
          <DrawerFooter className="flex-shrink-0 pt-0">
            <div className="flex gap-2 justify-end">
              <Button onClick={() => console.log("Save changes")}>
                Save Changes
              </Button>
              <DrawerClose
              onClick={handleClose}
              >
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
