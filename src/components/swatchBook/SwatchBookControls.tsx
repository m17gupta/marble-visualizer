import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Grid3X3,
  List,
  ArrowUpDown,
  Heart,
  Filter,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";

type ViewMode = "grid" | "list";
type LayoutMode = "compact" | "detailed";
type SortOption =
  | "name"
  | "price_low"
  | "price_high"
  | "lrv_low"
  | "lrv_high"
  | "newest"
  | "popular";

interface SwatchBookControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  sortBy: SortOption;
  handleSort: (option: SortOption) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  getActiveFiltersCount: () => number;
}

export function SwatchBookControls({
  viewMode,
  setViewMode,
  layoutMode,
  setLayoutMode,
  sortBy,
  handleSort,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showFilters,
  setShowFilters,
  getActiveFiltersCount,
}: SwatchBookControlsProps) {
  const { favorites } = useSelector((state: RootState) => state.swatches);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "name":
        return "Name A-Z";
      case "price_low":
        return "Price: Low to High";
      case "price_high":
        return "Price: High to Low";
      case "lrv_low":
        return "LRV: Dark to Light";
      case "lrv_high":
        return "LRV: Light to Dark";
      case "newest":
        return "Newest First";
      case "popular":
        return "Most Popular";
      default:
        return "Name A-Z";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Layout Mode Toggle */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="layout-mode" className="text-sm whitespace-nowrap">
          Layout:
        </Label>
        <div className="flex items-center border rounded-md">
          <Button
            variant={layoutMode === "compact" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayoutMode("compact")}
            className="rounded-r-none border-r"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Compact</span>
          </Button>
          <Button
            variant={layoutMode === "detailed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayoutMode("detailed")}
            className="rounded-l-none"
          >
            <Rows3 className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Detailed</span>
          </Button>
        </div>
      </div>

      {/* Favorites Toggle */}
      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        size="sm"
        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        className="flex items-center space-x-1"
      >
        <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
        <span className="hidden sm:inline">Favorites</span>
        {favorites.length > 0 && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {favorites.length}
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
          <DropdownMenuItem onClick={() => handleSort("name")}>
            Name A-Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("price_low")}>
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("price_high")}>
            Price: High to Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("lrv_low")}>
            LRV: Dark to Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("lrv_high")}>
            LRV: Light to Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("newest")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("popular")}>
            Most Popular
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode */}
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className="rounded-r-none"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="rounded-l-none"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Toggle */}
      <Button
        variant={showFilters ? "default" : "outline"}
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>
    </div>
  );
}
