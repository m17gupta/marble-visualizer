import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { AppDispatch } from "@/redux/store";
import { Segment } from "@/redux/slices/segmentsSlice";
import { logActivity } from "@/redux/slices/activityLogsSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Save,
  Shapes,
  Eye,
  EyeOff,
  Copy,
  Clipboard,
  Group,
  Ungroup,
  ChevronUp,
  ChevronDown,
  Filter,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Import the new mock data
import { newSegments } from "@/mock/newSegmentsMockData";
// Import components from the segments folder
import { SegmentListItem } from "./SegmentListItem";
import { SegmentTypeIcon } from "./SegmentTypeIcon";

// Define interface for extended segment properties
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

// This function has been moved to SegmentListItem component

interface SegmentsListProps {
  projectId: string;
  className?: string;
}

export function SegmentsList({ projectId, className }: SegmentsListProps) {
  const dispatch = useDispatch<AppDispatch>();

  // For scaffolding, use the new mock data instead of Redux state
  // Uncomment the useSelector line when connected to real Redux state
  /*
  const { segments, activeSegmentId, selectedSegmentIds, copiedSegment } = useSelector(
    (state: RootState) => state.segments
  );
  */

  // Use newSegments for scaffolding
  const [segments, setSegments] = useState<Segment[]>(newSegments);
  // const [segments, setSegments] = useState<Segment[]>([]);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [copiedSegment, setCopiedSegment] = useState<Segment | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showAdvancedProps, setShowAdvancedProps] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name"); // Options: name, type, area, perimeter

  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Get unique segment types for tabs
  const segmentTypes = useMemo(() => {
    return Array.from(
      new Set(
        segments
          .map((s) => s.type)
          .filter((type): type is string => typeof type === "string")
      )
    ).sort();
  }, [segments]);

  // Filter segments based on active tab and search
  const filteredSegments = useMemo(() => {
    let filtered = segments;

    // Handle special tabs
    if (activeTab === "visible") {
      filtered = segments.filter((s) => s.visible !== false);
    } else if (activeTab === "hidden") {
      filtered = segments.filter((s) => s.visible === false);
    } else if (activeTab !== "all") {
      filtered = segments.filter((s) => s.type === activeTab);
    }
    // Apply search filter if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => {
        const extSeg = s as ExtendedSegment;
        return (
          s.name.toLowerCase().includes(query) ||
          (s.type || "").toLowerCase().includes(query) ||
          extSeg.seg_short?.toLowerCase().includes(query) ||
          extSeg.group?.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const extA = a as ExtendedSegment;
      const extB = b as ExtendedSegment;
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return (a.type || "").localeCompare(b.type || "");
        case "area":
          return (extB.bb_area_pixel || 0) - (extA.bb_area_pixel || 0);
        case "perimeter":
          return (extB.perimeter_pixel || 0) - (extA.perimeter_pixel || 0);
        default:
          return 0;
      }
    });
  }, [segments, activeTab, searchQuery, sortBy]);

  // Count segments by type for the tab badges
  const segmentTypeCounts = useMemo(() => {
    return segments.reduce((acc: Record<string, number>, segment) => {
      const type = segment.type || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, [segments]);

  const handleSegmentSelect = (segmentId: string, isMultiSelect = false) => {
    if (isMultiSelect) {
      // Multi-select logic would go here
      // For now, just select single segment
      setActiveSegmentId(segmentId);
      setSelectedSegmentIds((prev) => [...prev, segmentId]);
    } else {
      setActiveSegmentId(segmentId);
      setSelectedSegmentIds([segmentId]);
    }
  };

  const handleDeleteSegment = (segmentId: string) => {
    const segment = segments.find((s: Segment) => s.id === segmentId);
    setSegments((prev) => prev.filter((s) => s.id !== segmentId));

    if (segment) {
      dispatch(
        logActivity({
          projectId,
          type: "segment_edited",
          action: "Segment Deleted",
          detail: `Segment "${segment.name}" was deleted`,
          metadata: { segmentId, segmentName: segment.name },
        })
      );
    }

    toast.success("Segment deleted");
  };

  const handleDuplicateSegment = (segmentId: string) => {
    const segment = segments.find((s: Segment) => s.id === segmentId);

    if (segment) {
      const newSegment = {
        ...segment,
        id: `seg_${Date.now()}`,
        name: `${segment.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSegments((prev) => [...prev, newSegment]);

      dispatch(
        logActivity({
          projectId,
          type: "segment_added",
          action: "Segment Duplicated",
          detail: `Segment "${segment.name}" was duplicated`,
          metadata: { originalSegmentId: segmentId, segmentName: segment.name },
        })
      );
    }

    toast.success("Segment duplicated");
  };

  const handleCopySegment = (segmentId: string) => {
    const segment = segments.find((s: Segment) => s.id === segmentId);

    if (segment) {
      setCopiedSegment(segment);

      dispatch(
        logActivity({
          projectId,
          type: "segment_edited",
          action: "Segment Copied",
          detail: `Segment "${segment.name}" was copied`,
          metadata: { segmentId, segmentName: segment.name },
        })
      );
    }

    toast.success("Segment copied");
  };

  const handleCopySpecificSegment = (segmentId: string) => {
    const segment = segments.find((s: Segment) => s.id === segmentId);
    if (segment) {
      setCopiedSegment(segment);
    }
    toast.success("Segment copied to clipboard");
  };

  const handlePasteSegment = () => {
    if (copiedSegment) {
      const newSegment = {
        ...copiedSegment,
        id: `seg_${Date.now()}`,
        name: `${copiedSegment.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSegments((prev) => [...prev, newSegment]);

      dispatch(
        logActivity({
          projectId,
          type: "segment_added",
          action: "Segment Pasted",
          detail: `Segment "${copiedSegment.name}" was pasted`,
          metadata: { segmentName: copiedSegment.name },
        })
      );

      toast.success("Segment pasted");
    }
  };

  const handleGroupSegments = () => {
    if (selectedSegmentIds.length < 2) {
      toast.error("Select at least 2 segments to group");
      return;
    }

    // Create a new group ID
    const groupId = `group_${Date.now()}`;

    // Update segments with the new group ID
    setSegments((prev) =>
      prev.map((segment) =>
        selectedSegmentIds.includes(segment.id)
          ? { ...segment, groupId, updatedAt: new Date().toISOString() }
          : segment
      )
    );

    dispatch(
      logActivity({
        projectId,
        type: "segment_edited",
        action: "Segments Grouped",
        detail: `${selectedSegmentIds.length} segments were grouped together`,
        metadata: {
          segmentIds: selectedSegmentIds,
          count: selectedSegmentIds.length,
        },
      })
    );

    toast.success("Segments grouped");
  };

  // Used when ungrouping segments from a group, keeping for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUngroupSegments = (groupId: string) => {
    // Remove the group ID from all segments in the group
    setSegments((prev) =>
      prev.map((segment) =>
        segment.groupId === groupId
          ? {
              ...segment,
              groupId: undefined,
              updatedAt: new Date().toISOString(),
            }
          : segment
      )
    );

    dispatch(
      logActivity({
        projectId,
        type: "segment_edited",
        action: "Segments Ungrouped",
        detail: `Group with ID ${groupId} was ungrouped`,
        metadata: { groupId },
      })
    );

    toast.success("Segments ungrouped");
  };

  const handleBringForward = (segmentId: string) => {
    // Find the segment and increase its zIndex
    setSegments((prev) => {
      const segment = prev.find((s) => s.id === segmentId);
      if (!segment) return prev;

      return prev.map((s) =>
        s.id === segmentId
          ? { ...s, zIndex: s.zIndex + 1, updatedAt: new Date().toISOString() }
          : s
      );
    });

    toast.success("Segment moved forward");
  };

  const handleSendBackward = (segmentId: string) => {
    // Find the segment and decrease its zIndex
    setSegments((prev) => {
      const segment = prev.find((s) => s.id === segmentId);
      if (!segment) return prev;

      return prev.map((s) =>
        s.id === segmentId
          ? { ...s, zIndex: s.zIndex - 1, updatedAt: new Date().toISOString() }
          : s
      );
    });

    toast.success("Segment moved backward");
  };

  const handleStartEdit = (segment: Segment) => {
    setEditingSegmentId(segment.id);
    setEditingName(segment.name);
  };

  const handleSaveEdit = () => {
    if (editingSegmentId && editingName.trim() !== "") {
      const oldName = segments.find(
        (s: Segment) => s.id === editingSegmentId
      )?.name;

      setSegments((prev) =>
        prev.map((segment) =>
          segment.id === editingSegmentId
            ? {
                ...segment,
                name: editingName.trim(),
                updatedAt: new Date().toISOString(),
              }
            : segment
        )
      );

      dispatch(
        logActivity({
          projectId,
          type: "segment_edited",
          action: "Segment Renamed",
          detail: `Segment renamed from "${oldName}" to "${editingName.trim()}"`,
          metadata: {
            segmentId: editingSegmentId,
            oldName,
            newName: editingName.trim(),
          },
        })
      );

      setEditingSegmentId(null);
      setEditingName("");
      toast.success("Segment renamed");
    }
  };

  const handleCancelEdit = () => {
    setEditingSegmentId(null);
    setEditingName("");
  };

  const handleToggleVisibility = (segmentId: string) => {
    const segment = segments.find((s: Segment) => s.id === segmentId);
    if (segment) {
      setSegments((prev) =>
        prev.map((s) =>
          s.id === segmentId
            ? { ...s, visible: !s.visible, updatedAt: new Date().toISOString() }
            : s
        )
      );
    }
  };

  const handleFocusSegment = (segmentId: string) => {
    setActiveSegmentId(segmentId);
    setSelectedSegmentIds([segmentId]);
    // In a real implementation, this would scroll the canvas to center on the segment
    toast.success("Segment focused");
  };

  const toggleDetailView = () => {
    setShowDetails((prev) => !prev);
    // Reset advanced props when hiding details
    if (showDetails) {
      setShowAdvancedProps(false);
    }
  };

  const toggleAdvancedProps = () => {
    setShowAdvancedProps((prev) => !prev);
  };

  const selectedCount = selectedSegmentIds?.length || 0;
  const hasSelection = activeSegmentId !== null;
  const canPaste = copiedSegment !== null;

  // Helper function to render the segments list
  const renderSegmentsList = (segments: Segment[]) => {
    if (segments.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground space-y-2">
          <Shapes className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No segments in this category</p>

          {searchQuery ? (
            // Show search-specific message when filtering
            <div className="text-xs">
              <p>No results match your search query.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs h-7"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : activeTab !== "all" ? (
            // Show category-specific message
            <div className="text-xs">
              <p>Use the canvas tools to draw {activeTab} segments</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs h-7"
                onClick={() => setActiveTab("all")}
              >
                View all segments
              </Button>
            </div>
          ) : (
            // Show default empty state message
            <p className="text-xs">Use the canvas tools to draw segments</p>
          )}
        </div>
      );
    }

    return (
      <ScrollArea className="h-[calc(100vh-380px)] min-h-[350px]">
        <div className="space-y-2">
          <AnimatePresence>
            {segments.map((segment: Segment, index: number) => {
              const extendedSegment = segment as ExtendedSegment;

              return (
                <SegmentListItem
                  key={segment.id}
                  segment={segment}
                  extendedSegment={extendedSegment}
                  index={index}
                  isActive={activeSegmentId === segment.id}
                  isSelected={selectedSegmentIds?.includes(segment.id) || false}
                  isEditing={editingSegmentId === segment.id}
                  editingName={editingName}
                  showDetails={showDetails}
                  showAdvancedProps={showAdvancedProps}
                  onSelect={handleSegmentSelect}
                  onDelete={handleDeleteSegment}
                  onDuplicate={handleDuplicateSegment}
                  onCopy={handleCopySpecificSegment}
                  onFocus={handleFocusSegment}
                  onToggleVisibility={handleToggleVisibility}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onEditNameChange={setEditingName}
                  onBringForward={handleBringForward}
                  onSendBackward={handleSendBackward}
                  onToggleAdvancedProps={toggleAdvancedProps}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shapes className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium">Segments</h2>
            <Badge variant="secondary" className="text-xs">
              {segments.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={toggleDetailView}
              title={showDetails ? "Hide details" : "Show details"}
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              title="Toggle visibility filter"
              onClick={() => {
                // Filter to only show visible segments
                const showingOnlyVisible = activeTab === "visible";
                setActiveTab(showingOnlyVisible ? "all" : "visible");
              }}
            >
              {activeTab === "visible" ? (
                <Eye className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* Save segments logic */
              }}
              disabled={segments.length === 0}
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Search & Sort controls */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs pl-7"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <Filter className="h-3 w-3 mr-1" />
                  <span className="text-xs">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => setSortBy("name")}
                  className={cn(sortBy === "name" && "bg-accent")}
                >
                  By Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("type")}
                  className={cn(sortBy === "type" && "bg-accent")}
                >
                  By Type
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("area")}
                  className={cn(sortBy === "area" && "bg-accent")}
                >
                  By Area
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("perimeter")}
                  className={cn(sortBy === "perimeter" && "bg-accent")}
                >
                  By Perimeter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 px-2",
                    activeTab === "visible" &&
                      "border-green-500 text-green-600",
                    activeTab === "hidden" && "border-red-500 text-red-600"
                  )}
                >
                  {activeTab === "visible" ? (
                    <Eye className="h-3 w-3 mr-1 text-green-500" />
                  ) : activeTab === "hidden" ? (
                    <EyeOff className="h-3 w-3 mr-1 text-red-500" />
                  ) : (
                    <Eye className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-xs">Visibility</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setActiveTab("visible")}>
                  <Eye className="h-3 w-3 mr-2 text-green-500" />
                  Show only visible segments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("hidden")}>
                  <EyeOff className="h-3 w-3 mr-2 text-red-500" />
                  Show only hidden segments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("all")}>
                  <Shapes className="h-3 w-3 mr-2" />
                  Show all segments
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // Show all segments in current view
                    setSegments((prev) =>
                      prev.map((s) =>
                        filteredSegments.some((fs) => fs.id === s.id)
                          ? { ...s, visible: true }
                          : s
                      )
                    );
                    toast.success("Made all filtered segments visible");
                  }}
                >
                  <Eye className="h-3 w-3 mr-2 text-green-500" />
                  Show all filtered segments
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // Hide all segments in current view
                    setSegments((prev) =>
                      prev.map((s) =>
                        filteredSegments.some((fs) => fs.id === s.id)
                          ? { ...s, visible: false }
                          : s
                      )
                    );
                    toast.success("Hidden all filtered segments");
                  }}
                >
                  <EyeOff className="h-3 w-3 mr-2 text-red-500" />
                  Hide all filtered segments
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              activeSegmentId && handleCopySegment(activeSegmentId)
            }
            disabled={!hasSelection}
            className="text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePasteSegment}
            disabled={!canPaste}
            className="text-xs"
          >
            <Clipboard className="h-3 w-3 mr-1" />
            Paste
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGroupSegments}
            disabled={selectedCount < 2}
            className="text-xs"
          >
            <Group className="h-3 w-3 mr-1" />
            Group
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              /* Ungroup segments logic */
            }}
            disabled={!hasSelection}
            className="text-xs"
          >
            <Ungroup className="h-3 w-3 mr-1" />
            Ungroup
          </Button>
        </div>

        {/* Visibility Status Bar */}
        <div className="flex justify-between items-center mt-2 mb-2 px-1.5 py-1.5 bg-muted/20 rounded-md border-dashed border border-muted">
          <div className="flex items-center gap-1 text-xs ">
            <span className="font-medium">Status:</span>
            <span className="inline-flex items-center text-green-600">
              <Eye className="h-3 w-3 mr-0.5" />
              {segments.filter((s) => s.visible !== false).length}
            </span>
            <span className="mx-0.5">|</span>
            <span className="inline-flex items-center text-red-500">
              <EyeOff className="h-3 w-3 mr-0.5" />
              {segments.filter((s) => s.visible === false).length}
            </span>
          </div>
          <div className="flex gap-0.5">
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-1.5 text-[10px] border-green-400 text-green-600"
              onClick={() => {
                setSegments((prev) =>
                  prev.map((s) => ({ ...s, visible: true }))
                );
                toast.success("All segments are now visible");
              }}
            >
              <Eye className="h-3 w-3 mr-0.5" />
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-1.5 text-[10px] border-red-400 text-red-600"
              onClick={() => {
                setSegments((prev) =>
                  prev.map((s) => ({ ...s, visible: false }))
                );
                toast.error("All segments are now hidden");
              }}
            >
              <EyeOff className="h-3 w-3 mr-0.5" />
              Hide All
            </Button>
          </div>
        </div>

        {/* Layer Controls */}
        {hasSelection && (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBringForward(activeSegmentId!)}
              className="text-xs flex-1"
            >
              <ChevronUp className="h-3 w-3 mr-1" />
              Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendBackward(activeSegmentId!)}
              className="text-xs flex-1"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Backward
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Tabs for segment types */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        {/* Scrollable tab list for many types */}
        <div className="overflow-x-auto pb-1">
          <TabsList className="w-full mb-4 h-auto p-1 bg-muted/50 overflow-x-auto flex-nowrap">
            <TabsTrigger
              value="all"
              className="flex-grow text-xs py-1.5 h-auto"
            >
              All
              <Badge variant="secondary" className="ml-1 bg-accent">
                {segments.length}
              </Badge>
            </TabsTrigger>
            {segmentTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="flex items-center"
              >
                <div className="flex items-center">
                  <SegmentTypeIcon type={type} />
                  <span className="ml-1 capitalize whitespace-nowrap">
                    {type}
                  </span>
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    {segmentTypeCounts[type] || 0}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-2 flex-1">
          {renderSegmentsList(filteredSegments)}
        </TabsContent>

        {segmentTypes.map((type) => (
          <TabsContent key={type} value={type} className="mt-2 flex-1">
            {renderSegmentsList(segments.filter((s) => s.type === type))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
