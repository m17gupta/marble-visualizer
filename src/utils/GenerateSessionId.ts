import { setCookie } from "@/lib/utils";

export const generateSessionId = (length = 20) : string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Store the generated session ID in a cookie (30 days expiration)
  setCookie('session_id', result, 30);
  
  return result;
};
