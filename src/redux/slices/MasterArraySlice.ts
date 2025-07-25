import { MasterModel } from "@/models";
import { createSlice } from "@reduxjs/toolkit";


interface MasterArrayState {
  masterArray: MasterModel[];
  selectedMasterArray?: MasterModel | null;
}

const initialState: MasterArrayState = {
  masterArray: [],
  selectedMasterArray: null,
};

const masterArraySlice = createSlice({
  name: "masterArray",
  initialState,
  reducers: {
    setMasterArray: (state, action) => {
      state.masterArray = action.payload;
    },
    addSelectedMasterArray: (state, action) => {
      const segName = action.payload
      state.selectedMasterArray = state.masterArray.find(
        (item) => item.name === segName
      ) || null;
    },
    removeFromMasterArray: (state, action) => {
      state.masterArray = state.masterArray.filter(item => item !== action.payload);
    },
    addNewSegmentToMasterArray: (state, action) => {
      const newSegment = action.payload;
      const existingSegment = state.masterArray.find(
        (item) => item.name === newSegment.segment_type
      );

      if (existingSegment) {
        const allGroups = existingSegment.allSegments ;
        if(allGroups.length>0){
        // Check if group already exists
        const existingGroup = allGroups.find(
          (group) => group.groupName === newSegment.group_name
        );

        if (existingGroup) {
          // Add to existing group
          existingGroup.segments.push(newSegment);
        } else {
          // Add new group with this segment
          allGroups.push({
            groupName: newSegment.group_name,
            segments: [newSegment],
          });
        }
      }else{
        existingSegment.allSegments = [{
          groupName: newSegment.group_name,
          segments: [newSegment],
        }];
      }

        // Assign back if allSegments was undefined (for safety)
        // existingSegment.allSegments = allGroups;
      }
    },
    addNewSegmentToSelectedMasterArray: (state, action) => {
      const newSegment = action.payload;
      if (state.selectedMasterArray) {
        const allGroups = state.selectedMasterArray.allSegments;
        // Check if group already exists
        if (allGroups.length > 0) {
          const existingGroup = allGroups.find(
            (group) => group.groupName === newSegment.group_name
        );

        if (existingGroup) {
          // Add to existing group
          existingGroup.segments.push(newSegment);
        } else {
          // Add new group with this segment
          allGroups.push({
            groupName: newSegment.group_name,
            segments: [newSegment],
          });
        }
      }else{
        state.selectedMasterArray.allSegments = [{
          groupName: newSegment.group_name,
          segments: [newSegment],
        }];
      }
    }    
  },
    clearMasterArray: (state) => {
      state.masterArray = [];
      state.selectedMasterArray = null;
    }
  },
});

export const {
  setMasterArray,
  addSelectedMasterArray,
  removeFromMasterArray,
  clearMasterArray,
  addNewSegmentToMasterArray,
  addNewSegmentToSelectedMasterArray
} = masterArraySlice.actions;

export default masterArraySlice.reducer;
