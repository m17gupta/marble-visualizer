import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { JobCommentModel, CommentModel } from '../../../models/commentsModel/CommentModel';

import { JobCommentService } from '@/services/commentsService/JobCommentsService';

interface JobCommentsState {
    isLoading: boolean;
    isError: boolean;
    isfetched: boolean;
    projectComments: JobCommentModel[];
    currentComments: JobCommentModel | null;
    addReplies: CommentModel[] | null;
    addNewComment: JobCommentModel | null;
}

// Async thunks
export const fetchJobComments = createAsyncThunk(
    'jobComments/fetchJobComments',
    async (jobId: number, { rejectWithValue }) => {
        try {
            const response = await JobCommentService.fetchJobComments(jobId);
            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to fetch job comments');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const addJobComment = createAsyncThunk(
    'jobComments/addJobComment',
    async (comment: JobCommentModel, { rejectWithValue }) => {
        try {
            const response = await JobCommentService.addJobComment(comment);
            console.log("New job comment added:", response);
            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to add job comment');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const updateJobCommentReply = createAsyncThunk(
    'jobComments/updateJobCommentReply',
    async ({ commentId, reply }: { commentId: string; reply: string }, { rejectWithValue }) => {
        try {
            const response = await JobCommentService.updateJobCommentReply(commentId, reply);
            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to update job comment reply');
            }
            return { commentId, data: response.data };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

// chnage status of a job comment
export const changeJobCommentStatus = createAsyncThunk( 
    'jobComments/changeJobCommentStatus',
    async ({ commentId, status }: { commentId: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await JobCommentService.changeJobCommentStatus(commentId, status);
            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to change job comment status');
            }
            return { commentId, data: response.data };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

// deleete a job comment
export const deleteJobComment = createAsyncThunk(
    'jobComments/deleteJobComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await JobCommentService.deleteJobComment(commentId);
            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to delete job comment');
            }
            return commentId; // Return the comment ID for deletion
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

const initialState: JobCommentsState = {
    isLoading: false,
    isError: false,
    projectComments: [],
    currentComments: null,
    addReplies: [],
    addNewComment: null,
    isfetched: false, 
};

const jobCommentsSlice = createSlice({
    name: 'jobComments',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        setProjectComments: (state, action: PayloadAction<JobCommentModel[]>) => {
            state.projectComments = action.payload;
        },
        addProjectComment: (state, action: PayloadAction<JobCommentModel>) => {
            state.projectComments.push(action.payload);
        },
        updateProjectComment: (state, action: PayloadAction<JobCommentModel>) => {
            const index = state.projectComments.findIndex(comment => comment.id === action.payload.id);
            if (index !== -1) {
                state.projectComments[index] = action.payload;
            }
        },
        removeProjectComment: (state, action: PayloadAction<string>) => {
            state.projectComments = state.projectComments.filter(comment => comment.id !== action.payload);
        },
        setCurrentComments: (state, action: PayloadAction<JobCommentModel | null>) => {
            state.currentComments = action.payload;
        },
        setAddReplies: (state, action: PayloadAction<CommentModel[] | null>) => {
            state.addReplies = action.payload;
        },
        setAddNewComment: (state, action: PayloadAction<JobCommentModel | null>) => {
            state.addNewComment = action.payload;
        },
        clearComments: (state) => {
            state.projectComments = [];
            state.currentComments = null;
            state.addReplies = null;
            state.addNewComment = null;
        },
        resetJobCommentsState: () => {
          return initialState
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch job comments
            .addCase(fetchJobComments.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchJobComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.projectComments = action.payload;
                state.isfetched = true; // Set fetched to true after successful fetch
            })
            .addCase(fetchJobComments.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            // Add job comment
            .addCase(addJobComment.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(addJobComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const data = action.payload; // action.payload is already the JobCommentModel
                state.projectComments.push(data);
                state.addNewComment = null;
            })
            .addCase(addJobComment.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            // Update job comment reply
            .addCase(updateJobCommentReply.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(updateJobCommentReply.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const { commentId, data } = action.payload;
                const commentIndex = state.projectComments.findIndex(comment => comment.id === commentId);
                if (commentIndex !== -1) {
                    state.projectComments[commentIndex].comments = data;
                }   
            })
            .addCase(updateJobCommentReply.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })

            // update job comment status
            .addCase(changeJobCommentStatus.pending, (state) => {   
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(changeJobCommentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const { commentId, data } = action.payload;
                const commentIndex = state.projectComments.findIndex(comment => comment.id === commentId);
                if (commentIndex !== -1) {
                    state.projectComments[commentIndex].status = data; // Assuming status is a field in JobCommentModel
                }
            })  
            .addCase(changeJobCommentStatus.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })

            // delete job comment
            .addCase(deleteJobComment.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(deleteJobComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const commentId = action.payload;
                state.projectComments = state.projectComments.filter(comment => comment.id !== commentId);
            })
            .addCase(deleteJobComment.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            }); 
    },
});

export const {
    setLoading,
    setError,
    setProjectComments,
    addProjectComment,
    updateProjectComment,
    removeProjectComment,
    setCurrentComments,
    setAddReplies,
    setAddNewComment,
    clearComments,
    resetJobCommentsState,
} = jobCommentsSlice.actions;

export default jobCommentsSlice.reducer;
