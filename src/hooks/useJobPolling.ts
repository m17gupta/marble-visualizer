import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { pollJobStatus, stopPolling } from '@/redux/slices/jobsSlice';

export function useJobPolling() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentJob, isPolling, pollingInterval } = useSelector((state: RootState) => state.jobs);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPolling && currentJob && currentJob.status === 'loading') {
      // Start polling
      intervalRef.current = setInterval(() => {
        dispatch(pollJobStatus(currentJob.id));
      }, pollingInterval);

      // Initial poll
      dispatch(pollJobStatus(currentJob.id));
    } else {
      // Stop polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPolling, currentJob, pollingInterval, dispatch]);

  // Stop polling when job completes or fails
  useEffect(() => {
    if (currentJob && (currentJob.status === 'completed' || currentJob.status === 'failed')) {
      dispatch(stopPolling());
    }
  }, [currentJob?.status, dispatch]);

  return {
    isPolling,
    currentJob,
  };
}