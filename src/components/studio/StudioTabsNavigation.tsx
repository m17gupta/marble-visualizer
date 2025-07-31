import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SegmentsList } from "@/components/segments";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { SwatchRecommendations } from "@/components/swatch/SwatchRecommendations";
import { StudioDesignTab } from "@/components/studio/StudioDesignTab";
// import { DesignSettings, Job } from './types';
import { Palette, Shapes, History, Clock, Square } from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import AllSegments from "./segment/AllSegments";


interface StudioTabsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  projectId?: string;
  // selectedSegmentType: string | null;
  // designSettings: DesignSettings;
  // isJobRunning: boolean;
  // canEdit: boolean;
  // jobError: string | null;
  // currentJob: Job | null;
  // onStyleChange: (value: string) => void;
  // onLevelChange: (checked: boolean) => void;
  // onPreserveToggle: (id: string) => void;
  // onToneChange: (value: string) => void;
  // onIntensityChange: (value: number) => void;
}

export function StudioTabsNavigation({
  activeTab,
  onTabChange,
  projectId,
}: // designSettings,
// isJobRunning,
// canEdit,
// jobError,
// currentJob,
// onStyleChange,
// onLevelChange,
// onPreserveToggle,
// onToneChange,
// onIntensityChange
StudioTabsNavigationProps) {
  const [designhubactivetab, setDesignHubActiveTab] =
    useState("studio-segment");

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
  //  const { list: jobs } = useSelector((state: RootState) => state.jobs);
  // console.log("SegmentHome jobs", jobs);

  return (
    <>
      <Tabs
        defaultValue="segment"
        value={designhubactivetab}
        onValueChange={handleChangeTab}
        className="flex flex-col w-full"
      >
        <TabsList className="grid grid-cols-5 gap-1 w-full h-11 ">
          <TabsTrigger
            value="studio-segment"
            className="text-xs p-1 border-gray-300"
          >
            <Square className="h-4 w-4" />
            {/* <span className="sr-only">Segment</span> */}
          </TabsTrigger>
          <TabsTrigger value="design" className="text-xs p-1 border-gray-300">
            <Palette className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="segments" className="text-xs p-1 border-gray-300">
            <Shapes className="h-4 w-4" />
          </TabsTrigger>
          {/* <TabsTrigger value="swatches" className="text-xs p-1">
            <Target className="h-3 w-3" />
          </TabsTrigger> */}
          <TabsTrigger value="history" className="text-xs p-1 border-gray-300">
            <History className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs p-1 border-gray-300">
            <Clock className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        {/* Scrollable Tab Content */}
        <ScrollArea className="px-4">
          <div className="py-4 space-y-6">
            <TabsContent value="studio-segment" className="space-y-6 mt-0">
              <AllSegments />
            </TabsContent>

            <TabsContent value="design" className="space-y-6 mt-0">
              <StudioDesignTab />
            </TabsContent>

            <TabsContent
              value="segments"
              className="space-y-4 mt-0 max-w-full overflow-hidden"
            >
              {projectId && <SegmentsList projectId={projectId} />}
            </TabsContent>

            <TabsContent value="swatches" className="mt-0">
              <SwatchRecommendations />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              {/* {projectId && <VersionHistory projectId={projectId} />} */}
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              {projectId && <ActivityTimeline projectId={projectId} />}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      <SwatchRecommendations />
    </>
  );
}
