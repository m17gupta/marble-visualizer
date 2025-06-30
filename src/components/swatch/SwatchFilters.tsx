import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setFilters, FilterSwatchModel, updateFilterCategory, updateFilterStyle, updateFilterBrand, resetSwatchFilter } from '@/redux/slices/swatchSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BrandModel } from '@/models/swatchBook/brand/BrandModel';

import { StyleModel } from '@/models/swatchBook/styleModel/StyleModel';
import { fetchMaterials } from '@/redux/slices/materialSlices/materialsSlice';
import { filters } from 'node_modules/fabric/dist/src/filters';

interface SwatchFiltersProps {
  compact?: boolean;
}

export function SwatchFilters({ compact = false }: SwatchFiltersProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.swatches);

  const { categories } = useSelector((state: RootState) => state.categories);
  const { brands } = useSelector((state: RootState) => state.brands);
  const { styles } = useSelector((state: RootState) => state.styles);

 
  const mockFinishes = ['Matte', 'Satin', 'Semi-Gloss', 'Gloss'];

  const [allBrands, setAllBrands] = useState<BrandModel[]>([]);
  const [allStyles, setAllStyles] = useState<StyleModel[]>([]);
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

  const handleFilterChange = (key: string, value: FilterSwatchModel ) => {
    dispatch(setFilters({
      [key]: value?.id.toString()
    }));
    if (key === 'category' && value && typeof value === 'object') {

      dispatch(updateFilterCategory(value as FilterSwatchModel))

      //search material based on category
      dispatch(fetchMaterials({
        material_category_id: value.id,
        limit: 100
      }))
    } else if (key === 'brand' && value && typeof value === 'object') {


      dispatch(updateFilterBrand(value as FilterSwatchModel))

       dispatch(fetchMaterials({
        material_category_id: Number(filters.category),
        material_brand_id: value.id,
        limit: 100
      }))
    }
    
    else if(key === 'style' && value && typeof value === 'object') {
      dispatch(updateFilterStyle(value as FilterSwatchModel))

        dispatch(fetchMaterials({
        material_category_id: Number(filters.category),
        material_brand_id: Number(filters.brand),
        material_brand_style_id: value.id,
        limit: 100
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
 
      const category = categories.find(c => c.id.toString() === value);
      if (category) {
        handleFilterChange('category', { id: category.id, title: category.title });
      
    }
  };

  const handleBrandChange = (value: string) => {
   
      const brand = brands.find(b => b.id.toString() === value);
      if (brand) {
        handleFilterChange('brand', { id: brand.id, title: brand.title });
      
    }
  };


  // based on caregory selecct brand
  useEffect(() => {
    if (filters.category) {
      const filteredBrands = brands.filter(b => b.material_category_id.toString() === filters.category);
      
      setAllBrands(filteredBrands);
    } else {
      setAllBrands(brands);
    }
  }, [filters.category, brands]);

  // based on brand update the style
  useEffect(() => {
    if( filters.brand && styles.length > 0) {
      const filteredStyles = styles.filter(s => s.material_brand_id.toString() === filters.brand);
      console.log("Filtered styles based on brand:", filteredStyles);
      setAllStyles(filteredStyles);
    } else {
      setAllStyles(styles); 
    }
  },[ filters.brand, styles]);


  const handleStyleChange = (value: string) => {
    const style = allStyles.find(s => s.id.toString() === value);
    if (style) {
      handleFilterChange('style', { id: style.id, title: style.title });
    }
  };



  const handleCoatingChange = (value: string) => {
    
  };

  const handleTagToggle = (tag: string) => {
    // const tagModel: FilterSwatchModel = { id: mockTags.indexOf(tag), title: tag };
    // const isSelected = filters.tags.some(t => t.title === tag);
    
    // if (isSelected) {
    //   const newTags = filters.tags.filter(t => t.title !== tag);
    //   handleFilterChange('tags', newTags);
    // } else {
    //   handleFilterChange('tags', [...filters.tags, tagModel]);
    // }
  };

  const handleSegmentToggle = (segment: string) => {
    // const segmentModel: FilterSwatchModel = { id: mockSegmentTypes.indexOf(segment), title: segment };
    // const isSelected = filters.segment_types.some(s => s.title === segment);
    
    // if (isSelected) {
    //   const newSegments = filters.segment_types.filter(s => s.title !== segment);
    //   handleFilterChange('segment_types', newSegments);
    // } else {
    //   handleFilterChange('segment_types', [...filters.segment_types, segmentModel]);
    // }
  };

  const clearAllFilters = () => {
    dispatch(resetSwatchFilter());
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
            value={filters.category??""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories && categories.length > 0 && (
                categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.title}
                  </SelectItem>
                ))
              ) }
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Brand */}
        <FilterSection title="Brand" section="brand">
          <Select
            value={filters.brand??""}
            onValueChange={handleBrandChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {allBrands && 
              allBrands.length > 0 &&
              allBrands.map((brand) => (
                <SelectItem
                 key={brand.id}
                  value={brand.id.toString()}>
                  {brand.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Style */}
        <FilterSection title="Style" section="style">
          <Select
           value={filters.style ?? ""}
             onValueChange={handleStyleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {allStyles && allStyles.length > 0 && (
                allStyles.map((style) => (
                  <SelectItem key={style.id} value={style.id.toString()}>
                    {style.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </FilterSection>

        {/* <Separator /> */}

        {/* Finish */}
        {/* <FilterSection title="Finish" section="finish">
          <Select
          
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
        </FilterSection> */}

        {/* <Separator /> */}

        {/* Coating Type */}
        {/* <FilterSection title="Coating Type" section="coating">
          <Select
            value={filters.coating_type ? filters.coating_type.title : 'all'}
            onValueChange={handleCoatingChange}
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
        </FilterSection> */}

        {/* <Separator /> */}

        {/* Price Range */}
        {/* <FilterSection title="Price Range" section="price">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.price_range[0]}</span>
              <span>${filters.price_range[1]}</span>
            </div>
            <Slider
              value={filters.price_range}
              onValueChange={(value) => handleFilterChange('price_range', value as [number, number])}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </FilterSection> */}

        {/* <Separator /> */}

        {/* LRV Range */}
        {/* <FilterSection title="Light Reflectance Value (LRV)" section="lrv">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.lrv_range[0]}%</span>
              <span>{filters.lrv_range[1]}%</span>
            </div>
            <Slider
              value={filters.lrv_range}
              onValueChange={(value) => handleFilterChange('lrv_range', value as [number, number])}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </FilterSection> */}

        <Separator />

        {/* Tags */}
        {/* <FilterSection title="Tags" section="tags">
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.some(t => t.title === tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                {filters.tags.some(t => t.title === tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </FilterSection> */}

        {/* <Separator /> */}

        {/* Segment Types */}
        {/* <FilterSection title="Application Areas" section="segments">
          <div className="flex flex-wrap gap-2">
            {mockSegmentTypes.map((segment) => (
              <Badge
                key={segment}
                variant={filters.segment_types.some(s => s.title === segment) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleSegmentToggle(segment)}
              >
                {segment}
                {filters.segment_types.some(s => s.title === segment) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </FilterSection> */}
      </CardContent>
    </Card>
  );
}