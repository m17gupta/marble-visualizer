import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { StyleSuggestions } from "@/models/projectModel/ProjectModel";
import { addPrompt } from "@/redux/slices/visualizerSlice/genAiSlice";

type Pack = { id: number; title: string; credits: number; price: string };

/* ---------- Popover that opens on HOVER (stable + arrow) ---------- */
function PopoverWithSwiperHover({
  triggerLabel = "Buy More Credits",
  items,
  onClick,
}: {
  triggerLabel?: string;
  items: Pack[];
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const overTrigger = useRef(false);
  const overContent = useRef(false);
  const closeTimer = useRef<number | null>(null);

  const enter = (who: "trigger" | "content") => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (who === "trigger") overTrigger.current = true;
    if (who === "content") overContent.current = true;
    setOpen(true);
  };

  const leave = (who: "trigger" | "content") => {
    if (who === "trigger") overTrigger.current = false;
    if (who === "content") overContent.current = false;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    // Close only when BOTH are left, with a small delay
    closeTimer.current = window.setTimeout(() => {
      if (!overTrigger.current && !overContent.current) setOpen(false);
    }, 140);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          className="noswipe swiper-no-swiping pointer-events-auto px-3 py-1 border border-gray-300 bg-white text-black text-xs font-semibold rounded-full hover:bg-gray-50"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          onMouseEnter={() => enter("trigger")}
          onFocus={() => enter("trigger")}
          onMouseLeave={() => leave("trigger")}
          onBlur={() => leave("trigger")}
        >
          {triggerLabel}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        avoidCollisions={false}
        className="z-[1100] w-[220px] p-3 rounded-xl border-b-0 bg-white shadow-md"
        onMouseEnter={() => enter("content")}
        onMouseLeave={() => leave("content")}
      >
        {/* Arrow */}
        <PopoverPrimitive.Arrow
          className="fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
          width={16}
          height={8}
        />

        <div className="space-y-2 text-sm">
          {items.map((pack) => (
            <div key={pack.id} className="rounded-lg px-2 py-1 text-gray-800">
              {pack.title}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
const SuggestedPrompt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const { id } = useParams();
  const suggestions = projects.find((d) => d.id == id)?.analysed_data
    ?.style_suggestions;
  const randomSuggestions = suggestions
    ? [...suggestions].sort(() => Math.random() - 0.5).slice(0, 3)
    : [];
  const [suggestedPrompt, setSuggestedPrompt] = useState<
    StyleSuggestions[] | null
  >(randomSuggestions);
  const packsA: Pack[] = [
    {
      id: 1,
      title:
        "Experiment with bold trim colors to highlight architectural features.",
      credits: 100,
      price: "$5",
    },
  ];
  const packsB: Pack[] = [
    {
      id: 1,
      title:
        "Experiment with bold trim colors to highlight architectural features.",
      credits: 50,
      price: "$3",
    },
  ];
  const packsC: Pack[] = [
    {
      id: 1,
      title:
        "Experiment with bold trim colors to highlight architectural features.",
      credits: 30,
      price: "$1",
    },
  ];
  const creditOptions: { label: string; items: Pack[] }[] = [
    { label: "Buy More Credits", items: packsA },
    { label: "Buy More Credits", items: packsB },
    { label: "Buy More Credits", items: packsC },
  ];

  
  const handleRandomPromptSelection = (prompt: string) => () => {
    if (prompt) {
      dispatch(addPrompt(prompt));
     // setShowActionButtons(false);
    }
  };
  return (
    <>
      <div className="flex-1 min-w-0">
        <Swiper
          modules={[FreeMode, Mousewheel, Keyboard]}
          slidesPerView="auto"
          spaceBetween={8}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumVelocityRatio: 0.9,
          }}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 0.7,
          }}
          keyboard={{ enabled: true }}
          grabCursor
          touchStartPreventDefault={false}
          simulateTouch={false}
          noSwiping
          noSwipingClass="noswipe"
          className="!px-1"
        >
          {suggestedPrompt &&
            suggestedPrompt.length > 0 &&
            suggestedPrompt.map((opt, idx) => (
              <SwiperSlide key={idx} className="!w-auto">
                <div className="inline-block">
                  <PopoverWithSwiperHover
                    triggerLabel={opt.title}
                    items={[
                      { id: 1, title: opt.prompt, credits: 1, price: "Free" },
                    ]}
                    onClick={handleRandomPromptSelection(opt.prompt)}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
};

export default SuggestedPrompt;
