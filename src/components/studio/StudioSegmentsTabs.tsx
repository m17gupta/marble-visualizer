import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudioSegmentsTabs = () => {
  return (
    <div className="w-full overflow-x-auto ">
      <Tabs defaultValue="wall1" className="w-full">
        <TabsList className="flex overflow-x-auto w-[400px] gap-2 bg-white rounded-md p-1 scrollbar-red-tabs px-4">
          {["wall1", "wall2", "wall3", "wall4", "wall5", "wall6", "wall7", "wall8"].map((wall, index) => (
            <TabsTrigger
              key={wall}
              value={wall}
              className="whitespace-nowrap px-4 py-2 text-sm rounded-md transition data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {`Wall ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="wall1">Content for Wall 1.</TabsContent>
        <TabsContent value="wall2">Content for Wall 2.</TabsContent>
        <TabsContent value="wall3">Content for Wall 3.</TabsContent>
        <TabsContent value="wall4">Content for Wall 4.</TabsContent>
        <TabsContent value="wall5">Content for Wall 5.</TabsContent>
        <TabsContent value="wall6">Content for Wall 6.</TabsContent>
        <TabsContent value="wall7">Content for Wall 7.</TabsContent>
        <TabsContent value="wall8">Content for Wall 8.</TabsContent>
      </Tabs>
    </div>
  );
};

export default StudioSegmentsTabs;
