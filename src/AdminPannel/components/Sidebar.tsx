// src/layouts/Sidebar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dzinlylogo from "../../../public/assets/image/dzinlylogo-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { logoutUser } from "@/redux/slices/user/authSlice";
import { clearCurrentJob } from "@/redux/slices/jobSlice";
import { clearCurrentImage } from "@/redux/slices/studioSlice";
import { clearBreadcrumbs } from "@/redux/slices/visualizerSlice/workspaceSlice";
import Setting from "@/layouts/Setting";
import { cn } from "@/lib/utils";

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
  Settings as SettingsIcon,
  Database,
  FileText,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export type AdminPage =
  | "dashboard"
  | "projects"
  | "analytics"
  | "demo_project"
  | "materials"
  | "addmaterials"
  | "material-attributes"
  | "brand"
  | "style"
  | "category"
  | "material-segment"
  | "material-connections"
  | "user"
  | "user-plan"
  | "data-library"
  | "roles"
  | "permissions"
  | "word-assistant"
  | "material"
  | "addSwatch"
  | "add-project"
  | "reports";



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

/* ---------- data ---------- */
const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { id: "projects", label: "Projects", icon: FolderOpen, section: "main" },
  { id: "analytics", label: "Analytics", icon: BarChart3, section: "main" },
  { id: "demo_project", label: "Demo Project", icon: FolderOpen, section: "main" },
];

const documentItems: NavigationItem[] = [
  { id: "materials", label: "Materials Library", icon: Package, section: "documents" },
  { id: "addmaterials", label: "Add Materials", icon: Plus, section: "documents" },
  { id: "material-attributes", label: "Attributes", icon: SettingsIcon, section: "documents" },
  { id: "brand", label: "Brands", icon: Tag, section: "documents" },
  { id: "style", label: "Styles", icon: Palette, section: "documents" },
  { id: "category", label: "Categories", icon: Grid3x3, section: "documents" },
  { id: "material-segment", label: "Segments", icon: Users, section: "documents" },
  { id: "material-connections", label: "Connections", icon: Link, section: "documents" },
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
  { id: "user-plan", label: "Subscriptions", icon: CreditCard, section: "main" },
];

const toolsItems: NavigationItem[] = [
  { id: "data-library", label: "Data Library", icon: Database, section: "documents" },
  { id: "reports", label: "Reports", icon: FileText, section: "documents" },
];

/* ---------- helpers ---------- */
function selectUser(state: RootState) {
  // apne store ke hisaab se adjust kar sakte ho
  const u =
    (state as any)?.auth?.user ||
    (state as any)?.user?.profile ||
    (state as any)?.user;
  return {
    name: u?.name || u?.fullName || "shadcn",
    email: u?.email || "m@example.com",
    avatar: u?.avatarUrl || u?.image || "",
  };
}

function NavSection({
  title,
  items,
  collapsed,
  currentPage,
  onClick,
}: {
  title: string;
  items: NavigationItem[];
  collapsed: boolean;
  currentPage: AdminPage;
  onClick: (id: AdminPage) => void;
}) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;

          const content = (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-8 rounded-lg text-gray-600 hover:bg-gray-50 bg-transparent hover:border-none border-none focus:ring-outline-none focus:ring-0",
                "hover:bg-gray-50 hover:text-accent-foreground focus:ring-outline-none focus:ring-0",
                "data-[active=true]:bg-gray-50 data-[active=true]:text-primary focus:ring-outline-none focus:ring-0",
                collapsed && "justify-center px-2",
                !collapsed && "px-3"
              )}
              data-active={active}
              onClick={() => onClick(item.id)}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Button>
          );

          return collapsed ? (
            <TooltipProvider key={item.id}>
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
}

/* ---------- user menu (shadcn style, dynamic) ---------- */
function UserMenu({
  collapsed,
  onLogout,
  name,
  email,
  avatar,
}: {
  collapsed: boolean;
  onLogout: () => void;
  name: string;
  email: string;
  avatar?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full h-12 rounded-lg justify-start gap-3",
            "hover:bg-accent hover:text-accent-foreground",
            collapsed ? "justify-center px-2" : "px-3"
          )}
        >
          <Avatar className="h-6 w-6">
            {!!avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>
              {name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium leading-4">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            {!!avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium leading-4">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Upgrade to Pro
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Account
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- actual sidebar content ---------- */
function SidebarContent({
  collapsed,
  setCollapsed,
  currentPage,
  onNav,
  onOpenSettings,
  onLogout,
  name,
  email,
  avatar,
}: {
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
  currentPage: AdminPage;
  onNav: (p: AdminPage) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  name: string;
  email: string;
  avatar?: string;
}) {
  return (
    <div className={cn("flex h-screen flex-col border-r bg-background", collapsed ? "w-16" : "w-64")}>
      {/* header */}
      <div className="flex items-center justify-between border-b px-2 py-3">
        <div className="flex items-center gap-3">
          <img src={dzinlylogo} alt="Dzinly" className="h-8 w-8" />
          {!collapsed && <span className="font-semibold">Dzinly</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* nav */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-6">
          <NavSection title="Workspace" items={navigationItems} collapsed={collapsed} currentPage={currentPage} onClick={onNav} />
          <NavSection title="Materials Library" items={documentItems} collapsed={collapsed} currentPage={currentPage} onClick={onNav} />
          <NavSection title="User Management" items={userManagementItems} collapsed={collapsed} currentPage={currentPage} onClick={onNav} />
          <NavSection title="Tools & Features" items={toolsItems} collapsed={collapsed} currentPage={currentPage} onClick={onNav} />
        </div>
      </ScrollArea>

      {/* footer: settings + user menu */}
      <div className="border-t p-2 space-y-2">
      
        {/* <Button
          variant="ghost"
          className={cn(
            "w-full h-10 rounded-lg justify-start",
            "hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center"
          )}
          onClick={onOpenSettings}
        >
          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          {!collapsed && <span className="ml-3 text-sm">Settings</span>}
        </Button> */}

        {/* Dynamic user card (shadcn style) */}
        <UserMenu
          collapsed={collapsed}
          onLogout={onLogout}
          name={name}
          email={email}
          avatar={avatar}
        />
      </div>
    </div>
  );
}

/* ---------- wrapper (mobile + desktop) ---------- */
const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); // desktop default expanded
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { name, email, avatar } = useSelector(selectUser);

  const handleNavClick = (page: AdminPage) => {
    navigate(`/admin/${page}`);
    onPageChange(page);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCurrentJob());
      dispatch(clearCurrentImage());
      dispatch(clearBreadcrumbs());
      window.location.href = "/";
    } catch {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <Setting isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* mobile */}
      <div className="md:hidden fixed left-4 top-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="shadow">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              currentPage={currentPage}
              onNav={handleNavClick}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onLogout={handleLogout}
              name={name}
              email={email}
              avatar={avatar}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* desktop */}
      <div className="hidden md:block">
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          currentPage={currentPage}
          onNav={handleNavClick}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          name={name}
          email={email}
          avatar={avatar}
        />
      </div>
    </>
  );
};

export default Sidebar;
