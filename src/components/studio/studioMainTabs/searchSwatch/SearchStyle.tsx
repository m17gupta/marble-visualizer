import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TextShimmer } from "@/components/core";
import { setFilterSwatchStyle } from "@/redux/slices/swatch/FilterSwatchSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { StyleModel } from "@/models/swatchBook/styleModel/StyleModel";

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

const SearchStyle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { style, isFetchingStyle, filterSwatch } = useSelector(
    (state: RootState) => state.filterSwatch
  );

  const [selectedStyles, setSelectedStyles] = useState<number[]>([]);
  const [openCard, setOpenCard] = useState<null | "style">("style"); // open by default

  const toggleCard = (card: "style") =>
    setOpenCard((prev) => (prev === card ? null : card));

  const handleStyleSelection = (s: StyleModel) => {
    dispatch(setFilterSwatchStyle(s));
    // local reflect (redux already keeps truth, this makes UI snappy)
    setSelectedStyles((prev) =>
      prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
    );
  };

  // keep local selection synced with redux
  useEffect(() => {
    if (filterSwatch?.style?.length) {
      setSelectedStyles(filterSwatch.style.map((s) => s.id));
    } else {
      setSelectedStyles([]);
    }
  }, [filterSwatch]);

  /* ------- auto-height animation (no fixed max-h) ------- */
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  const recalcHeight = () => {
    if (contentRef.current) setPanelHeight(contentRef.current.scrollHeight);
  };

  useEffect(() => {
    recalcHeight();
  }, [style, selectedStyles, openCard]);

  useEffect(() => {
    const onResize = () => recalcHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Header Card (click to open) */}
      <Card
        role="button"
        onClick={() => toggleCard("style")}
        className={`rounded-xl border shadow-none transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
          openCard === "style" ? "border-purple-500" : "border-gray-200 hover:shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between p-3">
          <div>
            <div className="text-sm font-medium leading-none">Style</div>
            <div className="text-sm text-muted-foreground mt-1">
              {selectedStyles.length} selected
            </div>
          </div>
          {openCard === "style" ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground mt-0.5" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground mt-0.5" />
          )}
        </div>
      </Card>

      {/* Collapsible content panel directly UNDER the card */}
      <div
        style={{ height: openCard === "style" ? panelHeight : 0 }}
        className="overflow-hidden transition-[height,opacity] duration-300"
      >
        {openCard === "style" && (
          <div
            ref={contentRef}
            className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex flex-wrap gap-2">
              {isFetchingStyle ? (
                <TextShimmer className="font-mono text-sm" duration={1}>
                  Loading styles...
                </TextShimmer>
              ) : style && style.length > 0 ? (
                style.map((s) => (
                  <Chip
                    key={s.id}
                    className={`cursor-pointer transition-colors ${
                      selectedStyles.includes(s.id)
                        ? "border-blue-600 bg-blue-100 text-blue-800"
                        : "border-blue-400 text-blue-700 hover:bg-blue-50"
                    }`}
                    onClick={() => handleStyleSelection(s)}
                  >
                    {s.title}
                  </Chip>
                ))
              ) : (
                <div className="text-xs text-gray-500">No styles available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStyle;
