import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Setting from "./Setting";
import dzinlylogo from "../../public/assets/image/dzinlylogo-icon.svg";
import { AiOutlineMenuUnfold } from "react-icons/ai";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Home,
  FolderOpen,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  Paintbrush,
  Menu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";
import GetGenAiImageJobIdBased from "@/components/workSpace/compareGenAiImages/GetGenAiImageJobIdBased";
import UserProfileHome from "@/components/userProfile/UserProfileHome";

const navigation = [
  {
    name: "Projects",
    href: "/app/projects",
    icon: FolderOpen,
  },
  {
    name: "Studio",
    href: "/app/studio",
    icon: Palette,
  },
  {
    name: "Materials Library",
    href: "/app/swatchbook",
    icon: Paintbrush,
  },
];

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const isStudioPage = location.pathname.startsWith("/app/studio");

  const isActivePath = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full overflow-y-auto bg-card">
      <UserProfileHome />
      <SwatchBookDataHome />
      <GetGenAiImageJobIdBased />
      <div className="flex items-center justify-between p-4 pt-3">
        <motion.div
          initial={false}
          animate={{ opacity: sidebarCollapsed && !mobile ? 0 : 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center pt-0">
            {/* <Home className="h-5 w-5 text-primary-foreground" /> */}
            <img src={dzinlylogo} alt="Dzinly Logo" className="h-100 w-100" />
          </div>
          {(!sidebarCollapsed || mobile) && (
            <span className="text-xl font-bold text-foreground pt-1">Dashboard</span>
          )}
        </motion.div>
        {!mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex position-absolute right-3"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(item.href);

          return (
            <motion.button
              key={item.name}
              onClick={() => {
                navigate(item.href);
                if (mobile) setMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {(!sidebarCollapsed || mobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {(!sidebarCollapsed || mobile) && (
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border flex items-center justify-between px-4 h-14">
        <Button variant="ghost"  onClick={() => setMobileMenuOpen(true)}>
          {/* <Menu className="h-5 w-5" /> */}
          <AiOutlineMenuUnfold className="text-2xl"/>

        </Button>
        <img src={dzinlylogo} alt="Dzinly" className="h-8" />
      </div>

      {/* Desktop Sidebar */}
      {!isStudioPage && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 280 }}
          className="fixed inset-y-0 left-0 z-50 hidden lg:block bg-card border-r border-border "
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 w-full lg:pl-[280px]",
          sidebarCollapsed && "lg:pl-[80px]",
          isStudioPage && "lg:pl-0"
        )}
      >
        <main className="overflow-y-auto min-h-[calc(100vh-56px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Settings Modal */}
      <Setting
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}
