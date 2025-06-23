import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppDispatch, RootState } from '@/redux/store';
import { 
  fetchProjects, 
  createProject, 
  toggleProjectVisibility,
  optimisticToggleVisibility,
  clearError 
} from '@/redux/slices/projectSlice';
import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Share2, 
  Edit3, 
  Eye, 
  EyeOff,
  Globe,
  Lock,
  Loader2,
  FolderOpen,
  BarChart3,
  MoreHorizontal,
  Crown,
  Users,
  Settings,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .min(3, 'Project name must be at least 3 characters')
    .max(50, 'Project name must be less than 50 characters'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  visibility: z.enum(['public', 'private']),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: projects, isLoading, isCreating, error } = useSelector((state: RootState) => state.projects);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [shareDialogProject, setShareDialogProject] = useState<{ id: string; name: string } | null>(null);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private',
    },
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onCreateProject = async (values: CreateProjectFormValues) => {
    const result = await dispatch(createProject(values));
    
    if (createProject.fulfilled.match(result)) {
      toast.success('Project created successfully!');
      setIsCreateDialogOpen(false);
      form.reset();
    }
  };

  const handleVisibilityToggle = async (projectId: string, currentVisibility: 'public' | 'private') => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
    
    // Optimistic update
    dispatch(optimisticToggleVisibility({ id: projectId, visibility: newVisibility }));
    
    try {
      await dispatch(toggleProjectVisibility({ id: projectId, visibility: newVisibility }));
      toast.success(`Project is now ${newVisibility}`);
    } catch (error) {
      // Revert optimistic update on error
      dispatch(optimisticToggleVisibility({ id: projectId, visibility: currentVisibility }));
      toast.error('Failed to update project visibility');
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/studio/${projectId}`);
  };

  const handleShare = (project: any) => {
    setShareDialogProject({ id: project.id, name: project.name });
  };

  const handleCopyLink = (project: any) => {
    const projectUrl = `${window.location.origin}/studio/${project.id}`;
    navigator.clipboard.writeText(projectUrl);
    toast.success('Project link copied to clipboard!');
  };

  const handleCopyPublicLink = (project: any) => {
    if (project.publicSlug) {
      const publicUrl = `${window.location.origin}/project/public/${project.publicSlug}`;
      navigator.clipboard.writeText(publicUrl);
      toast.success('Public link copied to clipboard!');
    }
  };

  const handleOpenPublic = (project: any) => {
    if (project.publicSlug) {
      window.open(`/project/public/${project.publicSlug}`, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'editor':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'viewer':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-32 w-full rounded-md mb-3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track progress
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new project and bring your ideas to life.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateProject)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter project name"
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your project (optional)"
                          rows={3}
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {field.value === 'public' ? 'Public Project' : 'Private Project'}
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value === 'public' 
                            ? 'Anyone can view this project' 
                            : 'Only you can view this project'
                          }
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === 'public'}
                          onCheckedChange={(checked) => 
                            field.onChange(checked ? 'public' : 'private')
                          }
                          disabled={isCreating}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                <div 
                  className="relative"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {project.thumbnail ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <FolderOpen className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                  
                  {/* Visibility and Role indicators */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        project.visibility === 'public' 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      )}
                    >
                      {project.visibility === 'public' ? (
                        <Globe className="h-3 w-3 mr-1" />
                      ) : (
                        <Lock className="h-3 w-3 mr-1" />
                      )}
                      {project.visibility}
                    </Badge>
                  </div>

                  {/* Role badge */}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getRoleBadgeColor(project.currentUserRole || 'viewer'))}
                    >
                      {project.currentUserRole === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                      {project.currentUserRole === 'editor' && <Edit3 className="h-3 w-3 mr-1" />}
                      {project.currentUserRole === 'viewer' && <Eye className="h-3 w-3 mr-1" />}
                      {project.currentUserRole}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Updated {formatDate(project.updatedAt)}
                  </div>

                  {/* Access info */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{project.accessList.length} member{project.accessList.length !== 1 ? 's' : ''}</span>
                    {project.isPublic && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="text-green-600">Public</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(project);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project.id);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyLink(project)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        {project.isPublic && project.publicSlug && (
                          <>
                            <DropdownMenuItem onClick={() => handleCopyPublicLink(project)}>
                              <Globe className="h-4 w-4 mr-2" />
                              Copy Public Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenPublic(project)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Public View
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleShare(project)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </motion.div>
      )}

      {/* Share Project Dialog */}
      {shareDialogProject && (
        <ShareProjectDialog
          open={!!shareDialogProject}
          onOpenChange={(open) => !open && setShareDialogProject(null)}
          projectId={shareDialogProject.id}
          projectName={shareDialogProject.name}
        />
      )}
    </motion.div>
  );
}