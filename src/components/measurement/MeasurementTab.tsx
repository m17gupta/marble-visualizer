import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

import { AppDispatch, RootState } from "@/redux/store";
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
import { WallSelectionModal } from "../studio/studioMainTabs/tabContent/MeasurementTabModal";

interface MeasurementTabProps {
  selectedUnit: string;
}

const MeasurementTab: React.FC<MeasurementTabProps> = ({ selectedUnit }) => {
  //   const [selectedUnit, setSelectedUnit] = useState<string>("sq. m");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState<string>("");
  //const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<SegmentModal[]>([]);
  const [pdfData, setPdfData] = useState<
    { groupname: string; selected_material: any[] }[]
  >([]);

  // const finaldata = pdfData
  //   .find((d: any) => d.groupname == activeTab)
  //   ?.selected_material.map((d) => d.id);

  const nameExpanded = expandedGroups[0]?.group_label_system;

  const expandedDetails =
    pdfData
      .find((d) => d.groupname == nameExpanded)
      ?.selected_material.map((d) => d.id) ?? [];

  const handleSelectMaterial = (data: any, name: string) => {
    const copied = pdfData;
    const id = data.id;
    const isPresent = copied.find((d: any) => d.groupname == name);
    if (isPresent) {
      if (isPresent?.selected_material.find((d) => d.id == id)) {
        const newdata = isPresent.selected_material.filter((d) => d.id !== id);
        isPresent.selected_material = newdata;
        const filtered = copied.filter((d: any) => d.groupname != name);
        filtered.push(isPresent);
        setPdfData(filtered);
      } else {
        isPresent.selected_material.push(data);
        const filtered = pdfData.filter((d: any) => d.groupname != name);
        filtered.push(isPresent);
        setPdfData(filtered);
      }
    } else {
      const final = {
        groupname: name,
        selected_material: [data],
      };
      copied.push(final);
      setPdfData(copied);
    }
  };

  console.log(pdfData);
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
      ? "border-b-2 border-b-blue-500 text-blue-600 bg-blue-50"
      : "border-b-2 border-b-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50";
  };

  const getActiveTabData = (): MasterModel | undefined => {
    return masterArray.find((item) => item.name === activeTab);
  };

  const activeTabData = getActiveTabData();

  return (
    <>
      {/* Tab Navigation */}
      <div className="px-2 bg-white border-b border-gray-200">
        <div className="flex space-x-0 overflow-x-auto my-2 pb-2 thin-scrollbar gap-2">
          {masterArray.map((tab: MasterModel) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab?.name ?? "")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${getTabStyle(
                tab.name ?? ""
              )}`}
              type="button"
            >
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
            <WallSelectionModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              activeTabData={activeTabData}
              handleSelectMaterial={handleSelectMaterial}
              finaldata={expandedDetails}
              expanded={nameExpanded}
            />

            {/* Groups */}
            <div className="px-4 py-3 space-y-3">
              {activeTabData.allSegments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No segments available for {activeTab}</p>
                  <p className="text-sm">Total area: 0.00 {selectedUnit}</p>
                </div>
              ) : (
                activeTabData.allSegments.map((group: MasterGroupModel) => (
                  <div key={group.groupName} className="bg-gray-50 rounded-lg">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroupExpansion(group.segments)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors rounded-lg"
                      type="button"
                    >
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
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelGroupEdit();
                                }}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
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
                                className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded transition-colors"
                              >
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
                        <div className="px-4 pb-4">
                          {/* Select Style Button */}
                          <div className="mb-4 flex justify-end">
                            <button
                              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                              type="button"
                              onClick={() => setIsOpen(true)}
                            >
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
                                  className="flex justify-between items-center py-2.5 px-3 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                >
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
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Building className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No data available</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MeasurementTab;
