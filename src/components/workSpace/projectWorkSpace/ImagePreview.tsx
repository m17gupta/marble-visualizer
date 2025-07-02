import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';



const ImagePreview: React.FC = () =>{
  
  const {viewFiles} = useSelector((state:RootState) => state.workspace);

  const src = viewFiles.image; // Assuming you want to show the front view image
 const altType = viewFiles.viewType??"front"; // Assuming you want to show the view type as alt text

  return(
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
    {src ? <img src={src} alt={altType} className="max-h-full" /> : <span className="text-gray-500">No Image</span>}
  </div>
);
}
export default ImagePreview;
