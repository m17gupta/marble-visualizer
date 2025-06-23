import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import {
  selectSegment,
  deleteSegment,
  duplicateSegment,
  updateSegment,
  groupSegments,
  ungroupSegments,
  copySegment,
  pasteSegment,
  bringForward,
  sendBackward,
  clearCopiedSegment,
} from '@/redux/slices/segmentsSlice';
import { logActivity } from '@/redux/slices/activityLogsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Save,
  Shapes,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
  Copy,
  Clipboard,
  Group,
  Ungroup,
  ChevronUp,
  ChevronDown,
  Edit3,
  Palette,
  Focus,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SegmentsListProps {
  projectId: string;
  className?: string;
}

export function SegmentsList({ projectId, className }: SegmentsListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { segments, activeSegmentId, selectedSegmentIds, copiedSegment } = useSelector(
    (state: RootState) => state.segments
  );
  
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleSegmentSelect = (segmentId: string, isMultiSelect = false) => {
    if (isMultiSelect) {
      // Multi-select logic would go here
      // For now, just select single segment
      dispatch(selectSegment(segmentId));
    } else {
      dispatch(selectSegment(segmentId));
    }
  };

  const handleDeleteSegment = (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId);
    dispatch(deleteSegment(segmentId));
    
    if (segment) {
      dispatch(logActivity({
        projectId,
        type: 'segment_edited',
        action: 'Segment Deleted',
        detail: `Segment "${segment.name}" was deleted`,
        metadata: { segmentId, segmentName: segment.name },
      }));
    }
    
    toast.success('Segment deleted');
  };

  const handleDuplicateSegment = (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId);
    dispatch(duplicateSegment(segmentId));
    
    if (segment) {
      dispatch(logActivity({
        projectId,
        type: 'segment_added',
        action: 'Segment Duplicated',
        detail: `Segment "${segment.name}" was duplicated`,
        metadata: { originalSegmentId: segmentId, segmentName: segment.name },
      }));
    }
    
    toast.success('Segment duplicated');
  };

  const handleCopySegment = (segmentId: string) => {
    dispatch(copySegment(segmentId));
    toast.success('Segment copied to clipboard');
  };

  const handlePasteSegment = () => {
    if (copiedSegment) {
      dispatch(pasteSegment());
      
      dispatch(logActivity({
        projectId,
        type: 'segment_added',
        action: 'Segment Pasted',
        detail: `Segment "${copiedSegment.name}" was pasted`,
        metadata: { segmentName: copiedSegment.name },
      }));
      
      toast.success('Segment pasted');
    }
  };

  const handleGroupSegments = () => {
    if (selectedSegmentIds.length < 2) {
      toast.error('Select at least 2 segments to group');
      return;
    }
    
    dispatch(groupSegments(selectedSegmentIds));
    
    dispatch(logActivity({
      projectId,
      type: 'segment_edited',
      action: 'Segments Grouped',
      detail: `${selectedSegmentIds.length} segments were grouped together`,
      metadata: { segmentIds: selectedSegmentIds, count: selectedSegmentIds.length },
    }));
    
    toast.success('Segments grouped');
  };

  const handleUngroupSegments = (groupId: string) => {
    dispatch(ungroupSegments(groupId));
    
    dispatch(logActivity({
      projectId,
      type: 'segment_edited',
      action: 'Segments Ungrouped',
      detail: 'Segment group was ungrouped',
      metadata: { groupId },
    }));
    
    toast.success('Segments ungrouped');
  };

  const handleBringForward = (segmentId: string) => {
    dispatch(bringForward(segmentId));
    toast.success('Segment moved forward');
  };

  const handleSendBackward = (segmentId: string) => {
    dispatch(sendBackward(segmentId));
    toast.success('Segment moved backward');
  };

  const handleStartEdit = (segment: any) => {
    setEditingSegmentId(segment.id);
    setEditingName(segment.name);
  };

  const handleSaveEdit = () => {
    if (editingSegmentId && editingName.trim()) {
      const oldName = segments.find(s => s.id === editingSegmentId)?.name;
      
      dispatch(updateSegment({
        id: editingSegmentId,
        updates: { name: editingName.trim() }
      }));
      
      dispatch(logActivity({
        projectId,
        type: 'segment_edited',
        action: 'Segment Renamed',
        detail: `Segment renamed from "${oldName}" to "${editingName.trim()}"`,
        metadata: { segmentId: editingSegmentId, oldName, newName: editingName.trim() },
      }));
      
      setEditingSegmentId(null);
      setEditingName('');
      toast.success('Segment renamed');
    }
  };

  const handleCancelEdit = () => {
    setEditingSegmentId(null);
    setEditingName('');
  };

  const handleToggleVisibility = (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId);
    if (segment) {
      dispatch(updateSegment({
        id: segmentId,
        updates: { visible: !segment.visible }
      }));
    }
  };

  const handleFocusSegment = (segmentId: string) => {
    dispatch(selectSegment(segmentId));
    // In a real implementation, this would scroll the canvas to center on the segment
    toast.success('Segment focused');
  };

  const selectedCount = selectedSegmentIds?.length || 0;
  const hasSelection = activeSegmentId !== null;
  const canPaste = copiedSegment !== null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shapes className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Segments</h3>
            <Badge variant="secondary" className="text-xs">
              {segments.length}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Save segments logic */}}
            disabled={segments.length === 0}
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySegment}
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
            onClick={() => {/* Ungroup logic */}}
            disabled={!hasSelection}
            className="text-xs"
          >
            <Ungroup className="h-3 w-3 mr-1" />
            Ungroup
          </Button>
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

      {/* Segments List */}
      {segments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Shapes className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No segments created yet</p>
          <p className="text-xs">Use the canvas tools to draw segments</p>
        </div>
      ) : (
        <ScrollArea className="h-64">
          <div className="space-y-2">
            <AnimatePresence>
              {segments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <Card
                    className={cn(
                      'p-3 cursor-pointer transition-all hover:shadow-sm',
                      activeSegmentId === segment.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => handleSegmentSelect(segment.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Multi-select checkbox */}
                      <Checkbox
                        checked={selectedSegmentIds?.includes(segment.id) || false}
                        onCheckedChange={(checked) => {
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
                      <div className="flex-1 min-w-0">
                        {editingSegmentId === segment.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              onBlur={handleSaveEdit}
                              className="h-6 text-xs"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium truncate">{segment.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{segment.points.length} points</span>
                              {segment.material && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Palette className="h-3 w-3 mr-1" />
                                    {segment.material.materialName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(segment.id);
                          }}
                        >
                          {segment.visible !== false ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>

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
                            <DropdownMenuItem onClick={() => handleStartEdit(segment)}>
                              <Edit3 className="h-3 w-3 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFocusSegment(segment.id)}>
                              <Focus className="h-3 w-3 mr-2" />
                              Focus
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopySegment(segment.id)}>
                              <Copy className="h-3 w-3 mr-2" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateSegment(segment.id)}>
                              <Layers className="h-3 w-3 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBringForward(segment.id)}>
                              <ChevronUp className="h-3 w-3 mr-2" />
                              Bring Forward
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendBackward(segment.id)}>
                              <ChevronDown className="h-3 w-3 mr-2" />
                              Send Backward
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSegment(segment.id)}
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
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {/* Selection Info */}
      {selectedCount > 0 && (
        <div className="text-xs text-muted-foreground text-center py-2 border-t border-border">
          {selectedCount} segment{selectedCount !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}