import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspirationContent from "./tabContent/InspirationContent";
import ChatHome from "./chat/ChatHome";
import GenAiImageGeneration from "@/components/workSpace/projectWorkSpace/genAiImageGeneration/GenAiImageGeneration";
import ChatHistory from "./genAiHistory/ChatHistory";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCurrentInspirationTab } from "@/redux/slices/studioSlice";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { RiEdit2Line } from "react-icons/ri";
import { MdOutlineAccessTime } from "react-icons/md";

export function StudioStyleTabs() {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: RootState) => state.studio.currentInspirationTab);

  // Tab configuration for easier management
  const tabs = [
    {
      value: "chat",
      label: "Chat",
      icon: <IoChatboxEllipsesOutline className="h-5 w-5 me-1"/>,
      content: <ChatHome />
    },
    {
      value: "renovation", 
      label: "Play",
      icon:  <RiEdit2Line  className="h-5 w-5 me-1"/>,
      content: <InspirationContent />
    },
    {
      value: "history",
      label: "History", 
      icon:  <MdOutlineAccessTime  className="h-5 w-5 me-1"/>,
      content: <ChatHistory />
    }
  ];

  const handleTabChange = (value: string) => {
    dispatch(updateCurrentInspirationTab(value));
  };

  const isTabActive = (value: string) => currentTab === value;

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={` shadow-none  border border-gray-300 data-[state=active]:bg-white rounded-lg data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 py-1.5 px-6 text-gray-600 focus:outline-none focus:ring-0 ${
                isTabActive(tab.value) ? 'bg-white border-blue-500 text-blue-600' : ''
              }`}
            >
              {/* <img
                src={tab.icon}
                alt={`${tab.label} Icon`}
                className="h-5 w-5 mr-2 500"
              /> */}
               {tab.icon}
              <span>{tab.label}</span>
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
