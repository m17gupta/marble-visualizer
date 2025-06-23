import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { setActiveVariation, removeVariation } from '@/redux/slices/jobsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import {
  ChevronDown,
  ChevronUp,
  History,
  Trash2,
  Eye,
  Download,
  Clock,
  Palette,
  Star,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VersionHistoryProps {
  projectId: string;
  className?: string;
}

export function VersionHistory({ projectId, className }: VersionHistoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { variations, activeVariationId } = useSelector((state: RootState) => state.jobs);
  const [isOpen, setIsOpen] = useState(false);
  
  const projectVariations = variations[projectId] || [];

  const handleVariationSelect = (variationId: string) => {
    dispatch(setActiveVariation(variationId));
    toast.success('Variation selected');
  };

  const handleDeleteVariation = (variationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeVariation({ projectId, variationId }));
    toast.success('Variation deleted');
  };

  const handleDownloadVariation = async (variation: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(variation.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `variation-${variation.style}-${variation.id}.jpg`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Variation downloaded!');
    } catch (error) {
      toast.error('Failed to download variation');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (projectVariations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No versions yet</p>
            <p className="text-xs">Generate designs to create version history</p>
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
                <History className="h-4 w-4 mr-2" />
                Version History
                <Badge variant="secondary" className="ml-2 text-xs">
                  {projectVariations.length}
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
            <ScrollArea className="h-80">
              <div className="space-y-3">
                <AnimatePresence>
                  {projectVariations.map((variation, index) => (
                    <motion.div
                      key={variation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        'group relative rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md',
                        activeVariationId === variation.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50'
                      )}
                      onClick={() => handleVariationSelect(variation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img
                              src={variation.imageUrl}
                              alt={`Version ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Active indicator */}
                          {activeVariationId === variation.id && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <Star className="h-2 w-2 text-primary-foreground fill-current" />
                            </div>
                          )}
                          
                          {/* Cloud indicator */}
                          {variation.s3Url && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                <Palette className="h-3 w-3 mr-1" />
                                {variation.style}
                              </Badge>
                              {index === 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatTimestamp(variation.timestamp)}</span>
                          </div>
                          
                          {/* Settings preview */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              Level {variation.settings.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {variation.settings.tone}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {variation.settings.intensity}%
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => handleDownloadVariation(variation, e)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteVariation(variation.id, e)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{projectVariations.length} version{projectVariations.length !== 1 ? 's' : ''} saved</span>
                <span>
                  {projectVariations.filter(v => v.s3Url).length} in cloud storage
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}