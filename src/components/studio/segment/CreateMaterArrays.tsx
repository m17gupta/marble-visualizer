import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";

import { setMasterArray } from "@/redux/slices/MasterArraySlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateMasterArrays = () => {
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const dispatch = useDispatch();

  const { allSegments } = useSelector((state: RootState) => state.segments);
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const { isCreatedMasterArray } = useSelector(
    (state: RootState) => state.masterArray
  );

  const { isSegmentLoaded } = useSelector((state: RootState) => state.segments);

  useEffect(() => {
    if (!segments || segments.length === 0) return;

    const segData: MasterModel[] = [];
    if (
      allSegments &&
      allSegments.length > 0 &&
      segments &&
      segments.length > 0 &&
      !isCreatedMasterArray &&
      isSegmentLoaded
    ) {
      segments.forEach((segment) => {
        const grpName = segment.name;
        const sameGrpSeg: MasterGroupModel[] = [];
            const allsameGrp = allSegments.filter((item) => item.segment_type === grpName);
        const getallGrpName = Array.from(new Set(allsameGrp.map((item) => item.group_label_system)));
        // console.log("getallGrpName", getallGrpName);
        // const allsameGrp = allSegments.filter(
        //   (item) => item.segment_type === grpName
        // );
        // const getallGrpName = Array.from(
        //   new Set(                                      //group_label_system
        //     allsameGrp.map((item) => {                    //group_name_user
        //       if (item.group_label_system !== null) {
        //         return item.group_label_system;
        //       } else {
        //         return item.group_name_user;
        //       }
        //       // item.group_label_system;
        //     })
        //   )
        // );

        getallGrpName.forEach((grp) => {
           const sameGrp = allsameGrp.filter((item) => item.group_label_system === grp);
          // const sameGrp = allsameGrp.filter((item) => {
          //   if (item.group_name_user) {
          //     return item.group_name_user === grp;
          //   } else {
          //     return item.group_label_system == grp;
          //   }
          // });
          sameGrpSeg.push({
            groupName: grp ?? "",
            segments: sameGrp,
          });
        });
        if (sameGrpSeg.length > 0) {
          segData.push({
            id: segment.id,
            name: segment.name,
            icon: segment.icon,
            color: segment.color,
            color_code: segment.color_code,
            short_code: segment.short_code,
            categories: segment.categories,
            overAllSwatch: [],
            allSegments: sameGrpSeg,
          });
        }
      });

      if (segData.length > 0) {
        dispatch(setMasterArray(segData));
      }
    }
   
  }, [
    isSegmentLoaded,
    segments,
    allSegments,
    currentProject,
    isCreatedMasterArray,
  ]);

  return null;
};

export default CreateMasterArrays;
