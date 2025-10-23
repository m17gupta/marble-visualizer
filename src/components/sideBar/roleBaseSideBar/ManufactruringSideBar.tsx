import React from "react";
import {
  Factory,
  Truck,
  ClipboardList,
  BarChart3,
  ShoppingCart,
  FileText,
  Calendar,
  MessageCircle,
  Package,
  Palette,
  BookOpen,
  Users,
  Calculator,
  Settings,
  ChevronDown,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

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
const ManufactruringSideBar = ({
  sidebarCollapsed,
  mobile,
  setSidebarCollapsed,
  setMobileMenuOpen,
  setShareModalOpen,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.userProfile);

  const manufacturerSidebarSections: {
    title: string;
    items: SidebarItem[];
  }[] = [
    {
      title: "MANUFACTURER PORTAL",
      items: [
        {
          id: "manufacturer-profile",
          label: "Company Profile",
          icon: Factory,
          href: "/manufacturer/profile",
        },
        {
          id: "product-catalog",
          label: "Product Catalog",
          icon: Package,
          href: "/manufacturer/catalog",
        },
      ],
    },

    {
      title: "MATERIALS & PRODUCTS",
      items: [
        {
          id: "materials-library",
          label: "Materials Library",
          icon: Palette,
          href: "/app/materials",
        },
        {
          id: "material-add",
          label: "Add Material",
          icon: Plus,
          href: "/app/addmaterials",
        },
      ],
    },
    {
      title: "ORDERS & INVENTORY",
      items: [
        {
          id: "orders",
          label: "Orders Management",
          icon: ShoppingCart,
          href: "/manufacturer/orders",
        },
        {
          id: "inventory",
          label: "Inventory Tracking",
          icon: ClipboardList,
          href: "/manufacturer/inventory",
        },
        {
          id: "shipping",
          label: "Shipping & Logistics",
          icon: Truck,
          href: "/manufacturer/shipping",
        },
      ],
    },
    {
      title: "ANALYTICS & REPORTS",
      items: [
        {
          id: "sales-analytics",
          label: "Sales Analytics",
          icon: BarChart3,
          href: "/manufacturer/analytics",
        },
        {
          id: "reports",
          label: "Reports",
          icon: FileText,
          href: "/manufacturer/reports",
        },
      ],
    },
    {
      title: "CUSTOMER RELATIONS",
      items: [
        {
          id: "customers",
          label: "Customer Management",
          icon: Users,
          href: "/manufacturer/customers",
        },
        {
          id: "inquiries",
          label: "Product Inquiries",
          icon: MessageCircle,
          href: "/manufacturer/inquiries",
        },
        {
          id: "appointments",
          label: "Appointments",
          icon: Calendar,
          href: "/manufacturer/appointments",
        },
      ],
    },
    {
      title: "TOOLS & SETTINGS",
      items: [
        {
          id: "pricing-tools",
          label: "Pricing Calculator",
          icon: Calculator,
          href: "/manufacturer/pricing",
        },
        {
          id: "integrations",
          label: "System Integrations",
          icon: Settings,
          href: "/manufacturer/integrations",
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
        {profile &&
          profile.role === "manufacturer" &&
          manufacturerSidebarSections.map((section) => (
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
                          {item.hasChevron && (
                            <ChevronDown className="h-4 w-4" />
                          )}
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
  );
};

export default ManufactruringSideBar;
