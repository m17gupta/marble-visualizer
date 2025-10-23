import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FolderOpen,
  Layout,
  Package,
  Palette,
  Plus,
  Settings,
  User,
  Users,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Share2,
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { useLocation, useNavigate } from "react-router-dom";
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
  badge?: string;
  hasChevron?: boolean;
  isAction?: boolean;
}

type Props = {
  sidebarCollapsed: boolean;
  mobile?: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen?: (open: boolean) => void;
  setShareModalOpen?: (open: boolean) => void;
};
const RealEstateSideBar = ({
  sidebarCollapsed,
  mobile,
  setSidebarCollapsed,
  setMobileMenuOpen,
  setShareModalOpen
}: Props) => {

      const location = useLocation();
      const navigate = useNavigate();
      const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.userProfile);


  // Base workspace items without admin panel
  const baseWorkspaceItems = [
    {
      id: "projects", 
      label: "Projects",
      icon: FolderOpen,
      hasChevron: true,
      href: `${profile?.role}` === "support" ? "/support/projects" : "/app/projects",
    },
    { id: "assets", label: "Assets", icon: Package, href: `${profile?.role}` === "support" ? "/support/assets" : "/app/assets" },
    { id: "boards", label: "Boards", icon: Layout, href: `${profile?.role}` === "support" ? "/support/boards" : "/app/boards" },
  ];



  const sidebarSections: {
    title: string;
    items: SidebarItem[];
  }[] = [
    {
      title: "ORGANIZATIONS",
      items: [
        {
          id: "personal",
          label: "Personal",
          icon: User,
          badge: "Free Plan",
          href: "/app/personal",
        },
        {
          id: "add-org",
          label: "Add Organization",
          icon: Plus,
          isAction: true,
        },
      ],
    },
    {
      title: "WORKSPACE",
      items: baseWorkspaceItems,
    },
    {
      title: "MATERIALS LIBRARY",
      items: [
        {
          id: "materials",
          label: "Materials Library",
          icon: Palette,
          href:`${profile?.role}` === "support" ? "/support/swatchbook" : "/app/swatchbook" },
      
      ],
    },
    {
      title: "TOOLS & FEATURES",
      items: [
        {
          id: "design-tools",
          label: "Design Tools",
          icon: Palette,
          href: "/app/studio",
        },
        {
          id: "share-project",
          label: "Share Project",
          icon: Share2,
          isAction: true,
        },
      ],
    },
    {
      title: "COMMUNITY",
      items: [
        { id: "blogs", label: "Blogs", icon: BookOpen, href: "/app/blogs" },
        {
          id: "affiliate",
          label: "Affiliate Program",
          icon: Users,
          href: "/app/affiliate",
        },  
      ],
    },
  ];

    const isActivePath = (path: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

   const handleItemClick = (item: SidebarItem) => {
    if (item.isAction) return;

    if (item.id === "share-project") {
      //setSelectedProjectId('current-project'); // Replace with real project ID
      if (setShareModalOpen) {
        setShareModalOpen(true);
      }
      return;
    }

    if (item.href) {
      navigate(item.href);
      if (mobile && setMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };
  return (
  <>
   <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        { profile&&profile.role==="real_estate" &&
        sidebarSections.map((section) => (
          <div key={section.title} className="space-y-2">
            {(!sidebarCollapsed || mobile) && (
              <div className="px-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.href || "");

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : item.isAction
                        ? "text-primary hover:bg-primary/10"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <AnimatePresence>
                        {(!sidebarCollapsed || mobile) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="ml-3"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {(!sidebarCollapsed || mobile) && (
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.hasChevron && <ChevronDown className="h-4 w-4" />}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
  
  </>
  )
}

export default RealEstateSideBar