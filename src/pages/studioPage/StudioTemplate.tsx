import React, { useEffect, useState } from 'react'
import { StudioPage } from './StudioPage';
import StudioMobilePage from './StudioMobilePage';

const StudioTemplate = () => {
      const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);


  console.log("isMobile", isMobile);
  return (
    <>
    {isMobile ? (<StudioMobilePage />) : (<StudioPage />)}
    </>
  )
}

export default StudioTemplate