// import React, { useEffect, useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   Edit2,
//   Download,
//   Ruler,
//   Target,
//   X,
//   Building,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// // Type definitions
// interface Segment {
//   id: string;
//   area: string;
//   unit: string;
// }

// interface Tab {
//   id: string;
//   label: string;
//   color: string;
//   count: number;
// }

// interface Material {
//   name: string;
//   coverage: string;
//   cost: string;
//   image: string;
// }

// interface JobData {
//   projectName: string;
//   date: string;
//   address: string;
//   totalValue: string;
//   totalCost: string;
// }

// interface Segments {
//   [key: string]: Segment[];
// }

// const MeasurementContent: React.FC = () => {
//   const [selectedUnit, setSelectedUnit] = useState<string>("sq. m");
//   const [activeTab, setActiveTab] = useState<string>("Column");
//   const [expandedSegment, setExpandedSegment] = useState<string>("Column");
//   const [hasDimensionReference, setHasDimensionReference] =
//     useState<boolean>(false);
//   const [showPDFModal, setShowPDFModal] = useState<boolean>(false);
//   const [segment, setSegments] = useState<Segment[]>([]);

//   const { masterArray } = useSelector((state: RootState) => state.masterArray);

//   // Mock data - replace with your actual data
//   const mockJobData: JobData = {
//     projectName: "Residential Home Renovation",
//     date: "5/8/2025",
//     address: "123 Main Street, Jaipur, Rajasthan",
//     totalValue: "$11,903",
//     totalCost: "$10,845.78",
//   };

//   const units: string[] = ["sq. m", "sq. ft", "sq. in", "sq. cm"];

//   const tabs: Tab[] = [
//     {
//       id: "Column",
//       label: "Column",
//       color: "border-b-blue-500 text-blue-600",
//       count: 1,
//     },
//     {
//       id: "Gutter",
//       label: "Gutter",
//       color: "border-b-transparent text-gray-500",
//       count: 1,
//     },
//     {
//       id: "Wall",
//       label: "Wall",
//       color: "border-b-transparent text-gray-500",
//       count: 2,
//     },
//     {
//       id: "Roof",
//       label: "Roof",
//       color: "border-b-transparent text-gray-500",
//       count: 1,
//     },
//     {
//       id: "Light",
//       label: "Light",
//       color: "border-b-transparent text-gray-500",
//       count: 1,
//     },
//     {
//       id: "Trim",
//       label: "Trim",
//       color: "border-b-transparent text-gray-500",
//       count: 1,
//     },
//   ];

//   const segments: Segments = {
//     Column: [{ id: "CL1", area: "45.60", unit: "sq. m" }],
//     Gutter: [{ id: "GT1", area: "32.40", unit: "sq. m" }],
//     Wall: [
//       { id: "WL1", area: "156.80", unit: "sq. m" },
//       { id: "WL2", area: "98.20", unit: "sq. m" },
//     ],
//     Roof: [{ id: "RF1", area: "89.30", unit: "sq. m" }],
//     Light: [{ id: "LT1", area: "12.50", unit: "sq. m" }],
//     Trim: [{ id: "TR1", area: "67.40", unit: "sq. m" }],
//   };

//   const materials: Material[] = [
//     {
//       name: "Vintagewood - Cedar - 17 7/8 in x 7-1/8 in L",
//       coverage: "74 sq ft/Box",
//       cost: "5.99",
//       image: "🟤",
//     },
//     {
//       name: "Illumination",
//       coverage: "58 sq ft/Box",
//       cost: "8.99",
//       image: "🔵",
//     },
//   ];

//   const handleMarkDimension = (): void => {
//     setHasDimensionReference(true);
//   };

//   const getTabStyle = (tabId: string): string => {
//     return activeTab === tabId
//       ? "border-b-2 border-b-blue-500 text-blue-600 bg-blue-50"
//       : "border-b-2 border-b-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50";
//   };

//   const getTotalArea = (): string => {
//     if (!segments[activeTab]) return "0.00";
//     return segments[activeTab]
//       .reduce((total: number, segment: Segment) => {
//         return total + parseFloat(segment.area);
//       }, 0)
//       .toFixed(2);
//   };

//   // PDF Generation Function
//   const generatePDF = (): void => {
//     const element = document.getElementById("pdf-content");
//     if (!element) return;

//     // Create a new window for printing
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>DZINLY Design Report</title>
//           <style>
//             @page {
//               size: A4;
//               margin: 20mm;
//             }

//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }

//             body {
//               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//               font-size: 12px;
//               line-height: 1.4;
//               color: #374151;
//               background: white;
//             }

//             .page {
//               width: 210mm;
//               min-height: 297mm;
//               padding: 20mm;
//               margin: 0 auto;
//               background: white;
//               page-break-after: always;
//             }

//             .page:last-child {
//               page-break-after: avoid;
//             }

//             .header {
//               text-align: center;
//               margin-bottom: 30px;
//               border-bottom: 2px solid #e5e7eb;
//               padding-bottom: 20px;
//             }

//             .logo {
//               font-size: 24px;
//               font-weight: bold;
//               margin-bottom: 8px;
//               color: #1f2937;
//             }

//             .date {
//               color: #6b7280;
//               font-size: 14px;
//             }

//             .property-image {
//               width: 100%;
//               height: 150px;
//               background: linear-gradient(135deg, #fed7aa 0%, #fca5a5 100%);
//               border-radius: 8px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               margin: 20px 0;
//               color: #6b7280;
//             }

//             .section-title {
//               font-size: 18px;
//               font-weight: 600;
//               margin: 20px 0 10px 0;
//               color: #1f2937;
//             }

//             .project-info {
//               background: #f9fafb;
//               padding: 15px;
//               border-radius: 8px;
//               margin: 15px 0;
//             }

//             .segments-grid {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 15px;
//               margin: 20px 0;
//             }

//             .segment-card {
//               text-align: center;
//               padding: 15px;
//               background: #f3f4f6;
//               border-radius: 8px;
//             }

//             .segment-icon {
//               width: 40px;
//               height: 40px;
//               background: #d1d5db;
//               border-radius: 8px;
//               margin: 0 auto 10px;
//             }

//             .materials-grid {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 20px;
//               margin: 20px 0;
//             }

//             .material-card {
//               border: 1px solid #e5e7eb;
//               border-radius: 8px;
//               padding: 15px;
//               display: flex;
//               align-items: flex-start;
//               gap: 15px;
//             }

//             .material-image {
//               width: 60px;
//               height: 60px;
//               background: linear-gradient(135deg, #fed7aa 0%, #fbbf24 100%);
//               border-radius: 8px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               font-size: 24px;
//             }

//             .material-info h3 {
//               font-size: 12px;
//               font-weight: 600;
//               margin-bottom: 8px;
//               line-height: 1.3;
//             }

//             .material-details {
//               font-size: 10px;
//               color: #6b7280;
//               line-height: 1.4;
//             }

//             .summary-table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//               border: 1px solid #e5e7eb;
//               border-radius: 8px;
//               overflow: hidden;
//             }

//             .summary-table th {
//               background: #f9fafb;
//               padding: 12px;
//               text-align: left;
//               font-size: 10px;
//               font-weight: 600;
//               text-transform: uppercase;
//               color: #6b7280;
//               letter-spacing: 0.5px;
//             }

//             .summary-table td {
//               padding: 12px;
//               border-top: 1px solid #e5e7eb;
//               font-size: 11px;
//             }

//             .summary-table tr:nth-child(even) {
//               background: #f9fafb;
//             }

//             .total-value {
//               font-weight: 600;
//               color: #1f2937;
//             }

//             .footer-note {
//               font-size: 10px;
//               color: #6b7280;
//               text-align: right;
//               margin-top: 15px;
//               line-height: 1.4;
//             }

//             .company-footer {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               margin-bottom: 20px;
//               padding-bottom: 15px;
//               border-bottom: 1px solid #e5e7eb;
//             }

//             .company-name {
//               font-size: 12px;
//               color: #6b7280;
//             }

//             .company-website {
//               font-size: 12px;
//               color: #3b82f6;
//             }

//             @media print {
//               body { -webkit-print-color-adjust: exact; }
//               .page { margin: 0; }
//             }
//           </style>
//         </head>
//         <body>
//           <!-- Page 1 -->
//           <div class="page">
//             <div class="header">
//               <div class="logo">🏢</div>
//               <h1 class="logo">DZINLY DESIGN REPORT</h1>
//               <p class="date">${mockJobData.date}</p>
//             </div>

//             <div class="property-image">
//               <div style="text-align: center;">
//                 <div style="font-size: 48px; margin-bottom: 10px;">🏠</div>
//                 <p>Property Image</p>
//               </div>
//             </div>

//             <h2 class="section-title">Project Summary</h2>
//             <div class="project-info">
//               <p><strong>Project:</strong> ${mockJobData.projectName}</p>
//               <p><strong>Address:</strong> ${mockJobData.address}</p>
//               <p style="margin-top: 10px; font-size: 11px; color: #6b7280;">
//                 Project and material may not be saved in the cloud. Please save your work locally and take up all job data before exiting your browser session.
//               </p>
//             </div>

//             <h3 style="font-size: 14px; margin: 20px 0 10px 0;">Segments</h3>
//             <div class="segments-grid">
//               <div class="segment-card">
//                 <div class="segment-icon"></div>
//                 <p style="font-weight: 500;">Wall2</p>
//               </div>
//               <div class="segment-card">
//                 <div class="segment-icon"></div>
//                 <p style="font-weight: 500;">Wall</p>
//               </div>
//             </div>
//           </div>

//           <!-- Page 2 -->
//           <div class="page">
//             <h2 class="section-title">Material Summary</h2>

//             <div class="materials-grid">
//               ${materials
//                 .map(
//                   (material) => `
//                 <div class="material-card">
//                   <div class="material-image">${material.image}</div>
//                   <div class="material-info">
//                     <h3>${material.name}</h3>
//                     <div class="material-details">
//                       <p>Coverage: ${material.coverage}</p>
//                       <p>$${material.cost} / sq ft Material</p>
//                     </div>
//                   </div>
//                 </div>
//               `
//                 )
//                 .join("")}
//             </div>
//           </div>

//           <!-- Page 3 -->
//           <div class="page">
//             <div class="company-footer">
//               <div class="company-name">🏢 DZINLY</div>
//               <div class="company-website">dzinly.org</div>
//             </div>

//             <h2 class="section-title">Project Summary</h2>
//             <p style="margin-bottom: 5px;"><strong>For:</strong> ${
//               mockJobData.projectName
//             }</p>
//             <p style="margin-bottom: 5px;"><strong>Increased Home Value:</strong> ${
//               mockJobData.totalValue
//             }</p>
//             <p style="margin-bottom: 20px;"><strong>Total Cost:</strong> ${
//               mockJobData.totalCost
//             }</p>

//             <table class="summary-table">
//               <thead>
//                 <tr>
//                   <th>Summary</th>
//                   <th>Materials</th>
//                   <th>Applications</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>Wall2</td>
//                   <td>5 Units</td>
//                   <td>$0</td>
//                   <td class="total-value">$8,604.95</td>
//                 </tr>
//                 <tr>
//                   <td>Wall</td>
//                   <td>3 Units</td>
//                   <td>$0</td>
//                   <td class="total-value">$1,495.82</td>
//                 </tr>
//               </tbody>
//             </table>

//             <p class="footer-note">
//               All prices based on Home Depot and Lowes estimates and do not include labor, additional materials or delivery
//             </p>
//           </div>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(html);
//     printWindow.document.close();

//     // Wait for content to load then print
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 500);
//   };

//   const PDFModal: React.FC = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-800">
//             PDF Report Preview
//           </h3>
//           <button
//             onClick={() => setShowPDFModal(false)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//             type="button"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* PDF Content */}
//         <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
//           <div className="bg-gray-100 p-8">
//             {/* PDF Document */}
//             <div
//               id="pdf-content"
//               className="bg-white shadow-lg max-w-2xl mx-auto"
//             >
//               {/* Page 1 - Header */}
//               <div className="p-8">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                   <div className="flex items-center justify-center mb-4">
//                     <Building className="w-8 h-8 text-gray-600 mr-2" />
//                   </div>
//                   <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                     DZINLY DESIGN REPORT
//                   </h1>
//                   <p className="text-gray-600">{mockJobData.date}</p>
//                 </div>

//                 {/* Property Image Placeholder */}
//                 <div className="mb-8">
//                   <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-red-300 rounded-lg flex items-center justify-center">
//                     <div className="text-center text-gray-700">
//                       <Building className="w-16 h-16 mx-auto mb-2 opacity-50" />
//                       <p className="text-sm">Property Image</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Project Summary */}
//                 <div className="mb-8">
//                   <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                     Project Summary
//                   </h2>
//                   <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                     <p className="mb-2">
//                       <strong>Project:</strong> {mockJobData.projectName}
//                     </p>
//                     <p className="mb-2">
//                       <strong>Address:</strong> {mockJobData.address}
//                     </p>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-4">
//                     Project and material may not be saved in the cloud. Please
//                     save your work locally and take up all job data before
//                     exiting your browser session.
//                   </p>

//                   {/* Segments Grid */}
//                   <h3 className="font-semibold mb-3">Segments</h3>
//                   <div className="grid grid-cols-2 gap-4 mb-6">
//                     <div className="text-center p-4 bg-gray-50 rounded-lg">
//                       <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
//                       <p className="text-sm font-medium">Wall2</p>
//                     </div>
//                     <div className="text-center p-4 bg-gray-50 rounded-lg">
//                       <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
//                       <p className="text-sm font-medium">Wall</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Page 2 - Material Summary */}
//               <div className="p-8 border-t-2 border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-6">
//                   Material Summary
//                 </h2>

//                 <div className="grid grid-cols-2 gap-6 mb-8">
//                   {materials.map((material: Material, index: number) => (
//                     <div
//                       key={index}
//                       className="border border-gray-200 rounded-lg p-4"
//                     >
//                       <div className="flex items-start space-x-3">
//                         <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-lg flex items-center justify-center text-2xl">
//                           {material.image}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-medium text-sm text-gray-800 mb-2">
//                             {material.name}
//                           </h3>
//                           <div className="space-y-1 text-xs text-gray-600">
//                             <p>Coverage: {material.coverage}</p>
//                             <p>${material.cost} / sq ft Material</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Page 3 - Project Summary Table */}
//               <div className="p-8 border-t-2 border-gray-200">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center space-x-2">
//                     <Building className="w-5 h-5 text-gray-400" />
//                     <span className="text-sm text-gray-600">DZINLY</span>
//                   </div>
//                   <span className="text-sm text-blue-600">dzinly.org</span>
//                 </div>

//                 <h2 className="text-xl font-semibold text-gray-800 mb-6">
//                   Project Summary
//                 </h2>
//                 <p className="text-sm text-gray-600 mb-2">
//                   For: {mockJobData.projectName}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Increased Home Value: {mockJobData.totalValue}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-6">
//                   Total Cost: {mockJobData.totalCost}
//                 </p>

//                 {/* Summary Table */}
//                 <div className="overflow-hidden border border-gray-200 rounded-lg">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Summary
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Materials
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Applications
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Total
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       <tr>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           Wall2
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-600">
//                           5 Units
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-600">$ 0</td>
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                           $ 8,604.95
//                         </td>
//                       </tr>
//                       <tr className="bg-gray-50">
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           Wall
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-600">
//                           3 Units
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-600">$ 0</td>
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                           $ 1,495.82
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="mt-4 text-right">
//                   <p className="text-sm text-gray-600">
//                     All prices based on Home Depot and Lowes estimates and do
//                     not include labor, additional materials or delivery
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="p-4 border-t border-gray-200 bg-gray-50">
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => setShowPDFModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//               type="button"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={generatePDF}
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
//               type="button"
//             >
//               <Download className="w-4 h-4" />
//               <span>Download PDF</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-h-full bg-white">
//       {/* Compact Header */}
//       <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//               <Ruler className="w-4 h-4 text-white" />
//             </div>
//             <h2 className="text-lg font-semibold text-gray-800">
//               Measurements
//             </h2>
//           </div>

//           {/* Inline Unit Converter */}
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-600">Unit:</span>
//             <select
//               value={selectedUnit}
//               onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//                 setSelectedUnit(e.target.value)
//               }
//               className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               {units.map((unit: string) => (
//                 <option key={unit} value={unit}>
//                   {unit}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col h-full">
//         {/* Dimension Reference - Compact */}
//         <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <Target className="w-4 h-4 text-gray-400" />
//               <span className="text-sm font-medium text-gray-700">
//                 Dimension Reference
//               </span>
//             </div>

//             {hasDimensionReference ? (
//               <div className="flex items-center space-x-2 text-sm">
//                 <span className="text-green-600 font-medium">
//                   10.5m reference
//                 </span>
//                 <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
//               </div>
//             ) : (
//               <button
//                 onClick={handleMarkDimension}
//                 className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//                 type="button"
//               >
//                 Mark Dimension
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Tab Navigation - Sleek */}
//         <div className="px-4 bg-white border-b border-gray-200">
//           <div className="flex space-x-0 overflow-x-auto">
//             {masterArray.map((tab: any) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.name)}
//                 className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all ${getTabStyle(
//                   tab.id
//                 )}`}
//                 type="button"
//               >
//                 <div className="flex items-center space-x-1">
//                   <span>{tab.name}</span>
//                   <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
//                     {tab.allSegments?.length || 0}
//                   </span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="flex flex-col overflow-auto">
//           {/* Active Tab Header */}
//           <div className="px-4 py-4 bg-white border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex items-center space-x-2">
//                   <h3 className="font-semibold text-gray-800">{activeTab}</h3>
//                   <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
//                 </div>
//                 <button
//                   onClick={() =>
//                     setExpandedSegment(
//                       expandedSegment === activeTab ? "" : activeTab
//                     )
//                   }
//                   className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//                   type="button"
//                 >
//                   {expandedSegment === activeTab ? (
//                     <ChevronUp className="w-4 h-4 text-gray-400" />
//                   ) : (
//                     <ChevronDown className="w-4 h-4 text-gray-400" />
//                   )}
//                 </button>
//               </div>

//               <button
//                 className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium"
//                 type="button"
//               >
//                 Select Style
//               </button>
//             </div>

//             {/* Total Area Display */}
//             <div className="mt-3">
//               <div className="inline-flex items-baseline space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
//                 <span className="text-2xl font-bold text-blue-600">
//                   {getTotalArea()}
//                 </span>
//                 <span className="text-sm text-blue-500 font-medium">
//                   {selectedUnit}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Segment Details */}
//           {expandedSegment === activeTab && (
//             <div className="px-4 py-3">
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <div className="flex justify-between items-center mb-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                   <span>Segment</span>
//                   <span>Area ({selectedUnit.split(".")[1] || "m²"})</span>
//                 </div>

//                 <div className="space-y-2">
//                   {segments[activeTab]?.map(
//                     (segment: Segment, index: number) => (
//                       <div
//                         key={segment.id}
//                         className="flex justify-between items-center py-2.5 px-3 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all group"
//                       >
//                         <div className="flex items-center space-x-3">
//                           <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                             <span className="text-xs font-bold text-blue-600">
//                               {segment.id}
//                             </span>
//                           </div>
//                           <span className="font-medium text-gray-800">
//                             {segment.id}
//                           </span>
//                         </div>
//                         <span className="text-blue-600 font-medium">
//                           {segment.area} {selectedUnit}
//                         </span>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer Action */}
//         <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
//           <button
//             onClick={() => setShowPDFModal(true)}
//             className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm font-medium"
//             type="button"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export PDF Report</span>
//           </button>
//         </div>
//       </div>

//       {/* PDF Modal */}
//       {showPDFModal && <PDFModal />}
//     </div>
//   );
// };

// export default MeasurementContent;

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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

// Mock data - replace with your actual props or Redux state
const mockMasterArray: MasterArrayItem[] = [
  {
    id: 1,
    name: "Wall",
    icon: "https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/wall.svg",
    color: "Red",
    color_code: "#25f474",
    short_code: "WL",
    categories: [
      "Brick",
      "Siding",
      "Wall Panels",
      "Pediment",
      "EIFS",
      "Stone",
      "Stain",
    ],
    allSegments: [
      {
        groupName: "Wall1",
        segments: [
          {
            id: 56,
            title: "Siding",
            short_title: "WL2",
            group_name_user: "Wall1",
            seg_area_sqmt: 18.72,
            seg_perimeter: 680,
            segment_type: "Wall",
          },
          {
            id: 55,
            title: "Siding",
            short_title: "WL1",
            group_name_user: "Wall1",
            seg_area_sqmt: 22.15,
            seg_perimeter: 610,
            segment_type: "Wall",
          },
          {
            id: 68,
            title: "Brick",
            short_title: "WL4",
            group_name_user: "Wall1",
            seg_area_sqmt: 56.34,
            seg_perimeter: 1146,
            segment_type: "Wall",
          },
        ],
      },
      {
        groupName: "Wall2",
        segments: [
          {
            id: 67,
            title: "Brick",
            short_title: "WL3",
            group_name_user: "Wall2",
            seg_area_sqmt: 5.88,
            seg_perimeter: 346,
            segment_type: "Wall",
          },
          {
            id: 74,
            title: "Siding",
            short_title: "WL7",
            group_name_user: "Wall2",
            seg_area_sqmt: 7.45,
            seg_perimeter: 692,
            segment_type: "Wall",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Door",
    icon: "https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/door.svg",
    color: "Red",
    color_code: "#FE0056",
    short_code: "DO",
    categories: ["Door"],
    allSegments: [
      {
        groupName: "Door1",
        segments: [
          {
            id: 78,
            title: "",
            short_title: "DO1",
            group_name_user: "Door1",
            seg_area_sqmt: 3.25,
            seg_perimeter: 496,
            segment_type: "Door",
          },
        ],
      },
      {
        groupName: "Door2",
        segments: [
          {
            id: 77,
            title: "Door",
            short_title: "DO3",
            group_name_user: "Door2",
            seg_area_sqmt: 2.88,
            seg_perimeter: 242,
            segment_type: "Door",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Window",
    icon: "https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/window.svg",
    color: "Purple",
    color_code: "#8622FF",
    short_code: "WI",
    categories: ["Windows", "Vents"],
    allSegments: [
      {
        groupName: "Window1",
        segments: [
          {
            id: 79,
            title: "Windows",
            short_title: "WI1",
            group_name_user: "Window1",
            seg_area_sqmt: 2.68,
            seg_perimeter: 208,
            segment_type: "Window",
          },
          {
            id: 75,
            title: "Windows",
            short_title: "WI2",
            group_name_user: "Window1",
            seg_area_sqmt: 15.45,
            seg_perimeter: 604,
            segment_type: "Window",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Roof",
    icon: "https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/roof.svg",
    color: "Yellow",
    color_code: "#eeff00",
    short_code: "RF",
    categories: ["Roofing", "Tile", "Paint", "Gable", "Awning"],
    allSegments: [
      {
        groupName: "Roof3",
        segments: [
          {
            id: 73,
            title: "Roofing",
            short_title: "RF3",
            group_name_user: "Roof3",
            seg_area_sqmt: 2.96,
            seg_perimeter: 304,
            segment_type: "Roof",
          },
        ],
      },
      {
        groupName: "Roof1",
        segments: [
          {
            id: 53,
            title: "Roofing",
            short_title: "RF1",
            group_name_user: "Roof1",
            seg_area_sqmt: 8.43,
            seg_perimeter: 662,
            segment_type: "Roof",
          },
        ],
      },
      {
        groupName: "Roof2",
        segments: [
          {
            id: 54,
            title: "Roofing",
            short_title: "RF3",
            group_name_user: "Roof2",
            seg_area_sqmt: 32.48,
            seg_perimeter: 1390,
            segment_type: "Roof",
          },
        ],
      },
    ],
  },
];

const MeasurementContent: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>("sq. m");
  const [activeTab, setActiveTab] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [hasDimensionReference, setHasDimensionReference] =
    useState<boolean>(false);
  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);

  // Use mockMasterArray - replace with your actual data source
  // const masterArray = mockMasterArray;

  const { masterArray } = useSelector((state: RootState) => state.masterArray);

  // Set initial active tab
  useEffect(() => {
    if (masterArray.length > 0 && !activeTab) {
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
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowPDFModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              type="button"
            >
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
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
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

            {hasDimensionReference ? (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-600 font-medium">
                  10.5m reference
                </span>
                <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            ) : (
              <button
                onClick={handleMarkDimension}
                className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                type="button"
              >
                Mark Dimension
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 bg-white border-b border-gray-200">
          <div className="flex space-x-0 overflow-x-auto">
            {masterArray.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all ${getTabStyle(
                  tab.name
                )}`}
                type="button"
              >
                <div className="flex items-center space-x-1">
                  <span>{tab.name}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {getTotalSegmentsForTab(tab.name)}
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
                    type="button"
                  >
                    Select Style
                  </button>
                </div>

                {/* Total Area Display */}
                <div className="inline-flex items-baseline space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-blue-600">
                    {convertArea(getTotalAreaForTab(activeTab))}
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
                  activeTabData.allSegments.map((group: SegmentGroup) => (
                    <div
                      key={group.groupName}
                      className="bg-gray-50 rounded-lg"
                    >
                      {/* Group Header */}
                      <button
                        onClick={() => toggleGroupExpansion(group.groupName)}
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
                                  total + (segment.seg_area_sqmt || 0),
                                0
                              )
                            )}{" "}
                            {selectedUnit}
                          </span>
                          {expandedGroups.has(group.groupName) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Group Segments */}
                      {expandedGroups.has(group.groupName) && (
                        <div className="px-4 pb-4">
                          {group.segments.length === 0 ? (
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
                              {group.segments.map((segment: Segment) => (
                                <div
                                  key={segment.id}
                                  className="flex justify-between items-center py-2.5 px-3 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                >
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
                                    {convertArea(segment.seg_area_sqmt || 0)}{" "}
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

        {/* Footer Action */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setShowPDFModal(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm font-medium"
            type="button"
          >
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
