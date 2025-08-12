import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

const RequestPallet = () => {
    // const dispatch = useDispatch<AppDispatch>();
    const { requests: genAiRequests } = useSelector((state: RootState) => state.genAi);
    return (
        <>
           {genAiRequests.paletteUrl &&
            genAiRequests.paletteUrl.length > 0 &&
            <div className="relative w-16 h-16 rounded overflow-hidden border">
                <img
                   // src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/CarolynReformatted_1753799607502_hgvazm.jpg"
                   src={genAiRequests?.paletteUrl[0] || "https://via.placeholder.com/150"}
                    alt="Thumb"
                    className="object-cover w-full h-full"
                />
                <button className="absolute pt-3 pb-3 px-3 w-4 h-5 top-0 right-0 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-ms leading-3 text-red-500 font-bold items-center flex">×</span>
                </button>
            </div>}
        </>
    )
}

export default RequestPallet