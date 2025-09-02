import React, { useEffect } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; // <-- Import HoverCard instead of Popover

// Note: I left the other imports in case you need them elsewhere.
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GenAiRequestImage from '../genAiRequestsImage/GenAiRequestImage';
import { RequestPaletteModel } from '@/models/genAiModel/GenAiModel';
import { addPrompt, addUpdateRequestPalette, resetInspirationImage, resetPaletteImage } from '@/redux/slices/visualizerSlice/genAiSlice';
import { url } from 'inspector';

const RequestgenAitemplate = () => {
   const dispatch = useDispatch();
     const { currentRequestPalette, requests ,inspirationNames} = useSelector((state: RootState) => state.genAi);
  const [requestPalletList, setRequestPalletList] = React.useState<RequestPaletteModel[]>(
    []
  );
  const [requestInspirationImage, setRequestInspirationImage] = React.useState<RequestPaletteModel[]>(
    []
  );

  // update pallet
  useEffect(() => {
    if (currentRequestPalette && currentRequestPalette.length > 0) {
      setRequestPalletList(currentRequestPalette);
    } else {
      setRequestPalletList([]);
    }
  }, [currentRequestPalette]);

  // update inspiration image
  useEffect(() => {
    if (requests.referenceImageUrl && requests.referenceImageUrl.length > 0) {
      const data={
        id:123,
        url:requests.referenceImageUrl[0],
        groupName: "",
        segments:[inspirationNames]
      }
      setRequestInspirationImage([data]);
    } else {
      setRequestInspirationImage([]);
    }
  }, [requests.referenceImageUrl]);

  const handleDeletePallet = (item: RequestPaletteModel) => {
    dispatch(addUpdateRequestPalette(item));
    if(currentRequestPalette && currentRequestPalette.length==1) {
       dispatch(resetPaletteImage())
    }
  };

  const handleDeleteInspiration=()=>{
     dispatch(resetInspirationImage());
    
  }

  const handleDeletePrompt=()=>{
    dispatch(addPrompt(""));
  }
  return (
    <div className="flex items-baseline gap-4 rounded-md border border-gray-200 bg-white px-2  mb-4 mx-4">
      <div className="flex flex-grow gap-2 overflow-x-auto scroll-thin p-2 "
      key="pallet"
      >
          {/* request pallet */}
           {requestPalletList &&
        requestPalletList.length > 0 &&
        requestPalletList.map((item, index) => (
          <GenAiRequestImage
            requestData={item}
            keytitle={"pallet"}
            onDelete={handleDeletePallet}
            
          />
        ))}

       {/* request for inspiration image  */}
       {requestInspirationImage &&
        requestInspirationImage.length > 0 &&
        requestInspirationImage.map((item, index) => (
          <GenAiRequestImage
            requestData={item}
            keytitle={"inspiration"}
            onDelete={handleDeleteInspiration}
          />
        ))}

        {/*  request for prompt  */}
       { requests &&
       requests.prompt &&
       requests.prompt.length > 0 &&
        
       <HoverCard>
          {/* Replace PopoverTrigger with HoverCardTrigger */}
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              className="flex w-40 items-center justify-between px-2"
            >
              {/* 1. Wrap the text in its own span */}
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {requests.prompt[0]}
              </span>

              {/* 2. The close icon */}
              <span className="ml-2 text-lg text-gray-500"
              onClick={handleDeletePrompt}
              >&times;</span>
            </Button>
          </HoverCardTrigger>

          {/* Replace PopoverContent with HoverCardContent */}
          <HoverCardContent
            className="w-[240px] rounded-xl p-3 shadow-lg"
            sideOffset={8}
          >
            <h6 className="mb-2 text-sm font-semibold">
             {requests.prompt[0]}
            </h6>
          </HoverCardContent>
        </HoverCard>}
      </div>
    </div>
  )
}

export default RequestgenAitemplate