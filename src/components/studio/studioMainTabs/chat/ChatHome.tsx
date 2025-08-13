import React, { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import RequestMasterImage from './RequestMasterImage';
import RequestPallet from './RequestPallet';
import RequestOutput from './RequestOutput';
import { useDispatch, useSelector } from 'react-redux';
import { addPrompt, submitGenAiRequest } from '@/redux/slices/visualizerSlice/genAiSlice';
import VoiceRecognition from '@/components/workSpace/projectWorkSpace/VoiceRecognition';
import { AppDispatch, RootState } from '@/redux/store';
import { updateIsGenLoading } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { GenAiRequest } from '@/models/genAiModel/GenAiModel';
import { toast } from 'sonner';
import ProcessImage from './ProcessImage';
import GalleryImage from './GalleryImage';
import MaskImage from './MaskImage';
import ChatPallet from './ChatPallet';
const ChatHome = () => {
  const dispatch = useDispatch<AppDispatch>();
      const { requests: genAiRequests } = useSelector((state: RootState) => state.genAi);
   const [inputPrompt, setInputPrompt] = React.useState<string>('');
      const { list: projects } = useSelector((state: RootState) => state.projects);

     const {isGenLoading} = useSelector((state: RootState) => state.workspace);
     const [isLoading , setIsLoading] = useState<boolean>(false);


     // update teh loading state when the genAiRequests change
     useEffect(() => {
      if(isGenLoading) {
        setIsLoading(isGenLoading);
      }else{
        setIsLoading(false);
      }
    }, [isGenLoading]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
 
    const value= e.target.value;
    if (value.trim() !== '') {
        setInputPrompt(e.target.value);
      dispatch(addPrompt(value));
    }else{
      setInputPrompt('');
      dispatch(addPrompt(''));
    }
  }

  // update the inputPrompt state when the genAiRequests change
useEffect(() => {
  if(genAiRequests && genAiRequests.prompt && genAiRequests.prompt[0]) {
    setInputPrompt(genAiRequests.prompt[0]);
  }else{
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
            <div className="flex gap-3">
            
                   <RequestPallet/>
                   
                   <MaskImage/>

                   <RequestMasterImage/>

                   

            
              
            </div>

                  { isLoading &&<ProcessImage/>}

             <RequestOutput/>
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
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-1 hover:text-purple-600 px-1 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bricks" viewBox="0 0 16 16">
                        <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5zM3 4v2h4.5V4zm5.5 0v2H13V4zM3 10v2h4.5v-2zm5.5 0v2H13v-2zM1 1v2h3.5V1zm4.5 0v2h5V1zm6 0v2H15V1zM1 7v2h3.5V7zm4.5 0v2h5V7zm6 0v2H15V7zM1 13v2h3.5v-2zm4.5 0v2h5v-2zm6 0v2H15v-2z"></path>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Pallet</p>
                  </TooltipContent>
                </Tooltip> */}

                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-base hover:text-purple-600 transition p-0" >
                      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.7482 8.99633C14.4375 8.99633 14.9963 8.43751 14.9963 7.74817C14.9963 7.05882 14.4375 6.5 13.7482 6.5C13.0588 6.5 12.5 7.05882 12.5 7.74817C12.5 8.43751 13.0588 8.99633 13.7482 8.99633Z" fill="#212121"></path>
                        <path d="M6.25 3C4.45507 3 3 4.45507 3 6.25V15.25C3 17.0449 4.45507 18.5 6.25 18.5H15.25C17.0449 18.5 18.5 17.0449 18.5 15.25V6.25C18.5 4.45507 17.0449 3 15.25 3H6.25ZM4.5 6.25C4.5 5.2835 5.2835 4.5 6.25 4.5H15.25C16.2165 4.5 17 5.2835 17 6.25V15.25C17 15.4812 16.9552 15.7018 16.8738 15.9038L12.2867 11.6128C11.4217 10.8036 10.0775 10.8036 9.21252 11.6128L4.62602 15.9033C4.54474 15.7015 4.5 15.481 4.5 15.25V6.25ZM11.262 12.7082L15.7669 16.9224C15.6035 16.9728 15.4299 17 15.25 17H6.25C6.06985 17 5.89607 16.9728 5.73252 16.9222L10.2372 12.7082C10.5256 12.4385 10.9736 12.4385 11.262 12.7082Z" fill="#212121"></path>
                        <path d="M8.74995 21.0002C7.59927 21.0002 6.58826 20.4022 6.01074 19.5H8.72444L8.74995 19.5002H15.7499C17.821 19.5002 19.5 17.8212 19.5 15.7502V6.01108C20.402 6.58861 21 7.59956 21 8.75017V15.7502C21 18.6497 18.6494 21.0002 15.7499 21.0002H8.74995Z" fill="#212121"></path>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Image</p>
                  </TooltipContent>
                </Tooltip> */}
<ChatPallet/>
                <GalleryImage/>

                {/* <button className="text-base hover:text-purple-600 transition p-0 text-center" title="Start voice recording">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="text-xl cursor-pointer transition-colors text-gray-500 hover:text-gray-700" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path>
                  </svg>
                </button> */}

                <VoiceRecognition/>
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