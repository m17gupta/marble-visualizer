import { UserProfile } from '@/models/userModel/UserModel'
import { createUserProfile, getUserProfileBySessionId } from '@/redux/slices/userProfileSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

const CreateUserProfile = () => {


  const dispatch = useDispatch<AppDispatch>()
    const {isAuthenticated} = useSelector((state: RootState) => state.auth)
    const  getSessionId= localStorage.getItem('session_id') || '';

    useEffect(() => {
        // Check if user is authenticated and session ID exists
    if (!isAuthenticated && !getSessionId) {
       return
        
    }else if(!isAuthenticated && getSessionId) {
        getUserBaseOnSessionId(getSessionId)
        console.log("User is not authenticated but session ID exists",getSessionId);
    }
}, [isAuthenticated, getSessionId, dispatch]);


    const getUserBaseOnSessionId = async (sessionId:string) => {
        try {
           const response= await dispatch(getUserProfileBySessionId(sessionId)).unwrap();
           if(!response) {
               console.error("No user profile found for session ID:", sessionId);
               return null;
           }else if(response === "No user profile found for session ID") {
              handleCreateUserProfile(sessionId);
           }else {
               console.log("User profile fetched successfully:", response);
           }
           return response;
        } catch (error) {
            console.error("Error fetching user by session ID:", error);
            return null;
        }
    }

    

     const handleCreateUserProfile = async (sessionId:string) => {

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
      const response= await  dispatch(createUserProfile(userData)).unwrap();
        if(response) {
            console.log("User profile created successfully:", response);
        }        
        }catch(error) {
            console.error("Error creating user profile:", error);
        }   
     }
    // Render the user profile form
    return (
       null
    );
}

export default CreateUserProfile