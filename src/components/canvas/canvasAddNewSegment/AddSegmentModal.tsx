import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MaterialSegmentModel } from '@/models/materialSegment/MaterialSegmentModel';

import { ScrollArea } from '@radix-ui/react-scroll-area';

import { MasterModel } from '@/models';
import { selectedNewMasterArray } from '@/redux/slices/segmentsSlice';
;
import { addSelectedMasterArray } from '@/redux/slices/MasterArraySlice';

interface AddSegmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
 
}



const AddSegmentModal: React.FC<AddSegmentModalProps> = ({ open, onClose, onSave }) => {
  const dispatch = useDispatch();

  const { masterArray } = useSelector((state: RootState) => state.masterArray);
  const {segments} = useSelector((state: RootState) => state.materialSegments);
  const [updatedSegments, setUpdatedSegments] = useState<MaterialSegmentModel[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<MasterModel | null>(null);

useEffect(() => {
  if (open) {
    if (masterArray && masterArray.length > 0 && segments && segments.length > 0) {
      const masterNames = masterArray.map((master) => master.name);

      const activeSegmnets=segments.filter(item=>item.is_visible)

      console.log("activeSegmnets------",activeSegmnets)
      const updateSeg = activeSegmnets.map((seg: MaterialSegmentModel) => ({
        ...seg,
        isDisabled: masterNames.includes(seg.name),
      }));
      setUpdatedSegments(updateSeg);
    } else {
      setUpdatedSegments(segments);
    }
  }else{
    setUpdatedSegments([]);
    setSelectedSegment(null);
  }
}, [masterArray, segments, open]);




   const handleAddSegment = (data: MaterialSegmentModel) => {

    const segValue:MasterModel={
      id: data.id,
      name: data.name,
      icon: data.icon,
      color_code: data.color_code,
      color: data.color,
      short_code: data.short_code,
      overAllSwatch:[],
      categories: data.categories,
      allSegments: [],
    }
     setSelectedSegment(segValue);
    
    
   }

   const closeSegmentModal=()=>{
    setSelectedSegment(null);
    setUpdatedSegments([])
    onClose()
   }

     const handleSave = () => {
    dispatch(selectedNewMasterArray(selectedSegment));
    dispatch(addSelectedMasterArray(selectedSegment));
    setUpdatedSegments([])
    setSelectedSegment(null);
    onSave()
  }

  return (
    <>
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>

      <DialogContent className="max-w-4xl h-auto">
        <DialogHeader>
          <DialogTitle>Add Segment</DialogTitle>
        </DialogHeader>

        <div className="mt-4 mb-2 text-lg font-medium text-primary border-ra">
        {selectedSegment && (
          <button className="bg-gray-50 text-black rounded px-2 py-1 border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-sm">
            {selectedSegment?.name}
          </button>
        )}
      </div>

        <ScrollArea className="h-[300px] pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-8 gap-4">
            {updatedSegments?.map((item, index) => {
              const isSelected = item.name === selectedSegment?.name
              const isDisabled = item.isDisabled ? true : false;

              return (
                <div
                  key={index}
                  onClick={() => !isDisabled && handleAddSegment(item)}
                  className={`cursor-pointer border rounded-lg p-3 text-center transition 
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'} 
                    ${isSelected ? 'bg-blue-100 border-blue-500' : ''}
                  `}
                  style={{ borderColor: item.color_code }}
                >
                  <div className="w-full h-18 mb-2">
                    <img
                            src={item.icon}
                            alt={item.name || "Segment Icon"}
                            style={{
                              width: "100%", // ya '100%' for full fit
                              height: "100%",
                              display: "block",
                              objectFit: "contain",
                              filter: "brightness(0) saturate(100%)",
                            }}
                          />
                  </div>
                  <h6 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">{item.name}</h6>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={closeSegmentModal}>Cancel</Button>
          <Button onClick={handleSave}>Add New Segment</Button>
        </div>
      </DialogContent>
    </Dialog>





    </>
  );
};

export default AddSegmentModal;
