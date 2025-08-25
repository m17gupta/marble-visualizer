import { MasterGroupModel, MasterModel } from "@/models";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { createSlice } from "@reduxjs/toolkit";


interface MasterArrayState {
  masterArray: MasterModel[];
  selectedMasterArray?: MasterModel | null;
  selectedGroupSegment: MasterGroupModel | null;
  selectedSegment?: SegmentModal | null;
  isCreatedMasterArray?: boolean;
  userSelectedSegment?: SegmentModal[]
}

const initialState: MasterArrayState = {
  masterArray: [],
  selectedMasterArray: null,
  selectedGroupSegment: null,   
  selectedSegment: null,
  // Initialize isCreatedMasterArray to false
  isCreatedMasterArray: false,
  userSelectedSegment: []
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
      state.selectedMasterArray = mastArray

    },
    removeFromMasterArray: (state, action) => {
      state.masterArray = state.masterArray.filter(item => item !== action.payload);
    },
    addNewSegmentType: (state, action) => {
      const newSegmentType = action.payload;
      state.masterArray.push(newSegmentType);
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
        const allGroups = existingSegment.allSegments;
        if (allGroups.length > 0) {
          // Check if group already exists
          const existingGroup = allGroups.find(
            (group) => group.groupName === newSegment.group_label_system
          );

          if (existingGroup) {
            //check if segment already exists in the group
            const existingSegment = existingGroup.segments.find(
              (seg) => seg.id === newSegment.id
            );
            if (!existingSegment) {
              existingGroup.segments.push(newSegment);
              state.selectedSegment = newSegment;
            } else {
              // remove and add new segment
              existingGroup.segments = existingGroup.segments.filter(seg => seg.id !== newSegment.id);
              existingGroup.segments.push(newSegment);
              state.selectedSegment = newSegment;
            }
          } else {
            // Add new group with this segment
            allGroups.push({
              groupName: newSegment.group_label_system,
              segments: [newSegment],
            });
            state.selectedSegment = newSegment;
          }
        } else {
          existingSegment.allSegments = [{
            groupName: newSegment.group_label_system,
            segments: [newSegment],
          }];
          state.selectedSegment = newSegment;
        }

        // Assign back if allSegments was undefined (for safety)
        // existingSegment.allSegments = allGroups;
      } else {
        const segArray = state.selectedMasterArray
        if (segArray && segArray.name === newSegment.segment_type) {

          const newMasterArray: MasterModel = {
            id: segArray.id,
            name: segArray.name,
            icon: segArray.icon,
            color_code: segArray.color_code,
            color: segArray.color,
            short_code: segArray.short_code,
            overAllSwatch: [],
            categories: segArray.categories,
            allSegments: [
              {
                groupName: newSegment.group_label_system,
                segments: [newSegment],
              }
            ],
          }
          state.masterArray.push(newMasterArray);
        }
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
        } else {
          state.selectedMasterArray.allSegments = [{
            groupName: newSegment.group_label_system,
            segments: [newSegment],
          }];
        }
      }
    },
    deletedChangeGroupSegment: (state, action) => {
      const updatedSegment = action.payload;
      const oldSeg = state.selectedSegment;
      if (oldSeg &&
        oldSeg.segment_type &&
        oldSeg.group_label_system &&
        oldSeg.id
      ) {
        const index = state.masterArray.findIndex(seg => seg.name === oldSeg.segment_type);
        if (index !== -1) {
          // remove existed segment
          const segArrayIndex = state.masterArray[index].allSegments.findIndex(seg => seg.groupName === oldSeg.group_label_system);
          if (segArrayIndex !== -1) {
            state.masterArray[index].allSegments[segArrayIndex].segments = state.masterArray[index].allSegments[segArrayIndex].segments.filter(seg => seg.id !== oldSeg.id);
            // If no segments left in the group, remove the group
            if (state.masterArray[index].allSegments[segArrayIndex].segments.length === 0) {
              state.masterArray[index].allSegments.splice(segArrayIndex, 1);
            }
            state.selectedSegment = updatedSegment
          }
        }
      }

    },
    deleteSegment:(state, action) => {
      const segmentId = action.payload;
      const index = state.masterArray.findIndex(seg => seg.allSegments.some(group => group.segments.some(seg => seg.id === segmentId)));
      if (index !== -1) {
        const segArrayIndex = state.masterArray[index].allSegments.findIndex(group => group.segments.some(seg => seg.id === segmentId));
        if (segArrayIndex !== -1) {
          state.masterArray[index].allSegments[segArrayIndex].segments = state.masterArray[index].allSegments[segArrayIndex].segments.filter(seg => seg.id !== segmentId);
        }
      }
      // delete from selected master array if it exists
      if (state.selectedMasterArray) {
        const selectedSegArrayIndex = state.selectedMasterArray.allSegments.findIndex(group => group.segments.some(seg => seg.id === segmentId));
        if (selectedSegArrayIndex !== -1) {
          state.selectedMasterArray.allSegments[selectedSegArrayIndex].segments = state.selectedMasterArray.allSegments[selectedSegArrayIndex].segments.filter(seg => seg.id !== segmentId);
          // If no segments left in the group, remove the group
          if (state.selectedMasterArray.allSegments[selectedSegArrayIndex].segments.length === 0) {
            state.selectedMasterArray.allSegments.splice(selectedSegArrayIndex, 1);
          }
        }
      }

    },
    changeGroupSelectedSegment: (state, action) => {
      const { master, updatedSegment } = action.payload;

      const index = state.masterArray.findIndex(seg => seg.name === updatedSegment.segment_type);

      if (index !== -1) {
        // remove existed and add new segment
        const segArrayIndex = state.masterArray[index].allSegments.findIndex(seg => seg.groupName === updatedSegment.group_label_system);
        if (segArrayIndex !== -1) {
          state.masterArray[index].allSegments[segArrayIndex].segments.push(updatedSegment);
        } else {
          state.masterArray[index].allSegments.push({
            groupName: updatedSegment.group_label_system,
            segments: [updatedSegment],
          });
        }
      } else {
        // If master not found, add new master with segment
        const newMasterArray: MasterModel = {
          // id: master.id,
          name: master.name,
          icon: master.icon,
          color_code: master.color_code,
          color: master.color,
          short_code: master.short_code,
          overAllSwatch: [],
          categories: master.categories,
          allSegments: [{
            groupName: updatedSegment.group_label_system,
            segments: [updatedSegment],
          }],
        };
        state.masterArray.push(newMasterArray);
      }
    },
    updateSelectedSegment: (state, action) => {
      const segment = action.payload;
      state.selectedSegment = segment;
    },
    addUserSelectedSegment: (state, action) => {
      
      if (!state.userSelectedSegment) {
        state.userSelectedSegment = [];
      }
      state.userSelectedSegment = action.payload;
    },
    updateUserSelectedSegment: (state, action) => {
     const { segment } = action.payload;
     // Ensure userSelectedSegment is always an array
     if (!state.userSelectedSegment) {
       state.userSelectedSegment = [];
     }
     // check if segment exists
     const index = state.userSelectedSegment.findIndex(seg => seg.id === segment.id);
     if (index !== -1 && state.userSelectedSegment.length) {
       state.userSelectedSegment.push(segment);
     } else {
       // delete from array
       state.userSelectedSegment = state.userSelectedSegment.filter(seg => seg.id !== segment.id);
     }
    },
    clearMasterArray: (state) => {
      state.masterArray = [];
      state.selectedMasterArray = null;
      state.selectedGroupSegment = null;
      state.selectedSegment = null;
      state.isCreatedMasterArray = false;
      state.userSelectedSegment = [];
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
  updatedSelectedGroupSegment,
  updateSelectedSegment,
  changeGroupSelectedSegment,
  deletedChangeGroupSegment,
  deleteSegment,
  addUserSelectedSegment,
  updateUserSelectedSegment
} = masterArraySlice.actions;

export default masterArraySlice.reducer;
