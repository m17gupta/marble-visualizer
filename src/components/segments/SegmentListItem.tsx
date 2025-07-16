import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  ChevronDown,
  Edit3,
  Focus,
  MoreHorizontal,
  Copy,
  Layers,
  Trash2,
  EyeOff,
  Group,
  Ruler,
  SquareCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Segment } from "@/redux/slices/segmentsSlice";
import { SegmentTypeIcon } from "./SegmentTypeIcon";
import { SegmentVisibilityStatus } from "./SegmentVisibilityStatus";
import { SVGPathPreview } from "./SVGPathPreview";

interface ExtendedSegment extends Segment {
  seg_short?: string;
  perimeter_pixel?: number;
  perimeter_feet?: number;
  bb_area_pixel?: number;
  bb_area_sqft?: number;
  annotation_type?: "manual" | "system";
  group?: string;
  svg_path?: string;
  bb_dimension_pixel?: number[];
  bb_dimension_feet?: number[];
  seg_dimension_pixel?: number[];
  annotation?: number[];
  bb_annotation_float?: number[];
  bb_annotation_int?: number[];
  skew_value?: {
    skew_x: number;
    skew_y: number;
  };
  annotation_area_pixel?: number;
  annotation_area_sqft?: number;
  designer?: Array<Record<string, unknown>>;
}

// Get color from segment type - for badges and indicators
const getSegmentTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "wall":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "roof":
      return "bg-red-100 text-red-700 border-red-200";
    case "door":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "window":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "floor":
      return "bg-green-100 text-green-700 border-green-200";
    case "garage door":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "gutter":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "light":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "trim":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

interface SegmentListItemProps {
  segment: Segment;
  extendedSegment: ExtendedSegment;
  index: number;
  isActive: boolean;
  isSelected: boolean;
  isEditing: boolean;
  editingName: string;
  showDetails: boolean;
  showAdvancedProps: boolean;
  onSelect: (segmentId: string, isMultiSelect?: boolean) => void;
  onDelete: (segmentId: string) => void;
  onDuplicate: (segmentId: string) => void;
  onCopy: (segmentId: string) => void;
  onFocus: (segmentId: string) => void;
  onToggleVisibility: (segmentId: string) => void;
  onStartEdit: (segment: Segment) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditNameChange: (name: string) => void;
  onBringForward: (segmentId: string) => void;
  onSendBackward: (segmentId: string) => void;
  onToggleAdvancedProps: () => void;
}

export const SegmentListItem: React.FC<SegmentListItemProps> = ({
  segment,
  extendedSegment,
  index,
  isActive,
  isSelected,
  isEditing,
  editingName,
  showDetails,
  showAdvancedProps,
  onSelect,
  onDelete,
  onDuplicate,
  onCopy,
  onFocus,
  onToggleVisibility,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange,
  onBringForward,
  onSendBackward,
  onToggleAdvancedProps,
}) => {
  return (
    <motion.div
      className="relative"
      key={segment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
    >
      <Card
        className={cn(
          "p-3 cursor-pointer transition-all hover:shadow-sm",
          isActive
            ? "border-primary bg-primary/5"
            : segment.visible !== false
            ? "border-green-400/40 hover:border-primary/50"
            : "border-red-400/40 hover:border-primary/50 opacity-60",
          segment.visible === false && "bg-gray-50"
        )}
        onClick={() => onSelect(segment.id)}
      >
        <div className="flex items-center space-x-3">
          {/* Multi-select checkbox */}

          <Checkbox
            checked={isSelected}
            onCheckedChange={(_checked) => {
              // Multi-select logic would go here
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Color indicator */}
          <div
            className="w-4 h-4 rounded-full border-2 border-background shadow-sm flex-shrink-0"
            style={{ backgroundColor: segment.fillColor }}
          />

          {/* Segment info */}
          <div className="flex-1 min-w-10 pt-4 pr-1 ">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editingName}
                  onChange={(e) => onEditNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveEdit();
                    if (e.key === "Escape") onCancelEdit();
                  }}
                  onBlur={onSaveEdit}
                  className="h-6 text-xs"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-1.5">
                  {/* Segment Type Icon - Display an icon based on segment type */}
                  {segment.type && (
                    <div
                      className={cn(
                        "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-sm",
                        getSegmentTypeColor(segment.type),
                        segment.visible === false && "opacity-60 grayscale"
                      )}
                    >
                      <SegmentTypeIcon type={segment.type} />
                      <span className="ml-1">{segment.type}</span>
                      {segment.visible === false && (
                        <EyeOff className="h-2.5 w-2.5 ml-1 opacity-70" />
                      )}
                    </div>
                  )}
                  <p className="text-sm font-medium truncate">{segment.name}</p>
                  {extendedSegment.seg_short && (
                    <Badge variant="outline" className="text-xs">
                      {extendedSegment.seg_short}
                    </Badge>
                  )}
                </div>

                {/* Extended properties */}
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground mt-1">
                  <span>{segment.points.length} points</span>

                  {extendedSegment.perimeter_pixel && (
                    <span className="flex items-center">
                      <Ruler className="h-3 w-3 mr-1" />
                      {Math.round(extendedSegment.perimeter_pixel)}px
                      {extendedSegment.perimeter_feet && (
                        <span className="ml-1">
                          ({extendedSegment.perimeter_feet}ft)
                        </span>
                      )}
                    </span>
                  )}

                  {extendedSegment.bb_area_pixel && (
                    <span>
                      {Math.round(extendedSegment.bb_area_pixel)}px²
                      {extendedSegment.bb_area_sqft && (
                        <span className="ml-1">
                          ({extendedSegment.bb_area_sqft}ft²)
                        </span>
                      )}
                    </span>
                  )}

                  {extendedSegment.annotation_type && (
                    <Badge
                      variant={
                        extendedSegment.annotation_type === "manual"
                          ? "default"
                          : "secondary"
                      }
                      className="text-[10px] h-4"
                    >
                      {extendedSegment.annotation_type}
                    </Badge>
                  )}

                  {extendedSegment.group && (
                    <span className="flex items-center">
                      <Group className="h-3 w-3 mr-1" />
                      {extendedSegment.group}
                    </span>
                  )}
                </div>

                {/* Detailed View - Only shown when details are toggled on */}
                {showDetails && (
                  <div className="mt-2 pt-2 border-t border-dashed border-muted-foreground/20 space-y-1">
                    {/* Toggle for advanced properties */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-medium text-muted-foreground">
                        Details
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAdvancedProps();
                        }}
                        className="h-5 text-[10px] px-2"
                      >
                        {showAdvancedProps ? "Basic" : "Advanced"}
                      </Button>
                    </div>

                    {/* Dimensions */}
                    {extendedSegment.bb_dimension_pixel && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-1">Dimensions:</span>
                        {extendedSegment.bb_dimension_pixel[0]} ×{" "}
                        {extendedSegment.bb_dimension_pixel[1]} px
                        {extendedSegment.bb_dimension_feet && (
                          <span className="ml-1">
                            ({extendedSegment.bb_dimension_feet[0]} ×{" "}
                            {extendedSegment.bb_dimension_feet[1]} ft)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Basic properties */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      {extendedSegment.perimeter_pixel && (
                        <div>
                          <span className="font-medium">Perimeter:</span>{" "}
                          {Math.round(extendedSegment.perimeter_pixel)} px
                        </div>
                      )}

                      {extendedSegment.bb_area_pixel && (
                        <div>
                          <span className="font-medium">Area:</span>{" "}
                          {Math.round(extendedSegment.bb_area_pixel)} px²
                        </div>
                      )}

                      {extendedSegment.perimeter_feet && (
                        <div>
                          <span className="font-medium">Perimeter:</span>{" "}
                          {extendedSegment.perimeter_feet} ft
                        </div>
                      )}

                      {extendedSegment.bb_area_sqft && (
                        <div>
                          <span className="font-medium">Area:</span>{" "}
                          {extendedSegment.bb_area_sqft} ft²
                        </div>
                      )}
                    </div>

                    {/* Advanced properties - conditionally shown */}
                    {showAdvancedProps && (
                      <>
                        {/* SVG Path preview */}
                        {extendedSegment.svg_path && (
                          <div className="space-y-1">
                            <div className="flex items-start gap-1">
                              <SquareCode className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-[10px] text-muted-foreground break-all">
                                {extendedSegment.svg_path.length > 50
                                  ? `${extendedSegment.svg_path.substring(
                                      0,
                                      50
                                    )}...`
                                  : extendedSegment.svg_path}
                              </p>
                            </div>
                            <SVGPathPreview
                              path={extendedSegment.svg_path}
                              color={segment.fillColor}
                              isVisible={segment.visible !== false}
                            />
                          </div>
                        )}

                        {/* Annotation points count */}
                        {extendedSegment.annotation && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">
                              Annotation points:
                            </span>{" "}
                            {extendedSegment.annotation.length / 2}
                          </div>
                        )}

                        {/* Bounding box info */}
                        {extendedSegment.bb_annotation_int && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Bounding box:</span> [
                            {extendedSegment.bb_annotation_int.join(", ")}]
                          </div>
                        )}

                        {/* Skew values if available */}
                        {extendedSegment.skew_value && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Skew:</span> X:{" "}
                            {extendedSegment.skew_value.skew_x.toFixed(2)}, Y:{" "}
                            {extendedSegment.skew_value.skew_y.toFixed(2)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-1 right-1 flex items-center space-x-1">
            <SegmentVisibilityStatus
              isVisible={segment.visible !== false}
              showLabel={false}
              onToggle={() => onToggleVisibility(segment.id)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onStartEdit(segment)}>
                  <Edit3 className="h-3 w-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFocus(segment.id)}>
                  <Focus className="h-3 w-3 mr-2" />
                  Focus
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(segment.id)}>
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(segment.id)}>
                  <Layers className="h-3 w-3 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onBringForward(segment.id)}>
                  <ChevronUp className="h-3 w-3 mr-2" />
                  Bring Forward
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendBackward(segment.id)}>
                  <ChevronDown className="h-3 w-3 mr-2" />
                  Send Backward
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(segment.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
