// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store';
// import {
//   setWorkSpace,
//   setVisual,
//   setStepper,
//   setCurrentStep,
//   nextStep,
//   previousStep,
//   resetSteps,
//   setUploadedFile,
//   setViewFile,
//   removeViewFile,
//   clearAllViewFiles,
//   setProcessingState,
//   setError,
//   clearError,
//   enterWorkspace,
//   enterVisualMode,
//   enterStepperMode,
//   resetWorkspace,
//   completeWorkflow,
//   ViewType,
// } from '@/redux/slices/visualizerSlice/workspaceSlice';

// // Custom hook for workspace state management
// export const useWorkspace = () => {
//   const dispatch = useDispatch();
  
//   // Selectors
//   const workspace = useSelector((state: RootState) => state.workspace);
//   const isWorkSpace = useSelector((state: RootState) => state.workspace.isWorkSpace);
//   const isVisual = useSelector((state: RootState) => state.workspace.isVisual);
//   const isStepper = useSelector((state: RootState) => state.workspace.isStepper);
//   const currentStep = useSelector((state: RootState) => state.workspace.currentStep);
//   const uploadedFile = useSelector((state: RootState) => state.workspace.uploadedFile);
//   const viewFiles = useSelector((state: RootState) => state.workspace.viewFiles);
//   const processingState = useSelector((state: RootState) => state.workspace.processingState);
//   const error = useSelector((state: RootState) => state.workspace.error);

//   // Action dispatchers
//   const actions = {
//     setWorkSpace: (value: boolean) => dispatch(setWorkSpace(value)),
//     setVisual: (value: boolean) => dispatch(setVisual(value)),
//     setStepper: (value: boolean) => dispatch(setStepper(value)),
//     setCurrentStep: (step: number) => dispatch(setCurrentStep(step)),
//     nextStep: () => dispatch(nextStep()),
//     previousStep: () => dispatch(previousStep()),
//     resetSteps: () => dispatch(resetSteps()),
//     setUploadedFile: (file: File | null) => dispatch(setUploadedFile(file)),
//     setViewFile: (view: ViewType, file: File | null) => dispatch(setViewFile({ view, file })),
//     removeViewFile: (view: ViewType) => dispatch(removeViewFile(view)),
//     clearAllViewFiles: () => dispatch(clearAllViewFiles()),
//     setProcessingState: (state: 'idle' | 'uploading' | 'processing' | 'completed' | 'error') => 
//       dispatch(setProcessingState(state)),
//     setError: (error: string | null) => dispatch(setError(error)),
//     clearError: () => dispatch(clearError()),
//     enterWorkspace: () => dispatch(enterWorkspace()),
//     enterVisualMode: () => dispatch(enterVisualMode()),
//     enterStepperMode: () => dispatch(enterStepperMode()),
//     resetWorkspace: () => dispatch(resetWorkspace()),
//     completeWorkflow: () => dispatch(completeWorkflow()),
//   };

//   // Computed properties
//   const isProcessing = processingState === 'processing' || processingState === 'uploading';
//   const isCompleted = processingState === 'completed';
//   const hasError = !!error;
//   const canProceed = uploadedFile && !isProcessing && !hasError;
  
//   // Workflow state helpers
//   const workflowState = {
//     isInWorkspace: isWorkSpace,
//     isInVisualMode: isVisual,
//     isInStepperMode: isStepper,
//     isProcessing,
//     isCompleted,
//     hasError,
//     canProceed,
//   };

//   return {
//     // State
//     workspace,
//     isWorkSpace,
//     isVisual,
//     isStepper,
//     currentStep,
//     uploadedFile,
//     viewFiles,
//     processingState,
//     error,
    
//     // Computed
//     ...workflowState,
    
//     // Actions
//     ...actions,
//   };
// };

// // Hook specifically for stepper navigation
// export const useStepper = () => {
//   const { currentStep, nextStep, previousStep, resetSteps, setCurrentStep, isStepper } = useWorkspace();
  
//   const canGoNext = true; // You can add validation logic here
//   const canGoPrevious = currentStep > 0;
  
//   return {
//     currentStep,
//     canGoNext,
//     canGoPrevious,
//     isStepper,
//     nextStep,
//     previousStep,
//     resetSteps,
//     goToStep: setCurrentStep,
//   };
// };

// // Hook for file upload management
// export const useFileUpload = () => {
//   const { 
//     uploadedFile, 
//     setUploadedFile, 
//     processingState, 
//     setProcessingState, 
//     error, 
//     setError, 
//     clearError 
//   } = useWorkspace();
  
//   const uploadFile = async (file: File) => {
//     try {
//       setProcessingState('uploading');
//       clearError();
//       setUploadedFile(file);
      
//       // Here you would typically make an API call to upload the file
//       // For now, we'll simulate a successful upload
//       setTimeout(() => {
//         setProcessingState('completed');
//       }, 2000);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Upload failed');
//       setProcessingState('error');
//     }
//   };
  
//   const removeFile = () => {
//     setUploadedFile(null);
//     setProcessingState('idle');
//     clearError();
//   };
  
//   return {
//     uploadedFile,
//     processingState,
//     error,
//     uploadFile,
//     removeFile,
//     clearError,
//   };
// };

// // Hook for managing multiple view files
// export const useViewFiles = () => {
//   const workspace = useWorkspace();
//   const { viewFiles } = workspace;
  
//   const setViewFile = (view: ViewType, file: File | null) => {
//     workspace.setViewFile(view, file);
//   };

//   const removeViewFile = (view: ViewType) => {
//     workspace.removeViewFile(view);
//   };

//   const clearAllFiles = () => {
//     workspace.clearAllViewFiles();
//   };

//   // const getViewFile = (view: ViewType) => viewFiles;

//   const hasAnyFiles = Object.values(viewFiles).some(file => file !== null);
//   const fileCount = Object.values(viewFiles).filter(file => file !== null).length;
//   const isAllViewsUploaded = Object.values(viewFiles).every(file => file !== null);

//   return {
//     viewFiles,
//     setViewFile,
//     removeViewFile,
//     clearAllFiles,
//     // getViewFile,
//     hasAnyFiles,
//     fileCount,
//     isAllViewsUploaded,
//   };
// };
