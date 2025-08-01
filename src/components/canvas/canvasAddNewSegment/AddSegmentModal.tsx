import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MaterialSegmentModel } from '@/models/materialSegment/MaterialSegmentModel';

import { ScrollArea } from '@radix-ui/react-scroll-area';

import { MasterModel } from '@/models';
import { selectedNewMasterArray } from '@/redux/slices/segmentsSlice';

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
  const [selectedSegment, setSelectedSegment] = useState<MaterialSegmentModel | null>(null);

  useEffect(() => {
    if(masterArray && masterArray.length > 0) {
      masterArray.forEach((master) => {
        const updateSeg=segments.map((seg: MaterialSegmentModel) => {
          if (seg.name=== master.name) {
            return {
              ...seg,
              isDisabled: true, // Ensure isDisabled is set to false
              
            };
          }
          return seg;
        });
        setUpdatedSegments(updateSeg);  
      })
    }
  },[masterArray, segments]);


;

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
     setSelectedSegment(data);
     dispatch(selectedNewMasterArray(segValue));
   }

   const closeSegmentModal=()=>{
    onClose()
   }

     const handleSave = () => {
    console.log("updatedSegments", )
    onSave()
  }
  return (
    <>
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>

      <DialogContent className="max-w-4xl h-auto">
        <DialogHeader>
          <DialogTitle>Add Segment</DialogTitle>
        </DialogHeader>

        <div className="mt-4 mb-2 text-lg font-medium text-primary">{selectedSegment?.name}</div>

        <ScrollArea className="h-[300px] pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {updatedSegments?.map((item, index) => {
              const isSelected = item.name === selectedSegment?.name
              const isDisabled = item.isDisabled

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
                  <div className="w-full h-20 mb-2">
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
                  <h6 className="text-sm font-medium">{item.name}</h6>
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
