import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { 
  fetchProjectAccess, 
  inviteUserToProject, 
  updateUserRole, 
  removeUserFromProject,
  toggleProjectPublic 
} from '@/redux/slices/projectSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Share2,
  UserPlus,
  Copy,
  Globe,
  Lock,
  Crown,
  Edit3,
  Eye,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Shield,
  Users,
  Link as LinkIcon,
  Mail,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

const roleIcons = {
  admin: Crown,
  editor: Edit3,
  viewer: Eye,
};

const roleColors = {
  admin: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  editor: 'text-blue-600 bg-blue-50 border-blue-200',
  viewer: 'text-gray-600 bg-gray-50 border-gray-200',
};

const roleDescriptions = {
  admin: 'Full access including project settings and user management',
  editor: 'Can edit content, segments, and generate designs',
  viewer: 'Can view project but cannot make changes',
};

export function ShareProjectDialog({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName 
}: ShareProjectDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, currentUserRole, isLoadingAccess } = useSelector(
    (state: RootState) => state.projects
  );
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [isInviting, setIsInviting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAdmin = currentUserRole === 'admin';
  const accessList = currentProject?.accessList || [];
  const isPublic = currentProject?.isPublic || false;
  const publicSlug = currentProject?.publicSlug;

  useEffect(() => {
    if (open && projectId) {
      dispatch(fetchProjectAccess(projectId));
    }
  }, [open, projectId, dispatch]);

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!isValidEmail(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if user is already invited
    const existingUser = accessList.find(access => access.email.toLowerCase() === inviteEmail.toLowerCase());
    if (existingUser) {
      toast.error('User is already invited to this project');
      return;
    }

    setIsInviting(true);
    try {
      const result = await dispatch(inviteUserToProject({
        projectId,
        email: inviteEmail.trim(),
        role: inviteRole,
      }));

      if (inviteUserToProject.fulfilled.match(result)) {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
        setInviteRole('viewer');
      }
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      const result = await dispatch(updateUserRole({
        projectId,
        userId,
        role: newRole,
      }));

      if (updateUserRole.fulfilled.match(result)) {
        toast.success('User role updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    try {
      const result = await dispatch(removeUserFromProject({
        projectId,
        userId,
      }));

      if (removeUserFromProject.fulfilled.match(result)) {
        toast.success(`${userEmail} removed from project`);
      }
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  const handleTogglePublic = async () => {
    try {
      const result = await dispatch(toggleProjectPublic({
        projectId,
        isPublic: !isPublic,
      }));

      if (toggleProjectPublic.fulfilled.match(result)) {
        toast.success(isPublic ? 'Project is now private' : 'Project is now public');
      }
    } catch (error) {
      toast.error('Failed to update project visibility');
    }
  };

  const handleCopyPublicLink = () => {
    if (publicSlug) {
      const publicUrl = `${window.location.origin}/project/public/${publicSlug}`;
      navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      toast.success('Public link copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyProjectLink = () => {
    const projectUrl = `${window.location.origin}/studio/${projectId}`;
    navigator.clipboard.writeText(projectUrl);
    toast.success('Project link copied to clipboard');
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Project</span>
          </DialogTitle>
          <DialogDescription>
            Manage access and sharing settings for "{projectName}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Public Sharing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Public Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Make project public</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone with the link can view this project
                  </p>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={handleTogglePublic}
                  disabled={!isAdmin}
                />
              </div>

              {isPublic && publicSlug && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Public Link</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={`${window.location.origin}/project/public/${publicSlug}`}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyPublicLink}
                        className="flex-shrink-0"
                      >
                        {copiedLink ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/project/public/${publicSlug}`, '_blank')}
                        className="flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {!isAdmin && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Only project admins can change public access settings
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Invite Users */}
          {isAdmin && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Invite People</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Label htmlFor="invite-email" className="text-xs font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleInviteUser();
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Role</Label>
                    <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-3 w-3" />
                            <span>Viewer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center space-x-2">
                            <Edit3 className="h-3 w-3" />
                            <span>Editor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center space-x-2">
                            <Crown className="h-3 w-3" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleInviteUser}
                  disabled={isInviting || !inviteEmail.trim()}
                  className="w-full"
                >
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>

                {/* Role Descriptions */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Role Permissions</Label>
                  <div className="space-y-1">
                    {Object.entries(roleDescriptions).map(([role, description]) => {
                      const Icon = roleIcons[role as keyof typeof roleIcons];
                      return (
                        <div key={role} className="flex items-start space-x-2 text-xs">
                          <Icon className="h-3 w-3 mt-0.5 text-muted-foreground" />
                          <div>
                            <span className="font-medium capitalize">{role}:</span>
                            <span className="text-muted-foreground ml-1">{description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Access List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>People with Access</span>
                <Badge variant="secondary" className="text-xs">
                  {accessList.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAccess ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="max-h-64">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {accessList.map((access, index) => {
                        const Icon = roleIcons[access.role];
                        const isCurrentUser = access.userId === '1'; // In real app, compare with current user ID
                        
                        return (
                          <motion.div
                            key={access.userId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {access.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-medium">{access.email}</p>
                                  {isCurrentUser && (
                                    <Badge variant="outline" className="text-xs">
                                      You
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Added {formatDate(access.addedAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={cn('text-xs', roleColors[access.role])}
                              >
                                <Icon className="h-3 w-3 mr-1" />
                                {access.role}
                              </Badge>

                              {isAdmin && !isCurrentUser && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateRole(access.userId, 'admin')}
                                      disabled={access.role === 'admin'}
                                    >
                                      <Crown className="h-3 w-3 mr-2" />
                                      Make Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateRole(access.userId, 'editor')}
                                      disabled={access.role === 'editor'}
                                    >
                                      <Edit3 className="h-3 w-3 mr-2" />
                                      Make Editor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateRole(access.userId, 'viewer')}
                                      disabled={access.role === 'viewer'}
                                    >
                                      <Eye className="h-3 w-3 mr-2" />
                                      Make Viewer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleRemoveUser(access.userId, access.email)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Remove Access
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <LinkIcon className="h-4 w-4" />
                <span>Quick Share</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleCopyProjectLink}
                  className="w-full justify-start"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Project Link
                </Button>
                
                {isPublic && publicSlug && (
                  <Button
                    variant="outline"
                    onClick={handleCopyPublicLink}
                    className="w-full justify-start"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Copy Public Link
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}