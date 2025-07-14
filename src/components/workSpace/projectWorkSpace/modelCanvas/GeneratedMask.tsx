import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TrashIcon } from '@radix-ui/react-icons';
import { CanvasModel } from '@/models/canvasModel/CanvasModel';
import { deleteMask } from '@/redux/slices/canvasSlice';



const GeneratedMask = () => {
    const{masks}= useSelector((state: RootState) => state.canvas);

    const [allMasks, setAllMasks] = React.useState<CanvasModel[]>([])
     const dispatch = useDispatch<AppDispatch>();

        useEffect(() => {
            if (masks && masks.length > 0) {
                setAllMasks(masks);
            }else{
                setAllMasks([]);
            }
        }, [masks]);


        const handleDeleteMask = (maskId: number) => {
        dispatch(deleteMask(maskId));
        
        };
      return (
    <>
    {allMasks && allMasks.length > 0 ? (
      <div className="space-y-4">
        {allMasks.map((mask, index) => (
          <div key={index} className="flex items-center justify-between">
            <h4>{mask.name}</h4>
            {/* delete icon */}
            <button className="text-red-500 hover:text-red-700 p-1"
             onClick={()=>handleDeleteMask(mask.id)}>
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No masks generated yet.</p>
    )}
    
  </>
  )
}

export default GeneratedMask