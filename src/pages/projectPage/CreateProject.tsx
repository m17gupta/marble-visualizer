import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppDispatch, RootState } from '@/redux/store';
import { createProject } from '@/redux/slices/projectSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { UploadImage } from '@/components/uploadImageS3';
import { ProjectModel } from '@/models/projectModel/ProjectModel';

import { CreateJob, CreateJobParams } from '@/utils/CreateJob';

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
  visibility: z.enum(['public', 'private']).default('private'),
  status: z.enum(['active', 'pending', 'completed']).default('active'),
  thumbnail: z.string().optional(),
  user_id: z.string().min(1, 'User ID is required'), // Assuming user_id is required for project creation
  jobType: z.enum(['living Room', 'kitchen', 'bathroom', 'bedRoom', 'counter Top']).default('living Room'),
  imageFile: z.any().optional(), // For the uploaded image file
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  user_id: string; // Assuming user_id is required for project creation
  onOpenChange: (open: boolean) => void;
  onJobCreated?: () => void;
}

// Predefined thumbnail options
const thumbnailOptions = [
  "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2",
  "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2",
  "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2"
];

// Job type options
const jobTypeOptions = [
  { value: 'living Room', label: 'Living Room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'bedRoom', label: 'Bedroom' },
  { value: 'counter Top', label: 'Counter Top' }
];

export function CreateProjectDialog({ open,user_id, onOpenChange, onJobCreated }: CreateProjectDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating } = useSelector((state: RootState) => state.jobs);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

   const [createdProjectId, setCreatedProjectId] = useState<number | null>(null); 

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private',
      status: 'active',
      thumbnail: thumbnailOptions[0],
      user_id: user_id || "", // Default to user_id
      jobType: 'living Room',
      imageFile: null,
    },
  });

  // const handleImageUpload = (file: File) => {
  //   if (!file.type.startsWith('image/')) {
  //     toast.error('Please upload an image file');
  //     return;
  //   }

  //   // if (file.size > 10 * 1024 * 1024) { // 10MB limit
  //   //   toast.error('File size must be less than 10MB');
  //   //   return;
  //   // }

  //   setUploadedImage(file);

  //   // Create preview URL
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     setImagePreview(e.target?.result as string);
  //   };
  //   reader.readAsDataURL(file);

  //   // Update form
  //   form.setValue('imageFile', file);
  // };

  // const removeImage = () => {
  //   setUploadedImage(null);
  //   setImagePreview(null);
  //   form.setValue('imageFile', null);
  // };

  const onCreateProject = async (values: CreateProjectFormValues) => {
   

  if( !values.name || values.name.trim() === '') {
      toast.error('Project name is required');
      return;
    }

    const projectData:ProjectModel = {
    name: values.name,
    description: values.description?? '',
    // visibility: "public",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: user_id,
    thumbnail: values.thumbnail || thumbnailOptions[0],
    };
    
    // // Remove imageFile from the data sent to the server
    // const { imageFile, ...projectDataWithoutFile } = projectData;

    const result = await dispatch(createProject(projectData));
    if (createProject.pending.match(result)) {
      toast.loading('Creating project...');
      return;
    }
    if (createProject.fulfilled.match(result)) {
      setCreatedProjectId(result.payload.id || null); // Assuming the payload contains the created project ID
      toast.success('Project created successfully!');
      // onOpenChange(false);
      // form.reset();
      setUploadedImage(null);
      setImagePreview(null);
     
    }
  };

  const CheckJobImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleCreateJob=async(jobUrl:string, key:string )=>{
   
      if(!jobUrl || !key || !createdProjectId) {
        toast.error('Job creation failed. Please try again.');
        return;
      }
      // Create job data object
      const jobData: CreateJobParams = {
        jobUrl: jobUrl,
        projectId: createdProjectId,
        jobType: form.getValues('jobType'),
        dispatch: dispatch,
      };
  // create job
      CreateJob(jobData, {
        resetForm: () => form.reset(),
        clearProjectId: () => setCreatedProjectId(null),
        clearImages: () => {  
          setImagePreview(null);
          setUploadedImage(null);
        }
      });
      // try{
      //  const jobData:JobModel = {
      //   project_id: createdProjectId,
      //   jobType: form.getValues('jobType'),
      //   full_image: jobUrl,
      //   thumbnail:jobUrl,
      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString(),
      //  }
     
      //  const jobResponse = await dispatch(createJob(jobData));
      //  if (createJob.pending.match(jobResponse)) {
      //    toast.loading('Creating job...');
      //    return;
      //  }
      //  if (createJob.fulfilled.match(jobResponse)) {
      //    toast.success('Job created successfully!');
      //      form.reset();
      //      setCreatedProjectId(null);
      //      setImagePreview(null);
      //      setUploadedImage(null);
      //    onJobCreated?.();

      //  }

      // }catch(error) {
      //   console.error('Error creating job:', error);
      //   toast.error('Job creation failed. Please try again.');
      // }

  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
 

 {/* select their thumbnail */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isCreating}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select thumbnail" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {thumbnailOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          <img src={option} alt="Thumbnail" className="w-12 h-8 object-cover rounded" />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />

            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isCreating}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

           
            <UploadImage
              createdProjectId={createdProjectId || null}
              jobImageUpload={CheckJobImageUpload}
              onUploadSuccess={handleCreateJob}
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
                onClick={() => onOpenChange(false)}
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
  );
}
