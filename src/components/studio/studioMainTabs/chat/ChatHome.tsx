'use client';

import React, { useEffect, useRef, useState } from "react";
import RequestMasterImage from "./RequestMasterImage";
import { useDispatch, useSelector } from "react-redux";
import {
  addPrompt,
  resetInspirationImage,
  resetPaletteImage,
  submitGenAiRequest,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import VoiceRecognition from "@/components/workSpace/projectWorkSpace/VoiceRecognition";
import { AppDispatch, RootState } from "@/redux/store";
import { updateIsGenLoading } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { toast } from "sonner";
import ProcessImage from "./ProcessImage";
import GalleryImage from "./GalleryImage";
import MaskImage from "./MaskImage";
import ChatPallet from "./ChatPallet";
import ImagePalletInspirational from "./ImagePalletInspirational";
import { TbBulb, TbBulbFilled } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import SuggestedPrompt from "./SuggestedPrompt";

type Pack = { id: number; title: string; credits: number; price: string };

/* ---------- Popover that opens on HOVER (stable + arrow) ---------- */
function PopoverWithSwiperHover({
  triggerLabel = "Buy More Credits",
  items,
}: {
  triggerLabel?: string;
  items: Pack[];
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
          onClick={(e) => e.stopPropagation()}
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
            <div
              key={pack.id}
              className="rounded-lg px-2 py-1 text-gray-800"
            >
              {pack.title}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Main Component ---------------- */
const ChatHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests: genAiRequests } = useSelector((state: RootState) => state.genAi);
  const { isGenLoading } = useSelector((state: RootState) => state.workspace);

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showActionButtons, setShowActionButton] = useState<boolean>(false);

  useEffect(() => { setIsLoading(!!isGenLoading); }, [isGenLoading]);

  useEffect(() => {
    if (genAiRequests?.prompt?.[0]) setInputPrompt(genAiRequests.prompt[0]);
    else setInputPrompt("");
  }, [genAiRequests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputPrompt(value);
    dispatch(addPrompt(value.trim() ? value : ""));
  };

  const handleGenerateAiImage = () => {
    if (!genAiRequests?.houseUrl?.length || !genAiRequests?.prompt?.length) {
      return toast.error("Please provide prompt before generating AI image.");
    }
    dispatch(updateIsGenLoading(true));
    try { dispatch(submitGenAiRequest(genAiRequests)); }
    catch (error) { toast.error("Error generating AI image: " + (error as Error).message); }
  };

  const handleDeletePalletImage = (imageName?: string) => {
    if (imageName === "palette") dispatch(resetPaletteImage());
  };
  const handleDeleteInspirationImage = (imageName?: string) => {
    if (imageName === "inspiration") dispatch(resetInspirationImage());
  };

  const animationStyles = `
    @keyframes swing-gradient {
      from { background-position: 0% 50%; }
      to { background-position: 100% 50%; }
    }
    .gemini-input-wrapper { position: relative; z-index: 1; border-radius: 0.8rem; }
    .gemini-input-wrapper::before {
      content: ''; position: absolute; inset: -2px; z-index: -1; border-radius: inherit;
      background: linear-gradient(90deg,#2563eb,#d946ef,#ab56ff,#d946ef,#2563eb);
      background-size: 400% 400%; opacity: 1; animation: swing-gradient 3s alternate ease-in-out infinite;
    }
  `;

  const packsA: Pack[] = [
    { id: 1, title: "Experiment with bold trim colors to highlight architectural features.", credits: 100, price: "$5" },
  ];
  const packsB: Pack[] = [
    { id: 1, title: "Experiment with bold trim colors to highlight architectural features.", credits: 50, price: "$3" },
  ];
  const packsC: Pack[] = [
    { id: 1, title: "Experiment with bold trim colors to highlight architectural features.", credits: 30, price: "$1" },
  ];


  return (
    <>
      <div className="min-h-screen flex flex-col bg-white overflow-y-auto max-h-[65vh] sm:max-h-[68vh]">
        <div className="flex-1">
          <div className="flex flex-col gap-4 max-w-md mx-auto bg-white">
            <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2 p-4">
              <span>187/250 Designs Left</span>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold">
                Buy More Credits
              </button>
            </div>

            <div className="p-4 mb-10">
              <div className="flex gap-3">
                <div className="grid gap-2">
                  {genAiRequests?.paletteUrl?.length ? (
                    <ImagePalletInspirational
                      url={genAiRequests.paletteUrl[0]}
                      name="palette"
                      onDeleteImage={handleDeletePalletImage}
                    />
                  ) : null}

                  {genAiRequests?.referenceImageUrl?.length ? (
                    <ImagePalletInspirational
                      url={genAiRequests.referenceImageUrl[0]}
                      name="inspiration"
                      onDeleteImage={handleDeleteInspirationImage}
                    />
                  ) : null}

                  <MaskImage />
                </div>

                <RequestMasterImage />
              </div>

              {genAiRequests?.prompt?.[0] && (
                <div
                  className="inline-block text-gray-600 text-sm px-3 py-1 rounded-xl border border-transparent mt-2"
                  style={{
                    backgroundClip: "padding-box, border-box",
                    backgroundImage:
                      "linear-gradient(#fff, #fff), linear-gradient(90deg, #9333ea, #3b82f6)",
                    backgroundOrigin: "border-box",
                  }}
                >
                  {genAiRequests.prompt[0]}
                </div>
              )}

              {isLoading && <ProcessImage />}
            </div>
          </div>
        </div>

        {/* ===== Bottom-Sticky Composer ===== */}
        <div className="sticky bottom-40 inset-x-0 bg-white/95 backdrop-blur border-t pb-safe">
          <div className="max-w-md mx-auto p-3">
            <style>{animationStyles}</style>

            <div className="flex items-center gap-2 mb-2 min-w-0">
              <button
                className="text-sm border border-gray-300 rounded-full bg-transparent flex items-center justify-center gap-1 px-1 py-1 focus:outline-none focus:ring-0 shrink-0"
                onClick={() => setShowActionButton((prev) => !prev)}
              >
                {showActionButtons ? (
                  <TbBulbFilled size={28} className="text-yellow-300 w-6 h-6" />
                ) : (
                  <TbBulb size={28} className="w-6 h-6" />
                )}
              </button>

             <SuggestedPrompt />
            </div>

            <div className="gemini-input-wrapper">
              <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                <div className="px-4 pt-3">
                  <textarea
                    rows={2}
                    value={inputPrompt}
                    className="w-full rounded-xl border-none p-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-0 resize-none"
                    placeholder="Type your prompt..."
                    spellCheck="false"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ChatPallet />
                    <GalleryImage />
                    <VoiceRecognition />
                  </div>

                  <button
                    className="px-4 py-1.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium transition"
                    onClick={handleGenerateAiImage}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};

export default ChatHome;
