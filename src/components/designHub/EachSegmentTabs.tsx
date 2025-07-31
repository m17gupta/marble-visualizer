import React, { useRef } from 'react';
import { SwiperSlide } from 'swiper/react';
import { TabsTrigger } from '../ui/tabs';
import { MasterGroupModel } from '@/models/jobModel/JobModel';
import { updateHoverGroup } from '@/redux/slices/canvasSlice';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

type Props = {
  groupSegments: MasterGroupModel;
  onTabClick: (tabId: string) => void;
};

const EachSegmentTabs = ({ groupSegments, onTabClick }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleGroupHover = (group: string) => {
    dispatch(updateHoverGroup(null));
    dispatch(updateHoverGroup([group]));
  };


  const handleLeaveGroupHover = () => {
    dispatch(updateHoverGroup(null));
  };
  return (
    <>
      {groupSegments.segments.map((tab) => (
        <SwiperSlide key={tab.short_title} className="!w-auto">
          <TabsTrigger
            value={tab.short_title ?? ""}
            ref={(el) => (tabRefs.current[tab.short_title ?? ""] = el)}
            onClick={() => onTabClick(tab.short_title ?? "")}
            onMouseEnter={() => handleGroupHover(tab.short_title ?? "")}
            onMouseLeave={handleLeaveGroupHover}
            className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
          >
            {tab.short_title}
          </TabsTrigger>
        </SwiperSlide>
      ))}
    </>
  );
};

export default EachSegmentTabs;
