import { MasterGroupModel, MasterModel } from '@/models/jobModel/JobModel';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';

import { AppDispatch, RootState } from '@/redux/store';
import { Building, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const MeasurementTab = () => {

    const [selectedUnit, setSelectedUnit] = useState<string>("sq. m");
    const [activeTab, setActiveTab] = useState<string | null>(null);

    //const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [expandedGroups, setExpandedGroups] = useState<SegmentModal[]>([]);
    const { masterArray } = useSelector((state: RootState) => state.masterArray);
  

    // Set initial active tab
    useEffect(() => {
        if (masterArray &&
            masterArray.length > 0 &&
            masterArray[0].name &&
            !activeTab) {
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
        let convertedArea = area;
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
                                tab.name??""
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
                        {/* Active Tab Header */}
                        <div className="px-4 py-4 bg-white border-b border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <h3 className="font-semibold text-gray-800">{activeTab}</h3>
                                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
                                </div>
                                <button
                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium"
                                    type="button">
                                    Select Style
                                </button>
                            </div>

                            {/* Total Area Display */}
                            <div className="inline-flex items-baseline space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                                <span className="text-2xl font-bold text-blue-600">
                                    {/* {convertArea(getTotalAreaForTab(activeTab))} */}
                                </span>
                                <span className="text-sm text-blue-500 font-medium">
                                    {selectedUnit}
                                </span>
                            </div>
                        </div>

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
                                    <div
                                        key={group.groupName}
                                        className="bg-gray-50 rounded-lg">
                                        {/* Group Header */}
                                        <button
                                            onClick={() => toggleGroupExpansion(group.segments)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors rounded-lg"
                                            type="button">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm font-bold text-blue-600">
                                                        {group.groupName.slice(-1)}
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-semibold text-gray-800">
                                                        {group.groupName}
                                                    </h4>
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
                                                                total + (segment.seg_area_pixel || 0),
                                                            0
                                                        )
                                                    )}{" "}
                                                    {selectedUnit}
                                                </span>
                                                {expandedGroups.length > 0 && expandedGroups === group.segments ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Group Segments */}
                                        {expandedGroups.length > 0 && expandedGroups === group.segments && (
                                            <div className="px-4 pb-4">
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
                                                            <span>Segment</span>
                                                            <span>Area ({selectedUnit})</span>
                                                        </div>
                                                        {expandedGroups.map((segment:SegmentModal) => (
                                                            <div
                                                                key={segment.id}
                                                                className="flex justify-between items-center py-2.5 px-3 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all">
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
                                                                <span className="text-blue-600 font-medium">
                                                                    {convertArea(segment.seg_area_pixel || 0)}{" "}
                                                                    {selectedUnit}
                                                                </span>
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
    )
}

export default MeasurementTab