import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Share2, Shield, Crown, Edit3, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioSidebarHeaderProps {
  currentUserRole: 'admin' | 'editor' | 'viewer' | null;
  canEdit: boolean;
  canAdmin: boolean;
  onShareClick: () => void;
}

export function StudioSidebarHeader({ 
  currentUserRole, 
  canEdit, 
  canAdmin, 
  onShareClick 
}: StudioSidebarHeaderProps) {
  // Role badge component
  const RoleBadge = () => {
    if (!currentUserRole) return null;

    const roleConfig = {
      admin: {
        icon: Crown,
        color:
          "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800",
        label: "Admin",
      },
      editor: {
        icon: Edit3,
        color:
          "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
        label: "Editor",
      },
      viewer: {
        icon: Eye,
        color: "text-muted-foreground bg-muted border-border",
        label: "Viewer",
      },
    };

    const config = roleConfig[currentUserRole];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("text-xs", config.color)}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-4 border-b border-border flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Design Studio
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure your design
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RoleBadge />
          {canAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Permission Alert */}
      {!canEdit && (
        <Alert className="mb-4">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            You have view-only access to this project. Contact an admin to
            request edit permissions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
