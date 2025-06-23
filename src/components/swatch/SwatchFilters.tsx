import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { setFilters } from '@/redux/slices/swatchSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SwatchFiltersProps {
  compact?: boolean;
}

export function SwatchFilters({ compact = false }: SwatchFiltersProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.swatches);
  
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    style: true,
    finish: true,
    coating: true,
    price: true,
    lrv: true,
    tags: true,
    segments: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const clearAllFilters = () => {
    dispatch(setFilters({}));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.style) count++;
    if (filters.finish) count++;
    if (filters.coating_type) count++;
    if (filters.tags.length > 0) count++;
    if (filters.segment_types.length > 0) count++;
    if (filters.price_range[0] > 0 || filters.price_range[1] < 200) count++;
    if (filters.lrv_range[0] > 0 || filters.lrv_range[1] < 100) count++;
    return count;
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <Collapsible
      open={expandedSections[section]}
      onOpenChange={() => toggleSection(section)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium text-left"
        >
          {title}
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            expandedSections[section] && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  const mockCategories = ['Interior', 'Exterior', 'Primer', 'Specialty'];
  const mockBrands = ['Premium Paint Co.', 'ColorMax', 'ProCoat', 'Elite Finishes'];
  const mockStyles = ['Modern', 'Traditional', 'Contemporary', 'Rustic'];
  const mockFinishes = ['Matte', 'Satin', 'Semi-Gloss', 'Gloss'];
  const mockCoatingTypes = ['Latex', 'Oil-Based', 'Acrylic', 'Enamel'];
  const mockTags = ['Popular', 'New', 'Eco-Friendly', 'Quick-Dry', 'Low-VOC'];
  const mockSegmentTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Exterior'];

  return (
    <Card className={cn("w-full", compact && "border-0 shadow-none")}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Category */}
        <FilterSection title="Category" section="category">
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mockCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Brand */}
        <FilterSection title="Brand" section="brand">
          <Select
            value={filters.brand || 'all'}
            onValueChange={(value) => handleFilterChange('brand', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {mockBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Style */}
        <FilterSection title="Style" section="style">
          <Select
            value={filters.style || 'all'}
            onValueChange={(value) => handleFilterChange('style', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {mockStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Finish */}
        <FilterSection title="Finish" section="finish">
          <Select
            value={filters.finish || 'all'}
            onValueChange={(value) => handleFilterChange('finish', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Finishes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Finishes</SelectItem>
              {mockFinishes.map((finish) => (
                <SelectItem key={finish} value={finish}>
                  {finish}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Coating Type */}
        <FilterSection title="Coating Type" section="coating">
          <Select
            value={filters.coating_type || 'all'}
            onValueChange={(value) => handleFilterChange('coating_type', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {mockCoatingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.price_range[0]}</span>
              <span>${filters.price_range[1]}</span>
            </div>
            <Slider
              value={filters.price_range}
              onValueChange={(value) => handleFilterChange('price_range', value)}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </FilterSection>

        <Separator />

        {/* LRV Range */}
        <FilterSection title="Light Reflectance Value (LRV)" section="lrv">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.lrv_range[0]}%</span>
              <span>{filters.lrv_range[1]}%</span>
            </div>
            <Slider
              value={filters.lrv_range}
              onValueChange={(value) => handleFilterChange('lrv_range', value)}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </FilterSection>

        <Separator />

        {/* Tags */}
        <FilterSection title="Tags" section="tags">
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter(t => t !== tag)
                    : [...filters.tags, tag];
                  handleFilterChange('tags', newTags);
                }}
              >
                {tag}
                {filters.tags.includes(tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Segment Types */}
        <FilterSection title="Application Areas" section="segments">
          <div className="flex flex-wrap gap-2">
            {mockSegmentTypes.map((segment) => (
              <Badge
                key={segment}
                variant={filters.segment_types.includes(segment) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => {
                  const newSegments = filters.segment_types.includes(segment)
                    ? filters.segment_types.filter(s => s !== segment)
                    : [...filters.segment_types, segment];
                  handleFilterChange('segment_types', newSegments);
                }}
              >
                {segment}
                {filters.segment_types.includes(segment) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
}