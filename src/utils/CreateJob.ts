import { AppDispatch } from '@/redux/store';
import { createJob } from '@/redux/slices/jobSlice';
import { JobModel } from '@/models/jobModel/JobModel';
import { toast } from 'sonner';

export interface CreateJobParams {
  jobUrl: string;
  projectId: number | null;
  jobType: string;
  dispatch: AppDispatch;
}

interface ResetFormOptions {
  resetForm: () => void;
  clearProjectId: () => void;
  clearImages: () => void;
}

/**
 * Service function to handle job creation
 * @param params Job creation parameters
 * @param resetOptions Functions to reset form state after successful creation
 * @param onSuccess Callback function to execute after successful job creation
 * @returns Promise<boolean> indicating success or failure
 */
export const CreateJob = async (
  params: CreateJobParams,
  resetOptions?: ResetFormOptions,
  onSuccess?: () => void
): Promise<boolean> => {
  const { jobUrl, projectId, jobType, dispatch } = params;
  
  // Validate required parameters
  if (!jobUrl || !projectId) {
    toast.error('Job creation failed. Missing required information.');
    return false;
  }

  try {
    // Create job data object
    const jobData: JobModel = {
      project_id: projectId,
      jobType: jobType,
      full_image: jobUrl,
      thumbnail: jobUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
   
    // Dispatch the create job action
    const jobResponse = await dispatch(createJob(jobData));
    
    // Handle pending state
    if (createJob.pending.match(jobResponse)) {
      toast.loading('Creating job...');
      return false;
    }
    
    // Handle success state
    if (createJob.fulfilled.match(jobResponse)) {
      toast.success('Job created successfully!');
      
      // Reset form and state if reset options are provided
      if (resetOptions) {
        resetOptions.resetForm();
        resetOptions.clearProjectId();
        resetOptions.clearImages();
      }
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    }
    
    // If we get here, something went wrong but didn't throw an error
    toast.error('Job creation failed. Please try again.');
    return false;
  } catch (error) {
    console.error('Error creating job:', error);
    toast.error('Job creation failed. Please try again.');
    return false;
  }
};

