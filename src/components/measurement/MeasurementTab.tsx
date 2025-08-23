import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

import {
  Building,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meterArea } from "../canvasUtil/CalculatePolygonArea";
import { AppDispatch, RootState } from "@/redux/store";
import FilterSwatch from "../studio/studioMainTabs/searchSwatch/FilterSwatch";
import { Sheet } from "@/components/ui/sheet";
import {
  fetchAllCategories,
  setFilterSwatchSegmentType,
} from "@/redux/slices/swatch/FilterSwatchSlice";
// import styleIcon from "../../../public/assets/line-md--list-3-twotone.svg";
import styleIcon from "../../../public/assets/image/line-md--list-3-twotone (1).svg";

interface MeasurementTabProps {
  selectedUnit: string;
}

const MeasurementTab: React.FC<MeasurementTabProps> = ({ selectedUnit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState<string>("");
  //const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<SegmentModal[]>([]);
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  // const finaldata = pdfData
  //   .find((d: any) => d.groupname == activeTab)
  //   ?.selected_material.map((d) => d.id);

  const { masterArray } = useSelector((state: RootState) => state.masterArray);
  const { list: joblist } = useSelector((state: RootState) => state.jobs);
  // Set initial active tab
  const PixelRatio: number =
    (joblist[0]?.distance_ref?.distance_meter ?? 0) /
    (joblist[0]?.distance_ref?.distance_pixel ?? 1);

  useEffect(() => {
    if (
      masterArray &&
      masterArray.length > 0 &&
      masterArray[0].name &&
      !activeTab
    ) {
      setActiveTab(masterArray[0]?.name);
    }
  }, [masterArray, activeTab]);

  const getTotalSegmentsForTab = (tabName: string): number => {
    const tabData = masterArray.find((item) => item.name === tabName);
    if (!tabData) return 0;

    return tabData.allSegments.reduce((total, group) => {
      return total + group.segments.length;
    }, 0);
  };

  const convertArea = (area: number): string => {
    // Convert from sq. m to other units
    let convertedArea: number = area;
    switch (selectedUnit) {
      case "sq. ft":
        convertedArea = area * 10.764; // 1 sq.m = 10.764 sq.ft
        break;
      case "sq. in":
        convertedArea = area * 1550; // 1 sq.m = 1550 sq.in
        break;
      case "sq. cm":
        convertedArea = area * 10000; // 1 sq.m = 10000 sq.cm
        break;
      default:
        convertedArea = area;
    }
    return convertedArea.toFixed(2);
  };

  const toggleGroupExpansion = (segments: SegmentModal[]): void => {
    // If this group is already expanded, collapse it
    if (expandedGroups === segments) {
      setExpandedGroups([]);
    } else {
      // Expand this group
      setExpandedGroups(segments);
    }
  };

  const handleEditGroup = (groupName: string): void => {
    setEditingGroup(groupName);
    setEditingGroupValue(groupName);
  };

  const handleSaveGroupEdit = (): void => {
    // Here you would typically dispatch an action to update the group name
    // For now, just close the editing mode
    setEditingGroup(null);
    setEditingGroupValue("");
  };


  const handleCancelGroupEdit = (): void => {
    setEditingGroup(null);
    setEditingGroupValue("");
  };

  const getTabStyle = (tabName: string): string => {
    return activeTab === tabName
      ? "border-b-2 border-b-purple-500 border-purple-500 hover:border-purple-600 text-purple-600 bg-white hover:bg-purple-50 focus:ring-0 focus:outline-none"
      : "border-b-2 border-b-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50";
  };

  const getActiveTabData = (): MasterModel | undefined => {
    return masterArray.find((item) => item.name === activeTab);
  };

  const activeTabData = getActiveTabData();

  const handleSelectStyle = async (data: string) => {
    console.log("Selected Style for group:", data);
    const segment = segments.find((segment) =>
      segment.name.startsWith(data.replace(/\d+/g, ""))
    );

    if (!segment) return;
    dispatch(setFilterSwatchSegmentType(segment));
    await dispatch(fetchAllCategories(segment.categories));
    // console.log("Segment Type:", segment);
    setIsOpen(true);
  };
  return (
    <>
      {/* Tab Navigation */}
      <div className=" bg-transparent  border-gray-200 ">
        <div className="flex space-x-0 overflow-x-auto my-2 pb-2 thin-scrollbar gap-2 border-b px-3">
          {masterArray.map((tab: MasterModel) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab?.name ?? "")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all border border-gray-300 ${getTabStyle(
                tab.name ?? ""
              )}`}
              type="button">
              <div className="flex items-center space-x-1">
                <span>{tab.name}</span>
                <span className="text-xs bg-blue-200  text-gray-600 rounded-full px-1.5 py-0.5 min-w-[18px] text-center ">
                  {getTotalSegmentsForTab(tab.name ?? "")}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col overflow-auto">
        {activeTabData ? (
          <>
            {/* <WallSelectionModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              activeTabData={activeTabData}
              handleSelectMaterial={handleSelectMaterial}
              finaldata={expandedDetails}
              expanded={nameExpanded}
            /> */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <FilterSwatch setIsSheetOpen={setIsOpen} />
            </Sheet>

            {/* Groups */}
            <div className="px-4 py-3 space-y-3 overflow-y-auto h-[90vh] max-h-[60vh] sm:max-h-[56vh]">
              {activeTabData.allSegments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No segments available for {activeTab}</p>
                  <p className="text-sm">Total area: 0.00 {selectedUnit}</p>
                </div>
              ) : (
                activeTabData.allSegments.map((group: MasterGroupModel) => (
                  <div
                    key={group.groupName}
                    className="bg-transparent rounded-lg">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroupExpansion(group.segments)}
                      className="w-full flex items-center justify-between py-2 px-4 border-color border border-blue-300 hover:bg-transparent transition-colors rounded-lg"
                      type="button">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {group.groupName.slice(-1)}
                          </span>
                        </div>
                        <div className="text-left">
                          {editingGroup === group.groupName ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editingGroupValue}
                                onChange={(e) =>
                                  setEditingGroupValue(e.target.value)
                                }
                                className="px-2 py-1 text-sm font-semibold border border-blue-300 rounded focus:outline-none focus:border-blue-500 bg-white w-16"
                                autoFocus
                                onKeyDown={(e) => {
                                  e.stopPropagation(); // Prevent button click
                                  if (e.key === "Enter") handleSaveGroupEdit();
                                  if (e.key === "Escape")
                                    handleCancelGroupEdit();
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent button click
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveGroupEdit();
                                }}
                                className="p-1 text-green-600 hover:bg-green-100 rounded">
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelGroupEdit();
                                }}
                                className="p-1 text-red-600 hover:bg-red-100 rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-800">
                                {group.groupName}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditGroup(group.groupName);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded transition-colors">
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <p className="text-sm text-gray-500">
                            {group.segments.length} segment
                            {group.segments.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600 font-medium">
                          {convertArea(
                            group.segments.reduce(
                              (total, segment) =>
                                total +
                                parseFloat(
                                  meterArea(
                                    segment.seg_area_pixel || 0,
                                    PixelRatio
                                  ).toFixed(2)
                                ),
                              0
                            )
                          )}{" "}
                          {selectedUnit}
                        </span>
                        {expandedGroups.length > 0 &&
                        expandedGroups === group.segments ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Group Segments */}
                    {expandedGroups.length > 0 &&
                      expandedGroups === group.segments && (
                        <div className="px-4 pb-4 border border-t-0 border-blue-300 rounded-b-lg -mt-2">
                          {/* Select Style Button */}
                          <div className="mb-4 flex justify-end pt-6">
                            <button
                              className="px-3 py-1 border border-purple-600 text-purple-500 -mt-1 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium "
                              type="button" 
                              onClick={() =>
                                handleSelectStyle(group.groupName)
                              }>
                              <img src={styleIcon} alt="Style" className="w-4 h-4 inline-block mr-1 text-purple-500" />
                              Select Style 
                            </button>
                          </div>

                          {expandedGroups.length === 0 ? (
                            <div className="text-center py-6 text-gray-400">
                              <p>No segments in this group</p>
                              <p className="text-sm">
                                Area: 0.00 {selectedUnit}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 uppercase tracking-wide px-3">
                                <span>Area ({selectedUnit})</span>
                                <span>Segment</span>
                              </div>
                              {expandedGroups.map((segment: SegmentModal) => (
                                <div
                                  key={segment.id}
                                  className="flex justify-between items-center py-2.5 px-3 bg-transparent rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all">
                                  {/* Area on the left */}
                                  <div className="flex items-center space-x-3">
                                    <span className="text-blue-600 font-medium min-w-[80px]">
                                      {convertArea(
                                        parseFloat(
                                          meterArea(
                                            segment.seg_area_pixel || 0,
                                            PixelRatio
                                          ).toFixed(2)
                                        )
                                      )}{" "}
                                      {selectedUnit}
                                    </span>
                                  </div>

                                  {/* Segment info on the right - NOT editable */}
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <span className="text-xs font-bold text-blue-600">
                                        {segment.short_title}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-800">
                                        {segment.title || segment.short_title}
                                      </span>
                                      {segment.title && (
                                        <p className="text-xs text-gray-500">
                                          {segment.short_title}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            {/* Icon */}
            <div className="bg-blue-100 text-blue-500 p-4 rounded-full mb-3">
              <Building className="w-10 h-10" />
            </div>

            {/* Text */}
            <p className="text-gray-700 font-semibold text-base mb-1">
              No data available
            </p>
            <p className="text-gray-500 text-sm max-w-[200px] text-center">
              Add segments or styles to view the summary here.
            </p>

            {/* Optional Action */}
            <button
              // onClick={handleAddNew}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow transition">
              Add Segment
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MeasurementTab;
