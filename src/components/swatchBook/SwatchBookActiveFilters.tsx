import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/redux/store";

interface SwatchBookActiveFiltersProps {
  getActiveFiltersCount: () => number;
}

export function SwatchBookActiveFilters({
  getActiveFiltersCount,
}: SwatchBookActiveFiltersProps) {
  const { filters } = useSelector((state: RootState) => state.swatches);

  if (getActiveFiltersCount() === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex gap-2"
    >
      {filters.search && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Search: "{filters.search}"
        </Badge>
      )}
      {filters.category && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Category: {filters.category}
        </Badge>
      )}
      {filters.brand && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Brand: {filters.brand}
        </Badge>
      )}
      {filters.style && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Style: {filters.style}
        </Badge>
      )}
      {filters.finish && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Finish: {filters.finish}
        </Badge>
      )}
      {filters.coating_type && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Type: {filters.coating_type}
        </Badge>
      )}
      {filters.tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="bg-muted text-muted-foreground"
        >
          Tag: {tag}
        </Badge>
      ))}
      {filters.segment_types.map((type) => (
        <Badge
          key={type}
          variant="secondary"
          className="bg-muted text-muted-foreground"
        >
          Area: {type}
        </Badge>
      ))}
    </motion.div>
  );
}
