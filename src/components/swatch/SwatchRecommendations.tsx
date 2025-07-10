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
import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';


interface SwatchRecommendationsProps {
  selectedSegmentType: string | null;
  className?: string;
}

export function SwatchRecommendations({ selectedSegmentType, className }: SwatchRecommendationsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedMaterialSegment } = useSelector((state: RootState) => state.materialSegments);

  const { materials } = useSelector((state: RootState) => state.materials)
  const { categories } = useSelector((state: RootState) => state.categories);

  const [recommendedSwatches, setRecommendedSwatches] = useState<Swatch[]>([]);
  const [groupedSwatches, setGroupedSwatches] = useState<Record<string, Swatch[]>>({});


  useEffect(() => {

    if( selectedMaterialSegment &&
      selectedMaterialSegment.name &&
      selectedMaterialSegment.categories &&
        selectedMaterialSegment.categories.length > 0 &&
       materials && materials.length > 0 &&
       categories && categories.length > 0) {
      const allData:MaterialModel[]= materials.filter((material) => {
        return selectedMaterialSegment.categories.some((cat) => 
          material.title.includes(cat)
        );
      });
      console.log('Filtered Materials:', allData);
    }

  }, [selectedMaterialSegment, materials,categories]);

;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Recommended for
             {/* {getSegmentTypeDisplayName(selectedSegmentType)} */}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {recommendedSwatches.length} swatches
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {/* {getSegmentTypeDescription(selectedSegmentType)} */}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
       

      
      </CardContent>
    </Card>
  );
}