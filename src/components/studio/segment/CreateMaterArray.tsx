import { MasterGroupModel, MasterModel } from '@/models/jobModel/JobModel';
import { setMasterArray } from '@/redux/slices/MasterArraySlice';
import { RootState } from '@/redux/store';
import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CreateMasterArray = () => {
  const { segments } = useSelector((state: RootState) => state.materialSegments);
  const dispatch = useDispatch();

  const { allSegments } = useSelector((state: RootState) => state.segments);
  const { currentProject } = useSelector((state: RootState) => state.projects);





    useEffect(() => {
    if (!segments || segments.length === 0) return;

    const segData: MasterModel[] = [];

    if (allSegments && allSegments.length === 0) {

      segments.forEach((segment) => {
        segData.push({
          id: segment.id,
          name: segment.name,
          color: segment.color,
          color_code: segment.color_code,
          short_code: segment.short_code,
          categories: segment.categories,
          overAllSwatch: [],
          allSegments: [],
        });
      });

      if (segData.length > 0) {
        dispatch(setMasterArray(segData));
      }
    } else {
      segments.forEach((segment) => {
        const grpName = segment.name;
        const sameGrpSeg: MasterGroupModel[] = [];
        const allsameGrp = allSegments.filter((item) => item.segment_type === grpName);
        const getallGrpName = Array.from(new Set(allsameGrp.map((item) => item.group_name)));

        getallGrpName.forEach((grp) => {
          const sameGrp = allsameGrp.filter((item) => item.group_name === grp);
          sameGrpSeg.push({
            groupName: grp ?? "",
            segments: sameGrp,
          });
        });

        segData.push({
          id: segment.id,
          name: segment.name,
          color: segment.color,
          color_code: segment.color_code,
          short_code: segment.short_code,
          categories: segment.categories,
          overAllSwatch: [],
          allSegments: sameGrpSeg,
        });
      });

      if (segData.length > 0) {
        dispatch(setMasterArray(segData));
      }
    }
  }, [segments, allSegments, currentProject, dispatch]);

  return null;
};

export default CreateMasterArray;
