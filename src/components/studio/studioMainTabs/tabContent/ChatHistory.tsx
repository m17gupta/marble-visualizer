"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Minus, Copy } from "lucide-react";
import { MdOutlineAddHome } from "react-icons/md";

const thumbUrl =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop";
const sampleBefore =
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=900&auto=format&fit=crop";
const sampleAfter =
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=900&auto=format&fit=crop";

const copyImage = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    // TODO: shadcn toast here if you want
  } catch {}
};

export default function ChatHistory() {
  return (
    <div className="max-w-sm mx-auto p-4 space-y-3">
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
                <img
                  src={thumbUrl}
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
              <img
                src={sampleBefore}
                alt="Original Image"
                className="w-full rounded-xl object-cover"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => copyImage(sampleBefore)}
                    className="absolute top-4 right-4 bg-white/90 border-gray-200 shadow hover:bg-white px-1 py-1"
                    title="Copy image URL">
                    {/* <Copy className="w-4 h-4" /> */}
                    <MdOutlineAddHome className="w-5 h-5 p-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Set as Main Image</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ---------- Design 1 ---------- */}
        <AccordionItem
          value="design-1"
          className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="custom-trigger py-3 hover:no-underline group border border-gray-200">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <img
                  src={thumbUrl}
                  alt="Design 1"
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 leading-tight">
                    Design 1
                  </div>
                  <div className="text-[12px] text-gray-500">
                    Jul 22, 2025, 11:45 AM
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
                <TabsList className="bg-transparent p-0 h-auto mt-2">
                  <TabsTrigger
                    value="view"
                    className="data-[state=active]:text-purple-700 data-[state=active]:font-medium bg-transparent h-auto px-3 mr-0">
                    View
                  </TabsTrigger>
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:text-purple-700 data-[state=active]:font-medium bg-transparent px-3">
                    Info
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="view" className="space-y-4 mt-3">
                <img
                  src={sampleBefore}
                  alt="Before"
                  className="w-60 rounded-xl object-cover"
                />

                <div
                  className="inline-block text-gray-600 text-sm px-3 py-1 rounded-full border border-transparent mt-2"
                  style={{
                    backgroundClip: "padding-box, border-box",
                    backgroundImage:
                      "linear-gradient(#fff, #fff), linear-gradient(90deg, #9333ea, #3b82f6)",
                    backgroundOrigin: "border-box",
                  }}>
                  hello change the wall colour
                </div>

                <div className="relative">
                  <img
                    src={sampleAfter}
                    alt="After"
                    className="w-full rounded-xl object-cover"
                  />


                  <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => copyImage(sampleBefore)}
                    className="absolute top-2 right-2 bg-white/90 border-gray-200 shadow hover:bg-white px-1 py-1"
                    title="Copy image URL">
                    {/* <Copy className="w-4 h-4" /> */}
                    <MdOutlineAddHome className="w-5 h-5 p-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Set as Main Image</p>
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
        </AccordionItem>

        {/* ---------- Design 2 (second accordion) ---------- */}
        <AccordionItem
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
                  className="w-60 rounded-xl object-cover"
                />
                 <div
                  className="inline-block text-gray-600 text-sm px-3 py-1 rounded-full border border-transparent mt-2"
                  style={{
                    backgroundClip: "padding-box, border-box",
                    backgroundImage:
                      "linear-gradient(#fff, #fff), linear-gradient(90deg, #9333ea, #3b82f6)",
                    backgroundOrigin: "border-box",
                  }}>
                  hello change the wall colour
                </div>

                <div className="relative">
                  <img
                    src={sampleAfter}
                    alt="After"
                    className="w-full rounded-xl object-cover"
                  />
                     <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => copyImage(sampleBefore)}
                    className="absolute top-2 right-2 bg-white/90 border-gray-200 shadow hover:bg-white px-1 py-1"
                    title="Copy image URL">
                    {/* <Copy className="w-4 h-4" /> */}
                    <MdOutlineAddHome className="w-5 h-5 p-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Set as Main Image</p>
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
        </AccordionItem>
      </Accordion>
    </div>
  );
}
