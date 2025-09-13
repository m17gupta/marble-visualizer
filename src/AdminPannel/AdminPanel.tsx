import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import Team from './pages/Team';
import DataLibrary from './pages/DataLibrary';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';


export type AdminPage = 'dashboard' | 'analytics' | 'user' | 'user-plan' | 'projects' | 'materials' | 'brand' | 'category' | 'style' | 'material-segment' | 'data-library' | 'reports' | 'word-assistant';



const AdminPanel= () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract current page from URL
  const getCurrentPageFromUrl = (): AdminPage => {
    const path = location.pathname.replace('/admin/', '');
    // Handle root admin path
    if (path === '' || path === 'admin') return 'dashboard';
    return path as AdminPage;
  };

  const [currentPage, setCurrentPage] = useState<AdminPage>(getCurrentPageFromUrl);

  // Update current page when URL changes
  useEffect(() => {
    setCurrentPage(getCurrentPageFromUrl());
  }, [location.pathname]);

  // Handle page navigation
  const handlePageChange = (page: AdminPage) => {
    navigate(`/admin/${page}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'projects':
        return <Projects />;
      case 'category':
        return <Team />;
      case 'data-library':
        return <DataLibrary />;
      case 'reports':
        return <Reports />;
      case 'user':
        return <div className="p-6"><h1 className="text-2xl font-bold">User Profile</h1><p className="text-gray-600 mt-2">User profile management page</p></div>;
      case 'user-plan':
        return <div className="p-6"><h1 className="text-2xl font-bold">User Plan</h1><p className="text-gray-600 mt-2">User subscription plans management</p></div>;
      case 'materials':
        return <div className="p-6"><h1 className="text-2xl font-bold">Materials</h1><p className="text-gray-600 mt-2">Materials management page</p></div>;
      case 'brand':
        return <div className="p-6"><h1 className="text-2xl font-bold">Material Brand</h1><p className="text-gray-600 mt-2">Material brand management page</p></div>;
      case 'style':
        return <div className="p-6"><h1 className="text-2xl font-bold">Material Style</h1><p className="text-gray-600 mt-2">Material style management page</p></div>;
      case 'material-segment':
        return <div className="p-6"><h1 className="text-2xl font-bold">Material Segment</h1><p className="text-gray-600 mt-2">Material segment management page</p></div>;
      case 'word-assistant':
        return <div className="p-6"><h1 className="text-2xl font-bold">Word Assistant</h1><p className="text-gray-600 mt-2">Word assistant management page</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 `}>
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {currentPage.replace('-', ' ')}
            </h1>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Quick Create
          </button>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;