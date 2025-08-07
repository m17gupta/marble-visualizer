import React from 'react'
import RenameGenAiNameModal from './RenameGenAiNameModal'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateGenAiChatTaskId, updateIsRenameGenAiModal } from '@/redux/slices/visualizerSlice/genAiSlice';
import { GenAiChat } from '@/models/genAiModel/GenAiModel';
import { toast } from 'sonner';

const RenameGenAiHome = () => {
    const dispatch = useDispatch<AppDispatch>();

   const { currentGenAiImage,isRenameGenAiModal } = useSelector((state: RootState) => state.genAi);

    const handleCloseModal = () => {
      dispatch(updateIsRenameGenAiModal(false));
    }


    const handleSaveGenAiImageData =async  (designName: string) => {
      if (currentGenAiImage) {
         dispatch(updateIsRenameGenAiModal(false));
        const data:  GenAiChat = {
          ...currentGenAiImage,
          name: designName, // Update the name with the new design name
        };
        
        try{
           await dispatch(updateGenAiChatTaskId(data)).unwrap();

        }catch(error){
          console.error("Error updating GenAI image:", error);
        }

      }else{
        toast.error("No GenAI image found to rename.");
      }
    }

  return (
   <RenameGenAiNameModal
     openModal={isRenameGenAiModal}
     onclose={handleCloseModal}
     afterImage={currentGenAiImage?.output_image||""}
     beforeImage={currentGenAiImage?.master_image_path||""}
     onSave={handleSaveGenAiImageData}
   />
  )
}

export default RenameGenAiHome