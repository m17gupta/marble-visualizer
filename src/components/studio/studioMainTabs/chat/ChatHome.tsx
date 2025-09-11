'use client';

import React, { useEffect, useState } from "react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Keyboard, Mousewheel } from "swiper/modules";

/** Swiper CSS */
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

type Pack = { id: number; title: string; credits: number; price: string };

/* ---------------- Reusable HoverCard + Swiper (autoplay on open) ---------------- */
function HoverCardWithSwiper({
  triggerLabel = "Buy More Credits",
  items,
}: {
  triggerLabel?: string;
  items: Pack[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={80} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          className="pointer-events-auto px-3 py-1 border border-gray-300 bg-white text-black text-xs font-semibold rounded-full hover:bg-gray-50"
        >
          {triggerLabel}
        </button>
      </HoverCardTrigger>

      {/* Open upward + high z-index so it's visible above sticky bars */}
      <HoverCardContent
        side="top"
        align="start"
        className="z-[1000] w-[420px] p-3"
      >
        {open && (
          <Swiper
            modules={[FreeMode, Mousewheel, Keyboard, Autoplay]}
            slidesPerView="auto"
            spaceBetween={12}
            freeMode={{ enabled: true, momentum: true }}
            mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 0.7 }}
            keyboard={{ enabled: true }}
            grabCursor
            autoplay={{ delay: 1600, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="!px-1"
          >
            {items.map((p) => (
              <SwiperSlide key={p.id} className="!w-[180px]">
                <div className="w-full rounded-2xl border border-gray-200 p-3 text-left hover:shadow-md transition bg-white">
                  <div className="text-[10px] uppercase tracking-wide text-gray-500">{p.title}</div>
                  <div className="mt-1 text-lg font-semibold">{p.credits} credits</div>
                  <div className="mt-2 text-sm">{p.price}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </HoverCardContent>
    </HoverCard>
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

  // update loading
  useEffect(() => {
    setIsLoading(!!isGenLoading);
  }, [isGenLoading]);

  // sync prompt from store
  useEffect(() => {
    if (genAiRequests?.prompt?.[0]) {
      setInputPrompt(genAiRequests.prompt[0]);
    } else {
      setInputPrompt("");
    }
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
    try {
      dispatch(submitGenAiRequest(genAiRequests));
    } catch (error) {
      toast.error("Error generating AI image: " + (error as Error).message);
    }
  };

  const handleDeletePalletImage = (imageName?: string) => {
    if (imageName === "palette") dispatch(resetPaletteImage());
  };
  const handleDeleteInspirationImage = (imageName?: string) => {
    if (imageName === "inspiration") dispatch(resetInspirationImage());
  };

  // gradient border styles
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

  // credit packs
  const packsA: Pack[] = [
    { id: 1, title: "Starter", credits: 100, price: "$5" },
    { id: 2, title: "Basic", credits: 250, price: "$10" },
    { id: 3, title: "Pro", credits: 600, price: "$20" },
    { id: 4, title: "Studio", credits: 1200, price: "$35" },
    { id: 5, title: "Agency", credits: 3000, price: "$80" },
  ];
  const packsB: Pack[] = [
    { id: 1, title: "Lite", credits: 50, price: "$3" },
    { id: 2, title: "Plus", credits: 400, price: "$25" },
    { id: 3, title: "Max", credits: 2000, price: "$120" },
  ];
  const packsC: Pack[] = [
    { id: 1, title: "Trial", credits: 30, price: "$1" },
    { id: 2, title: "Growth", credits: 800, price: "$45" },
    { id: 3, title: "Scale", credits: 5000, price: "$199" },
  ];

  // RED-BOX pill slider content
  const creditOptions: { label: string; items: Pack[] }[] = [
    { label: "Buy More Credits", items: packsA },
    { label: "Buy More Credits", items: packsB },
    { label: "Buy More Credits", items: packsC },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white overflow-y-auto max-h-[65vh] sm:max-h-[68vh]">
        {/* ===== Top Content ===== */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 max-w-md mx-auto bg-white">
            <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2 p-4">
              <span>187/250 Designs Left</span>
              <button className="px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 text-xs font-semibold">
                Buy More Credits
              </button>
            </div>

            <div className="p-4 mb-10">
              <div className="flex gap-3">
                <div className="grid gap-2">
                  {/* palette image */}
                  {genAiRequests?.paletteUrl?.length ? (
                    <ImagePalletInspirational
                      url={genAiRequests.paletteUrl[0]}
                      name="palette"
                      onDeleteImage={handleDeletePalletImage}
                    />
                  ) : null}

                  {/* inspiration image */}
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

            {/* RED BOX: bulb + pill swiper */}
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

              <div className="flex-1 min-w-0">
                <Swiper
                  modules={[FreeMode, Mousewheel, Keyboard]}
                  slidesPerView="auto"
                  spaceBetween={8}
                  freeMode={{ enabled: true, momentum: true, momentumVelocityRatio: 0.9 }}
                  mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 0.7 }}
                  keyboard={{ enabled: true }}
                  grabCursor
                  // prevent Swiper from blocking simple hovers
                  // (usually not needed, but helps in some setups)
                  // @ts-ignore
                  touchStartPreventDefault={false}
                  className="!px-1"
                >
                  {creditOptions.map((opt, idx) => (
                    <SwiperSlide key={idx} className="!w-auto">
                      <div className="inline-block">
                        <HoverCardWithSwiper triggerLabel={opt.label} items={opt.items} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="gemini-input-wrapper">
              <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                {/* Textarea */}
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

                {/* Bottom Bar */}
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
