import { RootState } from '@/redux/store'
import { generateSessionId } from '@/utils/GenerateSessionId'
import { useSelector } from 'react-redux'

const UserSession = () => {
 const {isAuthenticated}= useSelector((state: RootState) => state.auth)
  if (!isAuthenticated) {
    const cookieMatch = document.cookie.match(/(^|; )session_id=([^;]+)/);
    let session_id = cookieMatch ? cookieMatch[2] : '';
    if (!session_id) {
      session_id = generateSessionId();
      document.cookie = `session_id=${session_id}; path=/;`;
    }
    localStorage.setItem('session_id', session_id);
  }

  return (
    null
  )
}

export default UserSession

{/* <S8bl5BSpwFpP */}