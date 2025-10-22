import { setIsSwatchDetailsOpen } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";
import { AppDispatch, RootState } from "@/redux/store";
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import SelectedSwatchList from "./SelectedSwatchList";
import AllSwatchPanel from "./AllSwatchPanel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";


function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

const SelectedSwatchHome: React.FC = () => {
  const isMobile = useIsMobile(); 
 // console.log("isMobile:", isMobile);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSwatchInfo, isSwatchDetailsOpen } = useSelector((state: RootState) => state.demoMasterArray);
 
  // separate open state for each container type
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
        dispatch(setIsSwatchDetailsOpen(false));
    }
  if (isMobile) {
    // Mobile: open as bottom sheet / offcanvas
    return (
      <>
        <div onClick={() => setOpen(true)}>
          <SelectedSwatchList />
        </div>

        <Sheet open={isSwatchDetailsOpen} 
        >
          <SheetContent
            side="bottom"
            className="mx-auto w-full max-w-[520px] rounded-t-2xl border p-3"
          >
            {/* small grab handle */}
            <div className="mx-auto mb-2 mt-1 h-1.5 w-14 rounded-full bg-zinc-300" />
            <AllSwatchPanel  />
          </SheetContent>
        </Sheet>
      </>
    );
  }else{
  // Desktop: open as popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <SelectedSwatchList />
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="w-auto border-none p-0 shadow-none"
      >
        <AllSwatchPanel
        onClose={()=> setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
  }


};

export default SelectedSwatchHome;