import DashboardLandingSection from '@/components/DashboardLandingSection';
import React from 'react'

const LandingPage = () => {
  const handleRoomClick = (roomId: string) => {
    console.log('Room clicked:', roomId);
    // Add your navigation logic here
  };

  const handleTopPickClick = (pickId: string) => {
    console.log('Top pick clicked:', pickId);
    // Add your navigation logic here
    switch (pickId) {
      case 'renovate':
        // Navigate to renovation tool
        break;
      case 'virtual-staging':
        // Navigate to virtual staging
        break;
      case 'studio':
        // Navigate to studio
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLandingSection 
        onRoomClick={handleRoomClick}
        onTopPickClick={handleTopPickClick}
      />
    </div>
  )
}

export default LandingPage