import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateAddSegMessage, UpdateOtherSegmentDrawn } from '@/redux/slices/segmentsSlice';

interface AddSegmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
 
}



const AddSegmentModal: React.FC<AddSegmentModalProps> = ({ open, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [segType, setSegType] = useState('');
  const [allcatogories, setAllCategories] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [shortName, setShortName] = useState('');
  const [childName, setChildName] = useState('');
 const  [groupArray, setGroupArray] = useState<string[]>([]);
  const { selectedMasterArray } = useSelector((state: RootState) => state.masterArray);
 const [selectedCatogory, setSelectedCategory] = useState<string>('');
 
  useEffect(() => {
    if( selectedMasterArray &&
        selectedMasterArray.name &&
        selectedMasterArray.allSegments &&
        selectedMasterArray.allSegments.length === 0
    ) {
      setSegType(selectedMasterArray.name);
      setAllCategories(selectedMasterArray.categories || []);
      const allSeg = selectedMasterArray.allSegments.length;
      if (allSeg == 0) {
        setGroupArray([`${selectedMasterArray.name}1`]);
        const firstSeg =`${selectedMasterArray.name}1`
        if (firstSeg ) {
          setGroupName(firstSeg);
          setShortName(`${selectedMasterArray.short_code}1`);
          setChildName(firstSeg);
        }
    }
    } else if(selectedMasterArray &&
        selectedMasterArray.name &&
        selectedMasterArray.allSegments &&
        selectedMasterArray.allSegments.length >0){
      setSegType(selectedMasterArray.name);
      
      setAllCategories(selectedMasterArray.categories || []);
      const allSeg = selectedMasterArray.allSegments.length;
      if (allSeg > 0) {
        let count: number = 0;
        const allArray: string[] = [];
        setGroupArray([]);
        selectedMasterArray.allSegments.forEach((seg) => {
          allArray.push(seg.groupName);
          const allSegs= seg.segments.length;
          count= allSegs;
       });
       setGroupArray(allArray);
       setGroupName(selectedMasterArray.allSegments[0].groupName);
       setShortName(`${selectedMasterArray.short_code}${count + 1}`);
       setChildName(`${selectedMasterArray.name}${count + 1}`);
    }
    }
  },[selectedMasterArray])



  const handleSave = () => {

    dispatch(UpdateOtherSegmentDrawn({
      segType,
      groupName,
      childName,
      shortName: shortName,
      category:selectedCatogory
    }))
    dispatch(updateAddSegMessage(" Getting segment details..."));
    onSave()
  };

   const handleAddGroup = () => {
    const groupLength = groupArray.length;
    const newGroupName = `${segType}${groupLength + 1}`;
    setGroupArray([...groupArray, newGroupName]);
    // setGroupName(newGroupName);
    // setShortName(`${selectedMasterArray.short_code}${groupLength + 1}`);
    // setChildName(newGroupName);
   }
  return (
    <>
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                <a href="#" className="text-purple-600 underline mr-1">{segType}</a>
                /
                <a href="#" className="text-purple-600 underline mx-1">{groupName}</a>
                /
                <span className="ml-1">{shortName}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-4">
          {/* Wall and Categories Dropdowns in one line */}
          <div className="bg-purple-50 rounded-lg p-3 flex items-center justify-between gap-4">
            {/* Wall Dropdown */}
            <div className="flex items-center gap-2">
              {/* <span>{groupName}</span> */}
              <span>select group</span>
              <select
                className="bg-transparent outline-none"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              >
                <option value="">Select Group</option>
                {groupArray.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold"
                onClick={handleAddGroup}
              >+</button>
            </div>
            {/* Categories Dropdown */}
            <div className="flex items-center gap-2">
              <span>Categories</span>
              <select
                className="bg-transparent outline-none"
                value={selectedCatogory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {allcatogories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              onClick={onClose}
            >
              Delete
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>





    </>
  );
};

export default AddSegmentModal;
