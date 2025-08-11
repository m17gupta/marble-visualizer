import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // if you're using className merge helper
import { useSelector} from 'react-redux';
import { RootState} from '@/redux/store';


type Props = {
  x: number;
  y: number;
segmentName?: string;
commentType?: string; // Optional prop to differentiate comment types
  openReply: (data: string) => void; // Function to handle opening reply
}
const CommentAvatar: React.FC<Props> = ({ x, y , segmentName,openReply,commentType }) => {
  const { profile } = useSelector((state: RootState) => state.userProfile);
 
 
  const handleComments = (data:string) => {
      if(commentType==="new") {
          // Handle new comment logic
      } else {
         openReply(data);
      }
      
  };
  return (
    <>
      {/* Main Avatar */}
      <div
    
       onClick={() => handleComments(segmentName??"")}
        className="absolute flex items-start group pointer-events-auto z-50 cursor-pointer"
        style={{
          left: x,
          top: y,
          transform: `translate(-50%, -50%)`, 
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className={cn("flex items-center")}>
          <Avatar className={cn(
            "w-10 h-10 rounded-full text-white bg-primary border-2 border-white shadow-lg hover:scale-110 transition-transform",
          )}>
            <AvatarFallback className="font-semibold">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'M'}
            </AvatarFallback>
          </Avatar>
          {/* Optional: Show segment name as tooltip */}
          {segmentName && (
            <div className="ml-2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {segmentName}
            </div>
          )}
        </div>
      </div>

     

   
     
    </>
  )
}

export default CommentAvatar