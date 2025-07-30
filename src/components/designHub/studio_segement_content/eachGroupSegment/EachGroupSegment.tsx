import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import React from 'react'

type EachGroupSegmentProps = {
     groupName: string;
     segments: SegmentModal[];
}
const EachGroupSegment = ({ groupName, segments }: EachGroupSegmentProps) => {
  return (
   <>
  {segments && segments.length==0?(
    <p>No segments available in {groupName}. Please add segments.</p>
  ):( <Tabs defaultValue={segments[0]?.short_title ?? String(segments[0]?.id)}>
    <TabsList>
      {segments.map((segment: SegmentModal) => (
        <TabsTrigger key={segment.id} value={segment.short_title ?? String(segment.id)}>
          {segment.short_title ?? `Segment ${segment.id}`}
        </TabsTrigger>
      ))}
    </TabsList>
    {segments.map((segment) => (
      <TabsContent key={segment.id} value={segment.short_title ?? String(segment.id)}>
        {/* Render segment-specific content here */}
        <div>
          <h3>{segment.title ?? `Segment ${segment.id}`}</h3>
          {/* Add more segment details as needed */}
        </div>
      </TabsContent>
    ))}
  </Tabs>)}
   </>
  )
}

export default EachGroupSegment;