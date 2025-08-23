import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { AlertTriangle, Trash2 } from "lucide-react";

type DeletePopoverProps = {
  onConfirm: () => void;
  label?: string;
  itemName?: string;
  size?: "icon" | "sm" | "default" | "lg";
};

export function DeleteComment({
  onConfirm,
  label = "Delete",
  itemName = "this item",
  size = "icon",
}: DeletePopoverProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* <Button
          variant="outline"
          size={size}
        
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
          {size !== "icon" && <span className="ml-2">{label}</span>}
        </Button> */}

          <Button variant="ghost" 
           size="sm"
           aria-label="Delete" className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />       
          </Button>
                        
      </PopoverTrigger>

      <PopoverContent className="w-80" align="center" side="top">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-base font-semibold text-gray-800">
                Confirm Deletion
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to permanently delete
                <span className="font-medium text-gray-800">{itemName}</span>?
                
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
