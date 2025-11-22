import { RootState } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { DemoMasterModel } from "@/models/demoModel/DemoMaterArrayModel";
import { setSelectedDemoMasterItem } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";

interface CategoryButtonsProps {
  variant?: "collapsed" | "expanded";
}

const ShowSegments = ({ variant = "expanded" }: CategoryButtonsProps) => {
  const dispatch = useDispatch();
  const { demoMasterArray, selectedDemoMasterItem } = useSelector(
    (state: RootState) => state.demoMasterArray
  );

  const [category, setCategory] = useState<string>("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && demoMasterArray?.length) {
      const first = demoMasterArray[0];
      setCategory(first.name ?? "");
      dispatch(setSelectedDemoMasterItem(first));
      initialized.current = true;
    } else if (selectedDemoMasterItem) {
      setCategory(selectedDemoMasterItem.name ?? "");
    }
  }, [demoMasterArray, selectedDemoMasterItem, dispatch]);

  const handleDemoSegments = (item: DemoMasterModel) => {
    setCategory(item.name ?? "");
    dispatch(setSelectedDemoMasterItem(item));
  };

  if (!demoMasterArray || demoMasterArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-gray-500 text-sm font-medium">No segments found</div>
      </div>
    );
  }

  const isCollapsed = variant === "collapsed";

  return (
    <div className="flex flex-wrap gap-3">
      {demoMasterArray.map((item) => {
        const isActive = category === (item.name ?? "");

        return (
          <Button
            key={item.name}
            type="button"
            variant="outline"
            aria-pressed={isActive}
            onClick={() => handleDemoSegments(item)}
            className={[
              // base pill
              "h-12 rounded-lg border bg-white px-4",
              "flex items-center justify-start gap-3",
              "text-sm font-medium text-gray-900",
              "transition-all duration-150",
              "hover:bg-gray-50 hover:shadow-sm",
              "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
              // active state like screenshot
              isActive
                ? "bg-gray-100 border-gray-400 shadow-sm"
                : "border-gray-300",
              // collapsed sizing
              isCollapsed ? "h-10 px-3 text-[13px]" : "",
            ].join(" ")}
          >
            {/* left icon / check */}
            {isActive ? (
              <div
                className={[
                  "grid place-items-center rounded-full",
                  "bg-gray-600 text-white",
                  isCollapsed ? "h-7 w-7" : "h-8 w-8",
                ].join(" ")}
              >
                {/* checkmark */}
                <svg
                  viewBox="0 0 24 24"
                  className={isCollapsed ? "h-4 w-4" : "h-5 w-5"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            ) : item.icon ? (
              <img
                src={item.icon}
                alt={item.name || "Segment Icon"}
                className={[
                  "object-contain",
                  isCollapsed ? "h-5 w-5" : "h-6 w-6",
                ].join(" ")}
              />
            ) : (
              <div
                className={[
                  "rounded-sm bg-gray-300",
                  isCollapsed ? "h-5 w-5" : "h-6 w-6",
                ].join(" ")}
              />
            )}

            {/* label */}
            <span className="whitespace-nowrap">{item.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ShowSegments;
