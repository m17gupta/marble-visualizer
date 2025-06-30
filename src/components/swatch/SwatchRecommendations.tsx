import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import {  Swatch } from '@/redux/slices/swatchSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Palette,
  Sparkles,
  ExternalLink,
  Target,
  Lightbulb,
  ArrowRight,
  Layers,
  Info,
} from 'lucide-react';


interface SwatchRecommendationsProps {
  selectedSegmentType: string | null;
  className?: string;
}

export function SwatchRecommendations({ selectedSegmentType, className }: SwatchRecommendationsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { swatches, isLoading } = useSelector((state: RootState) => state.swatches);
  
  const [recommendedSwatches, setRecommendedSwatches] = useState<Swatch[]>([]);
  const [groupedSwatches, setGroupedSwatches] = useState<Record<string, Swatch[]>>({});

  // useEffect(() => {
  //   // Fetch swatches when component mounts
  //   dispatch(fetchSwatches({}));
  // }, [dispatch]);

  useEffect(() => {
    if (selectedSegmentType && swatches.length > 0) {
      // Filter swatches that are suitable for the selected segment type
      const filtered = swatches.filter(swatch =>
        swatch.segment_types.includes(selectedSegmentType)
      );
      
      setRecommendedSwatches(filtered);
      
      // Group by category for better organization
      const grouped = filtered.reduce((acc, swatch) => {
        const category = swatch.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(swatch);
        return acc;
      }, {} as Record<string, Swatch[]>);
      
      setGroupedSwatches(grouped);
    } else {
      setRecommendedSwatches([]);
      setGroupedSwatches({});
    }
  }, [selectedSegmentType, swatches]);

  const getSegmentTypeDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      'walls': 'Walls',
      'ceiling': 'Ceiling',
      'trim': 'Trim & Molding',
      'doors': 'Doors',
      'cabinets': 'Cabinets',
      'siding': 'Exterior Siding',
    };
    return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getSegmentTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'walls': 'Interior and exterior wall surfaces',
      'ceiling': 'Overhead surfaces and architectural details',
      'trim': 'Baseboards, crown molding, and decorative elements',
      'doors': 'Entry doors, interior doors, and frames',
      'cabinets': 'Kitchen and bathroom cabinetry',
      'siding': 'Exterior wall cladding and weatherproofing',
    };
    return descriptions[type] || `Surfaces and elements of type: ${type}`;
  };

  const handleViewAllSwatches = () => {
    navigate('/swatchbook');
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 gap-3">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex space-x-3">
                <Skeleton className="w-16 h-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (!selectedSegmentType) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Swatch Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Select a Segment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a segment on the canvas to see recommended swatches for that surface type
            </p>
            <Button variant="outline" onClick={handleViewAllSwatches}>
              <Palette className="h-4 w-4 mr-2" />
              Browse All Swatches
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Recommended for {getSegmentTypeDisplayName(selectedSegmentType)}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {recommendedSwatches.length} swatches
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {getSegmentTypeDescription(selectedSegmentType)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI Suggestions Placeholder */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            <div className="flex items-center justify-between">
              <span>Smart AI suggestions coming soon!</span>
              <Lightbulb className="h-4 w-4 opacity-70" />
            </div>
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <LoadingSkeleton />
        ) : recommendedSwatches.length === 0 ? (
          <div className="text-center py-6">
            <Info className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h4 className="font-medium mb-2">No Specific Recommendations</h4>
            <p className="text-sm text-muted-foreground mb-4">
              No swatches are specifically tagged for {getSegmentTypeDisplayName(selectedSegmentType).toLowerCase()}
            </p>
            <Button variant="outline" size="sm" onClick={handleViewAllSwatches}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Swatches
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grouped Swatches */}
            <Accordion type="multiple" defaultValue={Object.keys(groupedSwatches)} className="w-full">
              {Object.entries(groupedSwatches).map(([category, categorySwatches]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center justify-between w-full mr-2">
                      <span>{category}</span>
                      <Badge variant="outline" className="text-xs">
                        {categorySwatches.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <AnimatePresence>
                        {categorySwatches.slice(0, 4).map((swatch, index) => (
                          <motion.div
                            key={swatch._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            {/* <SwatchCard 
                              swatch={swatch} 
                              variant="list" 
                              className="hover:shadow-sm transition-shadow"
                            /> */}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {categorySwatches.length > 4 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleViewAllSwatches}
                          className="w-full text-xs"
                        >
                          View {categorySwatches.length - 4} more {category.toLowerCase()} swatches
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* View All Link */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleViewAllSwatches}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Swatches in SwatchBook
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}