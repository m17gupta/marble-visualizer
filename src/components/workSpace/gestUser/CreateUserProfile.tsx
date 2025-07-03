import { UserProfile } from '@/models/userModel/UserModel'
import { fetchProjects } from '@/redux/slices/projectSlice'
import { createUserProfile, getUserProfileBySessionId } from '@/redux/slices/userProfileSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { generateSessionId } from '@/utils/GenerateSessionId'
import { useEffect, useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

const CreateUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {isAuthenticated} = useSelector((state: RootState) => state.auth)
  const getSessionId = localStorage.getItem('session_id') || '';
  const {isContinue} = useSelector((state: RootState) => state.workspace)
    
  const handleCreateUserProfile = useCallback(async (sessionId:string) => {
    const userData:UserProfile={
      user_id: "",
      full_name: '',
      role: 'guest',
      profile_image: '',
      subscription_id: '',
      session_id: sessionId,
      status: true,
    }
    try{
       await dispatch(createUserProfile(userData)).unwrap();
            
    }catch(error) {
      console.error("Error creating user profile:", error);
    }   
  }, [dispatch]);
    
  const getUserBaseOnSessionId = useCallback(async (sessionId:string) => {
    try {
      const response= await dispatch(getUserProfileBySessionId(sessionId)).unwrap();
      if(!response) {
        console.error("No user profile found for session ID:", sessionId);
        return null;
      }else if(response === "No user profile found for session ID") {
        handleCreateUserProfile(sessionId);
      }else {
        // get all  projects
         await dispatch(fetchProjects(response.user_id)).unwrap();
      }
      return response;
    } catch (error) {
      console.error("Error fetching user by session ID:", error);
      return null;
    }
  }, [dispatch, handleCreateUserProfile]);
    
  useEffect(() => {
    // Check if user is authenticated and session ID exists
    if (!isAuthenticated && !getSessionId) {
        const sessionId = generateSessionId();
      handleCreateUserProfile(sessionId);
    } else {
      getUserBaseOnSessionId(getSessionId)
      console.log("User is not authenticated but session ID exists",getSessionId);
    }
  }, [isAuthenticated, getSessionId, isContinue, getUserBaseOnSessionId]);
    // Render the user profile form
    return (
       null
    );
}

export default CreateUserProfile