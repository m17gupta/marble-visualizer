import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLandingSection } from '@/components/DashboardLandingSection';

const DzinlyLandingDemo = () => {
  const navigate = useNavigate();

  const handleRoomClick = (roomId: string) => {
    console.log('Room clicked:', roomId);
    // Navigate to studio with room type
    navigate(`/app/studio?room=${roomId}`);
  };

  const handleTopPickClick = (pickId: string) => {
    console.log('Top pick clicked:', pickId);
    
    switch (pickId) {
      case 'renovate':
        // Navigate to renovation tool/studio
        navigate('/app/studio?mode=renovate');
        break;
      case 'virtual-staging':
        // Navigate to virtual staging feature
        navigate('/app/studio?mode=staging');
        break;
      case 'studio':
        // Navigate to general studio
        navigate('/app/studio');
        break;
      default:
        navigate('/app/studio');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dzinly</h1>
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Landing Section */}
      <main>
        <DashboardLandingSection 
          onRoomClick={handleRoomClick}
          onTopPickClick={handleTopPickClick}
        />
      </main>

      {/* Optional Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Dzinly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DzinlyLandingDemo;
