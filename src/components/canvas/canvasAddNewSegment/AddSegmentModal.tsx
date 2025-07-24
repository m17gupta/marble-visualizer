import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UpdateOtherSegmentDrawn } from '@/redux/slices/segmentsSlice';
// import 'bootstrap/dist/css/bootstrap.min.css';

interface AddSegmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
 
}



const AddSegmentModal: React.FC<AddSegmentModalProps> = ({ open, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [segType, setSegType] = useState('');

  const [groupName, setGroupName] = useState('');
  const [shortName, setShortName] = useState('');
  const [childName, setChildName] = useState('');
 const  [groupArray, setGroupArray] = useState<string[]>([]);
  const { selectedMasterArray } = useSelector((state: RootState) => state.masterArray);

  console.log("selectedMasterArray", selectedMasterArray);
  useEffect(() => {
    if( selectedMasterArray &&
        selectedMasterArray.name &&
        selectedMasterArray.allSegments &&
        selectedMasterArray.allSegments.length > 0 
    ) {
      setSegType(selectedMasterArray.name);
      const allSeg = selectedMasterArray.allSegments.length;
      if (allSeg == 1) {
        setGroupArray((prev) => [...prev, selectedMasterArray.allSegments[0].groupName]);
        const firstSeg = selectedMasterArray.allSegments[0];
        if (firstSeg && firstSeg.segments && firstSeg.segments.length == 0) {
          setGroupName(firstSeg.groupName ?? "");
          setShortName(selectedMasterArray.short_code + firstSeg.segments.length + 1);
          setChildName(selectedMasterArray.name + firstSeg.segments.length + 1);
        }


        }else if(allSeg > 1) {
            setGroupArray(selectedMasterArray.allSegments.map(seg => seg.groupName));
            setSegType(selectedMasterArray.name);
            // Reset groupName and childName if there are multiple segments
            setGroupName('');
            setChildName('');
        }
    }
  },[selectedMasterArray])
  const handleSave = () => {

    dispatch(UpdateOtherSegmentDrawn({
      segType,
      groupName,
      childName,
      shortName: shortName
    }))
    onSave()
  };

  return (
    <Modal show={open} onHide={onClose} backdrop="static" keyboard={false} centered size="lg">
      <Modal.Header closeButton>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-500">
            <a href="#" className="text-purple-600 underline mr-1">{segType}</a>
            /
            <a href="#" className="text-purple-600 underline mx-1">{groupName}</a>
            /
            <span className="ml-1">{shortName}</span>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-4">
          {/* Wall Dropdown */}
          <div className="bg-purple-50 rounded-lg p-3 flex items-center justify-between">
            <span>{groupName}</span>
            <div className="flex items-center gap-2">
              <select
                className="bg-transparent outline-none"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              >
                <option value="">Select Wall</option>
                {groupArray.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-purple-300 text-purple-600 text-lg font-bold">+</button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
          onClick={onClose}
        >
          Delete
        </Button>
        <Button
          variant="primary"
          className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSegmentModal;
