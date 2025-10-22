// src/components/studio/studioMainTabs/tabContent/ExtenstionPdf.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
//import ExtenstionPDF from "@/components/studio/studioMainTabs/tabContent/ExtenstionPDF";

type Props = {
  setShowPDFReport: React.Dispatch<React.SetStateAction<boolean>>;
  // ye props future me aayenge to directly Document ko pass ho jayenge:
  mockJobData?: any;
  activeTab?: any;
  selectedUnit?: any;
  convertArea?: any;
  masterArray?: any;
  pdfData?: any;
  PixelRatio?: number;
};

const ExtenstionPdf: React.FC<Props> = ({
  setShowPDFReport,
  mockJobData,
  activeTab,
  selectedUnit,
  convertArea,
  masterArray,
  pdfData,
  PixelRatio,
}) => {
  // backdrop click par close
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowPDFReport(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4"
      style={{ isolation: "isolate" }} // new stacking context
      onMouseDown={onBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden relative z-[100000]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-[100001]">
          <h3 className="text-lg font-semibold text-gray-800">DZINLY PDF REPORT</h3>
          <button
            onClick={() => setShowPDFReport(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div
          className="p-4 bg-gray-50 h-[80vh] overflow-auto relative"
          style={{ zIndex: 100000, isolation: "isolate" }}
        >
          <PDFViewer
            width="100%"
            height="100%"
            style={{ border: "none", zIndex: 999999, position: "relative" }}
          >
            {/* <ExtenstionPDF
              // ye props aage Document ko pass ho jayenge
              jobData={mockJobData}
              activeTab={activeTab}
              selectedUnit={selectedUnit}
              masterArray={masterArray}
              convertArea={convertArea}
              pdfData={pdfData}
              PixelRatio={PixelRatio}
            /> */}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default ExtenstionPdf;
