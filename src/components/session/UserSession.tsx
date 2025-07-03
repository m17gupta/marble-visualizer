import { RootState } from '@/redux/store'
import { generateSessionId } from '@/utils/GenerateSessionId'
import { getCookie } from '@/lib/utils'
import { useSelector } from 'react-redux'

const UserSession = () => {
 const {isAuthenticated}= useSelector((state: RootState) => state.auth)
  if (!isAuthenticated) {
    // Use our getCookie util function instead of direct cookie access
    let session_id = getCookie('session_id');
    if (!session_id) {
      session_id = generateSessionId();
      // The generateSessionId function now sets the cookie for us
    }
    // Removed localStorage usage since we're now using cookies
  }

  return (
    null
  )
}

export default UserSession

{/* <S8bl5BSpwFpP */}