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
          <div className="absolute inset-0 w-14 h-14 rounded-full bg-white shadow-2xl opacity-80 -z-10"></div>
          <div className="absolute inset-1 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-90 animate-pulse"></div>
          
          <Avatar className={cn(
            "w-12 h-12 rounded-full border-2 border-white shadow-xl hover:scale-110 transition-all duration-300 hover:shadow-2xl relative z-10",
            "bg-gradient-to-br from-blue-600 to-purple-700"
          )}>
            <AvatarFallback className={cn(
              "font-bold text-lg text-white bg-gradient-to-br from-blue-600 to-purple-700",
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