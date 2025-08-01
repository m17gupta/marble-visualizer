import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, Shapes, History, Clock, Square } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SwatchRecommendations } from "@/components/swatch/SwatchRecommendations";

const TabNavigation = () => {
  const [designhubactivetab, setDesignHubActiveTab] = useState(
    "recommendations-swatches"
  );

  const { activeTab: tabControlActiveTab } = useSelector(
    (state: RootState) => state.tabControl
  );
  const handleChangeTab = (value: string) => {
    console.log("Tab changed to:", value);
    setDesignHubActiveTab(value);
  };

  // update te active tab

  useEffect(() => {
    if (tabControlActiveTab) {
      handleChangeTab(tabControlActiveTab);
    }
  }, [tabControlActiveTab]);
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-muted text-muted-foreground border-b border-gray-200 gap-2">
        <button className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
          <Palette className="h-4 w-4" />
        </button>
        <button className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
          <Square className="h-4 w-4" />
        </button>
        <button className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
          <Shapes className="h-4 w-4" />
        </button>
        <button className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
          <History className="h-4 w-4" />
        </button>
        <button className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
          <Clock className="h-4 w-4" />
        </button>
      </div>

      {/* <Tabs
        defaultValue="recommendations-swatches"
        value={designhubactivetab}
        onValueChange={handleChangeTab}
        className="flex flex-col w-full"
      >
        <TabsList className="grid grid-cols-5 gap-1 w-full h-11 ">
          <TabsTrigger
            value="recommendations-swatches"
            className="text-xs p-1 border-gray-300"
          >
            <Palette className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="design" className="text-xs p-1 border-gray-300">
            <Square className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="segments" className="text-xs p-1 border-gray-300">
            <Shapes className="h-4 w-4" />
          </TabsTrigger>

          <TabsTrigger value="history" className="text-xs p-1 border-gray-300">
            <History className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs p-1 border-gray-300">
            <Clock className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="px-2">
          <div className="py-4 space-y-6">
            <TabsContent
              value="recommendations-swatches"
              className="space-y-6 mt-0"
            >
              <SwatchRecommendations />
            </TabsContent>

            <TabsContent value="design" className="space-y-6 mt-0">
              <span className="text-gray-700 font-medium">
                Design tab content goes here.
              </span>
            </TabsContent>

            <TabsContent
              value="segments"
              className="space-y-4 mt-0 max-w-full overflow-hidden"
            ></TabsContent>

            <TabsContent value="swatches" className="mt-0">
              <span className="text-gray-700 font-medium">
                Swatches tab content goes here.
              </span>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <span className="text-gray-700 font-medium">
                History tab content goes here.
              </span>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <span className="text-gray-700 font-medium">
                Activity tab content goes here.
              </span>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs> */}
    </>
  );
};

export default TabNavigation;
