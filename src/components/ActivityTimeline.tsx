import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/redux/store';
import { ActivityLog } from '@/redux/slices/activityLogsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FolderPlus,
  Palette,
  Paintbrush,
  Shapes,
  Upload,
  Sparkles,
  AlertCircle,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  projectId: string;
  className?: string;
}

const getActivityIcon = (type: ActivityLog['type']) => {
  switch (type) {
    case 'project_created':
      return FolderPlus;
    case 'style_changed':
      return Palette;
    case 'material_applied':
      return Paintbrush;
    case 'segment_added':
    case 'segment_edited':
      return Shapes;
    case 'image_uploaded':
      return Upload;
    case 'ai_job_started':
    case 'ai_job_completed':
      return Sparkles;
    case 'ai_job_failed':
      return AlertCircle;
    case 'design_saved':
      return Save;
    default:
      return Clock;
  }
};

const getActivityColor = (type: ActivityLog['type']) => {
  switch (type) {
    case 'project_created':
      return 'text-blue-500';
    case 'style_changed':
      return 'text-purple-500';
    case 'material_applied':
      return 'text-green-500';
    case 'segment_added':
    case 'segment_edited':
      return 'text-orange-500';
    case 'image_uploaded':
      return 'text-cyan-500';
    case 'ai_job_started':
    case 'ai_job_completed':
      return 'text-yellow-500';
    case 'ai_job_failed':
      return 'text-red-500';
    case 'design_saved':
      return 'text-emerald-500';
    default:
      return 'text-gray-500';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const groupLogsByDate = (logs: ActivityLog[]) => {
  const groups: Record<string, ActivityLog[]> = {};
  
  logs.forEach(log => {
    const date = new Date(log.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(log);
  });
  
  return groups;
};

export function ActivityTimeline({ projectId, className }: ActivityTimelineProps) {
  const { logs } = useSelector((state: RootState) => state.activityLogs);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const projectLogs = logs[projectId] || [];
  const displayLogs = showAll ? projectLogs : projectLogs.slice(0, 10);
  const groupedLogs = groupLogsByDate(displayLogs);

  if (projectLogs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Activity Timeline
                <Badge variant="secondary" className="ml-2 text-xs">
                  {projectLogs.length}
                </Badge>
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {Object.entries(groupedLogs).map(([dateGroup, groupLogs]) => (
                  <div key={dateGroup}>
                    <div className="flex items-center space-x-2 mb-3">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {dateGroup}
                      </h4>
                      <Separator className="flex-1" />
                    </div>
                    
                    <div className="space-y-3">
                      {groupLogs.map((log, index) => {
                        const Icon = getActivityIcon(log.type);
                        const iconColor = getActivityColor(log.type);
                        
                        return (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex items-start space-x-3 group"
                          >
                            <div className={cn(
                              'flex-shrink-0 w-8 h-8 rounded-full border-2 border-background bg-card flex items-center justify-center shadow-sm',
                              'group-hover:shadow-md transition-shadow'
                            )}>
                              <Icon className={cn('h-4 w-4', iconColor)} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground">
                                  {log.action}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(log.timestamp)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {log.detail}
                              </p>
                              
                              {/* Metadata */}
                              {log.metadata && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {Object.entries(log.metadata).map(([key, value]) => (
                                    <Badge key={key} variant="outline" className="text-xs">
                                      {key}: {String(value)}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Show More Button */}
            {projectLogs.length > 10 && (
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs"
                >
                  {showAll ? 'Show Less' : `Show ${projectLogs.length - 10} More`}
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}