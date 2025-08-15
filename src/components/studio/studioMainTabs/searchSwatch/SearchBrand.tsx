import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TextShimmer } from "@/components/core";
import { BrandModel } from "@/models/swatchBook/brand/BrandModel";
import { fetchAllStyles, setFilterSwatchBrand } from "@/redux/slices/swatch/FilterSwatchSlice";
import { AppDispatch, RootState } from "@/redux/store";

/* tiny chip */
const Chip: React.FC<
  { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>
> = ({ children, className = "", ...rest }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full border text-sm leading-none ${className}`}
    {...rest}
  >
    {children}
  </span>
);

const SearchBrand: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { brand, isFetchingBrand, filterSwatch } = useSelector(
    (state: RootState) => state.filterSwatch
  );

  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [openCard, setOpenCard] = useState<null | "brand">(null);

  const toggleCard = (card: "brand") =>
    setOpenCard((prev) => (prev === card ? null : card));

  const handleBrandSelection = async (b: BrandModel) => {
    dispatch(setFilterSwatchBrand(b));
    await dispatch(fetchAllStyles(b.id));
  };

  // keep local selection synced with redux
  useEffect(() => {
    if (filterSwatch?.brand?.length) {
      setSelectedBrands(filterSwatch.brand.map((b) => b.id));
    } else {
      setSelectedBrands([]);
    }
  }, [filterSwatch]);

  return (
    <div className="flex flex-col gap-3">
      {/* Header Card (click to open) */}
      <Card
        role="button"
        onClick={() => toggleCard("brand")}
        className={`rounded-xl border shadow-none transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
          openCard === "brand" ? "border-purple-500" : "border-gray-200 hover:shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between p-3">
          <div>
            <div className="text-sm font-medium leading-none">Brand</div>
            <div className="text-sm text-muted-foreground mt-1">
              {selectedBrands.length} selected
            </div>
          </div>
          {openCard === "brand" ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground mt-0.5" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground mt-0.5" />
          )}
        </div>
      </Card>

      {/* Collapsible content panel directly UNDER the card */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          openCard === "brand" ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {openCard === "brand" && (
          <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex flex-wrap gap-2">
              {isFetchingBrand ? (
                <TextShimmer className="font-mono text-sm" duration={1}>
                  Loading brands...
                </TextShimmer>
              ) : brand && brand.length > 0 ? (
                brand.map((b) => (
                  <Chip
                    key={b.id}
                    className={`cursor-pointer transition-colors ${
                      selectedBrands.includes(b.id)
                        ? "border-blue-600 bg-blue-100 text-blue-800"
                        : "border-blue-400 text-blue-700 hover:bg-blue-50"
                    }`}
                    onClick={() => handleBrandSelection(b)}
                  >
                    {b.title}
                  </Chip>
                ))
              ) : (
                <div className="text-xs text-gray-500">No brands available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBrand;
