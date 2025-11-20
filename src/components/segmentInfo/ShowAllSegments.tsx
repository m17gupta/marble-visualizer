import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { 
    setAllSegInfo, 
    setSelectedSegment, 
    addMultiSelectedSegment, 
    removeMultiSelectedSegment 
} from '@/redux/slices/InformationSlice';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type ShowAllSegmentsProps = {
    activeTab: string;
   // onTabChange: (tab: string) => void;
}
const ShowAllSegments = ({ activeTab }: ShowAllSegmentsProps) => {

    const dispatch= useDispatch();
    const [allSegs, setAllSegs] = React.useState<SegmentModal[]>([]);
    const {allSegments} = useSelector((state: RootState) => state.segments);
    const {segmentType, multiSelectedSegmentTypes, selectedSegment, multiSelectedSegments} = useSelector((state: RootState) => state.information);

    useEffect(() => {
        if (allSegments && allSegments.length > 0) {
            let filteredSegs: SegmentModal[] = [];

            if (activeTab === "information" && segmentType) {
                // Single selection mode - filter by single segment type
                filteredSegs = allSegments.filter(seg => seg.segment_type === segmentType);
            } else if (activeTab === "jsonData" && multiSelectedSegmentTypes.length > 0) {
                // Multi-selection mode - filter by multiple segment types
                filteredSegs = allSegments.filter(seg => 
                    multiSelectedSegmentTypes.includes(seg.segment_type || '')
                );
            }

            if (filteredSegs.length > 0) {
                // order by short_title ascending
                const sortedSegs = filteredSegs.sort((a, b) => 
                    (a.short_title || '').localeCompare(b.short_title || '')
                );
               
                // set to local state and redux state
                setAllSegs(sortedSegs);
                dispatch(setAllSegInfo(sortedSegs));
                
                // Set initial selection based on activeTab
                if (activeTab === "information") {
                    dispatch(setSelectedSegment(sortedSegs[0] || null));
                }
            } else {
                setAllSegs([]);
                dispatch(setAllSegInfo([]));
                if (activeTab === "information") {
                    dispatch(setSelectedSegment(null));
                }
            }
        }
    }, [allSegments, segmentType, multiSelectedSegmentTypes, activeTab]);

    const handleSegmentSelection = (segment: SegmentModal) => {
        if (activeTab === "information") {
            // Single selection mode
            dispatch(setSelectedSegment(segment));
        } else if (activeTab === "jsonData") {
            // Multi-selection mode
            const isSelected = multiSelectedSegments.some(seg => seg.id === segment.id);
            if (isSelected) {
                dispatch(removeMultiSelectedSegment(segment.id!));
            } else {
                dispatch(addMultiSelectedSegment(segment));
            }
        }
    };

  return (
    <div className="p-4 border-b border-gray-200">
      {allSegs.length > 0 && (
        <>
          <h3 className="text-md font-medium mb-3">
           Select segment
          </h3>
          <div className="flex flex-wrap gap-4">
            {allSegs.map(seg => (
              <label 
                key={seg.id} 
                className="flex items-center  space-x-2 cursor-pointer hover:bg-gray-100 bg-gray-100 px-4 py-2 rounded-md transition-colors"
              >
                <input 
                  type="checkbox" 
                  id={`segment-${seg.id}`}
                  checked={
                    activeTab === "information" 
                        ? selectedSegment?.id === seg.id
                        : multiSelectedSegments.some(s => s.id === seg.id)
                  }
                  onChange={() => handleSegmentSelection(seg)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {seg.short_title}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ShowAllSegments