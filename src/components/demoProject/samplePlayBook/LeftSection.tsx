import React, { useMemo, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// import dzinlylogo from "../../../public/assets/image/dzinly-logo.svg";
import dzinlylogo from "../../../../public/assets/image/dzinly-logo.svg";

const OPTIONS = [
  "EIFS",
  "Stone",
  "Stain",
  "Pediment",
  "Siding",
  "Wall Panels",
  "Brick",
];

const products = [
  {
    id: "p1", brand: "Demo Brand", name: "Red Oak – Natural", sizes: "2 sizes",
    thumb: "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
  },
  {
    id: "p2", brand: "Demo Brand", name: "White Oak", sizes: "3 sizes",
    thumb: "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
  },
  {
    id: "p3", brand: "Demo Brand", name: "White Oak — Graphite", sizes: "2 sizes",
    thumb: "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
  },
  {
    id: "p4", brand: "Demo Brand", name: "Red Oak", sizes: "4 sizes",
    thumb: "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
  },
];

import { Heart, Search, SlidersHorizontal, Grid3X3, List, Layers, Ruler, Sparkles, ChevronRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom'
import { FaRegHeart } from 'react-icons/fa6';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { FilterSidebars } from './FilterSidebars';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import ShowSegments from './ShowSegments';
import { resetDemoMasterArray } from '@/redux/slices/demoProjectSlice/DemoMasterArraySlice';
import { clearCurrentProject } from '@/redux/slices/projectSlice';
import { clearCurrentJob } from '@/redux/slices/jobSlice';
import GridSwatch from '../swatch/GridSwatch'; import SwatchTemplate from '../swatch/SwatchTemplate';
import { resetSegmentSlice } from '@/redux/slices/segmentsSlice';
import { IoInformation } from 'react-icons/io5';
import { resetDemoCanvasState } from '@/redux/slices/demoProjectSlice/DemoCanvasSlice';


/* -------------------- Main -------------------- */
const LeftSection = () => {

  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(products[0].id);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { masterArray } = useSelector((state: RootState) => state.masterArray);
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const [activeId, setActiveId] = useState<string | null>(null);


  const handleMoveTryVisualizer = () => {

    dispatch(resetDemoMasterArray())
    dispatch(clearCurrentProject())
    dispatch(clearCurrentJob())
    dispatch(resetSegmentSlice())
    dispatch(resetDemoMasterArray())
    dispatch(resetDemoCanvasState())
    navigate('/try-visualizer');
  }
  const [active, setActive] = useState<string[]>([]);

  const toggle = (v: string) =>
    setActive((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));


  const  [showSearch, setShowSearch] = useState(false)
  return (
    <aside
      className={` ${collapsed ? "w-[84px]" : "w-[100%] md:w-[360px] lg:w-[360px]"
        }`}
    >
      {/* collapse / expand */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-24 top-4 py-2 px-2 z-[2] flex  items-center justify-center rounded-lg border bg-gray-100 border-gray-200  "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        {collapsed ? (
          <TbLayoutSidebarRightCollapse className='text-lg' />

        ) : (
          <TbLayoutSidebarLeftCollapse className='text-lg' />

        )}
      </button>

      {/* COLLAPSED rail */}
      {collapsed ? (
        <div className="flex h-dvh flex-col items-center gap-3 p-3">
          <Link to="/" className="mt-1 mb-2 block">
            <img src={dzinlylogo} alt="dzinly" className="w-12" />
          </Link>

          <ShowSegments
            // category={category} 
            // setCategory={setCategory} 
            variant="collapsed"
          />
        </div>
      ) : (
        /* EXPANDED */
        <div className="flex h-dvh flex-col">
          {/* header */}
          <div className="flex items-center justify-between border-b px-4 py-3 pt-2">
            <Link to="/"><img className="w-32" src="https://marble-visualizer.vercel.app/assets/marble-DnOX0AGi.png" alt="Marble logo" /></Link>
            <Button className="flex h-8 items-center space-x-2 rounded-2 bg-white py-1 text-sm text-gray-800 shadow-none hover:bg-gray-50"
              onClick={handleMoveTryVisualizer}
            >
              <IoMdArrowRoundBack className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
 <div className="flex items-center gap-3 border-b p-2">
              <ShowSegments
          
                variant="expanded"
              />
            </div>
          {/* inner */}
          <div className="flex flex-1">
            {/* left icon column */}


           

            {/* right content */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* toolbar */}
              <div className="grid items-center gap-2 px-3 pb-3 pt-3">
                <div className="flex items-center gap-2">

                  {/* <div className="border py-2 px-2 rounded-md">
                  
                  <Search className="pointer-events-none  h-5 w-5 text-zinc-500" />
               
                  </div> */}

                   <button

                    onClick={() =>setShowSearch (!showSearch)}
                    className="p-2"
                  >
                    <Search className="h-5 w-5 text-zinc-600 cursor-pointer focus:outline-none focus:ring-0" />
                  </button>
                
                  <FilterSidebars />

                  <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
        <TabsList className="h-10 rounded-sm py-0 bg-gray-100 gap-1 px-2">
          <TabsTrigger
            value="grid"
            className="px-3 py-2 focus:ring-none focus:outline-none rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent"
          >
            <Grid3X3 className="h-4 w-4" />
          </TabsTrigger>

          <TabsTrigger
            value="list"
            className="px-3 py-2 focus:ring-none focus:outline-none rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent"
          >
            <List className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
                </Tabs>



                </div>

                {showSearch && (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search products…"
                    className="h-9 pl-8"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {OPTIONS.map((opt) => {
                    const isActive = active.includes(opt);
                    return (
                      <button
                        key={opt}
                        // size="sm"
                        onClick={() => toggle(opt)}
                        className={[
                          "rounded-lg border px-2 py-1 text-[12px] text-normal",
                          "transition-colors",
                          isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-500"
                            : " text-gray-600 border-gray-300 bg-white hover:bg-emerald-50",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

               
               
              </div>


              {/* content */}
              <ScrollArea className="h-[calc(100dvh-180px)] px-3 pb-4">
                {view === "list" ? (
                  <div className="space-y-3">
                    {/* {filtered.map((p) => (
                      <ListRow
                        key={p.id}
                        data={p}
                        isActive={picked === p.id}
                        onPick={() => setPicked(p.id)}
                        onFav={(e) => { e.stopPropagation(); }}
                      />
                    ))} */}
                    <SwatchTemplate
                      swatchType="list"
                    />
                  </div>
                ) : (
                  // PURE GRID: 3 columns, only images + heart (no details)
                  <div className="grid grid-cols-3 gap-4">
                    {/* {filtered.map((p) => (
                  <GridTileMinimal
                    key={p.id}
                    data={p}
                    isActive={picked === p.id}
                    activeId={activeId}
                    setActiveId={setActiveId}
                    onFav={(e) => e.stopPropagation()}
                  />
                ))} */}
                    <SwatchTemplate
                      swatchType="grid"
                    />

                  </div>


                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default LeftSection


/* -------------------- Tiles -------------------- */
const GridTileMinimal: React.FC<{
  data: (typeof products)[number];
  isActive: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onFav: (e: React.MouseEvent) => void;
}> = ({ data, isActive, activeId, setActiveId, onFav }) => {
  const isOpen = activeId === data.id;

  const handlePick = () => {
    setActiveId(isOpen ? null : data.id);
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Tile */}
      <button
        onClick={handlePick}
        className={[
          "group block w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition p-0",
          isActive
            ? "border-emerald-500 ring-2 ring-emerald-300"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow",
        ].join(" ")}
      >
        <div className="relative aspect-square w-full">
          <img
            src={data.thumb}
            alt={data.name}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onFav}
            className="absolute right-1 top-1 inline-flex items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow hover:bg-white p-1"
            aria-label="favorite"
            type="button"
          >
            <FaRegHeart className="h-4 w-4" />
          </button>
        </div>
      </button>

      {/* Full width Info Box */}
      {/* {isOpen && (
        <div className="relative mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-md">
     
          <div className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-zinc-200 bg-white"></div>

          <div className="text-[11px] text-zinc-500 font-medium">
            {data.brand}
          </div>
          <div className="text-[14px] font-semibold text-zinc-900 leading-tight">
            {data.name}
          </div>
          <div className="text-[12px] text-zinc-600 mt-1">
            Size: <span className="font-semibold">{data.sizes}</span>
          </div>
        </div>
      )} */}
    </div>
  );
};




const ListRow: React.FC<{
  data: (typeof products)[number];
  isActive: boolean;
  onPick: () => void;
  onFav: (e: React.MouseEvent) => void;
}> = ({ data, isActive, onPick, onFav }) => (
  <article
    onClick={onPick}
    className={[
      "flex cursor-pointer items-stretch gap-3 rounded-xl border bg-white p-3",
      isActive ? "border-emerald-500 ring-2 ring-emerald-300" : "border-zinc-200 hover:border-zinc-300"
    ].join(" ")}
  >
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
      <img src={data.thumb} alt={data.name} className="h-full w-full object-cover" />
      <button
        onClick={onFav}
        className="absolute right-1 top-1 inline-flex p-1 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow"
        aria-label="favorite"
        type="button"
      >
        <FaRegHeart />

      </button>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-zinc-500">{data.brand}</p>
      <h3 className="truncate text-xs font-medium">{data.name}</h3>
      <p className="mt-1 text-xs text-zinc-600">Size: {data.sizes}</p>
      <div className="mt-3 flex items-center gap-2">
        <a href="#" className="group inline-flex items-center text-xs font-medium text-emerald-700 ">
          More product details
          {/* <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" /> */}
        </a>
        {/* <Badge variant="secondary">Tile</Badge> */}
      </div>
    </div>
  </article>
);
