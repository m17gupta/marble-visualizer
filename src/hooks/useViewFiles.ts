import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  ViewType, 
  addCurrentView,
  enterStepperMode
} from '@/redux/slices/visualizerSlice/workspaceSlice';

interface ViewFiles {
  [key: string]: File | null;
}

export const useViewFiles = () => {
  const dispatch = useDispatch();
  const currentView = useSelector((state: RootState) => state.workspace.currentView);
  
  // Local state to track files for different views
  const [viewFiles, setViewFiles] = useState<ViewFiles>({
    front: null,
    rear: null,
    left: null,
    right: null
  });

  // Set a file for a specific view
  const setViewFile = useCallback((view: ViewType, file: File | null) => {
    setViewFiles(prev => ({
      ...prev,
      [view]: file
    }));
    
    // Also update Redux state
    dispatch(addCurrentView({ view, file }));
  }, [dispatch]);

  // Remove a file from a view
  const removeViewFile = useCallback((view: ViewType) => {
    setViewFiles(prev => ({
      ...prev,
      [view]: null
    }));
    
    // Also update Redux state if this view is the current one
    if (currentView.view === view) {
      dispatch(addCurrentView({ view, file: null }));
    }
  }, [dispatch, currentView]);

  // Clear all view files
  const clearAllViewFiles = useCallback(() => {
    setViewFiles({
      front: null,
      rear: null,
      left: null,
      right: null
    });
    
    // Reset current view in Redux
    dispatch(addCurrentView({ view: 'front', file: null }));
  }, [dispatch]);
  
  // Enter stepper mode with current files
  const proceedToStepper = useCallback(() => {
    dispatch(enterStepperMode());
  }, [dispatch]);

  // Check if any files have been uploaded
  const hasAnyFiles = Object.values(viewFiles).some(file => file !== null);
  
  // Count how many files have been uploaded
  const fileCount = Object.values(viewFiles).filter(file => file !== null).length;
  
  // Check if all views have been uploaded
  const isAllViewsUploaded = Object.values(viewFiles).every(file => file !== null);

  return {
    viewFiles,
    setViewFile,
    removeViewFile,
    clearAllViewFiles,
    hasAnyFiles,
    fileCount,
    isAllViewsUploaded,
    proceedToStepper,
    currentView
  };
};

export default useViewFiles;
