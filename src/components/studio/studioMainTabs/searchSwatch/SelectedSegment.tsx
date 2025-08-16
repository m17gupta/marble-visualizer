import { AppDispatch, RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchAllCategories, setFilterSwatchSegmentType } from '@/redux/slices/swatch/FilterSwatchSlice';

const SelectedSegment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {segments}= useSelector((state: RootState) => state.materialSegments);
    const {filterSwatch} = useSelector((state: RootState) => state.filterSwatch);
  
    const handleSegmentChange = async(value: string) => {
      if (value === "clear") {
        dispatch(setFilterSwatchSegmentType(null));
        return;
      }
      
      const segment = segments.find((segment) => segment.name === value);
      if (!segment) return;
      dispatch(setFilterSwatchSegmentType(segment));
      const response= await dispatch(fetchAllCategories(segment.categories));
      console.log("response", response);
    }
  return (
   <>
       <Select 
         value={filterSwatch.segment_types?.name || ""} 
         onValueChange={handleSegmentChange}
        //  className="w-100"
       >

      <SelectTrigger className="w-[160px] bg-white">
        <SelectValue placeholder="Select Segment" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Segment</SelectLabel>
          <SelectItem value="clear">
            <span className="text-gray-500 italic">Clear Selection</span>
          </SelectItem>
          {segments.map((segment) => (
            <SelectItem key={segment.id} value={segment.name}>
              {segment.name}
            </SelectItem>
          ))}
          
        </SelectGroup>
      </SelectContent>
    </Select>
   </>
  )
}

export default SelectedSegment