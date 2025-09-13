import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminPage } from '../AdminPanel';

interface SidebarProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
}

interface NavigationItem {
  id: AdminPage;
  label: string;
  icon: string;
  section?: 'main' | 'documents';
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'main' },
  
  { id: 'analytics', label: 'Analytics', icon: '📈', section: 'main' },
  { id: 'user', label: 'User Profile', icon: '🔄', section: 'main' },
  { id: 'user-plan', label: 'User Plan', icon: '📝', section: 'main' },
  { id: 'projects', label: 'Projects', icon: '📁', section: 'main' }, 

];

const documentItems: NavigationItem[] = [
    { id: 'materials', label: 'Materials', icon: '📦', section: 'documents' }, 
  { id: 'brand', label: 'Material Brand', icon: '🎨', section: 'documents' },
  { id: 'category', label: 'Material Category', icon: '👥', section: 'documents' },
  { id: 'style', label: 'Material Style', icon: '🎨', section: 'documents' },
{ id: 'material-segment', label: 'Material Segment', icon: '🧩', section: 'documents' },
  // { id: 'data-library', label: 'Data Library', icon: '📚', section: 'documents' },
  // { id: 'reports', label: 'Reports', icon: '📄', section: 'documents' },
  // { id: 'word-assistant', label: 'Word Assistant', icon: '✍️', section: 'documents' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();
  
  const handleNavClick = (page: AdminPage) => {
    navigate(`/admin/${page}`);
    onPageChange(page);
  };

  const renderNavItem = (item: NavigationItem) => (
    <button
      key={item.id}
      onClick={() => handleNavClick(item.id)}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
        currentPage === item.id
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-lg">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Acme Inc.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {/* Home Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-3">Home</p>
          <div className="space-y-1">
            {navigationItems.map(renderNavItem)}
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-3">Documents</p>
          <div className="space-y-1">
            {documentItems.map(renderNavItem)}
          </div>
        </div>
      </nav>

      {/* More Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors">
          <span className="text-lg">•••</span>
          <span className="font-medium">More</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;