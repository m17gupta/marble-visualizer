import React, { useEffect, useState } from "react";
import CommentAvatar from "./CommentAvatar";
import AddComments from "./AddComments";
import OldCommentAvatar from "./OldCommentAvatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { CommentModel } from "@/models/commentsModel/CommentModel";
import { toast } from "sonner";
import {
  deleteJobComment,
  updateJobCommentReply,
} from "@/redux/slices/comments/JobComments";

type CommentHomeProps = {
  x: number;
  y: number;
  segmentName?: string;
};
const CommentHome = ({ x, y, segmentName }: CommentHomeProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isExpanded, setIsExpanded] = useState(true);

  const [mousePositionX, setMousePositionX] = useState(x);
  const [mousePositionY, setMousePositionY] = useState(y);

  const { list: jobList } = useSelector((state: RootState) => state.jobs);
  const handleClose = () => {
    setIsExpanded(false);
  };

  useEffect(() => {
    if (x !== mousePositionX || y !== mousePositionY) {
      setMousePositionX(x);
      setMousePositionY(y);
      setIsExpanded(true);
    }
    if (segmentName == "") {
      setIsExpanded(false);
    }
  }, [mousePositionX, mousePositionY, isExpanded, x, y]);

  const handleSaveComment = async (data: CommentModel[], commentId: string) => {
    if (!data || data.length === 0! || !commentId) {
      toast.error("No data to save");
      return;
    }

    try {
      await dispatch(
        updateJobCommentReply({
          commentId: commentId,
          reply: JSON.stringify(data),
        })
      );

      toast.success("Comment saved successfully");
    } catch (error) {
      console.error("Error saving comment:", error);
    }

    // Logic to save the comment
    // This could involve dispatching an action to update the Redux store
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) {
      toast.error("No comment ID provided for deletion");
      return;
    }
    try {
      await dispatch(deleteJobComment(commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCloseComment = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {isExpanded && (
        <CommentAvatar
          commentType="new"
          openReply={(data) => console.log("Open reply clicked", data)}
          x={x}
          y={y}
          segmentName={segmentName}
        />
      )}

      {isExpanded && (
        <AddComments
          x={x}
          y={y}
          segmentName={segmentName}
          onClose={handleClose}
        />
      )}

      <OldCommentAvatar
        onSave={(data, commentId) => handleSaveComment(data, commentId)}
        onDeleteComment={(commentId) => handleDeleteComment(commentId)}
        x={x}
        y={y}
        segmentName={segmentName}
      />
    </>
  );
};

export default CommentHome;
