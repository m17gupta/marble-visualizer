import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { MasterModel } from '@/models/jobModel/JobModel'
import { 
    setSegmentType, 
    addMultiSelectedSegmentType, 
    removeMultiSelectedSegmentType 
} from '@/redux/slices/InformationSlice'


type SelectSegTypeProps = {
     activeTab: string;
    // onTabChange: (tab: string) => void;
}
const SelectSegType = ({ activeTab }: SelectSegTypeProps) => {

  

    const dispatch = useDispatch();
    const { masterArray } = useSelector((state: RootState) => state.masterArray)
    const { segmentType, multiSelectedSegmentTypes } = useSelector((state: RootState) => state.information)


    // initially select one segment type
    useEffect(() => {
        if(activeTab === "information"){
            dispatch(setSegmentType(masterArray[0].name??""));
        }else if(activeTab === "jsonData" && masterArray.length > 0){

            dispatch(addMultiSelectedSegmentType(masterArray[0].name??"") );
        }
    },[])
    const handleCheckboxChange = (value: string, checked: boolean) => {
       // console.log("Selected Segment Type:", value, "Checked:", checked);
        
        if (activeTab === "information") {
            // Single selection mode
            if (checked) {
                dispatch(setSegmentType(value));
            } else {
                // If unchecked and this was the selected type, clear the selection
                if (segmentType === value) {
                    dispatch(setSegmentType(''));
                }
            }
        } else if (activeTab === "jsonData") {
            // Multi-selection mode
            if (checked) {
                dispatch(addMultiSelectedSegmentType(value));
            } else {
                dispatch(removeMultiSelectedSegmentType(value));
            }
        }
    }

    return (
        <div className="p-4 border-b border-gray-200">
            <h4 className="text-md font-medium mb-3">
               
            </h4>
            <div className="flex flex-wrap gap-4">
                {masterArray &&
                    masterArray.length > 0 &&
                    masterArray
                        .filter((item: MasterModel) => item.name) // Filter out items with undefined name
                        .map((item: MasterModel) => (
                            <label 
                                key={item.id} 
                                className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        activeTab === "information" 
                                            ? segmentType === item.name
                                            : multiSelectedSegmentTypes.includes(item.name!)
                                    }
                                    onChange={(e) => handleCheckboxChange(item.name!, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {item.name}
                                </span>
                            </label>
                        ))}
            </div>
        </div>
    )
}

export default SelectSegType