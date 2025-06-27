import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Globe,
  Calendar,
  Users,
  Eye,
  Share2,
  
  ArrowLeft,
  Palette,
  Image as ImageIcon,
  
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicProject {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  publicSlug: string;
  viewCount: number;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  images: string[];
  isActive: boolean;
}

// Mock data for public projects
const mockPublicProjects: Record<string, PublicProject> = {
  'modern-dashboard-abc123': {
    id: '1',
    name: 'Modern Dashboard',
    description: 'A beautiful dashboard with dark mode support and advanced analytics. This project showcases modern design principles with clean layouts, intuitive navigation, and responsive components.',
    thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    progress: 75,
    status: 'active',
    publicSlug: 'modern-dashboard-abc123',
    viewCount: 1247,
    author: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
    tags: ['Dashboard', 'Modern', 'Analytics', 'Dark Mode'],
    images: [
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    isActive: true,
  },
  'portfolio-website-def456': {
    id: '3',
    name: 'Portfolio Website',
    description: 'Creative portfolio with smooth animations and responsive design. Features include project galleries, contact forms, and interactive elements.',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
    progress: 100,
    status: 'completed',
    publicSlug: 'portfolio-website-def456',
    viewCount: 892,
    author: {
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
    tags: ['Portfolio', 'Creative', 'Animation', 'Responsive'],
    images: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    isActive: true,
  },
};

export function PublicProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchPublicProject = async () => {
      if (!slug) {
        setError('Invalid project URL');
        setIsLoading(false);
        return;
      }

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const projectData = mockPublicProjects[slug];
        
        if (!projectData) {
          setError('Project not found or no longer public');
          setIsLoading(false);
          return;
        }

        if (!projectData.isActive) {
          setError('This project is no longer available for public viewing');
          setIsLoading(false);
          return;
        }

        setProject(projectData);
        
        // Increment view count (in real app, this would be an API call)
        projectData.viewCount += 1;
        
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProject();
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: project?.name,
        text: project?.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-8 w-48" />
            </div>
            
            <Skeleton className="aspect-video rounded-lg" />
            
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {error?.includes('not found') ? (
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
              ) : (
                <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
              )}
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {error?.includes('not found') ? 'Project Not Found' : 'Access Unavailable'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {error || 'This project is not available for public viewing.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button onClick={() => window.history.back()} variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Sign In to Access Projects
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Public Project</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{project.viewCount.toLocaleString()} views</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button onClick={() => navigate('/login')} size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={project.images[selectedImageIndex]}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Navigation */}
            {project.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'w-3 h-3 rounded-full transition-colors',
                      selectedImageIndex === index
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                <Badge className={cn('ml-4', getStatusColor(project.status))}>
                  {project.status}
                </Badge>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Author
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {project.author.avatar ? (
                        <img
                          src={project.author.avatar}
                          alt={project.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {project.author.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{project.author.name}</p>
                      <p className="text-xs text-muted-foreground">Project Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(project.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Interested in this project?</h3>
                    <p className="text-muted-foreground">
                      Sign in to create your own projects and collaborate with others
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <Button onClick={() => navigate('/login')}>
                      Sign In to Get Started
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Images Gallery */}
            {project.images.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Project Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          'aspect-video rounded-lg overflow-hidden border-2 transition-all',
                          selectedImageIndex === index
                            ? 'border-primary shadow-md'
                            : 'border-transparent hover:border-primary/50'
                        )}
                      >
                        <img
                          src={image}
                          alt={`${project.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}