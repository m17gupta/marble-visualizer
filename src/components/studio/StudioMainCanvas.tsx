import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasEditor } from '@/components/CanvasEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioMainCanvasProps {
  currentCanvasImage: string;
  isUploading: boolean;
  canEdit: boolean;
  isJobRunning: boolean;
  onFileUpload: (file: File) => void;
  onClearImage: () => void;
}

export function StudioMainCanvas({
  currentCanvasImage,
  isUploading,
  canEdit,
  isJobRunning,
  onFileUpload,
  onClearImage
}: StudioMainCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 space-y-6"
        >
          {/* Canvas Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Design Canvas
              </h1>
              <p className="text-muted-foreground">
                {canEdit
                  ? "Upload an image and use drawing tools to create segments"
                  : "View-only access to this project"}
              </p>
            </div>
            {currentCanvasImage && canEdit && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearImage}
                  disabled={isJobRunning}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Canvas Content */}
          <div className="relative">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
                Debug: currentCanvasImage = {currentCanvasImage || 'null'}
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {currentCanvasImage ? (
                <motion.div
                  key={`canvas-${currentCanvasImage}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <CanvasEditor
                    key={`canvas-editor-${currentCanvasImage}`}
                    imageUrl={currentCanvasImage}
                    width={800}
                    height={600}
                    className="mb-6"  
                  />
                </motion.div>
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
                      canEdit
                        ? () => fileInputRef.current?.click()
                        : undefined
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
                                {canEdit
                                  ? "Upload Your Image"
                                  : "No Image Uploaded"}
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

            {/* Hidden file input */}
            {canEdit && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            )}
          </div>
        </motion.div>
      </ScrollArea>
    </main>
  );
}
