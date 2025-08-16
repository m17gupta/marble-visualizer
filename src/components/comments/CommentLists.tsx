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
      <div className="space-y-4 bg-gray-50">
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
<div className="flex items-center justify-center min-h-screen">
  <div className="flex flex-col items-center justify-center py-10 px-6  rounded-2xl  border-gray-200 max-w-md w-full">
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><mask id="SVG4DmxDcsN"><path fill="#fff" fill-opacity="0" d="M5 15.5c1 1 2.5 2 4 2.5c-0.71 -0.24 -1.43 -0.59 -2.09 -1c-0.72 -0.45 -1.39 -0.98 -1.91 -1.5Z"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M5 15.5c1 1 2.5 2 4 2.5c-0.71 -0.24 -1.43 -0.59 -2.09 -1c-0.72 -0.45 -1.39 -0.98 -1.91 -1.5Z;M5 15.5c1 1 2.5 2 4 2.5c-2 2 -5 3 -7 3c2 -2 3 -3.5 3 -5.5Z"/><set fill="freeze" attributeName="fill-opacity" begin="0.6s" to="1"/></path><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="56" stroke-dashoffset="56" d="M7 16.82c-2.41 -1.25 -4 -3.39 -4 -5.82c0 -3.87 4.03 -7 9 -7c4.97 0 9 3.13 9 7c0 3.87 -4.03 7 -9 7c-1.85 0 -3.57 -0.43 -5 -1.18Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0"/></path><path stroke="#000" stroke-dasharray="28" stroke-dashoffset="28" d="M-1 11h26" transform="rotate(45 12 12)"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.4s" values="28;0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M-1 13h26" transform="rotate(45 12 12)"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.4s" values="28;0"/></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#SVG4DmxDcsN)"/></svg>

    <h3 className="text-lg font-semibold text-gray-800">No Comments Yet</h3>
    <p className="text-sm text-gray-500 mt-1 text-center">
      Be the first one to start the conversation and share your thoughts here.
    </p>

    <button className="mt-6 px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg shadow hover:bg-purple-700 transition">
      Add Comment
    </button>
  </div>
</div>


        )}
      </div>
    );
}

export default CommentLists