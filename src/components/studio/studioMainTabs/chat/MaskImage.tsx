import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateScreenShotUrl } from '@/redux/slices/canvasSlice';
import { RootState } from '@/redux/store';

// Props: requestData (object with id, url), keytitle (string), allSeg (string), onDelete (function)
const MaskImage = () => {
  const keytitle = "mask";
  const dispatch = useDispatch();
  const { screenShotUrl } = useSelector((state: RootState) => state.canvas);
  const handleClearImage = (e: React.MouseEvent) => {
    dispatch(updateScreenShotUrl(null));
  };
  if (!screenShotUrl) return null;
  return (
    <HoverCard key={`${keytitle}-${screenShotUrl}`}>
      <HoverCardTrigger asChild key={screenShotUrl}>
        <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#25f474] bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105 relative">
          {typeof screenShotUrl === 'string' && (
            <>
              <img
                src={screenShotUrl}
                alt="user-input"
                className="h-20 w-15 rounded-md object-cover"
              />
              <button
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 z-10"
                onClick={handleClearImage}
                aria-label="Clear image"
              >
                <span className="text-lg text-red-500">&times;</span>
              </button>
            </>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[240px] rounded-xl p-3 shadow-lg"
        sideOffset={8}
      >
        <h6 className="mb-2 text-md font-semibold">Mask</h6>
        {typeof screenShotUrl === 'string' && (
          <img src={screenShotUrl} alt="seg-img" className="rounded-md" />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default MaskImage;