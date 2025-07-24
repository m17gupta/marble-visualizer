import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { setFilters, setPage } from "@/redux/slices/swatchSlice";
import { useEffect, useState } from "react";

export function SwatchBookSearch() {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.swatches);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setFilters({ search: search }));
      dispatch(setPage(1));
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search swatches by name, brand, or tags..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-background "
        />
      </div>
    </div>
  );
}
