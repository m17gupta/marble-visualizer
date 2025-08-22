import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspirationContent from "./tabContent/InspirationContent";
import ChatHome from "./chat/ChatHome";
import GenAiImageGeneration from "@/components/workSpace/projectWorkSpace/genAiImageGeneration/GenAiImageGeneration";
import ChatHistory from "./genAiHistory/ChatHistory";
import { useInspirationTab } from "@/hooks/useInspirationTab";

export function StudioStyleTabs() {
  const { currentTab, handleTabChange, isTabActive } = useInspirationTab("chat");


  // Tab configuration for easier management
  const tabs = [
    {
      value: "chat",
      label: "Chat",
      icon: "/assets/image/line-md--chat-round-dots.svg",
      content: <ChatHome />
    },
    {
      value: "renovation", 
      label: "Play",
      icon: "/assets/image/line-md--edit-twotone.svg",
      content: <InspirationContent />
    },
    {
      value: "history",
      label: "History", 
      icon: "/assets/image/svgviewer-output.svg",
      content: <ChatHistory />
    }
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`shadow border border-gray-600 data-[state=active]:bg-white data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 ${
                isTabActive(tab.value) ? 'bg-white border-blue-500 text-blue-600' : ''
              }`}
            >
              <img
                src={tab.icon}
                alt={`${tab.label} Icon`}
                className="h-5 w-5 mr-2"
              />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      <GenAiImageGeneration/>
    </div>
  );
}
export default StudioStyleTabs;
