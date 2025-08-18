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
   const { user } = useSelector((state: RootState) => state.auth);
 
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
        <div className={cn("flex items-center relative")}>
          {/* Outer ring for better visibility */}
          {/* <div className="absolute inset-0 w-9 h-9 rounded-full bg-white shadow-2xl opacity-80 -z-9"></div> */}
          <div className="absolute inset-1 w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 opacity-90 animate-pulse rounded-[30px_30px_0px_30px]"  style={{left:"-2px", top:"1px"}}></div>
          
          <Avatar   className={cn(
    "w-8 h-8 border-2 border-white shadow-xl hover:scale-110 transition-all duration-300 hover:shadow-2xl relative z-10",
    "bg-gradient-to-br from-blue-600 to-purple-700",
    "rounded-[30px_30px_0px_30px]"
  )}>
            <AvatarFallback className={cn(
              "font-medium text-md text-white bg-gradient-to-br from-blue-600 to-purple-700",
              "flex items-center justify-center w-full h-full shadow-inner"
            )}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </AvatarFallback>
          </Avatar>
          
          {/* Optional: Show segment name as tooltip */}
          {segmentName && (
            <div className="ml-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-gray-700">
              {segmentName}
            </div>
          )}
        </div>
      </div>

     

   
     
    </>
  )
}

export default CommentAvatar