import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CommentModel } from "@/models/commentsModel/CommentModel";
import CommentListItem from "./CommentListItem";
import { setCurrentComments } from "@/redux/slices/comments/JobComments";

const CommentLists = () => {
  const { projectComments } = useSelector((state: RootState) => state.jobComments);
  const dispatch = useDispatch();

  // SINGLE ACTIVE ID here
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    const currentComment = projectComments.find((c) => c.id === id);
    if (!currentComment) return;

    // set single active
    setActiveCommentId(id);

    // your existing redux action
    dispatch(setCurrentComments(currentComment));
  };

  const items = useMemo(() => projectComments ?? [], [projectComments]);

  return (
    <div className="space-y-3">
      
      {items.length > 0 &&
        items.map((projectComment) => {
          const allComments = JSON.parse(projectComment.comments || "[]") as CommentModel[];
          return (
            <CommentListItem
              key={projectComment.id}
              replies={allComments}
              commentId={projectComment.id ?? ""}
              activeCommentId={activeCommentId}
              onSelect={handleSelect}
            />
          );
        })}

      {items.length === 0 && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="Q1ze2frefVT4VGRHT flex w-full max-w-md flex-col items-center justify-center rounded-2xl border-gray-200 px-6 py-10">
            {/* ... your empty state content exactly as before ... */}
            <h3 className="text-lg font-semibold text-gray-800">No Comments Yet</h3>
            <p className="mt-1 text-center text-sm text-gray-500">
              Be the first one to start the conversation and share your thoughts here.
            </p>
            <button className="mt-6 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-purple-700">
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentLists;
