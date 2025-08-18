import React, { useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus } from "lucide-react";
import { CommentModel } from "@/models/commentsModel/CommentModel";

type CommentListItemProps = {
  replies: CommentModel[];
  commentId: string;
  /** Parent-controlled active id */
  activeCommentId: string | null;
  /** Click -> parent sets active id */
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

  const createdAtDate = useMemo(
    () => (root?.created_at ? new Date(root.created_at) : null),
    [root?.created_at]
  );

  const formattedDate =
    createdAtDate &&
    createdAtDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formattedTime =
    createdAtDate &&
    createdAtDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const handleActivate = () => {
    // single-select: already active ho to kuch mat karo (no toggle-off)
    if (!isActive) onSelect(commentId);
  };

  return (
    <Card
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
      className={`relative m-0 mb-[0px] w-full cursor-pointer rounded-sm transition-all 
        ${isActive
          ? "bg-blue-50/60 border border-blue-300 shadow-md ring-1 ring-blue-200"
          : "bg-white border border-gray-300 shadow-none hover:bg-gray-50 hover:shadow-md"
        }`}
      style={{ padding: 0, marginBottom: "0px" }}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-3xl transition-all hover:bg-gray-50
        ${isActive ? "bg-blue-500" : "bg-transparent"}`}
      />

      <CardContent className="p-4 ">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
              {root?.name?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {root?.name || "Anonymous"}
              </p>
              <CheckCircle
                className={`h-4 w-4 shrink-0 ${isActive ? "text-green-600" : "text-green-500"}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {createdAtDate ? `${formattedDate} at ${formattedTime}` : "Unknown Date"}
            </span>
          </div>
        </div>

        <div className="mt-3 pl-12 flex justify-between">
        

          <div
            className={`rounded-lg px-0 py-0 text-sm leading-relaxed
              ${isActive ? "shadow-none" : ""}`}
          >
            {root?.commentText || ""}
          </div>

  <div className="mb-2 flex items-center gap-2">
            {replies?.length > 1 ? (
              <Badge
                variant="secondary"
                className={`flex items-center gap-1 ${isActive ? "ring-1 ring-blue-200" : ""}`}
              >
                <span>{replies.length - 1}</span>
                <Plus className="h-3 w-3" />
              </Badge>
            ) : (
              <Badge variant="outline" className={isActive ? "ring-1 ring-blue-200" : ""}>
                {replies?.length ?? 0}
              </Badge>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default CommentListItem;
