/**
 * Redux DevTools debugging helper
 * 
 * This file contains utilities to help debug Redux DevTools issues
 */

/**
 * Logs Redux DevTools status to console
 * Call this function early in your application to verify Redux DevTools configuration
 */
export const checkReduxDevToolsStatus = () => {
  console.log('Redux DevTools status check:');
  console.log('- import.meta.env.DEV:', import.meta.env.DEV);
  console.log('- Redux DevTools extension available:', typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? 'Yes' : 'No');
  
  if (import.meta.env.DEV) {
    console.log('✅ devTools should be enabled in the Redux store configuration');
  } else {
    console.warn('⚠️ devTools may be disabled because import.meta.env.DEV is false');
    console.log('  To force enable Redux DevTools, modify your store.ts file');
  }
  
  if (typeof window !== 'undefined' && !window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.warn('⚠️ Redux DevTools browser extension not detected');
    console.log('  Please install Redux DevTools extension for your browser:');
    console.log('  Chrome: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd');
    console.log('  Firefox: https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/');
  }
};

// Declare global window type to include Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: unknown;
  }
}
