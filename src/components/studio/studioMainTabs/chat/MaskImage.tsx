import { AppDispatch, RootState } from '@/redux/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { updateScreenShotUrl } from '@/redux/slices/canvasSlice';
import { resetMaskIntoRequest } from '@/redux/slices/visualizerSlice/genAiSlice';

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
        screenShotUrl!== null &&
        <div className="relative w-16 h-16 rounded overflow-hidden border">
            <LazyLoadImage
                src={screenShotUrl}
                alt="Canvas Screenshot"
                className="object-cover w-full h-full"
                placeholder={<div className="w-full h-full bg-gray-200 animate-pulse" />}
                effect="blur"
                onError={(e) => {
                    console.error("Error loading screenshot image:", e);
                }}
            />
            <button 
                className="absolute pt-3 pb-3 px-3 w-4 h-5 top-0 right-0 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                onClick={() => {
                   handleRemoveMaskImage();
                }}
                aria-label="Remove screenshot"
            >
                <span className="text-ms leading-3 text-red-500 font-bold items-center flex">×</span>
            </button>
        </div>}
        </>
    );
};

export default MaskImage;