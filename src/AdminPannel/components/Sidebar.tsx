import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPage } from "../AdminPanel";
import dzinlylogo from "../../../public/assets/image/dzinlylogo-icon.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logoutUser } from "@/redux/slices/user/authSlice";
import { clearCurrentJob } from "@/redux/slices/jobSlice";
import { clearCurrentImage } from "@/redux/slices/studioSlice";
import { clearBreadcrumbs } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  User,
  CreditCard,
  FolderOpen,
  Package,
  Plus,
  Tag,
  Users,
  Palette,
  Grid3x3,
  Link,
  LogOut,
  Menu,
  ChevronRight,
  ChevronLeft,
  Settings,
  Database,
  FileText,
} from "lucide-react";
//import marbleLogo from "../../../public/assets/image/marble-logo-icon.svg";
import marbleLogo from "../../../public/assets/marble/main-favicons.png";
import Setting from "@/layouts/Setting";

interface SidebarProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
}

interface NavigationItem {
  id: AdminPage;
  label: string;
  icon: React.ElementType;
  section?: "main" | "documents";
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    section: "main",
  },
  { id: "projects", label: "Projects", icon: FolderOpen, section: "main" },
  { id: "analytics", label: "Analytics", icon: BarChart3, section: "main" },
  {
    id: "demo_project",
    label: "Demo Project",
    icon: FolderOpen,
    section: "main",
  },
];

const documentItems: NavigationItem[] = [
  {
    id: "materials",
    label: "Materials Library",
    icon: Package,
    section: "documents",
  },
  {
    id: "addmaterials",
    label: "Add Materials",
    icon: Plus,
    section: "documents",
  },
  {
    id: "material-attributes",
    label: "Attributes",
    icon: Settings,
    section: "documents",
  },
  { id: "brand", label: "Brands", icon: Tag, section: "documents" },
  { id: "style", label: "Styles", icon: Palette, section: "documents" },
  {
    id: "category",
    label: "Categories",
    icon: Grid3x3,
    section: "documents",
  },

  {
    id: "material-segment",
    label: "Segments",
    icon: Users,
    section: "documents",
  },
  {
    id: "material-connections",
    label: "Connections",
    icon: Link,
    section: "documents",
  },
];

const userManagementItems: NavigationItem[] = [
  { id: "user", label: "User Profiles", icon: User, section: "main" },
  {
    id: "user-plan",
    label: "Subscriptions",
    icon: CreditCard,
    section: "main",
  },
  { id: "roles", label: "User Roles", icon: User, section: "main" },
  { id: "permissions", label: "Permissions", icon: Settings, section: "main" },
];

const toolsItems: NavigationItem[] = [
  {
    id: "data-library",
    label: "Data Library",
    icon: Database,
    section: "documents",
  },
  { id: "reports", label: "Reports", icon: FileText, section: "documents" },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNavClick = (page: AdminPage) => {
    navigate(`/admin/${page}`);
    onPageChange(page);
    setMobileOpen(false);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCurrentJob());
      dispatch(clearCurrentImage());
      dispatch(clearBreadcrumbs());
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      navigate("/", { replace: true });
    }
  };

  const renderNavItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;

    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`group flex items-center w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200 relative 
            ${!collapsed ? "justify-start" : "justify-center"}
          ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
      >
        <Icon
          className={`w-4 h-4 transition-colors ${
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
          }`}
        />
        {!collapsed && (
          <span
            className={`ml-3 font-medium text-sm ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {item.label}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (title: string, items: NavigationItem[]) => {
    if (collapsed) {
      return <div className="space-y-1">{items.map(renderNavItem)}</div>;
    }

    return (
      <div className="space-y-1">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div className="space-y-1">{items.map(renderNavItem)}</div>
      </div>
    );
  };

  console.log(collapsed, mobileOpen);

  return (
    <>
      {/* Mobile Hamburger */}
      <Setting
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen((prev) => !prev)}
      />
      <button
        className={`absolute z-50 p-3 bg-white rounded-lg shadow-lg lg:hidden  hover:shadow-xl transition-shadow ${
          mobileOpen ? "top-2 left-[200px]" : "top-4 left-4"
        }`}
        onClick={() => {
          setMobileOpen((prev) => !prev);
          setCollapsed((prev) => !prev);
        }}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? "w-16" : "w-64"}
          ${
            mobileOpen
              ? "fixed z-40 w-64 shadow-xl lg:relative lg:shadow-none"
              : "hidden lg:flex"
          }
        `}
      >
        {/* Header */}
        <div className="relative flex items-center p-4 ps-3 border-b border-gray-200">
          <div className="flex items-end space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white-600">
              <img src={marbleLogo} alt="Marble Logo" className="w-10 h-10" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">Marble</span>
              </div>
            )}
          </div>

          {/* Toggle Button - Always positioned at the right */}
          <button
            onClick={toggleSidebar}
            className={`relative ${
              collapsed ? "left-[30]" : "left-[100px]"
            }  p-1.5 rounded-md hover:bg-gray-100 transition-colors md:block hidden`}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1  overflow-y-auto px-1 py-4">
          <div className="space-y-6">
            {/* Workspace Section */}
            {renderSection("Workspace", navigationItems)}

            {/* Materials Library Section */}
            {renderSection("Materials Library", documentItems)}

            {/* User Management Section */}
            {renderSection("User Management", userManagementItems)}

            {/* Tools & Features Section */}
            {renderSection("Tools & Features", toolsItems)}
          </div>
        </nav>

        {/* User Profile and Settings */}
        <div className="p-2 border-t border-gray-200">
          <div className="space-y-2">
            {/* Settings */}
            <button
              className={`flex items-center w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 text-gray-500" />
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">Settings</span>
              )}
            </button>

            {/* Sign Out */}
            {/* <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-6 h-6" />
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">Sign Out</span>
              )}
            </button> */}
          </div>
        </div>
        {/* </ScrollArea> */}
      </div>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => {
            setCollapsed((prev) => !prev);
            setMobileOpen((prev) => !prev);
          }}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
