import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import LeftSection from "./LeftSection";
import { UploadProjects } from "./UploadProjects";
import { TbColorSwatch } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGitCompareOutline } from "react-icons/io5";

import { FiLayout } from "react-icons/fi";
import { LayoutSidebar } from "./LayoutSidebar";
import SelectPalletPopover from "./SelectPalletPopover";
import SampleMobile from "./mobilePage/SampleMobile";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Canvas from "./demoCanvas/Canvas";
import CreateMasterArrays from "@/components/studio/segment/CreateMaterArrays";
import GetDemoprojectSegmemt from "./GetDemoprojectSegmemt";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import GetDemoProject from "../GetDemoProject";
import { setCurrentProject } from "@/redux/slices/projectSlice";
import { setCurrentJob } from "@/redux/slices/jobSlice";
import { fetchMaterialSegments } from "@/redux/slices/materialSlices/materialSegmentSlice";
import CreateDemoMasterArray from "../createMasterArray/CreateDemoMasterArray";
import { RiResetLeftFill } from "react-icons/ri";
import CanvasHeader from "./CanvasHeader";
import ComparePage from "./ComparePage";
import SwatchDetails from "../swatch/SwatchDetails";
import Loading from "@/components/loading/Loading";
import SelectedSwatchHome from "../swatch/selectedSwatch/SelectedSwatchHome";


/* --------------------------------- Page --------------------------------- */


const SamplePlayBookPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showCompare, setShowCompare] = useState(false);

  const { userImage } = useSelector((state: RootState) => state.demoCanvas);
  const baseImg =
    "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/jeramie_b_archchange_1657719958.jpg";
  const altImg =
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop";
  const { id: projectId } = useParams<{ id: string }>();
  const location = useLocation();
  const { list: projectList, currentProject } = useAppSelector((state: RootState) => state.projects);


     React.useEffect(() => {
      if(userImage){
       // console.log("PreviewBox userImage:", userImage);
        const objectUrl = URL.createObjectURL(userImage);
    
        // navigate('/try-visualizer/sample');
        
      }
    }, [userImage]);
  
  useEffect(() => {
    if (projectId &&
      projectList.length > 0 &&
      !currentProject) {
      const project = projectList.find((p) => p.id === Number(projectId));
      if (project &&
        project?.jobData &&
        project?.jobData.length > 0) {
        // Do something with the project
        dispatch(setCurrentProject(project));
        dispatch(setCurrentJob(project?.jobData?.[0] ?? null));
      }
    }
  }, [projectId, projectList]);

  // Fetch segments on component mount
  useEffect(() => {
    dispatch(fetchMaterialSegments());
  }, [dispatch]);


  return (
    <>
      {/* <LeftSection /> */}
      <CreateDemoMasterArray />
      <GetDemoProject />
      <GetDemoprojectSegmemt />

      <SwatchDetails />


      <div className="flex-1 min-w-0 flex flex-col overflow-x-auto  hidden md:block relative">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Top Toolbar */}
          <CanvasHeader/>

          {/* Canvas / Image Section */}
          <ScrollArea className="flex-1">
            <div className="mx-auto w-full  ">
              {/* ✅ Either image OR compare (never both) */}
              {showCompare ? (
                <ComparePage
                  leftSrc={baseImg}
                  rightSrc={altImg}
                  onClose={() => setShowCompare(false)}
                />
              ) : (
                <div className="relative w-full overflow-hidden rounded-none border-none">
                  {/* canvas Image */}
                  {/* <img
                  src={baseImg}
                  alt="House Preview"
                  className="block h-auto w-full"
                /> */}
                  <Canvas
                    backgroundImage={currentProject?.jobData?.[0]?.full_image ?? baseImg}
                    className="block h-auto w-full"
                  />

                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs text-zinc-700 shadow">
                    Powered by{" "}
                    <span className="font-semibold text-blue-600">Dzinly</span>
                  </div>
                </div>
              )}

              {/* Bottom Tray */}
              <div className="rounded-lg border text-card-foreground shadow flex flex-row absolute items-center gap-2 bg-white justify-end rounded-b-lg z-1 bottom-2 inset-x-10 px-2 py-4">
                {/* <SelectPalletPopover /> */}
                <SelectedSwatchHome />

                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </Button>

                  <LayoutSidebar />

                  <Button variant="ghost" size="sm" className="gap-2">
                    <RotateCw className="h-4 w-4" />
                    Apply Product
                  </Button>

                  {/* 🔁 Toggle Compare */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowCompare((v) => !v)}
                  >
                    {showCompare ? (
                      <>
                        <X className="h-4 w-4" /> Exit Compare
                      </>
                    ) : (
                      <>
                        <IoGitCompareOutline className="h-4 w-4" /> Compare
                      </>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Pattern
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Herringbone</DropdownMenuItem>
                      <DropdownMenuItem>Chevron</DropdownMenuItem>
                      <DropdownMenuItem>Basketweave</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <SampleMobile />


        {/* <Loading/> */}
    </>
  );
};

export default SamplePlayBookPage;


/* ----------------------------- Compare Slider ----------------------------- */
function CompareSlider({
  leftSrc,
  rightSrc,
  onClose,
}: {
  leftSrc: string;
  rightSrc: string;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(0.5); // 0..1

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const getPct = (clientX: number) => {
      const r = wrap.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - r.left, 0), r.width);
      return x / r.width;
    };

    let dragging = false;

    const down = (e: PointerEvent) => {
      dragging = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setPos(getPct(e.clientX));
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      setPos(getPct(e.clientX));
    };
    const up = () => {
      dragging = false;
    };

    const handle = wrap.querySelector("[data-handle]") as HTMLElement | null;
    handle?.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      handle?.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="relative mt-4 w-full overflow-hidden rounded-xl border bg-white">
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow hover:bg-white"
        aria-label="Close compare"
      >
        <X className="h-4 w-4" />
      </button>

      <div ref={wrapRef} className="relative w-full select-none">
        {/* Right image (background) */}
        <img src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/AAA1111.jpg" alt="Right" className="block h-auto w-full" />

        {/* Left image (clipped) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pos * 100}%` }}
        >
          <img src="https://betadzinly.s3.us-east-2.amazonaws.com/projects/img/styleGen/styled_output_b44595af9aa540e980b13540102aef57.webp" alt="Left" className="block h-auto w-full" />
        </div>

        {/* divider */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `calc(${pos * 100}% - 1px)`, width: 2 }}
        >
          <div className="h-full bg-white/70 mix-blend-difference" />
        </div>

        {/* draggable handle */}
        <button
          type="button"
          data-handle
          className="absolute top-1/2 z-20 -translate-y-1/2 translate-x-[-50%] rounded-lg bg-white p-1.5 shadow ring-1 ring-black/5"
          style={{ left: `${pos * 100}%` }}
          aria-label="Drag to compare"
        >
          <ChevronsLeftRight className="h-5 w-5" />
        </button>

        {/* bottom controls */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            className="h-10 min-w-[120px] rounded-xl bg-white/95"
            onClick={() => setPos(0)}
          >
            Left
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl bg-white/95 px-3"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            className="h-10 min-w-[120px] rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
            onClick={() => setPos(1)}
          >
            Right
          </Button>
        </div>

        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs text-zinc-700 shadow">
          Powered by <span className="font-semibold text-blue-600">Dzinly</span>
        </div>
      </div>
    </div>
  );
}
