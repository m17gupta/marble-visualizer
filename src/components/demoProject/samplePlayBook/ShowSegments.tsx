import { RootState } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { DemoMasterModel } from "@/models/demoModel/DemoMaterArrayModel";
import { setSelectedDemoMasterItem } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";

interface CategoryButtonsProps {
  variant?: "collapsed" | "expanded";
}

// Skeleton shimmer for sidebar
const SidebarShimmer = () => (
  <div className="p-3">
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-10 w-24 bg-green-200 rounded" />
      <div className="h-8 w-20 bg-green-100 rounded" />
      <div className="h-8 w-20 bg-green-100 rounded" />
      <div className="h-8 w-20 bg-green-100 rounded" />
      <div className="h-32 w-full bg-green-50 rounded" />
      <div className="h-32 w-full bg-green-50 rounded" />
    </div>
  </div>
);

const ShowSegments = ({ variant = "expanded" }: CategoryButtonsProps) => {
  const dispatch = useDispatch();
  const { demoMasterArray, selectedDemoMasterItem } = useSelector((state: RootState) => state.demoMasterArray);
  const [category, setCategory] = useState<string>("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && demoMasterArray?.length) {
      const first = demoMasterArray[0];
      setCategory(first.name ?? "");
      dispatch(setSelectedDemoMasterItem(first));
      initialized.current = true;
    }else{
    if(selectedDemoMasterItem){
        setCategory(selectedDemoMasterItem.name ?? "");
    }}
  }, [demoMasterArray, selectedDemoMasterItem, dispatch]);

  const handleDemoSegments = (item: DemoMasterModel) => {
    setCategory(item.name ?? "");
    dispatch(setSelectedDemoMasterItem(item));
  };

  if (!demoMasterArray || demoMasterArray.length === 0) {
    return (
      <div >
        <SidebarShimmer />
      </div>
    );
  }

  return (
    <>
      {demoMasterArray.map((item) => {
        const isActive = category === (item.name ?? "");
        const seg = item.color_code || "#0ea5e9";

        const btnBase =
          "grid place-items-center rounded-xl border bg-white transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 h-14 w-14 p-0";
        const btnStyle = (isActive
          ? {
              backgroundColor: `${seg}20`,
              borderColor: seg,
              borderWidth: 1,
              color: seg,
              // @ts-ignore
              "--tw-ring-color": seg,
            }
          : { borderColor: "rgba(0,0,0,0.08)", color: "#111827" }) as React.CSSProperties;

        return (
          <div key={item.name} className="text-center">
            <Button
              type="button"
              variant="outline"
              aria-pressed={isActive}
              className={btnBase}
              style={btnStyle}
              onClick={() => handleDemoSegments(item)}
            >
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={item.name || "Segment Icon"}
                  className="h-6 w-6 object-contain transition-transform"
             
                />
              ) : (
                <div className="h-5 w-5 bg-gray-300 rounded" />
              )}
            </Button>

            <h6
              className={`mt-1 text-[12px] font-medium transition-colors ${
                isActive ? "text-current" : "text-gray-500"
              }`}
              style={isActive ? { color: seg } : undefined}
            >
              {item.name}
            </h6>
          </div>
        );
      })}
    </>
  );
};

export default ShowSegments;
