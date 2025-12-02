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
    <div className="flex flex-wrap gap-3 px-1">
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
              "h-11 rounded-lg border bg-white",
              "flex items-center gap-3 justify-start",
              "text-sm font-medium text-gray-900",
              "transition-all duration-150",
              "hover:bg-gray-50 hover:shadow-sm",
              "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
              // mobile responsive fix
              "min-w-[00px] max-w-[30px] sm:min-w-[30px] sm:max-w-max",
              "px-0 sm:px-4",

              // active style
              isActive
                ? "bg-gray-100 border-gray-400 shadow-sm"
                : "border-gray-300",

              // collapsed option
              isCollapsed ? "h-10 px-3 text-[13px]" : ""
            ].join(" ")}
          >
            {/* Icon / Checkmark */}
            {isActive ? (
              <div
                className={[
                  "grid place-items-center rounded-full shrink-0",
                  "bg-gray-600 text-white",
                  isCollapsed ? "h-5 w-5" : "h-6 w-6",
                ].join(" ")}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={isCollapsed ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}
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
                  "object-contain shrink-0",
                  isCollapsed ? "h-5 w-5" : "h-6 w-6",
                ].join(" ")}
              />
            ) : (
              <div
                className={[
                  "rounded-sm bg-gray-300 shrink-0",
                  isCollapsed ? "h-5 w-5" : "h-6 w-6",
                ].join(" ")}
              />
            )}

            {/* Label with truncate for mobile */}
            <span className="whitespace-nowrap truncate max-w-[70px] sm:max-w-full">
              {item.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default ShowSegments;
