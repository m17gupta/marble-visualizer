import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ViewMode, LayoutMode, SortOption } from './types';
import {
  Search,
  Grid3X3,
  List,
  ArrowUpDown,
  Heart,
  Filter,
  LayoutGrid,
  Rows3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwatchBookSearchControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
  favoritesCount: number;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showFilters: boolean;
  onFiltersToggle: () => void;
  activeFiltersCount: number;
}

export function SwatchBookSearchControls({
  searchValue,
  onSearchChange,
  layoutMode,
  onLayoutModeChange,
  showFavoritesOnly,
  onFavoritesToggle,
  favoritesCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFilters,
  onFiltersToggle,
  activeFiltersCount
}: SwatchBookSearchControlsProps) {
  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name': return 'Name A-Z';
      case 'price_low': return 'Price: Low to High';
      case 'price_high': return 'Price: High to Low';
      case 'lrv_low': return 'LRV: Dark to Light';
      case 'lrv_high': return 'LRV: Light to Dark';
      case 'newest': return 'Newest First';
      case 'popular': return 'Most Popular';
      default: return 'Name A-Z';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search swatches by name, brand, or tags..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Layout Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="layout-mode" className="text-sm whitespace-nowrap">Layout:</Label>
          <div className="flex items-center border rounded-md">
            <Button
              variant={layoutMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onLayoutModeChange('compact')}
              className="rounded-r-none border-r"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Compact</span>
            </Button>
            <Button
              variant={layoutMode === 'detailed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onLayoutModeChange('detailed')}
              className="rounded-l-none"
            >
              <Rows3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Detailed</span>
            </Button>
          </div>
        </div>

        {/* Favorites Toggle */}
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={onFavoritesToggle}
          className="flex items-center space-x-1"
        >
          <Heart className={cn('h-4 w-4', showFavoritesOnly && 'fill-current')} />
          <span className="hidden sm:inline">Favorites</span>
          {favoritesCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {favoritesCount}
            </Badge>
          )}
        </Button>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{getSortLabel(sortBy)}</span>
              <span className="sm:hidden">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortChange('name')}>
              Name A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('price_low')}>
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('price_high')}>
              Price: High to Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('lrv_low')}>
              LRV: Dark to Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('lrv_high')}>
              LRV: Light to Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('newest')}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('popular')}>
              Most Popular
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode */}
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Toggle */}
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={onFiltersToggle}
          className="lg:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}
