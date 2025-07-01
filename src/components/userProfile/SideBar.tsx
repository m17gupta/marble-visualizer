import React, { useState } from 'react'
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
    const sidebarSections: {
        title: string;
        items: SidebarItem[];
    }[] = [
            {
                title: 'ACCOUNT',
                items: [
                    { id: 'profile', label: 'Profile', icon: User, active: true },
                    { id: 'settings', label: 'Settings', icon: Settings },
                    { id: 'billing', label: 'Billing', icon: CreditCard },
                ],
            },
            {
                title: 'ORGANIZATIONS',
                items: [
                    { id: 'personal', label: 'Personal', icon: User, badge: 'Free Plan', active: true },
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
                items: [
                    { id: 'design-tools', label: 'Design Tools', icon: Palette },
                ],
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
        <>
            {sidebarSections.map((section) => (
                <div key={section.title} className="px-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {section.title}
                    </h3>
                    <div className="space-y-1">
                        {section.items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${activeSection === item.id
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    } ${item.isAction ? 'text-blue-600 hover:bg-blue-50' : ''}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {item.badge && (
                                        <Badge  className="text-xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                    {item.hasChevron && (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

export default SideBar