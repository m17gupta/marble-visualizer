import { fetchGenAiChat } from '@/redux/slices/visualizerSlice/genAiSlice';
import { AppDispatch, RootState } from '@/redux/store';
import  { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';


const GetGenAiImageJobIdBased = () => {
        const dispatch= useDispatch<AppDispatch>();
        const {currentProject} = useSelector((state: RootState) => state.projects);
        const {genAiImages} = useSelector((state: RootState) => state.genAi);
        const isApi= useRef<boolean>(true); // Flag to check if the API call is needed
        const fetchGenAiImages =async (jobId: number) => {
            try {
                // Dispatch an action to fetch GenAI images using the job ID
                await dispatch(fetchGenAiChat(jobId));
            } catch (error) {
                toast.error('Failed to fetch GenAI images. Please try again later.');
                console.error('Error fetching GenAI images:', error);
            }
        }
    
        useEffect(() => {
            if(currentProject &&
                currentProject.jobData &&
                currentProject.jobData[0] &&
                currentProject.jobData[0].id &&
                genAiImages &&
                genAiImages.length === 0 &&
            isApi.current) {
                isApi.current = false; // Set the flag to false to prevent further API calls
                const jobId = currentProject.jobData[0].id;
                fetchGenAiImages(jobId);
                // Fetch the job ID for the GenAI image generation request
            }
        },[currentProject, genAiImages])
  return (
   null
  )
}

export default GetGenAiImageJobIdBased