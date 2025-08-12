
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Plus } from 'lucide-react'
import { CommentModel } from '@/models/commentsModel/CommentModel'

type CommentListsProps = {
  replies: CommentModel[];
  commentId: string;
   onCommentHover: (id: string) => void;
  // onReplyComment?: (comment: CommentModel) => void;
}
const CommentListItem: React.FC<CommentListsProps> = ({ 
  replies,
  commentId,
  onCommentHover

}) => { 
  const createdAtDate = replies[0].created_at ? new Date(replies[0].created_at) : null;


;

  const handleTargetComment = () => {
    onCommentHover(commentId);
  };
  return (
    <Card className="w-full relative mb-4"
    key={commentId}
    >
      <CardContent className="p-4">
        <div 
          className="w-full relative"
          onClick={handleTargetComment}
        >
          {/* User Avatar and Info Section */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-10 w-10 mb-3">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                  {replies[0].name?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-sm text-foreground truncate">
                  {replies[0].name}
                </p>
              </div>
              
              <span className="text-muted-foreground text-xs">
                {createdAtDate
                  ? createdAtDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) + " at " + createdAtDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : "Unknown Date"}
              </span>
            </div>

            {/* Check Icon */}
            <div className="absolute top-2 right-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>

          {/* Comment Content Section */}
          <div className="flex flex-col items-start pl-2">
            <div 
              className="text-wrap cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              
            >
              {/* Reply Count Badge */}
              <div className="flex items-center space-x-2 mb-2">
                {replies.length !== 1 ? (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>{replies.length - 1}</span>
                    <Plus className="h-3 w-3" />
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {replies.length}
                  </Badge>
                )}
              </div>
              
              {/* Comment Message */}
              <h5 className="text-sm font-medium text-foreground leading-relaxed">
                {replies[0] .commentText}
              </h5>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentListItem;