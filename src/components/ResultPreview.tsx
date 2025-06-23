import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { setActiveVariation, removeVariation, uploadResultToS3, saveProjectMetadata } from '@/redux/slices/jobsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Download,
  Trash2,
  Upload,
  Eye,
  Clock,
  Palette,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultPreviewProps {
  originalImageUrl: string;
  projectId: string;
  className?: string;
}

export function ResultPreview({ originalImageUrl, projectId, className }: ResultPreviewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentJob } = useSelector((state: RootState) => state.jobs);
  const { variations, activeVariationId } = useSelector((state: RootState) => state.jobs);
  
  const [sliderValue, setSliderValue] = useState([50]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const projectVariations = variations[projectId] || [];
  const activeVariation = projectVariations.find(v => v.id === activeVariationId);
  const resultImageUrl = activeVariation?.imageUrl || currentJob?.resultUrl;

  // Auto-select first variation when available
  useEffect(() => {
    if (projectVariations.length > 0 && !activeVariationId) {
      dispatch(setActiveVariation(projectVariations[0].id));
    }
  }, [projectVariations.length, activeVariationId, dispatch]);

  const handleDownload = async () => {
    if (!resultImageUrl) return;
    
    try {
      const response = await fetch(resultImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-result-${activeVariation?.id || 'current'}.jpg`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleUploadToS3 = async () => {
    if (!currentJob?.id || !resultImageUrl) return;
    
    const result = await dispatch(uploadResultToS3({
      jobId: currentJob.id,
      imageUrl: resultImageUrl,
    }));
    
    if (uploadResultToS3.fulfilled.match(result)) {
      // Save S3 URL to project metadata
      await dispatch(saveProjectMetadata({
        projectId,
        s3Url: result.payload.s3Url,
      }));
      toast.success('Result uploaded to cloud storage!');
    }
  };

  const handleDeleteVariation = (variationId: string) => {
    dispatch(removeVariation({ projectId, variationId }));
    toast.success('Variation deleted');
  };

  const handleVariationSelect = (variationId: string) => {
    dispatch(setActiveVariation(variationId));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!resultImageUrl) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results yet</p>
            <p className="text-sm">Generate a design to see results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Result Viewer */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AI Result</CardTitle>
            <div className="flex items-center space-x-2">
              {activeVariation && (
                <Badge variant="secondary" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  {activeVariation.style}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Before/After Slider */}
          <div className="relative">
            <div
              ref={containerRef}
              className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-muted"
            >
              {/* Original Image */}
              <img
                src={originalImageUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Result Image with Clip Path */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)`,
                }}
              >
                <img
                  src={resultImageUrl}
                  alt="AI Result"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
                style={{ left: `${sliderValue[0]}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-1 h-4 bg-gray-400 rounded-full" />
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Original
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                AI Result
              </div>
            </div>
            
            {/* Slider Control */}
            <div className="mt-4">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Original</span>
                <span>AI Result</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              {!activeVariation?.s3Url && (
                <Button variant="outline" size="sm" onClick={handleUploadToS3}>
                  <Upload className="h-4 w-4 mr-1" />
                  Save to Cloud
                </Button>
              )}
            </div>
            
            {activeVariation && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTimestamp(activeVariation.timestamp)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Variations History */}
      {projectVariations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Variations ({projectVariations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex space-x-3 pb-2">
                {projectVariations.map((variation, index) => (
                  <motion.div
                    key={variation.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex-shrink-0"
                  >
                    <div
                      className={cn(
                        'relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
                        activeVariationId === variation.id
                          ? 'border-primary shadow-md'
                          : 'border-border hover:border-primary/50'
                      )}
                      onClick={() => handleVariationSelect(variation.id)}
                    >
                      <img
                        src={variation.imageUrl}
                        alt={`Variation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Style Badge */}
                      <div className="absolute top-1 left-1">
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {variation.style}
                        </Badge>
                      </div>
                      
                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVariation(variation.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      
                      {/* Cloud Indicator */}
                      {variation.s3Url && (
                        <div className="absolute bottom-1 right-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-1 text-center">
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(variation.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resultImageUrl}
                alt="AI Result Fullscreen"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="outline"
                className="absolute top-4 right-4"
                onClick={() => setIsFullscreen(false)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}