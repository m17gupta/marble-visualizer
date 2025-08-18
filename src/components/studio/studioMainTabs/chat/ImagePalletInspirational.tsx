import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";

type Props={
    url:string
    name:string
    onDeleteImage: (imageName: string) => void;
}
const ImagePalletInspirational = ({url, name, onDeleteImage}:Props) => {
    // Check if paletteUrl exists, has length, and contains non-empty strings
    const hasValidPaletteUrl = url && url.trim() !== '';

    const handleDeleteImage = (imageName: string) => {
        onDeleteImage(imageName);
    }
  return (
     <>
           {hasValidPaletteUrl &&
            <div className="relative w-14 h-14 rounded overflow-hidden border">
                <LazyLoadImage

                   src={url || "https://via.placeholder.com/150"}
                    alt={name}
                    className="object-cover w-full h-full"
                />
                <button className="absolute pt-2 pb-2 px-2 w-4 h-3 top-0 right-0 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-ms leading-3 text-red-500 font-bold items-center flex"
                    onClick={() => handleDeleteImage(name)}
                    >×</span>
                </button>
            </div>}
        </>
  )
}

export default ImagePalletInspirational