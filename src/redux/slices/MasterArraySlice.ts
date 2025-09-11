import { MasterGroupModel, MasterModel } from "@/models";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { createSlice } from "@reduxjs/toolkit";

interface MasterArrayState {
  masterArray: MasterModel[];
  selectedMasterArray?: MasterModel | null;
  selectedGroupSegment: MasterGroupModel | null;
  selectedSegment?: SegmentModal | null;
  isCreatedMasterArray?: boolean;
  userSelectedSegment?: SegmentModal[];
}

const initialState: MasterArrayState = {
  masterArray: [],
  selectedMasterArray: null,
  selectedGroupSegment: null,
  selectedSegment: null,
  // Initialize isCreatedMasterArray to false
  isCreatedMasterArray: false,
  userSelectedSegment: [],
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
      const mastArray = action.payload;
      state.selectedMasterArray = mastArray;
    },
    removeFromMasterArray: (state, action) => {
      state.masterArray = state.masterArray.filter(
        (item) => item !== action.payload
      );
    },
    addNewSegmentType: (state, action) => {
      const newSegmentType = action.payload;
      state.masterArray.push(newSegmentType);
    },
    updatedSelectedGroupSegment: (state, action) => {
      const groupSegment = action.payload;
      state.selectedGroupSegment = groupSegment;
    },
    updateSelectedGroupSegmentAfterEdit: (state, action) => {
      const groupSegments = action.payload;
      if( state.selectedGroupSegment &&
         state.selectedGroupSegment.segments && 
         state.selectedGroupSegment.segments.length >0){
           // remove the old segment and add the new segments
           state.selectedGroupSegment.segments = state.selectedGroupSegment.segments.filter(seg => !groupSegments.some((gseg:SegmentModal) => gseg.id === seg.id));
           state.selectedGroupSegment.segments = [...state.selectedGroupSegment.segments, ...groupSegments];
         }    
    },
    // same segtype but different groupName
       updateSelectedGroupSegmentAfterEdit2: (state, action) => {
      const{segment, groupName}= action.payload;
      const segType= segment[0]?.segment_type;
      if( state.selectedGroupSegment &&
         state.selectedGroupSegment.segments && 
         state.selectedGroupSegment.segments.length >0){
           // remove the old segment and add the new segments
           state.selectedGroupSegment.segments = state.selectedGroupSegment.segments.filter(seg => !segment.some((gseg:SegmentModal) => gseg.id === seg.id));
          
         }
         
         // delete from selectedMasterArray
          const index = state.selectedMasterArray?.allSegments.findIndex(
            (group) => group.groupName === groupName
          );
          if (index !== -1 && index !== undefined && state.selectedMasterArray?.allSegments[index]) {
              const selectedSegArray = state.selectedMasterArray?.allSegments[index].segments;

              if(selectedSegArray && selectedSegArray.length >0){
                // delete the segment from selected master array
                state.selectedMasterArray!.allSegments[index].segments = selectedSegArray.filter(seg => !segment.some((gseg:SegmentModal) => gseg.id === seg.id));
             
              }
            }

            // update in group
            segment.map((item: SegmentModal) => {
              const index = state.selectedMasterArray?.allSegments.findIndex(
                (seg) => seg.groupName === item.group_label_system
              );
              if (index !== -1 && index !== undefined && state.selectedMasterArray?.allSegments[index]) {
                state.selectedMasterArray.allSegments[index].segments.push(item);
              }

            });
    },

    // different segtype and different groupName
       // same segtype but different groupName

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
              existingGroup.segments = existingGroup.segments.filter(
                (seg) => seg.id !== newSegment.id
              );
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
          existingSegment.allSegments = [
            {
              groupName: newSegment.group_label_system,
              segments: [newSegment],
            },
          ];
          state.selectedSegment = newSegment;
        }

        // Assign back if allSegments was undefined (for safety)
        // existingSegment.allSegments = allGroups;
      } else {
        const segArray = state.selectedMasterArray;
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
              },
            ],
          };
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
          state.selectedMasterArray.allSegments = [
            {
              groupName: newSegment.group_label_system,
              segments: [newSegment],
            },
          ];
        }
      }
    },
    updateMasterArrayonEditSegment: (state, action) => {
      const {updatedSegment,groupName,segType} = action.payload;
      updatedSegment.map((item: SegmentModal) => {
        const index = state.masterArray.findIndex(
          (seg) => seg.name === segType
        );
        if (index !== -1) {
          const segArrayIndex = state.masterArray[index].allSegments.findIndex(
            (group) => group.groupName === groupName
          );
          if (segArrayIndex !== -1) {
            const segmentIndex = state.masterArray[index].allSegments[
              segArrayIndex
            ].segments.findIndex((seg) => seg.id === item.id);
            if (segmentIndex !== -1) {
              state.masterArray[index].allSegments[segArrayIndex].segments[
                segmentIndex
              ] = item;
            }
          }
        }
      });
    },
    // update edit segmnet when same segType and different groeuNmae
    updateMasterArrayonEditSegment2: (state, action) => {
      const {updatedSegment,groupName,segType} = action.payload;
      updatedSegment.map((item: SegmentModal) => {
        const index = state.masterArray.findIndex(
          (seg) => seg.name === segType
        );
        debugger;
        if (index !== -1) {
          // remove from old group
          state.masterArray[index].allSegments = state.masterArray[
            index
          ].allSegments.map((group) => {
            return {  
              ...group,
              segments: group.segments.filter((seg) => seg.id !== item.id),
            };
          });
          // add to new group
          const segArrayIndex = state.masterArray[index].allSegments.findIndex(
            (group) => group.groupName === item.group_label_system
          );
          if (segArrayIndex !== -1) {
            state.masterArray[index].allSegments[segArrayIndex].segments.push(
              item
            );
          } else {
            console.log("Adding new group in edit segment");
            state.masterArray[index].allSegments.push({
              groupName: item.group_label_system??"",
              segments: [item],
            });
          }
        }
      });
    },
    // update edit segmnet when different segType and different groeuNmae
    updateMasterArrayonEditSegment3: (state, action) => {
      const {updatedSegment,groupName,segType} = action.payload;
      updatedSegment.map((item: SegmentModal) => {
        // remove from old master array
        state.masterArray = state.masterArray.map((master) => {
          return {
            ...master,
            allSegments: master.allSegments.map((group) => {
              return {
                ...group,
                segments: group.segments.filter((seg) => seg.id !== item.id),
              };
            }),
          }
          });
          // add to new master array
          const index = state.masterArray.findIndex(
            (seg) => seg.name === item.segment_type
          );
          if (index !== -1) {
            const segArrayIndex = state.masterArray[index].allSegments.findIndex(
              (group) => group.groupName === item.group_label_system
            );
            if (segArrayIndex !== -1) {
              state.masterArray[index].allSegments[segArrayIndex].segments.push(
                item
              );
            } else {
              state.masterArray[index].allSegments.push({
                groupName: item.group_label_system ?? "",
                segments: [item],
              });
            }
          }
        });

    },
    deleteSegment: (state, action) => {
      const segmentId = action.payload;
      const index = state.masterArray.findIndex((seg) =>
        seg.allSegments.some((group) =>
          group.segments.some((seg) => seg.id === segmentId)
        )
      );
      if (index !== -1) {
        const segArrayIndex = state.masterArray[index].allSegments.findIndex(
          (group) => group.segments.some((seg) => seg.id === segmentId)
        );
        if (segArrayIndex !== -1) {
          state.masterArray[index].allSegments[segArrayIndex].segments =
            state.masterArray[index].allSegments[segArrayIndex].segments.filter(
              (seg) => seg.id !== segmentId
            );
        }
      }
      // delete from selected master array if it exists
      if (state.selectedMasterArray) {
        const selectedSegArrayIndex =
          state.selectedMasterArray.allSegments.findIndex((group) =>
            group.segments.some((seg) => seg.id === segmentId)
          );
        if (selectedSegArrayIndex !== -1) {
          state.selectedMasterArray.allSegments[
            selectedSegArrayIndex
          ].segments = state.selectedMasterArray.allSegments[
            selectedSegArrayIndex
          ].segments.filter((seg) => seg.id !== segmentId);
          // If no segments left in the group, remove the group
          if (
            state.selectedMasterArray.allSegments[selectedSegArrayIndex]
              .segments.length === 0
          ) {
            state.selectedMasterArray.allSegments.splice(
              selectedSegArrayIndex,
              1
            );
          }
        }
      }
      // delete from selcted GroupSegmnet
      if (
        state.selectedGroupSegment &&
        state.selectedGroupSegment.segments &&
        state.selectedGroupSegment.segments.length > 0
      ) {
        // find index and delete it
        const index = state.selectedGroupSegment.segments.findIndex(
          (seg) => seg.id === segmentId
        );
        if (index !== -1) {
          state.selectedGroupSegment.segments.splice(index, 1);
        }
      }
    },
    changeGroupSelectedSegment: (state, action) => {
      const { master, updatedSegment } = action.payload;

      const index = state.masterArray.findIndex(
        (seg) => seg.name === updatedSegment.segment_type
      );

      if (index !== -1) {
        // remove existed and add new segment
        const segArrayIndex = state.masterArray[index].allSegments.findIndex(
          (seg) => seg.groupName === updatedSegment.group_label_system
        );
        if (segArrayIndex !== -1) {
          state.masterArray[index].allSegments[segArrayIndex].segments.push(
            updatedSegment
          );
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
          allSegments: [
            {
              groupName: updatedSegment.group_label_system,
              segments: [updatedSegment],
            },
          ],
        };
        state.masterArray.push(newMasterArray);
      }
    },
    updateSelectedSegment: (state, action) => {
      const segment = action.payload;
      state.selectedSegment = segment;

      if (!state.userSelectedSegment) {
        state.userSelectedSegment = [];
      }
      state.userSelectedSegment.push(segment);
    },
    addUserSelectedSegment: (state, action) => {
      if (!state.userSelectedSegment) {
        state.userSelectedSegment = [];
      }
      state.userSelectedSegment = action.payload;
    },
    updateUserSelectedSegment: (state, action) => {
      const segment = action.payload;

      if (!state.userSelectedSegment) {
        state.userSelectedSegment = [];
      }

      const index = state.userSelectedSegment.findIndex(
        (seg) => seg.id === segment.id
      );

      if (index === -1) {
        // If not present, add to array
        state.userSelectedSegment.push(segment);
      } else {
        // If present, remove from array
        state.userSelectedSegment = state.userSelectedSegment.filter(
          (seg) => seg.id !== segment.id
        );
      }
    },

    updateGroupNameSegment: (state, action) => {
      const { type, groupname, newgroupname, segments } = action.payload;
      const isPresent = state.masterArray.find((d: any) => d.name == type);
      if (!isPresent) {
        return;
      }
      isPresent.allSegments = isPresent.allSegments.filter(
        (d: any) => d.groupName !== groupname
      );

      const singleSegment = {
        groupName: newgroupname,
        segments: segments,
      };

      isPresent.allSegments.push(singleSegment);
    },
    clearMasterArray: (state) => {
      state.masterArray = [];
      state.selectedMasterArray = null;
      state.selectedGroupSegment = null;
      state.selectedSegment = null;
      state.isCreatedMasterArray = false;
      state.userSelectedSegment = [];
    },
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
  deleteSegment,
  addUserSelectedSegment,
  updateUserSelectedSegment,
  updateGroupNameSegment,
  updateMasterArrayonEditSegment,
  updateMasterArrayonEditSegment2,
  updateMasterArrayonEditSegment3,
  updateSelectedGroupSegmentAfterEdit,
  updateSelectedGroupSegmentAfterEdit2
} = masterArraySlice.actions;

export default masterArraySlice.reducer;
