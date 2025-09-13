import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Palette, Globe, HelpCircle, LogOut, Crown, Zap, CreditCard, Sparkles, ChevronRight, UserPlus, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/store';
import { logoutUser } from '@/redux/slices/user/authSlice';
import { clearCurrentImage } from '@/redux/slices/studioSlice';
import { clearCurrentJob } from '@/redux/slices/jobSlice';
import { clearBreadcrumbs } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { toast } from 'sonner';

interface SettingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsItem {
  icon: LucideIcon;
  label: string;
  action: () => void;
  toggle?: boolean;
  value?: boolean;
  highlight?: boolean;
  iconColor?: string;
  subtitle?: string;
  hasArrow?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const Setting: React.FC<SettingProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.userProfile);
  const { userPlan } = useSelector((state: RootState) => state.auth);
  const handleLogout = async () => {
    try {
         
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCurrentJob());
      dispatch(clearCurrentImage());
      dispatch(clearBreadcrumbs())
      toast.success("Logged out successfully");
        window.location.href = "/";
    } catch (error) {
      // Even if logout fails, force navigation to home page
      console.error("Logout error:", error);
      navigate("/", { replace: true });
    }
  };
  
  
  const userInfo = {
    name: "Guest",
    initials: "GS"
  };

  const settingsSections: SettingsSection[] = [
    {
      title: "",
      items: [
        { 
          icon: Crown, 
          label: "Upgrade Plan", 
          action: () => navigate('/app/upgrade'),
          highlight: true,
          iconColor: "text-yellow-500"
        },
        { 
          icon: Zap, 
          label: `${userPlan?.credits || 0} Credits Left`, 
          action: () => {},
          subtitle: "Credits remaining",
          iconColor: "text-blue-500"
        },
      ]
    },
    {
      title: "",
      items: [
        { 
          icon: CreditCard, 
          label: "Account & Subscription", 
          action: () => navigate('/app/subscription'),
          hasArrow: true
        },
        { 
          icon: Bell, 
          label: "Notifications", 
          action: () => {},
          subtitle: "(0)",
          hasArrow: true
        },
        { 
          icon: Sparkles, 
          label: "What's New", 
          action: () => {},
          hasArrow: true,
          iconColor: "text-purple-500"
        },
      ]
    },
    {
      title: "Appearance",
      items: [
        { 
          icon: Palette, 
          label: "Dark Mode", 
          toggle: true, 
          value: theme === 'dark',
          action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", action: () => {}, hasArrow: true },
        { icon: Globe, label: "Language", action: () => {}, hasArrow: true },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed top-0 left-0 bottom-0 bg-card border-r border-border z-50 w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between py-2 px-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full py-3 px-2 border-black/10 hover:bg-muted bg-white" 
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-80px)]">
              <div className="p-4 space-y-4">
                {/* User Profile Header */}
                <div className="flex items-center space-x-3 pb-4 border-b border-border">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {profile?.full_name.charAt(0).toUpperCase() || userInfo.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{profile?.full_name ||  userInfo.name}</h3>
                  </div>
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {settingsSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    {section.title && (
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={itemIndex}
                            className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                              item.highlight ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800' : ''
                            }`}
                            onClick={item.action}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className={`h-5 w-5 ${item.iconColor || 'text-muted-foreground'}`} />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">
                                  {item.label}
                                </span>
                                {item.subtitle && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.subtitle}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.toggle && (
                                <Switch
                                  checked={item.value}
                                  onCheckedChange={item.action}
                                />
                              )}
                              {item.hasArrow && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Auth Section */}
                <div className="pt-4 border-t border-border">
                { isAuthenticated ?(
                   <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </div>
                ):( <Button
                    variant="ghost"
                    className="w-full justify-between text-foreground hover:bg-muted"
                    onClick={() => navigate('/login')}
                  >
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-3" />
                      Log in / Sign up
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>)}
                </div>

                {/* Logout Section */}
                
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Setting;