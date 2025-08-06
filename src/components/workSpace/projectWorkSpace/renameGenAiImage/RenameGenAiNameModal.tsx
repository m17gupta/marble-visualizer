import { ImgComparisonSlider } from "@img-comparison-slider/react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

type Props = {
  openModal: boolean;
  onclose: () => void;
  afterImage: string;
  beforeImage: string;
  onSave?: (designName: string) => void;
  prompt?: string;
};

const RenameGenAiNameModal = ({
  openModal,
  onclose,
  afterImage,
  beforeImage,
  onSave,
  prompt = "Change wall color to lemon green",
}: Props) => {
  const [designName, setDesignName] = useState("");

  const handleClose = () => {
    onclose();
    setDesignName(""); // Reset form on close
  };

  const handleSave = () => {
    if (designName.trim() && onSave) {
      onSave(designName);
      handleClose();
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Custom Header */}
        <div className="relative border-b px-6 py-4">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          
          <div className="flex flex-col items-center text-center pt-2">
            <img
              src="/assets/image/dzinlylogo-icon.svg"
              alt="Dzinly"
              className="w-11 h-11 mx-auto"
            />
            <DialogTitle className="text-lg font-semibold mt-3 mb-4">
              Name your design to save it for future reference
            </DialogTitle>
            <div className="w-16 h-0.5 bg-purple-600 mx-auto"></div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Design Name Input */}
          <div className="space-y-2">
            <Label htmlFor="designName" className="text-sm font-medium">
              Enter a name for your design
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                id="designName"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="My design name..."
                className="flex-1"
              />
              <Button 
                onClick={handleSave}
                disabled={!designName.trim()}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Prompt Display */}
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              {prompt.includes("**") ? (
                // Handle bold text if prompt contains markdown-style bold
                prompt.split("**").map((part, index) => 
                  index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                )
              ) : (
                <>
                  Change wall color to <strong>lemon green</strong>.
                </>
              )}
            </p>
            
            {/* Image Comparison Slider */}
            <div className="w-full rounded-lg overflow-hidden border border-gray-200">
              <ImgComparisonSlider className="w-full">
                <figure slot="first" className="relative">
                  <img
                    src={beforeImage}
                    alt="Original"
                    className="w-full h-auto block"
                  />
                  <figcaption className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    Original
                  </figcaption>
                </figure>
                <figure slot="second" className="relative">
                  <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-auto block"
                  />
                  <figcaption className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    Generated
                  </figcaption>
                </figure>
              </ImgComparisonSlider>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenameGenAiNameModal;
