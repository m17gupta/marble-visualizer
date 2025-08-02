import React, { useEffect, useState } from 'react'
import SegmentEditModal from './SegmentEditModal'
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateIsSegmentEdit } from '@/redux/slices/segmentsSlice';

const SegmentHome = () => {

    const dispatch = useDispatch();
    const [ isOpen, setIsOpen] = useState(false);

        const {isSegmentEdit} = useSelector((state: RootState) => state.segments);
  


useEffect(() => {
    if(isSegmentEdit) {
      setIsOpen(isSegmentEdit);
    }else{
        setIsOpen(false);
    }
}, [isSegmentEdit]);


const handleCloseEditModal = () => {
    dispatch(updateIsSegmentEdit(false))
    setIsOpen(false);
  };
  return (
    <>
    <SegmentEditModal
    open={isOpen}
    onClose={handleCloseEditModal}
    />
    </>
  )
}

export default SegmentHome