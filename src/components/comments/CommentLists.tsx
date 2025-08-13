import { RootState } from '@/redux/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CommentModel } from '@/models/commentsModel/CommentModel'
import CommentListItem from './CommentListItem'
import { setCurrentComments } from '@/redux/slices/comments/JobComments'





const CommentLists = () => {
    const { projectComments } = useSelector((state: RootState) => state.jobComments);

    const dispatch = useDispatch();
    const handleCommentHover = (id: string) => {
      const currentComment = projectComments.find(comment => comment.id === id);
      
      if (!currentComment) return;
      dispatch(setCurrentComments(currentComment));

    };

  

    return (
      <div className="space-y-4">
        {projectComments && projectComments.length > 0 && 
          projectComments.map((projectComment) => {
            const allComments = JSON.parse(projectComment.comments || '[]') as CommentModel[];
            
            return (
              <CommentListItem
                key={`${projectComment.id}`}
                replies={allComments}
                commentId={projectComment.id??""}
                onCommentHover={handleCommentHover}
              />
            )
           
          })
        }
        
        {(!projectComments || projectComments.length === 0) && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments available</p>
          </div>
        )}
      </div>
    );
}

export default CommentLists