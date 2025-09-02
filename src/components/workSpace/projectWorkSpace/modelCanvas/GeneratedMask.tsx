import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TrashIcon } from '@radix-ui/react-icons';
import { CanvasModel } from '@/models/canvasModel/CanvasModel';
import { deleteMask, resetCanvas, setCanvasType, setIsCanvasModalOpen, updateIsScreenShotTaken } from '@/redux/slices/canvasSlice';
import { AnnotationValue } from '@/models/genAiModel/GenAiModel';
import { updateMaskIntoRequest } from '@/redux/slices/visualizerSlice/genAiSlice';



const GeneratedMask = () => {
  const { masks } = useSelector((state: RootState) => state.canvas);

  const [allMasks, setAllMasks] = React.useState<CanvasModel[]>([])
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (masks && masks.length > 0) {
      setAllMasks(masks);
    } else {
      setAllMasks([]);
    }
  }, [masks]);


  const handleDeleteMask = (maskId: number) => {
    dispatch(deleteMask(maskId));

  };
  

  const handleMask = () => {
    const allAnnotations:AnnotationValue={}
    if(allMasks && allMasks.length>0){

      allMasks.forEach((mask,index) => {
        allAnnotations[`additionalProp${index+1}`] = mask.annotations;
      });
    }
    dispatch(updateMaskIntoRequest(allAnnotations));
    // dispatch(setCanvasType("hover"));
    dispatch(updateIsScreenShotTaken(true)); // Reset screenshot taken flag
  }

  const handleCancel = () => {
    dispatch(setCanvasType("draw"));
    dispatch(resetCanvas())
    dispatch(setIsCanvasModalOpen(false));
  };
  return (
    <>
      {allMasks && allMasks.length > 0 ? (
        <div className="space-y-4">
          {allMasks.map((mask, index) => (
            <div key={index} className="flex items-center justify-between">
              <h4>{`mask-${index+1}`}</h4>
              {/* delete icon */}
              <button className="text-red-500 hover:text-red-700 p-1"
                onClick={() => handleDeleteMask(mask.id)}>
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No masks generated yet.</p>
      )}

      {/* button and cancel and submit */}
      <div className="flex justify-end space-x-2">
        <button className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          onClick={handleCancel}
        >Cancel</button>
        <button className="px-3 py-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"

          onClick={handleMask}>Submit</button>
      </div>
    </>
  )
}

export default GeneratedMask