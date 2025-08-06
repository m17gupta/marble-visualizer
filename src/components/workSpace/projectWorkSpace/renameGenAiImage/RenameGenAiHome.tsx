import React from 'react'
import RenameGenAiNameModal from './RenameGenAiNameModal'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateIsRenameGenAiModal } from '@/redux/slices/visualizerSlice/genAiSlice';

const RenameGenAiHome = () => {
    const dispatch = useDispatch<AppDispatch>();

   const { currentGenAiImage,isRenameGenAiModal } = useSelector((state: RootState) => state.genAi);

    const handleCloseModal = () => {
      dispatch(updateIsRenameGenAiModal(false));
    }
  return (
   <RenameGenAiNameModal
     openModal={isRenameGenAiModal}
     onclose={handleCloseModal}
     afterImage={currentGenAiImage?.output_image||""}
     beforeImage={currentGenAiImage?.master_image_path||""}
     onSave={(name) => console.log(name)}
   />
  )
}

export default RenameGenAiHome