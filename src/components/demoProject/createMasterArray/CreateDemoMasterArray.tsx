import { DemoMasterModel } from '@/models/demoModel/DemoMaterArrayModel';
import { MasterModel } from '@/models/jobModel/JobModel';
import { setDemoMasterArray } from '@/redux/slices/demoProjectSlice/DemoMasterArraySlice';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const CreateDemoMasterArray = () => {
  const dispatch = useDispatch();

  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const { allSegments, isSegmentLoaded } = useSelector((state: RootState) => state.segments);
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const { isdemoMasterArrayCreated } = useSelector((state: RootState) => state.demoMasterArray);
  useEffect(() => {
    if (!segments || segments.length === 0) return;

    const segData: DemoMasterModel[] = [];
    if (
      allSegments &&
      allSegments.length > 0 &&
      segments &&
      segments.length > 0 &&
      !isdemoMasterArrayCreated &&
      isSegmentLoaded
    ) {
      segments.forEach((segment) => {
        const grpName = segment.name;
        const allsameGrp = allSegments.filter((item) => item.segment_type === grpName);


        if (allsameGrp.length > 0) {
          segData.push({
            id: segment.id,
            name: segment.name,
            icon: segment.icon,
            color: segment.color,
            color_code: segment.color_code,
            short_code: segment.short_code,
            categories: segment.categories,
            overAllSwatch: [],
            allSegments: allsameGrp,
          });
        }
      });

      if (segData.length > 0) {
        dispatch(setDemoMasterArray(segData));
      }
    }

  }, [
    isSegmentLoaded,
    segments,
    allSegments,
    currentProject,
    isdemoMasterArrayCreated,
  ]);

  return (
    null
  )
}

export default CreateDemoMasterArray