
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Plus, Minus } from "lucide-react";

import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import TabView from "./TabView";
import InfoView from "./InfoView";
import { TbHomePlus } from "react-icons/tb";
import { addHouseImage, addInspirationImage, addPaletteImage, addPrompt, setCurrentGenAiImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import { setCurrentInspTab } from "@/redux/slices/InspirationalSlice/InspirationTabSlice";
import { GenAiChat } from "@/models/genAiModel/GenAiModel";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";




const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Reset time to compare just dates
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
};

export default function ChatHistory() {
   const dispatch = useDispatch<AppDispatch>();
  const { list: jobList } = useSelector((state: RootState) => state.jobs);
  const { genAiImages } = useSelector((state: RootState) => state.genAi);
  const copyImage = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      
    } catch {
      console.error("Failed to copy image URL");
    }
  };

     const handleMasterImage = (imagePath: string) => {
        
          dispatch(addHouseImage(imagePath));
           dispatch(setCurrentInspTab("chat"));
      };

      const handleImageSwitch = (imageSet: GenAiChat) => {
          
          dispatch(setCurrentGenAiImage(imageSet));
          dispatch(setCurrentTabContent("compare"));
          dispatch(addInspirationImage(imageSet.reference_img));
          dispatch(addPaletteImage(imageSet.palette_image_path));
          dispatch(addHouseImage(imageSet.master_image_path));
          dispatch(addPrompt(imageSet.user_input_text));
      };

  return (
    <div className="max-w-sm mx-auto p-4 space-y-3 mb-16">
      {/* ===== All sections as Accordion ===== */}
      {/* type="multiple" so multiple can be open at the same time */}
      <Accordion
        type="multiple"
        defaultValue={["original", "design-1"]}
        className="w-full space-y-3">
        {/* ---------- Original (as Accordion) ---------- */}
        <AccordionItem
          value="original"
          className="border border-gray-200 rounded-lg shadow-sm bg-white ">
          <AccordionTrigger className="custom-trigger py-3 hover:no-underline group border border-gray-200">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LazyLoadImage
                  src={jobList[0]?.thumbnail}
                  alt="Original"
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
                <div className="text-sm font-medium text-gray-800">
                  Original
                </div>
              </div>

              {/* plus/minus */}
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-300 text-gray-700">
                <Minus className="w-4 h-4 hidden group-data-[state=open]:block according_icon" />
                <Plus className="w-4 h-4 block group-data-[state=open]:hidden according_icon" />
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-3">
            <div className="relative p-3">
              <LazyLoadImage
                src={jobList[0]?.thumbnail}
                alt="Original Image"
                className="w-full rounded-xl object-cover"
              />
              <div className="absolute top-5 right-5 bg-white/80 rounded-full p-2 shadow-sm cursor-pointer hover:bg-white"
                onClick={() => handleMasterImage(jobList[0]?.full_image || '')}
              >
                <TbHomePlus className="text-lg"/>
              </div>
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyImage(jobList[0]?.full_image || '')}
                    className="absolute top-4 right-4 bg-white/90 border-gray-200 shadow hover:bg-white"
                    title="Copy image URL">
                    
                    <MdOutlineAddHome className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy image URL</p>
                </TooltipContent>
              </Tooltip> */}
            </div>
          </AccordionContent>
        </AccordionItem>


        {genAiImages &&
          genAiImages.length > 0 &&
          genAiImages.map((genAi, index) => {
            return (
              <AccordionItem
                value={genAi.task_id}
                className="border border-gray-200 rounded-xl shadow-sm bg-white">
                <AccordionTrigger className="custom-trigger py-3 hover:no-underline group border border-gray-200">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3 text-left">
                      <LazyLoadImage
                        src={genAi.output_image}
                        alt="Design 1"
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 leading-tight">
                          {genAi.name == null ? "Design " + (index + 1) : genAi.name}
                        </div>
                        <div className="text-[12px] text-gray-500">
                          {genAi.created ? formatRelativeDate(genAi.created) : 'No date available'}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-300 text-gray-700">
                      <Minus className="w-4 h-4 hidden group-data-[state=open]:block according_icon" />
                      <Plus className="w-4 h-4 block group-data-[state=open]:hidden according_icon" />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-3">
                  <Tabs defaultValue="view" className="w-full mt-1 px-3">
                    <div className="flex items-center gap-4">
                      <TabsList className="bg-transparent p-0 h-auto mt-2 gap-2">
                        <TabsTrigger
                          value="view"
                          className="data-[state=active]:bg-purple-700 data-[state=active]:text-white bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium transition-colors">
                          View
                        </TabsTrigger>
                        <TabsTrigger
                          value="info"
                          className="data-[state=active]:bg-purple-700 data-[state=active]:text-white bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium transition-colors">
                          Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="show"
                          className="data-[state=active]:bg-purple-700 data-[state=active]:text-white bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                          onClick={() => handleImageSwitch(genAi)}
                        >
                          Show
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="view" className="space-y-4 mt-3">
                      <TabView
                        genAi={genAi}
                      />
                    </TabsContent>

                    <TabsContent value="info" className="text-sm text-gray-600 mt-3">
                      <InfoView />
                    </TabsContent>

                    <TabsContent value="show" className="text-sm text-gray-600 mt-3">
                      <div className="p-4 text-center">
                        <p>Show content will be displayed here</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        {/* ---------- Design 1 ---------- */}


        {/* ---------- Design 2 (second accordion) ---------- */}
        {/* <AccordionItem
          value="design-2"
          className="border border-gray-200 rounded-xl shadow-sm bg-white ">
          <AccordionTrigger className="custom-trigger py-3 hover:no-underline group border border-gray-200">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <img
                  src={thumbUrl}
                  alt="Design 2"
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 leading-tight">
                    Design 2
                  </div>
                  <div className="text-[12px] text-gray-500">
                    Jul 23, 2025, 9:10 AM
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-300 text-gray-700">
                <Minus className="w-4 h-4 hidden group-data-[state=open]:block according_icon" />
                <Plus className="w-4 h-4 block group-data-[state=open]:hidden according_icon" />
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-3">
            <Tabs defaultValue="view" className="w-full mt-1 px-3">
              <div className="flex items-center gap-4">
                <TabsList className="bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="view"
                    className="data-[state=active]:text-purple-700 data-[state=active]:font-medium bg-transparent h-auto px-0 mr-4">
                    View
                  </TabsTrigger>
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:text-purple-700 data-[state=active]:font-medium bg-transparent h-auto px-3">
                    Info
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="view" className="space-y-4 mt-3">
                <img
                  src={sampleBefore}
                  alt="Before"
                  className="w-full rounded-xl object-cover"
                />
                <div
                  className="rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm"
                  style={{
                    border: "1.5px solid transparent",
                    background:
                      "linear-gradient(#fff,#fff) padding-box, linear-gradient(90deg,#7c3aed,#6366f1) border-box",
                  }}>
                  try warm beige siding and charcoal roof.
                </div>
                <div className="relative">
                  <img
                    src={sampleAfter}
                    alt="After"
                    className="w-full rounded-xl object-cover"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyImage(sampleAfter)}
                        className="absolute top-2 right-2 bg-white/90 border-gray-200 shadow hover:bg-white"
                        title="Copy image URL">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy image URL</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TabsContent>

              <TabsContent value="info" className="text-sm text-gray-600 mt-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Model</span>
                    <span className="font-medium text-gray-800">v2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Resolution</span>
                    <span className="font-medium text-gray-800">
                      1920 × 1080
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credits Used</span>
                    <span className="font-medium text-gray-800">1</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>
    </div>
  );
}
