import { UserProfile } from '@/models/userModel/UserModel'
import { fetchProjects } from '@/redux/slices/projectSlice'
import { createUserProfile, getUserProfileBySessionId } from '@/redux/slices/user/userProfileSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { generateSessionId } from '@/utils/GenerateSessionId'
import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from '@/lib/utils'

const CreateUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {isAuthenticated} = useSelector((state: RootState) => state.auth)
  const getSessionId = getCookie('session_id') || '';

    
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
    const initializeSession = async () => {
      if (!isAuthenticated && !getSessionId) {
        const sessionId = await generateSessionId();
        localStorage.setItem('session_id', sessionId);
        document.cookie = `session_id=${sessionId}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days expiration
       
        handleCreateUserProfile(sessionId);
      } else {
        getUserBaseOnSessionId(getSessionId);
        
      }
    };
    
    initializeSession();
  }, [isAuthenticated, getSessionId, handleCreateUserProfile, getUserBaseOnSessionId]);
    // Render the user profile form
    return (
       null
    );
}

export default CreateUserProfile

// "VBfy6dF64IZ77JHhfgc0"