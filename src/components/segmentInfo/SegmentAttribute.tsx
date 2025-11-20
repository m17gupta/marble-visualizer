import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { updateJsonData } from '@/redux/slices/InformationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type SegmentAttributeProps = {
    activeTab: string;
    // onTabChange: (tab: string) => void;
}
const SegmentAttribute = ({ activeTab }: SegmentAttributeProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { multiSelectedSegmentTypes, multiSelectedSegments } = useSelector((state: RootState) => state.information);
    const { allSegments } = useSelector((state: RootState) => state.segments);
    const data = ["segment_type", "short_title", "annotation_points_float", "segment_bb_float", "seg_perimeter", "seg_area_sqmt", "seg_area_pixel"]
     const [selctedKeys, setSelectedKeys] = React.useState<string[]>([]);
     const [updatedJSON, setUpdatedJSON] = React.useState<SegmentModal[]>([]);
    const handleSegmentAttraibuteSelection = (key: string) => {
       if(selctedKeys.includes(key)){
        const filteredKeys = selctedKeys.filter(k => k !== key);
        setSelectedKeys(filteredKeys);
       } else {
        setSelectedKeys([...selctedKeys, key]);
       }
    
    }

     useEffect(() => {
       // console.log("Selected Keys Updated:", selctedKeys);
        if(multiSelectedSegments.length > 0 &&
             selctedKeys.length > 0){
            const updated = multiSelectedSegments.map(segment => {
                const updatedAttributes: { [key: string]: any } = {};
                selctedKeys.forEach(key => {
                    if (key in segment) {
                        //console.log("Key present in segment:", key);
                        updatedAttributes[key] = (segment as any)[key];
                    }
                });
                return {  ...updatedAttributes };
            });

            dispatch(updateJsonData(updated));
            // setUpdatedJSON(updated);
        }
    }, [selctedKeys, multiSelectedSegments]);


    //console.log("Updated JSON:", updatedJSON);
    return (
        <div className="p-4 border-b border-gray-200">

            <>
                <h3 className="text-md font-medium mb-3">

                </h3>
                <div className="flex flex-wrap gap-4">
                    {data.map((key: string) => {
                       return (
                           <label
                               key={key}
                               className="flex items-center  space-x-2 cursor-pointer hover:bg-gray-100 bg-gray-100 px-4 py-2 rounded-md transition-colors"
                           >
                                <input
                                    type="checkbox"
                                    id={`attribute-${key}`}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    onChange={() => handleSegmentAttraibuteSelection(key)}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {key}
                                </span>
                            </label>
                        )
                    })
                    }
                </div>
            </>

        </div>
    )
}

export default SegmentAttribute