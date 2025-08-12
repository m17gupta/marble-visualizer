import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspirationContent from "./tabContent/InspirationContent";
import ChatHome from "./chat/ChatHome";
import GenAiImageGeneration from "@/components/workSpace/projectWorkSpace/genAiImageGeneration/GenAiImageGeneration";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { TbVectorBezier2 } from "react-icons/tb";

export function StudioStyleTabs() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="chat" className="shadow border border-gray-600">
            <img
              src="/assets/image/line-md--chat-round-dots.svg"
              alt="Chat Icon"
              className="h-5 w-5 mr-2"
            />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="renovation"
            className="shadow border border-gray-600">
            <img
              src="/assets/image/line-md--edit-twotone.svg"
              alt="Chat Icon"
              className="h-5 w-5 mr-2"
            />
            Renovation
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="shadow border border-gray-600">
            <img
              src="/assets/image/svgviewer-output.svg"
              alt="Chat Icon"
              className="h-5 w-5 mr-2"
            />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
               <ChatHome/>
        </TabsContent>

        <TabsContent value="renovation">
          <InspirationContent />
        </TabsContent>

        <TabsContent value="history">
          <InspirationContent />
        </TabsContent>
      </Tabs>

      <GenAiImageGeneration/>
    </div>
  );
}
export default StudioStyleTabs;
