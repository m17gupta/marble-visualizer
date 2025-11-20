
import { useSelector } from "react-redux";
import EditDeleteTemplate from "./template/EditDeleteTemplate";
import EditReannotationTemplate from "./template/EditReannotationTemplate";
import { RootState } from "@/redux/store";

interface SegmentEditCompProps {
  optionEdit?: string;
  onCancel: () => void;
}

export const SegmentEditComp = ({
  optionEdit,
  onCancel,
}: SegmentEditCompProps) => {
  // const dispatch = useDispatch<AppDispatch>();

  const { activeOption } = useSelector((state: RootState) => state.segments);



  return (
    <div className="w-full bg-white  rounded-lg shadow  py-2 flex flex-col overflow-y-auto max-h-[70vh] sm:max-h-[70vh] ">

      {activeOption &&
      activeOption==="edit-segment" &&(
        <EditDeleteTemplate/>
      )
      }

      
      {activeOption &&
      activeOption==="edit-annotation" &&(
        <EditReannotationTemplate/>
      )
      }
     
    </div>
  );
};
