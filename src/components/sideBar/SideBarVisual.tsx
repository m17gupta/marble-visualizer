
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ShareModal from "@/components/ShareModal";
import { AiOutlineMenuFold } from "react-icons/ai";

import SidebarContent from "./SideBarContent";
import { useState } from "react";



// const sidebarSections: {
//   title: string;
//   items: SidebarItem[];
// }[] = [
//   {
//     title: 'ORGANIZATIONS',
//     items: [
//       { id: 'personal', label: 'Personal', icon: User, badge: 'Free Plan', href: '/app/personal' },
//       { id: 'add-org', label: 'Add Organization', icon: Plus, isAction: true },
//     ],
//   },
//   {
//     title: 'WORKSPACE',
//     items: [
//       { id: 'projects', label: 'Projects', icon: FolderOpen, hasChevron: true, href: '/app/projects' },
//       { id: 'assets', label: 'Assets', icon: Package, href: '/app/assets' },
//       { id: 'boards', label: 'Boards', icon: Layout, href: '/app/boards' },
//     ],
//   },
//   {
//     title: 'TOOLS & FEATURES',
//     items: [
//       { id: 'design-tools', label: 'Design Tools', icon: Palette, href: '/app/studio' },
//       { id: 'share-project', label: 'Share Project', icon: Share2, isAction: true }
//     ],
//   },
//   {
//     title: 'COMMUNITY',
//     items: [
//       { id: 'blogs', label: 'Blogs', icon: BookOpen, href: '/app/blogs' },
//       { id: 'affiliate', label: 'Affiliate Program', icon: Users, href: '/app/affiliate' },
//     ],
//   },
// ];

const SideBarVisual = ({ sidebarCollapsed, setSidebarCollapsed }: { sidebarCollapsed: boolean, setSidebarCollapsed: (v: boolean) => void }) => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();

  // sidebarCollapsed and setSidebarCollapsed are now controlled from parent
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // useEffect(() => {
  //   // Auto-close mobile menu on route change
  //   setMobileMenuOpen(false);
  // }, [location.pathname]);

  // const handleLogin = () => {
  //   try {
  //     dispatch(logoutUser());
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //   }
  //   navigate('/login');
  // };

  // const isActivePath = (path: string) => {
  //   if (!path) return false;
  //   return location.pathname === path || location.pathname.startsWith(path + "/");
  // };

  // const handleItemClick = (item: SidebarItem) => {
  //   if (item.isAction) return;

  //   if (item.id === 'share-project') {
  //     setSelectedProjectId('current-project'); // Replace with real project ID
  //     setShareModalOpen(true);
  //     return;
  //   }

  //   if (item.href) {
  //     navigate(item.href);
  //     setMobileMenuOpen(false);
  //   }
  // };

  // const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
  //   <div className="flex flex-col h-full bg-card">
  //     {/* Header */}
  //     <div className="flex items-center justify-between p-6">
  //       <motion.div
  //         initial={false}
  //         animate={{ opacity: sidebarCollapsed && !mobile ? 0 : 1 }}
  //         className="flex items-center space-x-3"
  //       >
  //         <div className="w-8 h-8  rounded-lg flex items-center justify-center">
  //           <Home className="h-5 w-5 text-primary-foreground" />
  //           <img src={dzinlylogo} alt="Dzinly Logo" className="h-100 w-100" />
  //           {/* <img src */}
  //         </div>
  //         {(!sidebarCollapsed || mobile) && (
  //           <span className="text-lg font-bold text-foreground">Visual Studio</span>
  //         )}

  //       </motion.div>

  //       {!mobile && (
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
  //           className="hidden lg:flex"
  //         >
  //           {sidebarCollapsed ? (
  //             <ChevronRight className="h-4 w-4" />
  //           ) : (
  //             <ChevronLeft className="h-4 w-4" />
  //           )}
  //         </Button>
  //       )}
  //     </div>

  //     {/* Navigation */}
  //     <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
  //       {sidebarSections.map((section) => (
  //         <div key={section.title} className="space-y-2">
  //           {(!sidebarCollapsed || mobile) && (
  //             <div className="px-2">
  //               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
  //                 {section.title}
  //               </h3>
  //             </div>
  //           )}
  //           <div className="space-y-1">
  //             {section.items.map((item) => {
  //               const Icon = item.icon;
  //               const active = isActivePath(item.href || "");

  //               return (
  //                 <motion.button
  //                   key={item.id}
  //                   onClick={() => handleItemClick(item)}
  //                   className={cn(
  //                     "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
  //                     active
  //                       ? "bg-primary text-primary-foreground shadow-sm"
  //                       : item.isAction
  //                       ? "text-primary hover:bg-primary/10"
  //                       : "text-muted-foreground hover:bg-muted hover:text-foreground"
  //                   )}
  //                   whileHover={{ scale: 1.02 }}
  //                   whileTap={{ scale: 0.98 }}
  //                 >
  //                   <div className="flex items-center">
  //                     <Icon className="h-5 w-5 flex-shrink-0" />
  //                     <AnimatePresence>
  //                       {(!sidebarCollapsed || mobile) && (
  //                         <motion.span
  //                           initial={{ opacity: 0, width: 0 }}
  //                           animate={{ opacity: 1, width: "auto" }}
  //                           exit={{ opacity: 0, width: 0 }}
  //                           className="ml-3"
  //                         >
  //                           {item.label}
  //                         </motion.span>
  //                       )}
  //                     </AnimatePresence>
  //                   </div>

  //                   {(!sidebarCollapsed || mobile) && (
  //                     <div className="flex items-center space-x-2">
  //                       {item.badge && (
  //                         <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
  //                           {item.badge}
  //                         </span>
  //                       )}
  //                       {item.hasChevron && <ChevronDown className="h-4 w-4" />}
  //                     </div>
  //                   )}
  //                 </motion.button>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       ))}
  //     </nav>

  //     {/* Footer */}
  //     <div className="p-4 border-t border-border">
  //       {(!sidebarCollapsed || mobile) && (
  //         <div className="space-y-2">
  //           <Button
  //             onClick={handleLogin}
  //             variant="ghost"
  //             className="w-full justify-start text-muted-foreground hover:text-foreground"
  //           >
  //             <Settings className="h-4 w-4 mr-3" />
  //             Login
  //           </Button>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (

    <>


    <div className="min-h-screen bg-background">
      {/* Toggle Mobile Sidebar Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-background shadow-md rounded-full h-11 "
      >
        <AiOutlineMenuFold className="h-5 w-5"/>

        {/* <Menu className="h-6 w-6" /> */}
      </Button>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        projectId={selectedProjectId || ''}
        projectName="Current Project"
      />

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="fixed inset-y-0 left-0 z-40 lg:block bg-card border-r border-border md:block hidden"
      >
        <SidebarContent
         mobile={false}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
           setMobileMenuOpen={setMobileMenuOpen}
            setShareModalOpen={setShareModalOpen}
        />
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent
            mobile={true}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            setMobileMenuOpen={setMobileMenuOpen}
            setShareModalOpen={setShareModalOpen}
           />
        </SheetContent>
      </Sheet>

    </div>
    </>
  );
};

export default SideBarVisual;
