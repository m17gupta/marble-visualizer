import { MasterGroupModel, MasterModel } from "@/models";
import { createSlice } from "@reduxjs/toolkit";


interface MasterArrayState {
  masterArray: MasterModel[];
  selectedMasterArray?: MasterModel | null;
  selectedGroupSegment: MasterGroupModel | null;
  isCreatedMasterArray?: boolean;
}

const initialState: MasterArrayState = {
  masterArray: [],
  selectedMasterArray: null,
  selectedGroupSegment: null,
  isCreatedMasterArray: false,
};

const masterArraySlice = createSlice({
  name: "masterArray",
  initialState,
  reducers: {
    setMasterArray: (state, action) => {
      state.masterArray = action.payload;
      state.isCreatedMasterArray = true;
    },
    addSelectedMasterArray: (state, action) => {
      const mastArray = action.payload
      state.selectedMasterArray=mastArray
     
    },
    removeFromMasterArray: (state, action) => {
      state.masterArray = state.masterArray.filter(item => item !== action.payload);
    },
    updatedSelectedGroupSegment: (state, action) => {
      const groupSegment = action.payload;
      state.selectedGroupSegment = groupSegment;
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
          (group) => group.groupName === newSegment.group_label_system
        );

        if (existingGroup) {
          // Add to existing group
          existingGroup.segments.push(newSegment);
        } else {
          // Add new group with this segment
          allGroups.push({
            groupName: newSegment.group_label_system,
            segments: [newSegment],
          });
        }
      }else{
        existingSegment.allSegments = [{
          groupName: newSegment.group_label_system,
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
            (group) => group.groupName === newSegment.group_label_system
        );

        if (existingGroup) {
          // Add to existing group
          existingGroup.segments.push(newSegment);
        } else {
          // Add new group with this segment
          allGroups.push({
            groupName: newSegment.group_label_system,
            segments: [newSegment],
          });
        }
      }else{
        state.selectedMasterArray.allSegments = [{
          groupName: newSegment.group_label_system,
          segments: [newSegment],
        }];
      }
    }    
  },
    clearMasterArray: (state) => {
      state.masterArray = [];
      state.selectedMasterArray = null;
      state.selectedGroupSegment = null;
      state.isCreatedMasterArray = false;
    }
  },
});

export const {
  setMasterArray,
  addSelectedMasterArray,
  removeFromMasterArray,
  clearMasterArray,
  addNewSegmentToMasterArray,
  addNewSegmentToSelectedMasterArray,
  updatedSelectedGroupSegment
} = masterArraySlice.actions;

export default masterArraySlice.reducer;
