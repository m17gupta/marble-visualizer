

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Download,
  Ruler,
  Target,
  X,
  Building,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateIsDistanceRef } from "@/redux/slices/jobSlice";
import MeasurementTab from "@/components/measurement/MeasurementTab";

// Type definitions
interface Segment {
  id: number;
  title: string;
  short_title: string;
  group_name_user: string;
  seg_area_sqmt: number;
  seg_perimeter: number;
  segment_type: string;
}

interface SegmentGroup {
  groupName: string;
  segments: Segment[];
}

interface MasterArrayItem {
  id: number;
  name: string;
  icon: string;
  color: string;
  color_code: string;
  short_code: string;
  categories: string[] | null;
  allSegments: SegmentGroup[];
}

interface Material {
  name: string;
  coverage: string;
  cost: string;
  image: string;
}

interface JobData {
  projectName: string;
  date: string;
  address: string;
  totalValue: string;
  totalCost: string;
}


const MeasurementContent: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>("sq. m");
  const [activeTab, setActiveTab] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [hasDimensionReference, setHasDimensionReference] =useState<boolean>(false);
  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);

  // Use mockMasterArray - replace with your actual data source
  // const masterArray = mockMasterArray;
  const dispatch = useDispatch<AppDispatch>();
  const { masterArray } = useSelector((state: RootState) => state.masterArray);
  const { list: joblist } = useSelector((state: RootState) => state.jobs);
  // Set initial active tab
  useEffect(() => {
    if (masterArray &&masterArray.length > 0 && !activeTab) {
      setActiveTab(masterArray[0]?.name!);
    }
  }, [masterArray, activeTab]);

  // Mock data
  const mockJobData: JobData = {
    projectName: "Residential Home Renovation",
    date: "5/8/2025",
    address: "123 Main Street, Jaipur, Rajasthan",
    totalValue: "$11,903",
    totalCost: "$10,845.78",
  };

  const units: string[] = ["sq. m", "sq. ft", "sq. in", "sq. cm"];

  const materials: Material[] = [
    {
      name: "Vintagewood - Cedar - 17 7/8 in x 7-1/8 in L",
      coverage: "74 sq ft/Box",
      cost: "5.99",
      image: "🟤",
    },
    {
      name: "Illumination",
      coverage: "58 sq ft/Box",
      cost: "8.99",
      image: "🔵",
    },
  ];

  const handleMarkDimension = (): void => {
   dispatch(updateIsDistanceRef(true));
    setHasDimensionReference(true);
  };

  const toggleGroupExpansion = (groupName: string): void => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const getTabStyle = (tabName: string): string => {
    return activeTab === tabName
      ? "border-b-2 border-b-blue-500 text-blue-600 bg-blue-50"
      : "border-b-2 border-b-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50";
  };

  const getActiveTabData = (): any | undefined => {
    return masterArray.find((item) => item.name === activeTab);
  };

  const getTotalAreaForTab = (tabName: string): number => {
    const tabData = masterArray.find((item) => item.name === tabName);
    if (!tabData) return 0;

    return tabData.allSegments.reduce((total, group) => {
      return (
        total +
        group.segments.reduce((groupTotal, segment) => {
          return groupTotal + (segment.seg_area_sqmt || 0);
        }, 0)
      );
    }, 0);
  };

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

  // PDF Generation Function
  const generatePDF = (): void => {
    const activeTabData = getActiveTabData();
    if (!activeTabData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>DZINLY Design Report</title>
          <style>
            @page { size: A4; margin: 20mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4; color: #374151; background: white; }
            .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; page-break-after: always; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #1f2937; }
            .date { color: #6b7280; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 600; margin: 20px 0 10px 0; color: #1f2937; }
            .project-info { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .segments-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .segments-table th, .segments-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .segments-table th { background: #f9fafb; font-weight: 600; }
            @media print { body { -webkit-print-color-adjust: exact; } .page { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <h1 class="logo">🏢 DZINLY DESIGN REPORT</h1>
              <p class="date">${mockJobData.date}</p>
            </div>
            
            <h2 class="section-title">Project Summary</h2>
            <div class="project-info">
              <p><strong>Project:</strong> ${mockJobData.projectName}</p>
              <p><strong>Address:</strong> ${mockJobData.address}</p>
              <p><strong>Active Section:</strong> ${activeTab}</p>
              <p><strong>Total Area:</strong> ${convertArea(
                getTotalAreaForTab(activeTab)
              )} ${selectedUnit}</p>
            </div>
            
            <h3 class="section-title">${activeTab} Segments</h3>
            <table class="segments-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Segment ID</th>
                  <th>Title</th>
                  <th>Area (${selectedUnit})</th>
                </tr>
              </thead>
              <tbody>
                ${activeTabData.allSegments
                  .map((group: any) =>
                    group.segments
                      .map(
                        (segment: any) => `
                    <tr>
                      <td>${group.groupName}</td>
                      <td>${segment.short_title}</td>
                      <td>${segment.title || "Untitled"}</td>
                      <td>${convertArea(segment.seg_area_sqmt || 0)}</td>
                    </tr>
                  `
                      )
                      .join("")
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const PDFModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            PDF Report Preview
          </h3>
          <button
            onClick={() => setShowPDFModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowPDFModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              type="button">
              Cancel
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              type="button">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const activeTabData = getActiveTabData();

  return (
    <div className="max-h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Ruler className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Measurements
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Unit:</span>
            <select
              value={selectedUnit}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedUnit(e.target.value)
              }
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
              {units.map((unit: string) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* Dimension Reference */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Dimension Reference
              </span>
            </div>

            {joblist &&
            joblist.length>0 &&
            joblist[0].distance_ref!=null ? (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-600 font-medium">
                  {joblist[0].distance_ref?.distance_meter} reference
                </span>
                <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            ) : (
              <button
                onClick={handleMarkDimension}
                className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                type="button">
                Mark Dimension
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
          <MeasurementTab/>

     

        {/* Footer Action */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setShowPDFModal(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm font-medium"
            type="button">
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* PDF Modal */}
      {showPDFModal && <PDFModal />}
    </div>
  );
};

export default MeasurementContent;
