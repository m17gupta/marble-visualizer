import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { toggleFavorite, Swatch } from '@/redux/slices/swatchSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  Heart,
  Eye,
  Palette,
  DollarSign,
  Clock,
  Droplets,
  Award,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwatchCardProps {
  swatch: Swatch;
  variant?: 'grid' | 'list';
  showActions?: boolean;
  className?: string;
}

export function SwatchCard({ 
  swatch, 
  variant = 'grid', 
  showActions = true,
  className 
}: SwatchCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { favorites } = useSelector((state: RootState) => state.swatches);
  
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isFavorite = favorites.includes(swatch._id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(toggleFavorite(swatch._id));
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleViewDetails = () => {
    navigate(`/swatch/${swatch.slug}`);
  };

  const handleCopyColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(swatch.color.hex);
    toast.success(`Color ${swatch.color.hex} copied to clipboard`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getLRVCategory = (lrv: number) => {
    if (lrv >= 70) return { label: 'Light', color: 'bg-yellow-100 text-yellow-800' };
    if (lrv >= 30) return { label: 'Medium', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Dark', color: 'bg-gray-100 text-gray-800' };
  };

  const lrvCategory = getLRVCategory(swatch.color.lrv);

  if (variant === 'list') {
    return (
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={cn('w-full', className)}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
            onClick={handleViewDetails}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex">
              {/* Color Preview */}
              <div className="w-24 h-24 flex-shrink-0 relative">
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: swatch.color.hex }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{swatch.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {swatch.sku}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {swatch.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{swatch.brand}</span>
                      <span>•</span>
                      <span>{swatch.category}</span>
                      <span>•</span>
                      <span>{swatch.finish}</span>
                      <span>•</span>
                      <span>LRV {swatch.color.lrv}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {showActions && (
                    <div className="flex items-center space-x-1 ml-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyColor}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy color code</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleToggleFavorite}
                            className={cn(
                              'h-8 w-8 p-0',
                              isFavorite && 'text-red-500 hover:text-red-600'
                            )}
                          >
                            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleViewDetails}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View details</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(swatch.pricing.per_gallon)}/gal
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(swatch.pricing.per_sqft)}/sq ft
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {swatch.certifications.slice(0, 2).map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cn('w-full', className)}
      >
        <Card 
          className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
          onClick={handleViewDetails}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Color Preview */}
          <div className="relative aspect-square">
            <div
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: swatch.color.hex }}
            />
            
            {/* Overlay with color info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Color details overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between text-white text-sm">
                <div>
                  <div className="font-medium">{swatch.color.hex}</div>
                  <div className="text-xs opacity-90">LRV {swatch.color.lrv}</div>
                </div>
                <Badge className={lrvCategory.color} variant="secondary">
                  {lrvCategory.label}
                </Badge>
              </div>
            </div>

            {/* Action buttons overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 flex flex-col space-y-1"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={cn(
                      'h-8 w-8 p-0 bg-white/90 hover:bg-white',
                      isFavorite && 'text-red-500 hover:text-red-600'
                    )}
                  >
                    <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyColor}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy color code</TooltipContent>
              </Tooltip>
            </motion.div>

            {/* Premium badge */}
            {swatch.pricing.per_gallon > 80 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Award className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{swatch.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {swatch.description}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {swatch.brand}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {swatch.finish}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Pricing */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">{formatPrice(swatch.pricing.per_gallon)}</span>
                <span className="text-xs text-muted-foreground">/gal</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatPrice(swatch.pricing.per_sqft)}/sq ft
              </span>
            </div>

            {/* Quick specs */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>Dry: {swatch.dry_time_touch}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="h-3 w-3" />
                <span>{swatch.coating_type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="h-3 w-3" />
                <span>{swatch.application.coverage_sqft_per_gal} sq ft/gal</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {swatch.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {swatch.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{swatch.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Certifications */}
            {swatch.certifications.length > 0 && (
              <div className="flex items-center space-x-1 mt-3">
                <Award className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  {swatch.certifications[0]}
                  {swatch.certifications.length > 1 && ` +${swatch.certifications.length - 1}`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}