import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { ProjectModel } from '@/models/projectModel/ProjectModel';
import { 
  fetchProjects, 
  clearError 
} from '@/redux/slices/projectSlice';
// import { ShareProjectDialog } from '@/components/ShareProjectDialog';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Plus, 
  Calendar, 
  Share2, 
  Edit3, 
  Globe,
  Lock,
  FolderOpen,
  BarChart3,
  MoreHorizontal,
  Users,
  Settings,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserProfileHome from '@/components/userProfile/UserProfileHome';
import { CreateProjectDialog } from './CreateProject';
import JobHome from '@/components/job/JobHome';
import SwatchBookDataHome from '@/components/swatchBookData/SwatchBookDataHome';

export function ProjectsPage() {
  // const [user_id, setUser_id] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: projects, isLoading, error } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const [shareDialogProject, setShareDialogProject] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProjects(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);


  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
  const handleProjectClick = (projectId: number | undefined) => {

    if (projectId) {
      setSelectedProjectId(projectId);
      navigate(`/app/studio/${projectId}`);
    }
  };

  // const handleShare = () => {
  //  // setShareDialogProject({ id: String(project.id || 0), name: project.name || '' });
  // };

  const handleCopyLink = (project: ProjectModel) => {
    const projectUrl = `${window.location.origin}/studio/${project.id}`;
    navigator.clipboard.writeText(projectUrl);
    toast.success('Project link copied to clipboard!');
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

  // const getRoleBadgeColor = (role: string) => {
  //   switch (role) {
  //     case 'admin':
  //       return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
  //     case 'editor':
  //       return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  //     case 'viewer':
  //       return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  //     default:
  //       return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  //   }
  // };

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
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p?.progress || 0), 0) / projects.length) : 0,
  };


  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    
  };
  return (
    <>
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
        <Button
         
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Project</span>
        </Button>
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
                  {project.jobData &&
                   project.jobData.length > 0 ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={project.jobData[0]?.thumbnail || '/placeholder-image.png'}
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
                    
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project?.status || 'active')}>
                      {project?.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Updated {formatDate(project.updated_at || '')}
                  </div>

                  {/* Access info */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                  
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
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handleShare(project);
                        // }}
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
                        <DropdownMenuItem 
                        onClick={() => handleCopyLink(project)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                       
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                        // onClick={() => handleShare(project)}
                          >
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
      {/* {shareDialogProject && (
        <ShareProjectDialog
          open={!!shareDialogProject}
          onOpenChange={(open) => !open && setShareDialogProject(null)}
          projectId={shareDialogProject.id}
          projectName={shareDialogProject.name}
        />
      )} */}
    </motion.div>

    <UserProfileHome/>

    <JobHome
      selectedProjectId={selectedProjectId || undefined}
      
    />

     { isCreateDialogOpen  &&
        user?.id && (
        <CreateProjectDialog
          open={isCreateDialogOpen}
          user_id={user?.id }
          onOpenChange={setIsCreateDialogOpen}
          onJobCreated={handleCloseCreateDialog}
        />)}

      <SwatchBookDataHome   />
    </>
  );
}