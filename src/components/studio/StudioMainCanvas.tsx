import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Image as ImageIcon, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import * as fabric from "fabric";
import type { Canvas } from "fabric/fabric-impl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import PolygonOverlay from "../canvas/PolygonOverlay";
import CanvasEdit from "../canvas/canvasEdit/CanvasEdit";
import CommentCanvas from "../canvas/commentCanavs/CommentCanvas";
import HoverHeader from "../designHub/HoverHeader";
// import ImagePreview from "../workSpace/projectWorkSpace/ImagePreview";
// import DesignProject from "../workSpace/projectWorkSpace/DesignProject";
// import GuidancePanel from "../workSpace/projectWorkSpace/GuidancePanel";
// import CompareGenAiHome from "../workSpace/compareGenAiImages/CompareGenAiHome";
import LayerCanvas from "../canvas/layerCanvas/LayerCanvas";
// import OutlineTemplate from "./canvasTemplate/OutlineTemplate";
import Hovertemplate from "./canvasTemplate/Hovertemplate";
import CanavasImage from "../canvas/CanavasImage";
import React from "react";
// import Hovertesttemplate from "./canvasTemplate/HoverTestTemplate";

interface StudioMainCanvasProps {
  // currentCanvasImage: string;
  isUploading: boolean;
  canEdit: boolean;
  isJobRunning: boolean;
  onFileUpload: (file: File) => void;
  onClearImage: () => void;
}

export function StudioMainCanvas({
  // currentCanvasImage,
  isUploading,
  canEdit,
  onFileUpload,
}: StudioMainCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);
  const [canvasMode, setCanvasMode] = useState("");
  const { currentTabContent } = useSelector((state: RootState) => state.studio);
  const { canvasType } = useSelector((state: RootState) => state.canvas);

  const [canvasWidth, setCanvasWidth] = useState(1023);
  const [canvasHeight, setCanvasHeight] = useState(592);
  const { isCompare } = useSelector((state: RootState) => state.canvas);
  // // update the canvas image
  useEffect(() => {
    if (canvasType) {
      setCanvasMode(canvasType);
    } else {
      setCanvasMode("");
    }
  }, [canvasType]);

  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== "") {
      setImageLoading(true);
      setCanvasImage(currentImageUrl);
    } else {
      setCanvasImage(null);
      setImageLoading(false);
    }
  }, [currentImageUrl]);

  // Handle image load completion
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  const canavasImageRef = React.useRef<any>(null);
  const [canvasEvent, setCanvasEvent] = useState<fabric.TEvent | null>(null);
  const handleMouseMove = (event: fabric.TEvent) => {
    setCanvasEvent(event);
  };

  return (
    <div className="w-full md:w-3/4  flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">
      <AnimatePresence mode="wait">
        {canvasImage ? (
          <>
            {canvasMode == "hover" && (
              <>
                {!isCompare && (
                  <>
                    <HoverHeader />
                    <CanavasImage
                      imageUrl={canvasImage}
                      width={canvasWidth}
                      height={canvasHeight}
                      onImageLoad={handleImageLoad}
                      ref={canavasImageRef}
                      onMouseMove={handleMouseMove}
                    />
                  </>
                )}
                <Hovertemplate
                    canvas={canavasImageRef}
                  width={canvasWidth}
                  height={canvasHeight}
                />

                {/* <Hovertesttemplate
                  canvas={canavasImageRef}
                  width={canvasWidth}
                  height={canvasHeight}
                /> */}
              </>
            )}
            {/* {canvasMode == "outline" && (
              <>
                <OutlineTemplate
                  canvasImage={canvasImage}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                />

                  <OutlineTemplate
                    canvas={canavasImageRef}
                    width={canvasWidth}
                    height={canvasHeight}
                  />
              </>
            )} */}
            {(canvasMode == "draw" ||
              canvasMode == "reannotation" ||
              canvasMode == "dimension") && (
              <>
                <CanvasEditor
                  key={`canvas-editor-${canvasImage}`}
                  imageUrl={canvasImage}
                  width={canvasWidth}
                  height={canvasHeight}
                />
              </>
            )}

            {/* {canvasMode == "edit" && (
              <CanvasEdit
                key={`canvas-editor-${canvasImage}`}
                imageUrl={canvasImage}
                width={canvasWidth}
                height={canvasHeight}
                className="mb-6"
                onImageLoad={handleImageLoad}
              />
            )} */}

            {canvasMode == "comment" && (
              <CommentCanvas
                key={`canvas-comment-${canvasImage}`}
                imageUrl={canvasImage}
                width={canvasWidth}
                height={canvasHeight}
                className="mb-6"
                onImageLoad={handleImageLoad}
              />
            )}

            {/* {canvasMode == "test-canvas" && (
              <>
                <LayerCanvas
                  key={`canvas-test-${canvasImage}`}
                  imageUrl={canvasImage}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="mb-6"
                  onImageLoad={handleImageLoad}
                />
              </>
            )} */}
            {/* {canvasMode == "hover-default" && (
              <>

                  { canvasImage && <DefaultHoverTemplate
                  canvasImage={canvasImage}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                />}
 
               
              </>
            )}
            {canvasMode == "measurement" && (
              <>
                <PolygonOverlay
                  key={`canvas-hover-${canvasImage}`}
                  imageUrl={canvasImage}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="mb-6"
                  onImageLoad={handleImageLoad}
                />
                <>
                  <DesignProject />
                  <GuidancePanel />
                </>
              </>
            )} */}
          </>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card
              className={cn(
                "h-96 border-2 border-dashed transition-colors",
                canEdit ? "cursor-pointer" : "cursor-not-allowed",
                dragActive && canEdit
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 bg-muted/10"
              )}
              onDrop={canEdit ? handleDrop : undefined}
              onDragOver={canEdit ? handleDragOver : undefined}
              onDragLeave={canEdit ? handleDragLeave : undefined}
              onClick={
                canEdit ? () => fileInputRef.current?.click() : undefined
              }
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  animate={{ scale: dragActive && canEdit ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Uploading...
                        </h3>
                        <p className="text-muted-foreground">
                          Please wait while we process your image
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-primary/10 mx-auto w-fit">
                        {canEdit ? (
                          <Upload className="h-8 w-8 text-primary" />
                        ) : (
                          <Lock className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {canEdit ? "Upload Your Image" : "No Image Uploaded"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {canEdit
                            ? "Drag and drop an image here, or click to browse"
                            : "Contact an admin to upload images to this project"}
                        </p>
                        {canEdit && (
                          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                            <span>PNG, JPEG up to 10MB</span>
                          </div>
                        )}
                      </div>
                      {canEdit && (
                        <Button variant="outline" className="mt-4">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <div className="px-4"></div>
          {canEdit && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          )} */}
    </div>
  );
}
