import { useEffect, useState } from "react";
import {  Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Setting from "./Setting";
import dzinlylogo from "../../public/assets/marble/image.jpg";
import { AiOutlineMenuUnfold } from "react-icons/ai";

import { Sheet, SheetContent } from "@/components/ui/sheet";


import { cn } from "@/lib/utils";

import SidebarContent from "@/components/sideBar/SideBarContent";
import GetPlanFeatures from "@/components/planfeatures/GetPlanFeatures";

// const navigation = [
//   {
//     name: "Projects",
//     href: "/app/projects",
//     icon: FolderOpen,
//   },
//   {
//     name: "Studio",
//     href: "/app/studio",
//     icon: Palette,
//   },
//   {
//     name: "Materials Library",
//     href: "/app/swatchbook",
//     icon: Paintbrush,
//   },
// ];

export function MainLayout() {
  const location = useLocation();


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const isStudioPage = location.pathname.startsWith("/app/studio");

       const [isMobile, setIsMobile] = useState(false);
    const path=location.pathname;
  
    // Debug studio URL and mobile detection
    useEffect(() => {
        if(path.startsWith("/app/studio")) {
           
            setIsMobile(false);
        }else{
          setIsMobile(true)
        }
    }, [path]);
    

  return (
    <>
 

    <div className="min-h-screen bg-background">
      {/* Mobile Top Bar */}
   { isMobile &&
     <div className="a lg:hidden sticky top-0 z-40 bg-background border-b border-border flex items-center justify-between px-4 h-14">
        <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
         
          <AiOutlineMenuUnfold className="text-2xl" />

        </Button>
        <img src={dzinlylogo} alt="Dzinly" className="h-8" />
      </div>}

      {/* Desktop Sidebar */}
      {!isStudioPage && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 280 }}
          className="fixed inset-y-0 left-0 z-50 hidden lg:block bg-card border-r border-border "
        >
          <SidebarContent
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            mobile={false}
            setMobileMenuOpen={setMobileMenuOpen}
            setShareModalOpen={setShareModalOpen}
          />
        </motion.aside>
      )}

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} 
       onOpenChange={setMobileMenuOpen}
      >
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            mobile={true}
            setMobileMenuOpen={setMobileMenuOpen}
            setShareModalOpen={setShareModalOpen}
          />
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
    </>
  );
}
