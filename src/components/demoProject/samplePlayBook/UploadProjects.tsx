"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import TryVisualizerPage from "@/pages/tryVizualizer/TryVisualizerPage";

export function UploadProjects() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* <Button variant="ghost" size="sm" className="gap-2 bg-gray-100"> */}
        <span className="flex gap-2 items-center">
          <UploadCloud className="h-4 w-4" />
          Upload
          </span>
        {/* </Button> */}
      </DrawerTrigger>

      {/* ✅ Full viewport-ish height; padding zero to control layout ourselves */}
      <DrawerContent className="h-[95vh] p-0">
        {/* sticky header */}
        <DrawerHeader className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <DrawerTitle>Upload / Try Visualizer</DrawerTitle>
          <DrawerDescription>
            Choose a demo room or upload your own photo.
          </DrawerDescription>
        </DrawerHeader>

        {/* single scroll region for the whole body */}
        <ScrollArea className="h-[calc(95vh-140px)]">
          {/* wrapper to normalize child layouts from TryVisualizerPage */}
          <div className="drawer-sandbox mx-auto w-full border-0">
            {/* optional: light background to separate from page */}
            <div className="rounded-xl border-none bg-muted/30 p-4">
              <TryVisualizerPage />
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t bg-white py-2">
            <div className="flex w-full justify-end gap-2">
          <Button type="button">Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DrawerClose>
          </div>
        </DrawerFooter>

        {/* 🔧 Hardening styles to avoid oversized images / weird crops from inside TryVisualizerPage */}
        <style>
          {`
            .drawer-sandbox img {
              max-width: 100%;
              height: auto;
              display: block;
              border-radius: 0.5rem; /* looks nicer for cards */
            }
            /* If that page uses any fixed 'aspect' wrappers, ensure images fill correctly */
            .drawer-sandbox [class*="aspect-"] > img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            /* Avoid giant gaps under grids by normalizing margins */
            .drawer-sandbox .grid, 
            .drawer-sandbox .row {
              margin-bottom: 0;
            }
          `}
        </style>
      </DrawerContent>
    </Drawer>
  );
}
