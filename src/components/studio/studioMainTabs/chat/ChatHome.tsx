import React, { useEffect, useState } from 'react'
import RequestMasterImage from './RequestMasterImage';
import { useDispatch, useSelector } from 'react-redux';
import { addPrompt, resetInspirationImage, resetPaletteImage, submitGenAiRequest } from '@/redux/slices/visualizerSlice/genAiSlice';
import VoiceRecognition from '@/components/workSpace/projectWorkSpace/VoiceRecognition';
import { AppDispatch, RootState } from '@/redux/store';
import { updateIsGenLoading } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { toast } from 'sonner';
import ProcessImage from './ProcessImage';
import GalleryImage from './GalleryImage';
import MaskImage from './MaskImage';
import ChatPallet from './ChatPallet';
import ImagePalletInspirational from './ImagePalletInspirational';
const ChatHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests: genAiRequests } = useSelector((state: RootState) => state.genAi);
  const [inputPrompt, setInputPrompt] = React.useState<string>('');
 
  const { isGenLoading } = useSelector((state: RootState) => state.workspace);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  // update teh loading state when the genAiRequests change
  useEffect(() => {
    if (isGenLoading) {
      setIsLoading(isGenLoading);
    } else {
      setIsLoading(false);
    }
  }, [isGenLoading]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    const value = e.target.value;
    if (value.trim() !== '') {
      setInputPrompt(e.target.value);
      dispatch(addPrompt(value));
    } else {
      setInputPrompt('');
      dispatch(addPrompt(''));
    }
  }

  // update the inputPrompt state when the genAiRequests change
  useEffect(() => {
    if (genAiRequests && genAiRequests.prompt && genAiRequests.prompt[0]) {
      setInputPrompt(genAiRequests.prompt[0]);
    } else {
      setInputPrompt('');
    }
  }, [genAiRequests]);


  const handleGenerateAiImage = () => {
    if (!genAiRequests.houseUrl || genAiRequests.houseUrl.length === 0 || !genAiRequests.prompt || genAiRequests.prompt.length === 0) return toast.error("Please provide prompt before generating AI image.");
    dispatch(updateIsGenLoading(true));
    // Logic to generate AI image
    try {

      dispatch(
        submitGenAiRequest(genAiRequests)
      );

    } catch (error) {
      toast.error("Error generating AI image: " + (error as Error).message);


    }
  }

  const handleDeletePalletImage = (imageName: string | undefined) => {
   if(imageName==="palette" ) {
       dispatch(resetPaletteImage())
     }
  }
  const handleDeleteInspirationImage = (imageName: string | undefined) => {
     if(imageName==="inspiration" ) {
       dispatch(resetInspirationImage())
     }
  }
  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        {/* ===== Top Content ===== */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 max-w-md mx-auto bg-white">
            <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2 p-4">
              <span>187/250 Designs Left</span>
              <button className="px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 text-xs font-semibold">
                Buy More Credits
              </button>
            </div>

            <div className="p-4 mb-10">
              <div className="flex gap-3 ">
        
        <div className="grid grid-cols-2 gap-2">

                {/* pallet image  */}
                {genAiRequests  &&
                genAiRequests.paletteUrl &&
                genAiRequests.paletteUrl.length > 0 &&
                <ImagePalletInspirational 
                url={genAiRequests?.paletteUrl?.[0]}
                 name="palette" 
                 onDeleteImage={handleDeletePalletImage}
                 />}
                 {/* inspiration Image */}
                {genAiRequests  &&
                genAiRequests.referenceImageUrl &&
                genAiRequests.referenceImageUrl.length > 0 &&
                <ImagePalletInspirational 
                url={genAiRequests?.referenceImageUrl?.[0]}
                 name="inspiration" 
                 onDeleteImage={handleDeleteInspirationImage}
                 />}
               <MaskImage />

               </div>
                <RequestMasterImage />
              </div>
    

              {isLoading && <ProcessImage />}

              {/* <RequestOutput /> */}
            </div>
          </div>
        </div>

        {/* ===== Bottom-Sticky Composer ===== */}
        <div className="sticky bottom-12 inset-x-0 bg-white/95 backdrop-blur border-t pb-safe">
          <div className="max-w-md mx-auto p-3">
            <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
              {/* Textarea */}
              <div className="px-4 pt-3">
                <textarea
                  rows={2}
                  defaultValue="aaaaa"
                  value={inputPrompt}
                  className="w-full rounded-xl border-none p-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-0 resize-none"
                  placeholder="Type your prompt..."
                  spellCheck="false"
                  onChange={handleInputChange}
                />
              </div>

              {/* Bottom Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                {/* Left Icons */}
                <div className="flex items-center gap-2 text-sm text-gray-600">

                  <ChatPallet />
                  <GalleryImage />



                  <VoiceRecognition />
                </div>

                {/* Generate Button */}
                <button className="px-4 py-1.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium transition"
                  onClick={handleGenerateAiImage}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatHome