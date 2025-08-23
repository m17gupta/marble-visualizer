import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CommentAvatar from './CommentAvatar';
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CommentModel } from '@/models/commentsModel/CommentModel';
import { Card, CardContent } from '@/components/ui/card'
import { Check, CheckCircle, Trash, X, User, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils';
import { setAddReplies } from '@/redux/slices/comments/JobComments';
import { set } from 'date-fns';
import AddComments from './AddComments';
import { DeleteComment } from './DeleteComment';

type Props = {
    onSave: (data: CommentModel[], commentId: string) => void
    onDeleteComment: (commentId: string) => void;
      x: number;
  y: number;
  segmentName?: string;
  onClose?: () => void;
}


const OldCommentAvatar = ({onSave, onDeleteComment}:Props) => {
    const { projectComments } = useSelector((state: RootState) => state.jobComments);
    const [segName, setSegtName] = React.useState<string | null>(null);
    const [localMessage, setLocalMessage] = React.useState<string>('');
    const { user } = useSelector((state: RootState) => state.auth);
    const { currentComments } = useSelector((state: RootState) => state.jobComments);
    const dispatch = useDispatch<AppDispatch>();


    // update current comment
    useEffect(() => {
        if(currentComments && currentComments.segment_name) {
            setSegtName(currentComments.segment_name);
           // setLocalMessage(currentComments.commentText);
        }
    },[currentComments])
    const handleOpenReply = (data: string) => {
        
        setSegtName(data);
        setLocalMessage(''); // Reset message when opening reply
    };

    const handleCloseComment = () => {
        setSegtName(null);
        setLocalMessage('');
    };

    const handleSaveComment = (previousData: CommentModel[], commentId: string) => {
        if (localMessage.trim()) {
           
            const data: CommentModel = {
                userId: user?.id || '',
                name: user?.name || 'Anonymous',
                commentText: localMessage,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const updatedComments: CommentModel[] = [...previousData, data];
           
            dispatch(setAddReplies(updatedComments)); 
            onSave(updatedComments, commentId);
            setSegtName(null);
            setLocalMessage('');
        }
    };

  

    const handleDeleteComment = (commentId: string) => {
        setSegtName(null);
        onDeleteComment(commentId);
    };

    const handleMarkAsResolved = () => {
    
        handleCloseComment();
    };

    const handleMessageChange = (value: string) => {
        setLocalMessage(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCloseComment();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
          //  handleSaveComment();
        }
    };

    return (
        <>
            {projectComments &&
                projectComments.length > 0 &&
                projectComments.map((comment, index) => {
                    // Extract position from comment data or use default
                    const position = comment.position || [100, 100]; // Default position if not available
                    const allComments = JSON.parse(comment.comments || '[]') as CommentModel[];
                   
                    return (
                        <div key={comment.id}>
                            <CommentAvatar
                                commentType="old"
                                x={position[0]}
                                y={position[1]}
                                segmentName={comment.segment_name}
                                openReply={handleOpenReply}
                            />

                            {segName === comment.segment_name &&
        
                                
                                        <div
                                            // className="absolute shadow-lg pointer-events-auto z-50 w-80"

                                            key={`${comment.id}-reply-${index}`}
                                        >
                                            <Card
                                                className="absolute shadow-lg pointer-events-auto z-50 w-80"
                                                style={{
                                                    left: position[0] + 30,
                                                    top: position[1] - 10,
                                                    transition: "all 0.3s ease-in-out",
                                                }}
                                            >
                                                <CardContent className="p-4">
                                                    {/* Header */}
                                                    <div className="flex items-center justify-between gap-3 pb-3 border-b">
                                                        <span className="font-medium text-sm">{comment.segment_name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={handleMarkAsResolved}
                                                                title="Mark as resolved"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>

                                                            {/* <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handleDeleteComment(comment.id ?? "")}
                                                                title="Delete comment">
                                                             <Trash className="h-4 w-4"/>   
                                                            </Button> */}

                                          <DeleteComment
                                            onConfirm={() => handleDeleteComment(comment.id ?? "")}
      itemName={`Comment${comment.segment_name ? ` (${comment.segment_name})` : ""}`}
      size="sm"
                                          />

                                                         
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={handleCloseComment}
                                                                title="Close"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Existing Comment Display */}

                                                    { allComments && allComments.length > 0 && allComments.map((reply: CommentModel, index: number) => {
                                                        return (
                                                            <div key={`${index}`} className="py-3 border-b">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                                                        {reply.name ? reply.name.charAt(0).toUpperCase() : 'A'}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="font-medium text-sm">{reply.name}</span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {new Date(reply.created_at).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-700">{reply.commentText}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );  
                                                    })}
                                                    {/* <div className="py-3 border-b">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                                                {reply?.name ? reply.name.charAt(0).toUpperCase() : 'A'}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-medium text-sm">{reply.name}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(reply.created_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-700">{reply.commentText}</p>
                                                            </div>
                                                        </div>
                                                    </div> */}

                                                    {/* Comment Input */}
                                                    <div className="pt-4">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Reply to comment:</label>
                                                        <Textarea
                                                            className="min-h-[100px] resize-none"
                                                            placeholder="Add your reply..."
                                                            value={localMessage}
                                                            onChange={(e) => handleMessageChange(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            rows={4}
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Press Ctrl+Enter to save, Esc to close
                                                        </p>

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
                                                                    title="Clear message"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <Button
                                                                className="h-8 px-4"
                                                                onClick={() => handleSaveComment(allComments, comment.id ?? "")}
                                                                disabled={!localMessage.trim()}
                                                                title="Save comment"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    
                                }
                        </div>
                    );
                })}
        </>
    );
}

export default OldCommentAvatar