import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { 
  submitGenAiRequest, 
  checkGenAiStatus, 
  clearCurrentRequest, 
  clearError 
} from '@/redux/slices/genAiSlice';
import { GenAiRequest, GenAiResponse } from '@/models/genAiModel/GenAiModel';

export const useGenAi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    requests, 
    responses, 
    loading, 
    error, 
    currentRequestId 
  } = useSelector((state: RootState) => state.genAi);

  // Get the current request and response
  const currentRequest = currentRequestId ? requests[currentRequestId] : null;
  const currentResponse = currentRequestId ? responses[currentRequestId] : null;

  // Submit a new GenAI request
  const submitRequest = useCallback(
    (request: GenAiRequest) => {
      return dispatch(submitGenAiRequest(request));
    },
    [dispatch]
  );

  // Check the status of a GenAI request
  const checkStatus = useCallback(
    (requestId: string) => {
      return dispatch(checkGenAiStatus(requestId));
    },
    [dispatch]
  );

  // Clear the current request
  const clearRequest = useCallback(() => {
    dispatch(clearCurrentRequest());
  }, [dispatch]);

  // Clear any errors
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Poll for status updates
  const pollStatus = useCallback(
    (requestId: string, interval: number = 3000, maxAttempts: number = 20) => {
      let attempts = 0;
      
      const poll = () => {
        if (attempts >= maxAttempts) return;
        
        dispatch(checkGenAiStatus(requestId))
          .then((action) => {
            const response = action.payload as GenAiResponse;
            attempts++;
            
            if (response.status === 'completed' || response.status === 'failed') {
              // Status is final, no need to keep polling
              return;
            }
            
            // Continue polling
            setTimeout(poll, interval);
          })
          .catch(() => {
            attempts++;
            // Continue polling even if there was an error
            setTimeout(poll, interval);
          });
      };
      
      // Start polling
      poll();
    },
    [dispatch]
  );

  return {
    // State
    requests,
    responses,
    loading,
    error,
    currentRequestId,
    currentRequest,
    currentResponse,
    
    // Actions
    submitRequest,
    checkStatus,
    clearRequest,
    resetError,
    pollStatus,
  };
};

export default useGenAi;
