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
 isupdateMasterArray:boolean
}

const initialState: MasterArrayState = {
  masterArray: [],
  selectedMasterArray: null,
  selectedGroupSegment: null,
  selectedSegment: null,
  // Initialize isCreatedMasterArray to false
  isCreatedMasterArray: false,
  userSelectedSegment: [],
  isupdateMasterArray:false
};

const masterArraySlice = createSlice({
  name: "masterArray",
  initialState,
  reducers: {
    setMasterArray: (state, action) => {
      state.masterArray = action.payload;
      state.isCreatedMasterArray = true;
      state.isupdateMasterArray=true
    },
    updateIsCreatedMasterArray:(state,action)=>{
      state.isCreatedMasterArray=action.payload
    },

    setIsupdateMasterArray:(state,action)=>{
     state.isupdateMasterArray=action.payload
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
      if (
        state.selectedGroupSegment &&
        state.selectedGroupSegment.segments &&
        state.selectedGroupSegment.segments.length > 0
      ) {
        // remove the old segment and add the new segments
        state.selectedGroupSegment.segments =
          state.selectedGroupSegment.segments.filter(
            (seg) =>
              !groupSegments.some((gseg: SegmentModal) => gseg.id === seg.id)
          );
        state.selectedGroupSegment.segments = [
          ...state.selectedGroupSegment.segments,
          ...groupSegments,
        ];
      }

      if (
        state.selectedMasterArray &&
        state.selectedMasterArray.allSegments &&
        state.selectedMasterArray.allSegments.length > 0
      ) {
        const index = state.selectedMasterArray.allSegments.findIndex(
          (group) => group.groupName === state.selectedGroupSegment?.groupName
        );
        if (index !== -1) {
          // remove old segments and add new segments
          state.selectedMasterArray.allSegments[index].segments =
            state.selectedMasterArray.allSegments[index].segments.filter(
              (seg) =>
                !groupSegments.some((gseg: SegmentModal) => gseg.id === seg.id)
            );
          state.selectedMasterArray.allSegments[index].segments = [
            ...state.selectedMasterArray.allSegments[index].segments,
            ...groupSegments,
          ];
        }
      }
    },
    // same segtype but different groupName
    updateSelectedGroupSegmentAfterEdit2: (state, action) => {
      const { segment, groupName } = action.payload;
      const segType = segment[0]?.segment_type;
      if (
        state.selectedGroupSegment &&
        state.selectedGroupSegment.segments &&
        state.selectedGroupSegment.segments.length > 0
      ) {
        // remove the old segment and add the new segments
        state.selectedGroupSegment.segments =
          state.selectedGroupSegment.segments.filter(
            (seg) => !segment.some((gseg: SegmentModal) => gseg.id === seg.id)
          );
      }

      // delete from selectedMasterArray
      const index = state.selectedMasterArray?.allSegments.findIndex(
        (group) => group.groupName === groupName
      );
      if (
        index !== -1 &&
        index !== undefined &&
        state.selectedMasterArray?.allSegments[index]
      ) {
        const selectedSegArray =
          state.selectedMasterArray?.allSegments[index].segments;

        if (selectedSegArray && selectedSegArray.length > 0) {
          // delete the segment from selected master array
          state.selectedMasterArray!.allSegments[index].segments =
            selectedSegArray.filter(
              (seg) => !segment.some((gseg: SegmentModal) => gseg.id === seg.id)
            );
        }
      }

      // update in group
      segment.map((item: SegmentModal) => {
        const index = state.selectedMasterArray?.allSegments.findIndex(
          (seg) => seg.groupName === item.group_label_system
        );
        if (
          index !== -1 &&
          index !== undefined &&
          state.selectedMasterArray?.allSegments[index]
        ) {
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
      const { updatedSegment, groupName, segType } = action.payload;
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
      const { updatedSegment, segType } = action.payload;
      updatedSegment.map((item: SegmentModal) => {
        const index = state.masterArray.findIndex(
          (seg) => seg.name === segType
        );

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
              groupName: item.group_label_system ?? "",
              segments: [item],
            });
          }
        }
      });
    },
    // update edit segmnet when different segType and different groeuNmae
    updateMasterArrayonEditSegment3: (state, action) => {
      const { updatedSegment } = action.payload;
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
          };
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

    updateAdditionalArea: (state, action) => {
      const { activeTab, groupName, innerindex, result } = action.payload;

      const indexById = state.masterArray.findIndex(
        (obj) => obj.name === activeTab
      );
      const d = state.masterArray[indexById];
      const index = d.allSegments.findIndex(
        (obj) => obj.groupName === groupName
      );
      state.masterArray[indexById].allSegments[index].segments[
        innerindex
      ].additionalArea = result;
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
    updateselectedMasterArrayAndGroup: (state, action) => {
      const { segType, newSegments } = action.payload;

      // Ensure newSegments is an array
      if (!Array.isArray(newSegments)) {
        console.error("newSegments is not an array:", newSegments);
        return;
      }

      //update selectedMasterArray
      const selectedMaster = state.selectedMasterArray;
      if (
        selectedMaster &&
        selectedMaster.allSegments &&
        selectedMaster.allSegments.length > 0
      ) {
        selectedMaster.allSegments = selectedMaster.allSegments.map((group) => {
          return {
            ...group,
            segments: newSegments.filter(
              (nseg: SegmentModal) =>
                nseg.group_label_system === group.groupName
            ),
          };
        });
      }

      // update selectedGroupSegment
      const selectedGroup = state.selectedGroupSegment;
      if (
        selectedGroup &&
        selectedGroup.segments &&
        selectedGroup.segments.length > 0
      ) {
        selectedGroup.segments = newSegments.filter(
          (nseg: SegmentModal) =>
            nseg.group_label_system === selectedGroup.groupName
        );
      }

      // update masterArray
      if (state.masterArray && state.masterArray.length > 0) {
        const masterSegType = state.masterArray.find((m) => m.name === segType);
        if (
          masterSegType &&
          masterSegType.allSegments &&
          masterSegType.allSegments.length > 0
        ) {
          // update each group
          masterSegType.allSegments = masterSegType.allSegments.map((group) => {
            return {
              ...group,
              segments: newSegments.filter(
                (nseg: SegmentModal) =>
                  nseg.group_label_system === group.groupName
              ),
            };
          });
        }
      }
    },
   updatesegmentChanges: (state, action) => {
  const { allseg } = action.payload;
  if (!allseg?.id) return;
 
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
setIsupdateMasterArray,
  addUserSelectedSegment,
  updateUserSelectedSegment,
  updateGroupNameSegment,
  updateMasterArrayonEditSegment,
  updateMasterArrayonEditSegment2,
  updateMasterArrayonEditSegment3,
  updateSelectedGroupSegmentAfterEdit,
  updateSelectedGroupSegmentAfterEdit2,
  updateselectedMasterArrayAndGroup,
  updateAdditionalArea,
  updatesegmentChanges,
  updateIsCreatedMasterArray
} = masterArraySlice.actions;

export default masterArraySlice.reducer;
