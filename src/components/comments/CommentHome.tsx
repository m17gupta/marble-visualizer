import React, { useEffect, useState } from 'react'
import CommentAvatar from './CommentAvatar';
import AddComments from './AddComments';
import OldCommentAvatar from './OldCommentAvatar';

type CommentHomeProps = {
    x: number;
    y: number;
    segmentName?: string;
}
const CommentHome = ({ x, y, segmentName }: CommentHomeProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const [mousePositionX, setMousePositionX] = useState(x);
    const [mousePositionY, setMousePositionY] = useState(y);
    const handleClose = () => {
        setIsExpanded(false);
    }

    useEffect(() => {
        if (x !== mousePositionX || y !== mousePositionY ) {
            setMousePositionX(x);
            setMousePositionY(y);
            setIsExpanded(true);
        }
        if(segmentName=="") {
            setIsExpanded(false);
        }
    }, [mousePositionX, mousePositionY, isExpanded, x, y]);
    console.log("CommentHome rendered at position:", { x, y, segmentName });
    console.log("Mouse Position:", { mousePositionX, mousePositionY });
    return (
        <>
            {isExpanded && <CommentAvatar
               commentType="new"
                openReply={(data) => console.log("Open reply clicked", data)}
                x={x} y={y}
                segmentName={segmentName} />}

            {isExpanded &&
                <AddComments
                    x={x} y={y}
                    segmentName={segmentName}
                    onClose={handleClose}
                />}

                <OldCommentAvatar/>
        </>
    )
}

export default CommentHome