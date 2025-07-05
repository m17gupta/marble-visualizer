import { getCookie, setCookie } from "@/lib/utils";


// export const generateSessionId = (length = 20) : string => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
  
//   // Store the generated session ID in a cookie (30 days expiration)
//   setCookie('session_id', result, 30);
  
//   return result;
// };
// import { getCookie, setCookie } from "@/lib/utils";

/**
 * Generates or retrieves a session ID for the current user
 * Ensures one unique session ID per IP address
 * @param length Length of the session ID
 * @returns The session ID
 */
export const generateSessionId = async (length = 20): Promise<string> => {
  // First check if we already have a session ID
  const existingSessionId = getCookie('session_id');
  if (existingSessionId) {
    return existingSessionId;
  }
  
  // Get the client's IP address
  let ipAddress = '';
  try {
    // Using a public API to get the client's IP address
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ipAddress = data.ip;
    console.log('Client IP address:', ipAddress);
  } catch (error) {
    console.error('Failed to get IP address:', error);
    // Fallback to a timestamp-based identifier if IP fetch fails
    ipAddress = `fallback-${Date.now()}`;
  }
  
  // Create a hash of the IP address to use as part of the session ID
  const ipHash = await hashString(ipAddress);
  
  // Generate the random part of the session ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';
  for (let i = 0; i < length - 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Combine the IP hash (first 8 chars) with random chars
  const sessionId = `${ipHash.substring(0, 8)}${randomPart}`;
  
  // Store the session ID and IP hash in cookies (30 days expiration)
  setCookie('session_id', sessionId, 30);
  setCookie('ip_hash', ipHash, 30);
  
  return sessionId;
};

/**
 * Creates a hash from a string using SHA-256
 * @param str The string to hash
 * @returns A hex string hash
 */
async function hashString(str: string): Promise<string> {
  // Use the Web Crypto API to create a hash
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash to a hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}