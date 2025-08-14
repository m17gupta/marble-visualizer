import { AppDispatch, RootState } from '@/redux/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateScreenShotUrl } from '@/redux/slices/canvasSlice';
import { resetMaskIntoRequest } from '@/redux/slices/visualizerSlice/genAiSlice';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogClose,
} from '@/components/ui/morphing-dialog';

const MaskImage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { screenShotUrl } = useSelector((state: RootState) => state.canvas);
    
    console.log("MaskImage component rendered with screenShotUrl:", screenShotUrl);
    // Check if screenShotUrl is a valid base64 string
    const isValidBase64Image = screenShotUrl && (
        screenShotUrl.startsWith('data:image/') || 
        screenShotUrl.startsWith('http')
    );

    if (!isValidBase64Image) {
        return null;
    }


    const handleRemoveMaskImage = () => {
        dispatch(resetMaskIntoRequest()); // Reset the mask into request
    dispatch(updateScreenShotUrl(null)); // Clear the screenshot URL
    }
    return (
        <>
        {screenShotUrl &&
        screenShotUrl !== null &&
        <MorphingDialog>
            <MorphingDialogTrigger asChild>
                <div className="relative w-16 h-16 rounded overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity">
                    <MorphingDialogImage
                        src={screenShotUrl}
                        alt="Canvas Screenshot"
                        className="object-cover w-full h-full"
                        style={{
                            borderRadius: '4px',
                        }}
                    />
                    <button 
                        className="absolute pt-3 pb-3 px-3 w-4 h-5 top-0 right-0 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMaskImage();
                        }}
                        aria-label="Remove screenshot"
                    >
                        <span className="text-ms leading-3 text-red-500 font-bold items-center flex">×</span>
                    </button>
                </div>
            </MorphingDialogTrigger>
            
            <MorphingDialogContent
                style={{
                    borderRadius: '12px',
                }}
                className='relative h-auto w-[800px] max-w-[90vw] border border-gray-100 bg-white'
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 24,
                }}
            >
                <div className='relative p-6'>
                    <div className='flex justify-center py-10'>
                        <MorphingDialogImage
                            src={screenShotUrl}
                            alt="Canvas Screenshot"
                            className='h-auto w-full max-w-[600px] object-contain'
                        />
                    </div>
                    <div className=''>
                        <MorphingDialogTitle className='text-black'>
                            Canvas Screenshot
                        </MorphingDialogTitle>
                        <div className='mt-4 text-sm text-gray-700'>
                            <p>
                                This is your canvas screenshot that can be used for mask operations and AI processing.
                            </p>
                        </div>
                    </div>
                </div>
                <MorphingDialogClose className='text-zinc-500' />
            </MorphingDialogContent>
        </MorphingDialog>}
        </>
    );
};

export default MaskImage;