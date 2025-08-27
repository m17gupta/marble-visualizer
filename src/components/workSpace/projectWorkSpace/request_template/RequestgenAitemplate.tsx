import React, { useEffect } from 'react'

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GenAiRequestImage from '../genAiRequestsImage/GenAiRequestImage';

const RequestgenAitemplate = () => {

     const { requests } = useSelector((state: RootState) => state.genAi);
  const [requestPalletList, setRequestPalletList] = React.useState<string[]>(
    []
  );
  const [requestInspirationImage, setRequestInspirationImage] = React.useState<string[]>(
    []
  );

  // update pallet
  useEffect(() => {
    if (requests && requests.paletteUrl && requests.paletteUrl.length > 0) {
      setRequestPalletList(requests.paletteUrl);
    } else {
      setRequestPalletList([]);
    }
  }, [requests]);

  // upadte inspiration image
  
  return (
    <div className="flex items-baseline  gap-4 rounded-md border border-gray-200 bg-white px-2  mb-4 mx-4">
      <div className="flex flex-grow gap-2 overflow-x-auto scroll-thin p-2 ">
          
          {/* request pallet */}
           {requestPalletList &&
        requestPalletList.length > 0 &&
        requestPalletList.map((item, index) => (
          <GenAiRequestImage
            imageUrl={item}
            keytitle={"pallet"}
            segName={"WL"}
            index={index}
          />
        ))}

       {/* request for inspiration image  */}
      </div>
    </div>
  )
}

export default RequestgenAitemplate