// src/components/CommentsTabs.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInspirationTab } from "@/hooks/useInspirationTab"; // Make sure this hook exists
import { motion } from "framer-motion"; // Naya import animation ke liye
import { CheckCircle2 } from "lucide-react"; // Naya import icon ke liye
import { useState } from "react"; // Naya import active state ke liye
import CommentLists from "./CommentLists";

// --- Data and Type Definitions (Updated) ---
interface Comment {
  id: string;
  author: string;
  initials: string;
  avatarUrl?: string;
  message: string;
  timestamp: string; // Naye fields add kiye gaye hain
  isResolved: boolean;
  commentNumber: number;
}

// Dummy data naye design ke hisaab se update kiya gaya hai
const DUMMY_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "John Doe",
    initials: "JD",
    message: "Could we try a different shade of blue for the main wall?",
    timestamp: "August 26, 2025 at 08:00:15 PM",
    isResolved: false,
    commentNumber: 1,
  },
  {
    id: "2",
    author: "Jane Smith",
    initials: "JS",
    message: "I love the texture on the siding. Let's keep that.",
    timestamp: "August 26, 2025 at 08:02:30 PM",
    isResolved: true,
    commentNumber: 2,
  },
  {
    id: "3",
    author: "Sam Wilson",
    initials: "SW",
    message: "What about the front door color? I was thinking red.",
    timestamp: "August 26, 2025 at 08:05:00 PM",
    isResolved: false,
    commentNumber: 3,
  },
];

// --- Icon Components (Same as before) ---
const CommentIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M11.7685 21.1421C17.5217 21.1421 22.1852 16.6651 22.1852 11.1421C22.1852 5.61906 17.5217 1.14206 11.7685 1.14206C6.01541 1.14206 1.35187 5.61906 1.35187 11.1421C1.35187 12.7421 1.74353 14.2541 2.43833 15.5951C2.62374 15.9511 2.6852 16.3581 2.57791 16.7431L1.95812 18.9691C1.89673 19.1894 1.89679 19.4213 1.95828 19.6415C2.01977 19.8618 2.14053 20.0627 2.30845 20.224C2.47636 20.3853 2.68551 20.5013 2.91492 20.5605C3.14432 20.6197 3.3859 20.6199 3.61541 20.5611L5.93416 19.9651C6.33664 19.8674 6.76243 19.9148 7.13103 20.0981C8.57161 20.7866 10.1593 21.144 11.7685 21.1421Z" stroke="currentColor" strokeWidth="1.5" /> <path opacity="0.5" d="M7.60187 9.64206H15.9352M7.60187 13.1421H13.331" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> <path d="M20.1111 10.8221C22.7549 10.8221 24.8982 12.9647 24.8982 15.6072C24.8981 18.2496 22.7548 20.3924 20.1111 20.3924C17.4676 20.3921 15.3251 18.2495 15.325 15.6072C15.325 12.9649 17.4676 10.8223 20.1111 10.8221Z" fill="white" stroke="currentColor" strokeWidth="1.5" /> <path d="M19.6175 13.4354V15.5669C19.6175 15.843 19.8414 16.0669 20.1175 16.0669H21.5313" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> </svg> );
const ResolvedCommentIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M11.6652 21.3587C17.4183 21.3587 22.0819 16.8817 22.0819 11.3587C22.0819 5.83573 17.4183 1.35873 11.6652 1.35873C5.91208 1.35873 1.24854 5.83573 1.24854 11.3587C1.24854 12.9587 1.6402 14.4707 2.33499 15.8117C2.52041 16.1677 2.58187 16.5747 2.47458 16.9597L1.85479 19.1857C1.7934 19.406 1.79346 19.6379 1.85495 19.8582C1.91644 20.0785 2.0372 20.2793 2.20511 20.4406C2.37303 20.6019 2.58218 20.718 2.81158 20.7772C3.04099 20.8363 3.28257 20.8365 3.51208 20.7777L5.83083 20.1817C6.23331 20.0841 6.65909 20.1314 7.0277 20.3147C8.46828 21.0033 10.0559 21.3607 11.6652 21.3587Z" stroke="currentColor" strokeWidth="1.5" /> <path opacity="0.5" d="M7.49854 9.85873H15.8319M7.49854 13.3587H13.2277" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> <path d="M20.0078 11.0387C22.6515 11.0387 24.7949 13.1814 24.7949 15.8239C24.7948 18.4663 22.6515 20.609 20.0078 20.609C17.3643 20.6088 15.2217 18.4662 15.2216 15.8239C15.2216 13.1815 17.3642 11.039 20.0078 11.0387Z" fill="white" stroke="currentColor" strokeWidth="1.5" /> <path d="M19.4561 18.1044C19.0908 17.2977 18.1445 16.3614 17.7366 16.0038C18.1493 15.9882 18.5165 16.0905 18.6485 16.1436C19.0265 16.298 19.5304 16.8373 19.735 17.0876C20.0387 15.7041 20.7412 14.4174 21.0544 13.947C21.5339 13.2316 21.9392 13.1732 22.0819 13.2335C21.2295 14.5045 20.566 17.0104 20.3409 18.1044H19.4561Z" fill="currentColor" stroke="currentColor" strokeWidth="0.2" strokeLinecap="round" /> </svg> );
const AllCommentIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="27" height="21" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22Z"/><path stroke-linecap="round" d="M8 10.5h8M8 14h5.5"  fill="white" stroke="currentColor" strokeWidth="1.5"  opacity="0.5"/></g></svg> );
// --- Sub-Components (Naye design ke saath) ---
const CommentListItems = ({ comment, isActive, onClick }: { comment: Comment; isActive: boolean; onClick: () => void; }) => (
  <motion.div
    onClick={onClick}
    className={`relative p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? "bg-blue-50 border-blue-500 shadow-md"
        : "bg-white border-gray-200 hover:bg-gray-50"
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    layout
  >
    {isActive && <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-600 rounded-l-lg" />}
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={comment.avatarUrl} alt={comment.author} />
            <AvatarFallback>{comment.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm text-gray-900">{comment.author}</p>
            <p className="text-xs text-gray-500">{comment.timestamp}</p>
          </div>
        </div>
        {comment.isResolved && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      </div>
      <div className="flex items-end justify-between pl-12">
        <p className="text-sm text-gray-700">{comment.message}</p>
        <span className="flex items-center justify-center h-6 w-6 rounded-md border bg-white text-xs font-semibold text-gray-600">
          {comment.commentNumber}
        </span>
      </div>
    </div>
  </motion.div>
);

const CommentList = () => {
  const [activeComment, setActiveComment] = useState<string>(DUMMY_COMMENTS[0].id);

  return (
    <div className="flex flex-col gap-3">
      {DUMMY_COMMENTS.map((comment) => (
        <CommentListItems
          key={comment.id} 
          comment={comment}
          isActive={activeComment === comment.id}
          onClick={() => setActiveComment(comment.id)}
        />
      ))}
    </div>
  );
};

// --- Main Exported Component ---
export function CommentsTabs() {
  const { currentTab, handleTabChange } = useInspirationTab("all");
  const tabTriggerStyle = "rounded-lg px-6 text-gray-700 shadow-none border border-gray-300 data-[state=active]:bg-white data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm focus-ring-0 focus:ring-blue-500 focus:outline-none";

  
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="w-full py-2">
          <TabsTrigger value="all" className={tabTriggerStyle}>All </TabsTrigger>
          <TabsTrigger value="pending" className={tabTriggerStyle}>Pending</TabsTrigger>
          <TabsTrigger value="resolved" className={tabTriggerStyle}>Resolved</TabsTrigger>
        </TabsList>
        {/* <ResolvedCommentIcon className="pe-1" />
        <CommentIcon className="pe-1" />
        <AllCommentIcon className="pe-2" /> */}

        <TabsContent value="all" className="p-3"><CommentList/></TabsContent>
        <TabsContent value="pending" className="p-3"><CommentLists /></TabsContent>
        <TabsContent value="resolved" className="p-3"><p className="text-center text-gray-500">No resolved comments.</p></TabsContent>
      </Tabs>
    </div>
  );
}