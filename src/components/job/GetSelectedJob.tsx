import { fetchJobsByProject } from '@/redux/slices/jobSlice';
import { AppDispatch } from '@/redux/store';
import React from 'react';
import { useDispatch } from 'react-redux';


type Props = {
  selectedProjectId: number;
};
const GetSelectedJob = ({ selectedProjectId }: Props) => {
   const dispatch = useDispatch<AppDispatch>();
     
  React.useEffect(() => {
    if (selectedProjectId) {
      fetchJob();
    } else {
      console.warn('No project selected to fetch jobs for.'); 
    }
  }, [selectedProjectId, dispatch]);

  const fetchJob = async () => {
    try {
      // Replace with your API call to fetch jobs
      const response = await dispatch(fetchJobsByProject(selectedProjectId));
      if (fetchJobsByProject.fulfilled.match(response)) {
        console.log('Fetched jobs:', response.payload);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };
  return (
    null
  );
};

export default GetSelectedJob;