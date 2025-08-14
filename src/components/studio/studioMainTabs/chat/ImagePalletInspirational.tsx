import React from 'react'


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
            <div className="relative w-16 h-16 rounded overflow-hidden border">
                <img

                   src={url || "https://via.placeholder.com/150"}
                    alt={name}
                    className="object-cover w-full h-full"
                />
                <button className="absolute pt-3 pb-3 px-3 w-4 h-5 top-0 right-0 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-ms leading-3 text-red-500 font-bold items-center flex"
                    onClick={() => handleDeleteImage(name)}
                    >×</span>
                </button>
            </div>}
        </>
  )
}

export default ImagePalletInspirational