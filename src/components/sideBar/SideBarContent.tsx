import { Button } from "../ui/button";
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
import { AnimatePresence, motion } from "framer-motion";
import MarbleLogo from "../../../public/assets/image/marble-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/user/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Setting from "@/layouts/Setting";
import RealEstateSideBar from "./roleBaseSideBar/RealEstateSideBar";
import ManufactruringSideBar from "./roleBaseSideBar/ManufactruringSideBar";

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
const SidebarContent = ({
  sidebarCollapsed,
  mobile,
  setSidebarCollapsed,
  setMobileMenuOpen,
  setShareModalOpen,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
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
            href: `${profile?.role}` === "support" ? "/support/swatchbook" : "/app/swatchbook"
          },

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
  useEffect(() => {
    // Auto-close mobile menu on route change
    if (mobile && setMobileMenuOpen) {
      // setMobileMenuOpen(false);
    }
  }, [location.pathname]);

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

  const handleLogin = () => {
    try {
      dispatch(logoutUser());
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/login");
  };
  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <motion.div
          initial={false}
          animate={{ opacity: sidebarCollapsed && !mobile ? 0 : 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8  rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-primary-foreground" />
            <img src={MarbleLogo} alt="Dzinly Logo" className="h-100 w-100" />
            {/* <img src */}
          </div>
          {(!sidebarCollapsed || mobile) && (
            <span className="text-lg font-bold text-foreground">Dzinly</span>
          )}
        </motion.div>

        {!mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      {/* role == "real_estate" */}
    {profile && profile.role === "real_estate" && (
      <RealEstateSideBar
        mobile={false}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        setMobileMenuOpen={setMobileMenuOpen}
        setShareModalOpen={setShareModalOpen}
      />
      )}
    {profile && profile.role === "manufacturer" && (
      <ManufactruringSideBar
        mobile={false}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        setMobileMenuOpen={setMobileMenuOpen}
        setShareModalOpen={setShareModalOpen}
      />
      )}

      {/*  role =="manufacturer" */}
      {/* <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
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
      </nav> */}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isAuthenticated
          ? (!sidebarCollapsed || mobile) && (
            <div className="space-y-2">
              <Button
                onClick={handleLogin}
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4 mr-3" />
                Login
              </Button>
            </div>
          )
          : (!sidebarCollapsed || mobile) && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setSettingsModalOpen(true)}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </div>
          )}
      </div>

      <Setting
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
};

export default SidebarContent;
