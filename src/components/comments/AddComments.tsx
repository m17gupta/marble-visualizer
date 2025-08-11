import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Check, CheckCircle, Trash, X, User, XCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { CommentModel, JobCommentModel } from '@/models/commentsModel/CommentModel'
import { addJobComment } from '@/redux/slices/comments/JobComments'
import { cn } from '@/lib/utils'

type Props = {
  x: number;
  y: number;
  segmentName?: string;
  onClose?: () => void;
}
const AddComments: React.FC<Props> = ({ x, y, segmentName, onClose }) => {
     const dispatch = useDispatch<AppDispatch>();
  
  const [isExpanded, setIsExpanded] = useState(true);
    const [localMessage, setLocalMessage] = useState("")

     const { profile } = useSelector((state: RootState) => state.userProfile);

      const {currentProject} = useSelector((state: RootState) => state.projects);

  const {list:jobList} = useSelector((state: RootState) => state.jobs);

  const {user} = useSelector((state: RootState) => state.auth);

  const {allSegments} = useSelector((state: RootState) => state.segments);
  const handleMessageChange = (value: string) => {
    setLocalMessage(value)
  }

  const handleAvatarClick = () => {
    setIsExpanded(!isExpanded);
  }


  const handleSaveComment = async () => {
    // Fix the condition logic and null checks
    const segId= allSegments.find(seg => seg.short_title === segmentName)?.id;
    if (!currentProject || !currentProject.id || !jobList[0]?.id || !segmentName || !localMessage.trim() || !segId) {
      console.error("Missing required data to save comment:", {
        projectId: currentProject?.id,
        jobId: jobList[0]?.id,
        segmentName,
        message: localMessage
      });
      return; // Stop saving if data is missing
    }

    try {
      // Logic to save the comment
      const message: CommentModel = {
        userId: user?.id || '',
        name: profile?.full_name || 'Anonymous',
        commentText: localMessage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const newComment: JobCommentModel = {
       
        project_id: currentProject.id,
        job_id: jobList[0].id,
        segment_id: segId,
        segment_name: segmentName,
        position:[x, y],
        status:"pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        comments: JSON.stringify([message]), // Store as JSON string
      };

      // Dispatch the action to save the comment
      await dispatch(addJobComment(newComment));
      
      // Clear the message and close the form
      setLocalMessage("");
      setIsExpanded(false);
      onClose?.();
      
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  }

  return (
   <>
    {/* Expanded Comment Form */}
      {isExpanded && (
        <Card
          className="absolute shadow-lg pointer-events-auto z-50 w-80"
          style={{
            left: x + 30,
            top: y - 10,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b">
              <span className="font-medium text-sm">{segmentName}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comment Input */}
            <div className="pt-4">
              <Textarea
                className="min-h-[100px] resize-none"
                placeholder="Add your comment..."
                value={localMessage}
                onChange={(e) => handleMessageChange(e.target.value)}
                rows={4}
              />

              {/* Comment Actions */}
              <div className="flex items-center justify-between pt-3 border-t mt-3">
                <div className="flex items-center gap-2">
                  {/* @ button with dropdown */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Tag User"
                    >
                      @
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      "bg-accent text-accent-foreground"
                    )}
                    aria-label="Add Person"
                  >
                    <User className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setLocalMessage("")}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="h-8 px-4"
                onClick={handleSaveComment}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
   </>
  )
}

export default AddComments