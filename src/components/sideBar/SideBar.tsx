import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import {
  FolderOpen,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  Paintbrush,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  // {
  //   name: "Materials",
  //   href: "/materials",
  //   icon: Package,
  // },
  {
    name: "Materials Library",
    href: "/app/swatchbook",
    icon: Paintbrush,
  },
];

export function SideBar({ sidebarCollapsed, setSidebarCollapsed }: { sidebarCollapsed: boolean, setSidebarCollapsed: (v: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  // const { theme, setTheme } = useTheme();
  // const { user } = useSelector((state: RootState) => state.auth);
  // const { profile } = useSelector((state: RootState) => state.userProfile);

  // sidebarCollapsed and setSidebarCollapsed are now controlled from parent
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const handleLogout = () => {
  //   dispatch(logoutUser());
  //   // Navigation is handled within the thunk
  // };

  const handleSignIn = () => {
    // Handle sign-in logic here
    navigate("/login");
  };

  const isActivePath = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between p-6">
        <motion.div
          initial={false}
          animate={{ opacity: sidebarCollapsed && !mobile ? 0 : 1 }}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary-foreground" />

            {/* <User
  className="h-5 w-5 text-white bg-purple-600 rounded-lg p-1 cursor-pointer hover:bg-purple-700 transition-colors"
  onClick={handleSignIn}
/> */}
          </div>
          {(!sidebarCollapsed || mobile) && (
            <span
              className="text-xl font-bold text-foreground cursor-pointer"
              onClick={handleSignIn}
            >
              Sign In
              {/* <p className="text-sm "> Click to sign In account</p> */}
            </span>
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
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        // className="hidden lg:flex bg-card border-r border-border"
        className="fixed inset-y-0 left-0 z-50 hidden lg:block bg-card border-r border-border"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>
    </div>
  );
}
