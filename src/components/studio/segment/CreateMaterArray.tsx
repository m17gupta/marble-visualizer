import { MasterModel } from '@/models/jobModel/JobModel';
import { setMasterArray } from '@/redux/slices/MasterArraySlice';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const CreateMaterArray = () => {
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const dispatch = useDispatch();

  const { list: jobLists } = useSelector((state: RootState) => state.jobs);

  
  useEffect(() => {
    if (segments &&
      segments.length > 0 &&
      jobLists && jobLists[0]
    ) {
      if (jobLists[0].segments !== undefined &&
        jobLists[0].segments !== null) {
        const segData: MasterModel[] = [];
      } else {
        const segData: MasterModel[] = [];
        segments.map((segment) => {
          segData.push({
            id: segment.id,
            name: segment.name,
            color: segment.color,
            color_code: segment.color_code,
            short_code: segment.short_code,
            overAllSwatch: [],
            allSegments: [
              {
                groupName: `${segment.name}1`,
                segments: []
              }
            ]
          });
        });
        if (segData.length > 0) {
          dispatch(setMasterArray(segData));
          
        }
      }
    }
  }, [segments, jobLists]);

  

  return (
    null
  )
}

export default CreateMaterArray