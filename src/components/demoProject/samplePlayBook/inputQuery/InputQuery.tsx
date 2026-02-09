import ChatPallet from '@/components/studio/studioMainTabs/chat/ChatPallet';
import GalleryImage from '@/components/studio/studioMainTabs/chat/GalleryImage';
import { SwtichMode } from '@/components/studio/studioMainTabs/chat/SwtichMode';
import VoiceRecognition from '@/components/workSpace/projectWorkSpace/VoiceRecognition';
import { addPrompt } from '@/redux/slices/visualizerSlice/genAiSlice';
import { setPrompt } from '@/redux/slices/visualizerSlice/SinglePalletGenAiSlice';
import { updateIsGenLoading } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const InputQuery = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { requests: genAiRequests } = useSelector(
        (state: RootState) => state.genAi
    );

    const { isGenLoading } = useSelector((state: RootState) => state.workspace);

    const [inputPrompt, setInputPrompt] = useState("");
    const { genAiImageMode } = useSelector((state: RootState) => state.genAi);
    const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (genAiRequests?.prompt?.[0]) setInputPrompt(genAiRequests.prompt[0]);
        else setInputPrompt("");
    }, [genAiRequests])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputPrompt(value);
        dispatch(addPrompt(value.trim() ? value : ""));
        dispatch(setPrompt(value.trim() ? value : ""));
    };

    const handleGenerateAiImage = () => {
        if (isGenLoading) {
            toast.error("Please wait for the previous image to be generated");
            return;
        }
        // if (userSubscriptionPlan && userSubscriptionPlan?.credits > 0) {
        if (genAiImageMode === "api_mode") {


            //  requestGenAiApiMode();
        } else {
            requestForSinglePallet();
        }
    }

    const requestForSinglePallet = async () => {
        // if (!genAiRequests?.houseUrl?.length || !genAiRequests?.prompt?.length) {
        //   return toast.error("Please provide prompt before generating AI image.");
        // }
        // setIsInputDisabled(true);
        // dispatch(updateIsGenLoading(true));
        // try {
        //   dispatch(submitGenAiRequest(genAiRequests));
        // } catch (error) {
        //   toast.error("Error generating AI image: " + (error as Error).message);
        //   setIsInputDisabled(false);
        // }
    };

    return (
        <>
            <div className="gemini-input-wrapper">
                <div className="w-full overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="px-4 pt-3">
                        <textarea
                            rows={2}
                            value={inputPrompt}
                            className="w-full p-2 text-sm text-gray-800 border-none outline-none resize-none rounded-xl placeholder:text-gray-400 focus:ring-0"
                            placeholder="Type your prompt..."
                            spellCheck="false"
                            onChange={handleInputChange}
                            disabled={isGenLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            {/* <PalletHoverCart /> */}
                            {/* <ChatPallet />
                            <GalleryImage /> */}
                            <VoiceRecognition />

                            <SwtichMode />
                        </div>

                        <button
                            className="px-4 py-1.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium transition"
                            // onClick={handleGenerateAiImage}
                            onClick={() => {
                                if (
                                    genAiImageMode === "api_mode"
                                ) {
                                    // toast.error("The selected segment type does not have annotation points.", {
                                    //   style: { color: 'white' }
                                    // });
                                    // setIsInputDisabled(false);
                                    // dispatch(updateIsGenLoading(false));
                                    // return;
                                    handleGenerateAiImage();
                                }
                                // handleGenerateAiImage();
                            }}
                        // disabled={isGenLoading}
                        >
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InputQuery