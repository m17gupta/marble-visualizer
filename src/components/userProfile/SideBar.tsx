import React, { useState } from 'react';
import {
  User,
  Settings,
  CreditCard,
  Plus,
  FolderOpen,
  Package,
  Layout,
  Palette,
  BookOpen,
  ChevronRight,
  Users,
  Badge,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: string;
  hasChevron?: boolean;
  isAction?: boolean;
}

const SideBar = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarSections: {
    title: string;
    items: SidebarItem[];
  }[] = [
    {
      title: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'billing', label: 'Billing', icon: CreditCard },
      ],
    },
    {
      title: 'ORGANIZATIONS',
      items: [
        { id: 'personal', label: 'Personal', icon: User, badge: 'Free Plan' },
        { id: 'add-org', label: 'Add Organization', icon: Plus, isAction: true },
      ],
    },
    {
      title: 'WORKSPACE',
      items: [
        { id: 'projects', label: 'Projects', icon: FolderOpen, hasChevron: true },
        { id: 'assets', label: 'Assets', icon: Package },
        { id: 'boards', label: 'Boards', icon: Layout },
      ],
    },
    {
      title: 'TOOLS & FEATURES',
      items: [{ id: 'design-tools', label: 'Design Tools', icon: Palette }],
    },
    {
      title: 'COMMUNITY',
      items: [
        { id: 'blogs', label: 'Blogs', icon: BookOpen },
        { id: 'affiliate', label: 'Affiliate Program', icon: Users },
      ],
    },
  ];

  return (


    <div
      className={`h-screen ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 border-r border-gray-200 bg-white flex flex-col`}
    >
      {/* Header + Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <p className="font-semibold text-gray-900">Dashboard</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 border rounded-md text-xs text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-6 pt-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="px-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`group w-full flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-between'
                  } px-2 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${item.isAction ? 'text-blue-600 hover:bg-blue-50' : ''}`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        activeSection === item.id
                          ? 'text-blue-700'
                          : 'text-gray-500 group-hover:text-blue-600'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge className="text-xs bg-gray-100 text-gray-600">
                          {item.badge}
                        </Badge>
                      )}
                      {item.hasChevron && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Settings */}
      <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-start'
          } px-2 py-2 rounded-lg transition-colors hover:bg-gray-100`}
        >
          <Settings className="h-5 w-5 text-gray-600" />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium">Settings</span>
          )}
        </button>
      </div>
    </div>

    
  );
};

export default SideBar;
