import { MasterModel } from '@/models/jobModel/JobModel';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const CreateMaterArray = () => {
    const { segments } = useSelector(
        (state: RootState) => state.materialSegments
    );

      const { list: jobLists } = useSelector((state: RootState) => state.jobs);
  
      const [masterArray, setMasterArray] = React.useState<MasterModel[]>([]);

      useEffect(() => {
        if(segments &&
            segments.length>0 &&
            jobLists && jobLists[0] 
        ){
          if(jobLists[0].segments !== undefined &&
            jobLists[0].segments !== null ) {
                console.log("jobLists[0].segments", jobLists[0].segments);
          }else{
            const segData:MasterModel[] = [];
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
           setMasterArray(segData);
        }
    }
      }, [segments, jobLists]);

      console.log("masterArray", masterArray);

    return (
       null
    )
}

export default CreateMaterArray