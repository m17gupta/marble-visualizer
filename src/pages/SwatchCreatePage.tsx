import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import * as z from 'zod';
import { AppDispatch, RootState } from '@/redux/store';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Palette,
  Upload,
  Plus,
  X,
  Save,
  Eye,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const swatchSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  style: z.string().min(1, 'Style is required'),
  sku: z.string().min(1, 'SKU is required'),
  color: z.object({
    hex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
    rgb: z.string().min(1, 'RGB is required'),
    lrv: z.number().min(0).max(100),
  }),
  finish: z.string().min(1, 'Finish is required'),
  coating_type: z.string().min(1, 'Coating type is required'),
  dry_time_touch: z.string().min(1, 'Touch dry time is required'),
  dry_time_recoat: z.string().min(1, 'Recoat time is required'),
  application: z.object({
    recommended_substrates: z.array(z.string()).min(1, 'At least one substrate is required'),
    coverage_sqft_per_gal: z.number().min(1, 'Coverage is required'),
  }),
  pricing: z.object({
    per_gallon: z.number().min(0.01, 'Price per gallon is required'),
    per_sqft: z.number().min(0.001, 'Price per sq ft is required'),
  }),
  container_sizes: z.array(z.string()).min(1, 'At least one container size is required'),
  certifications: z.array(z.string()),
  tags: z.array(z.string()),
  segment_types: z.array(z.string()).min(1, 'At least one segment type is required'),
});

type SwatchFormValues = z.infer<typeof swatchSchema>;

const categoryOptions = ['Interior', 'Exterior', 'Specialty', 'Primer'];
const styleOptions = ['Modern', 'Traditional', 'Contemporary', 'Industrial', 'Mediterranean', 'Scandinavian'];
const finishOptions = ['Flat', 'Eggshell', 'Satin', 'Semi-Gloss', 'Gloss'];
const coatingTypeOptions = ['Latex', 'Acrylic', 'Oil-Based', 'Enamel'];
const substrateOptions = ['Drywall', 'Plaster', 'Wood', 'Metal', 'Concrete', 'Masonry', 'Stucco'];
const containerSizeOptions = ['1 Quart', '1 Gallon', '5 Gallon'];
const certificationOptions = ['Low VOC', 'GREENGUARD Gold', 'Weather Resistant', 'Fade Resistant', 'Antimicrobial'];
const segmentTypeOptions = ['walls', 'ceiling', 'trim', 'doors', 'cabinets', 'siding'];

export function SwatchCreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isCreating } = useSelector((state: RootState) => state.swatches);
  
  const [previewColor, setPreviewColor] = useState('#FFFFFF');
  const [customTag, setCustomTag] = useState('');

  const form = useForm<SwatchFormValues>({
    resolver: zodResolver(swatchSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      brand: '',
      style: '',
      sku: '',
      color: {
        hex: '#FFFFFF',
        rgb: 'rgb(255, 255, 255)',
        lrv: 90,
      },
      finish: '',
      coating_type: '',
      dry_time_touch: '',
      dry_time_recoat: '',
      application: {
        recommended_substrates: [],
        coverage_sqft_per_gal: 400,
      },
      pricing: {
        per_gallon: 0,
        per_sqft: 0,
      },
      container_sizes: [],
      certifications: [],
      tags: [],
      segment_types: [],
    },
  });

  const watchedValues = form.watch();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return 'rgb(255, 255, 255)';
  };

  const calculateLRV = (hex: string) => {
    // Simplified LRV calculation
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      // Simplified formula for demonstration
      return Math.round((r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100);
    }
    return 50;
  };

  const handleColorChange = (hex: string) => {
    setPreviewColor(hex);
    const rgb = hexToRgb(hex);
    const lrv = calculateLRV(hex);
    
    form.setValue('color.hex', hex);
    form.setValue('color.rgb', rgb);
    form.setValue('color.lrv', lrv);
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !watchedValues.tags.includes(customTag.trim())) {
      form.setValue('tags', [...watchedValues.tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue('tags', watchedValues.tags.filter(tag => tag !== tagToRemove));
  };

  const handleArrayFieldToggle = (
    fieldName: keyof SwatchFormValues,
    value: string,
    currentArray: string[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    form.setValue(fieldName as any, newArray);
  };

  const onSubmit = async (data: SwatchFormValues) => {
    try {
      const swatchData: Omit<Swatch, '_id' | 'slug' | 'created_at' | 'updated_at'> = {
        ...data,
        image_url: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
        created_by: 'current_user', // In real app, get from auth state
        is_favorite: false,
      };

      const result = await dispatch(createSwatch(swatchData));
      
      if (createSwatch.fulfilled.match(result)) {
        toast.success('Swatch created successfully!');
        navigate(`/swatch/${result.payload.slug}`);
      }
    } catch (error) {
      toast.error('Failed to create swatch');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/swatchbook')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to SwatchBook</span>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Swatch</h1>
            <p className="text-muted-foreground">
              Add a new paint swatch to the collection
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Color Preview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Color Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <div
                      className="w-full h-full transition-colors duration-300"
                      style={{ backgroundColor: previewColor }}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hex:</span>
                      <code className="bg-muted px-2 py-1 rounded">{watchedValues.color.hex}</code>
                    </div>
                    <div className="flex justify-between">
                      <span>RGB:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs">{watchedValues.color.rgb}</code>
                    </div>
                    <div className="flex justify-between">
                      <span>LRV:</span>
                      <span className="font-medium">{watchedValues.color.lrv}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details for the swatch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Arctic White" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input placeholder="PP-AW-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A crisp, clean white with subtle cool undertones..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand *</FormLabel>
                          <FormControl>
                            <Input placeholder="Premium Paints" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Style *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {styleOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Color Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Information</CardTitle>
                  <CardDescription>
                    Define the color properties
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="color.hex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hex Color *</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={field.value}
                              onChange={(e) => handleColorChange(e.target.value)}
                              className="w-16 h-10 p-1 border rounded"
                            />
                            <Input
                              placeholder="#FFFFFF"
                              value={field.value}
                              onChange={(e) => handleColorChange(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                  <CardDescription>
                    Technical details and specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="finish"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Finish *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select finish" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {finishOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="coating_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coating Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select coating type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coatingTypeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dry_time_touch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Touch Dry Time *</FormLabel>
                          <FormControl>
                            <Input placeholder="2 hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dry_time_recoat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recoat Time *</FormLabel>
                          <FormControl>
                            <Input placeholder="4 hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="application.coverage_sqft_per_gal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage (sq ft per gallon) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="400"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Set pricing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing.per_gallon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Gallon ($) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="65.99"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.per_sqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Sq Ft ($) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.001"
                              placeholder="0.16"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Application & Substrates */}
              <Card>
                <CardHeader>
                  <CardTitle>Application</CardTitle>
                  <CardDescription>
                    Recommended substrates and application areas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Recommended Substrates *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {substrateOptions.map((substrate) => (
                        <div key={substrate} className="flex items-center space-x-2">
                          <Checkbox
                            id={substrate}
                            checked={watchedValues.application.recommended_substrates.includes(substrate)}
                            onCheckedChange={() =>
                              handleArrayFieldToggle(
                                'application.recommended_substrates' as any,
                                substrate,
                                watchedValues.application.recommended_substrates
                              )
                            }
                          />
                          <Label htmlFor={substrate} className="text-sm cursor-pointer">
                            {substrate}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Segment Types *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {segmentTypeOptions.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={watchedValues.segment_types.includes(type)}
                            onCheckedChange={() =>
                              handleArrayFieldToggle('segment_types', type, watchedValues.segment_types)
                            }
                          />
                          <Label htmlFor={type} className="text-sm cursor-pointer capitalize">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container Sizes & Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability & Certifications</CardTitle>
                  <CardDescription>
                    Container sizes and product certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Container Sizes *
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {containerSizeOptions.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={size}
                            checked={watchedValues.container_sizes.includes(size)}
                            onCheckedChange={() =>
                              handleArrayFieldToggle('container_sizes', size, watchedValues.container_sizes)
                            }
                          />
                          <Label htmlFor={size} className="text-sm cursor-pointer">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Certifications
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {certificationOptions.map((cert) => (
                        <div key={cert} className="flex items-center space-x-2">
                          <Checkbox
                            id={cert}
                            checked={watchedValues.certifications.includes(cert)}
                            onCheckedChange={() =>
                              handleArrayFieldToggle('certifications', cert, watchedValues.certifications)
                            }
                          />
                          <Label htmlFor={cert} className="text-sm cursor-pointer">
                            {cert}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Add descriptive tags for better searchability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomTag}
                      disabled={!customTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {watchedValues.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watchedValues.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTag(tag)}
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/swatchbook')}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Swatch
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}