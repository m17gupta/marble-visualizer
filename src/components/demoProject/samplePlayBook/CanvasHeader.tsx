import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Share2,
  Download,
  ExternalLink,
  MoreVertical,
  RefreshCcw,
  RotateCw,
  ChevronDown,
  X,
  ChevronsLeftRight,
} from "lucide-react";
import { UploadProjects } from './UploadProjects';
import { TbColorSwatch } from 'react-icons/tb';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { RiResetLeftFill } from 'react-icons/ri';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setIsHover, setIsMask, setIsResetCanvas, setIsShowSegmentName } from '@/redux/slices/demoProjectSlice/DemoCanvasSlice';
import { FaTheaterMasks } from 'react-icons/fa';
// import ExtenstionPDF from '@/components/studio/studioMainTabs/tabContent/ExtenstionPDF';
import { PDFViewer } from '@react-pdf/renderer';
import ExtenstionPdf from './ExtenstionPdf';
import { Link } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
const CanvasHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isHover, isMask, isResetCanvas, isShowSegmentName } = useSelector((state: RootState) => state.demoCanvas);
  const resetCanvas = () => {
    dispatch(setIsResetCanvas(true));
  }

  const handleMask = () => {
    dispatch(setIsMask(!isMask));
  }

    const [showPDFModalReport, setShowPDFReport] = useState<boolean>(false);
  
    // const navigation = {} =>{
      
    // }
 
  const handleShowSegName = () => {
    dispatch(setIsShowSegmentName(!isShowSegmentName));
  }
  return (
    <>
      <div className="rounded-0 border text-card-foreground shadow flex flex-row absolute items-center gap-2 bg-white justify-between rounded-b-lg z-[1] top-0 inset-x-10 px-2 py-4">


        <Button
          className="bg-transparent border-blue-600 ms-16 flex gap-2"
          size="sm"
          onClick={resetCanvas}
          type="button"
          title="Reset canvas view"
        >
          <RiResetLeftFill />  Reset canvas
        </Button>

        <div className='flex gap-2'>
          <Button
            variant="ghost"
            size="sm"
            className={["gap-2 ", isMask ? "bg-blue-100 text-blue-700 border border-blue-400" : " text-gray-800"].join(" ")}
            onClick={handleMask}
          >
            <FaTheaterMasks size="sm" className={isMask ? "text-blue-700" : "text-gray-800"} />
            Mask
          </Button>
          <Button
            variant="ghost"
            size="sm"
          // className={["gap-2 ", isMask ? "bg-blue-100 text-blue-700 border border-blue-400" : " text-gray-800"].join(" ")}
            onClick={handleShowSegName}
          >
            {isShowSegmentName ? <IoMdEyeOff size="sm" className={isShowSegmentName ? "text-blue-700" : "text-gray-800"} /> : <IoMdEye size="sm" className={!isShowSegmentName ? "text-blue-700" : "text-gray-800"} />}
            {isShowSegmentName ? 'Hide Segment Name' : 'Show Segment Name'}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
         

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {/* <DropdownMenuLabel>Menu</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem  onClick={() => setShowPDFReport(true)}> PDF Report</DropdownMenuItem>
              <Link to="/pdf" className='text-gray-800'><DropdownMenuItem className='flex gap-2  font-light'>Pricing PDF</DropdownMenuItem></Link>
              {/* <DropdownMenuItem>Report a Problem</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>

       

        

          <Button variant="ghost" size="sm" className="gap-2">
            <TbColorSwatch className="h-4 w-4" /> Add to Catalog
          </Button>
          {/* <Button variant="ghost" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" /> View Projects
          </Button> */}
          <Button variant="ghost" size="sm" className="gap-2">
            <MdOutlineShoppingCart className="h-4 w-4" /> Cart
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {/* <DropdownMenuLabel>Menu</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem>  <UploadProjects /></DropdownMenuItem>
              <DropdownMenuItem className='flex gap-2'> <ExternalLink className="h-4 w-4" /> View Projects</DropdownMenuItem>
              {/* <DropdownMenuItem>Report a Problem</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


        {showPDFModalReport && (
        <ExtenstionPdf
          setShowPDFReport={setShowPDFReport}
          // yahan apna real data pass kar sakte ho:
          // mockJobData={mockJobData}
          // activeTab={activeTab}
          // selectedUnit={selectedUnit}
          // convertArea={convertArea}
          // masterArray={masterArray}
          // pdfData={pdfData}
          // PixelRatio={PixelRatio}
        />
      )}
    </>
  )
}




export default CanvasHeader

