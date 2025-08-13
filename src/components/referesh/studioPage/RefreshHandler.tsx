import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchProjects, setCurrentProject } from '@/redux/slices/projectSlice';
import { setCurrentImageUrl } from '@/redux/slices/studioSlice';
import { updateJobList, updateSidebarHeaderCollapse } from '@/redux/slices/jobSlice';
import { addHouseImage } from '@/redux/slices/visualizerSlice/genAiSlice';
import { addbreadcrumb, updateActiveTab } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { ProjectModel } from '@/models/projectModel/ProjectModel';



const RefreshHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: projectId } = useParams<{ id: string }>();
  const location = useLocation();
  
  const { list: projects, currentProject } = useSelector(
    (state: RootState) => state.projects
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeTab: activeTabFromStore } = useSelector(
    (state: RootState) => state.workspace
  );
  
  const hasInitialized = useRef(false);
  const isStudioRoute = location.pathname.includes('/studio/');

  const setupProjectState = useCallback((project: ProjectModel) => {
    try {
      // Set the current project
      dispatch(setCurrentProject(project));
      
      // Set up job-related state if project has job data
      if (project.jobData && project.jobData.length > 0) {
        const primaryJob = project.jobData[0];
        
        // Update job list
        dispatch(updateJobList(project.jobData));
        
        // Set current image URL
        if (primaryJob.full_image) {
          dispatch(setCurrentImageUrl(primaryJob.full_image));
          dispatch(addHouseImage(primaryJob.full_image));
        }
        
        // Update sidebar state
        dispatch(updateSidebarHeaderCollapse(false));
        

      }
      
      // Set breadcrumb
      dispatch(addbreadcrumb("Studio"));
      
    } catch (error) {
      console.error('RefreshHandler: Error setting up project state:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only run for studio routes with a project ID
    if (!isStudioRoute || !projectId || !user?.id) {
      return;
    }

    // If we have an empty projects list but a project ID in URL (refresh scenario)
    // OR if we don't have a current project set
    const needsRefresh = (projects.length === 0 || !currentProject) && !hasInitialized.current;
    
    if (needsRefresh) {
     
      hasInitialized.current = true;
      
      // Fetch projects for the user
      dispatch(fetchProjects(user.id)).then((result) => {
        if (fetchProjects.fulfilled.match(result)) {
          const fetchedProjects = result.payload;
          const targetProject = fetchedProjects.find(
            (project) => project.id?.toString() === projectId
          );
          
          if (targetProject) {
            setupProjectState(targetProject);
          } else {
            console.warn('RefreshHandler: Project not found with ID:', projectId);
          }
        }
      });
    } else if (currentProject && projects.length > 0 && currentProject.id?.toString() === projectId) {
      // We have the project but might need to ensure state is properly set
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setupProjectState(currentProject);
      }
    }
  }, [dispatch, projectId, user?.id, projects.length, currentProject, isStudioRoute, setupProjectState]);

  // Set default active tab if none is set
  useEffect(() => {
    if (isStudioRoute && !activeTabFromStore) {
      dispatch(updateActiveTab("inspiration"));
    }
  }, [dispatch, activeTabFromStore, isStudioRoute]);

  // This component doesn't render anything
  return null;
};

export default RefreshHandler;
