import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaCompress, FaDownload, FaExpand } from "react-icons/fa";
import { MdClose, MdOutlineFileDownload } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RiFullscreenFill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";

type CompareHoverHeaderProps = {
  onBack?: () => void;
  onClose?: () => void;
  /** Element to toggle fullscreen on (pass the same ref you use in CompareSlider) */
  containerRef?: React.RefObject<HTMLElement>;
  /** Optional: external like state if you want to control it from Redux/parent */
  likedProp?: boolean;
  onLikeChange?: (liked: boolean) => void;
};

const CompareHoverHeader: React.FC<CompareHoverHeaderProps> = ({
  onBack,
  onClose,
  containerRef,
  likedProp,
  onLikeChange,
}) => {
  const { currentGenAiImage } = useSelector((s: RootState) => s.genAi);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [likedLocal, setLikedLocal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const liked = likedProp ?? likedLocal;

  const setLiked = (val: boolean) => {
    if (likedProp === undefined) setLikedLocal(val);
    onLikeChange?.(val);
  };

  const handleBack = () => {
    setActiveAction("back");
    onBack?.();
  };

  const handleLikeToggle = () => {
    setActiveAction("like");
    setLiked(!liked);
  };

  const handleDownload = () => {
    setActiveAction("download");
    // mirrors CompareSlider: download the AFTER image
    const url = currentGenAiImage?.output_image;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "renovated-home.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const toggleFullscreen = () => {
    setActiveAction("fullscreen");
    const target = containerRef?.current ?? document.documentElement;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleClose = () => {
    setActiveAction("close");
    onClose?.();
  };

  // shared classes
  const hoverBtn = (isActive: boolean) =>
    `group relative flex items-center justify-start w-10 hover:w-auto transition-all duration-300 overflow-hidden px-2
     ${isActive ? "bg-blue-100 text-blue-600 border-blue-400" : ""}`;

  const label =
    "ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200";

  return (
    <Card>
      <CardContent className="py-3 pt-1.6 px-4">
        <div className="flex gap-3 align-center justify-between">
          {/* Back */}
          <div>
            <Button
              variant="outline"
              size="sm"
              className={hoverBtn(activeAction === "back")}
              onClick={handleBack}
              aria-label="Back"
              title="Back">
              <IoArrowBackSharp className="h-5 w-5 shrink-0" />
              <span className={label}>Back</span>
            </Button>
          </div>

          <div className="flex gap-4">
            {/* Like / Unlike */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLikeToggle}
              className={hoverBtn(activeAction === "like")}
              aria-label={liked ? "Unlike" : "Like"}
              title={liked ? "Unlike" : "Like"}>
              {liked ? (
                <BiSolidLike className="h-5 w-5 shrink-0 fill-blue-600" />
              ) : (
                <BiLike className="h-5 w-5 shrink-0" />
              )}
              <span className={label}>{liked ? "Unlike" : "Like"}</span>
            </Button>

            {/* Download (AFTER image) */}
            <Button
              variant="outline"
              size="sm"
              className={hoverBtn(activeAction === "download")}
              onClick={handleDownload}
              aria-label="Download"
              title="Download"
              disabled={!currentGenAiImage?.output_image}>
              <MdOutlineFileDownload
                className={`h-5 w-5 shrink-0 ${
                  activeAction === "download" ? "fill-blue-600" : ""
                }`}
              />
              <span className={label}>Download</span>
            </Button>

            {/* Fullscreen */}
            <Button
              variant="outline"
              size="sm"
              className={hoverBtn(activeAction === "fullscreen")}
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              title="Fullscreen">
              {isFullscreen ? (
                <RiFullscreenFill
                  className={`h-5 w-5 shrink-0 ${
                    activeAction === "fullscreen" ? "fill-blue-600" : ""
                  }`}
                />
              ) : (
                <RiFullscreenFill
                  className={`h-5 w-5 shrink-0 ${
                    activeAction === "fullscreen" ? "fill-blue-600" : ""
                  }`}
                />
              )}
              <span className={label}>
                {isFullscreen ? "Exit Fullscreen" : "Full Screen"}
              </span>
            </Button>

            {/* Close */}
            <Button
              variant="outline"
              size="sm"
              className={hoverBtn(activeAction === "close")}
              onClick={handleClose}
              aria-label="Close"
              title="Close">
              <MdClose
                className={`h-5 w-5 shrink-0 ${
                  activeAction === "close" ? "fill-blue-600" : ""
                }`}
              />
              <span className={label}>Close</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompareHoverHeader;
