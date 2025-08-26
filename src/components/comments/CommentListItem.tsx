import React, { useMemo } from "react";
import { motion } from "framer-motion"; // 1. Framer Motion ko import karein
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Plus } from "lucide-react";
import { CommentModel } from "@/models/commentsModel/CommentModel";

// 2. Card ka motion version banayein
const MotionCard = motion(Card);

type CommentListItemProps = {
  replies: CommentModel[];
  commentId: string;
  activeCommentId: string | null;
  onSelect: (id: string) => void;
};

const CommentListItem: React.FC<CommentListItemProps> = ({
  replies,
  commentId,
  activeCommentId,
  onSelect,
}) => {
  const root = replies?.[0];
  const isActive = activeCommentId === commentId;

  // Aapka date logic aacha hai, use waise hi rakha hai
  const createdAtDate = useMemo(
    () => (root?.created_at ? new Date(root.created_at) : null),
    [root?.created_at]
  );
  const formattedDate = createdAtDate?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const formattedTime = createdAtDate?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const handleActivate = () => {
    if (!isActive) onSelect(commentId);
  };

  return (
    // 3. MotionCard use karein aur animation props add karein
    <MotionCard
      key={commentId}
      role="button"
      tabIndex={0}
      aria-selected={isActive}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`relative w-full cursor-pointer overflow-hidden rounded-lg transition-colors duration-200 
        ${isActive
          ? "bg-blue-50 border-blue-500 shadow-md"
          : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
      style={{ padding: 0 }}
      layout // Smooth transitions ke liye
      whileHover={{ scale: 1.02 }} // Hover par animation
      whileTap={{ scale: 0.98 }} // Click par animation
    >
      <div
        className={`absolute left-0 top-0 h-full w-1.5 transition-colors
        ${isActive ? "bg-blue-600" : "bg-transparent"}`}
      />

      <CardContent className="p-3">
        {/* Upar ka hissa: Avatar, Naam, Timestamp, aur Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback>
                {root?.name?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="truncate text-sm font-bold text-gray-900">
                {root?.name || "Anonymous"}
              </p>
              <span className="text-xs text-gray-500">
                {createdAtDate ? `${formattedDate} at ${formattedTime}` : "Unknown Date"}
              </span>
            </div>
          </div>
          {root?.is_resolved && <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />}
        </div>

        {/* Neeche ka hissa: Message aur Number Badge */}
        <div className="mt-2 pl-12 flex items-end justify-between">
          <p className="text-sm text-gray-700">
            {root?.commentText || ""}
          </p>

          {/* 4. Badge ko naye design jaisa banane ke liye style kiya */}
          <div className="flex items-center justify-center h-6 w-6 rounded-md border bg-white text-xs font-semibold text-gray-600">
            {replies?.length ?? 0}
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default CommentListItem;