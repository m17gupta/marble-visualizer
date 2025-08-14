import { useEffect, useState } from "react";
// import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import { AppDispatch } from '@/redux/store';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  // Heart,
  // Eye,
  Palette,
  DollarSign,
  Clock,
  Droplets,
  // Award,
  Copy,
  ExternalLink,
  Heart,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUserProfile } from "@/redux/slices/userProfileSlice";

interface SwatchCardProps {
  swatch: MaterialModel;
  variant?: "grid" | "list";
  layoutMode?: "compact" | "detailed";
  showActions?: boolean;
  className?: string;
  onOpenChange: (id: number) => void;
}

export function SwatchCard({
  swatch,
  variant = "grid",
  layoutMode = "detailed",
  showActions = true,
  className,
  onOpenChange,
}: SwatchCardProps) {
  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const { favorites } = useSelector((state: RootState) => state.swatches);
  const { profile, isUpdating } = useSelector(
    (state: RootState) => state.userProfile
  );

  const isFavorite = profile?.favorite_materials?.includes(swatch.id);

  const [isHovered, setIsHovered] = useState(false);
  // const [favorites, setFavorites] = useState<number[]>([]);
  // const [imageLoaded, setImageLoaded] = useState(false);
  const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
  const newPath = "https://betadzinly.s3.us-east-2.amazonaws.com/material/";
  const handleToggleFavorite = async (
    e: React.MouseEvent,
    id: number,
    profile: any
  ) => {
    e.stopPropagation();
    const fav =
      profile?.favorite_materials == null ? [] : profile.favorite_materials;
    const newFav = [...fav];
    if (fav.includes(id)) {
      await dispatch(
        updateUserProfile({
          userId: profile !== null ? profile.user_id! : "",
          updates: {
            favorite_materials: newFav.filter((idx) => idx !== id),
          },
        })
      );
    } else {
      newFav.push(id);
      await dispatch(
        updateUserProfile({
          userId: profile !== null ? profile.user_id! : "",
          updates: {
            favorite_materials: newFav,
          },
        })
      );
    }

    // const getAllFavorite = (await JSON.parse(
    //   localStorage.getItem("fav_swatch") || "[]"
    // )) as number[];

    // if (!getAllFavorite.includes(id)) {
    //   getAllFavorite.push(id);
    //   await localStorage.setItem("fav_swatch", JSON.stringify(getAllFavorite));
    //   setFavorites(getAllFavorite); // update state
    // } else {
    //   const filteredData = getAllFavorite.filter((d) => d !== id);
    //   await localStorage.setItem("fav_swatch", JSON.stringify(filteredData));
    //   setFavorites(filteredData);
    // }
  };

  // useEffect(() => {

  //   // const stored = JSON.parse(
  //   //   localStorage.getItem("fav_swatch") || "[]"
  //   // ) as number[];
  //   // setFavorites(stored);
  // }, []);

  const handleViewDetails = (id: number) => {
    const path = `/app/swatchbook/${id}`;
    navigate(path);
  };

  const handleCopyColor = (e: React.MouseEvent) => {
    // e.stopPropagation();
    // navigator.clipboard.writeText(swatch.color.hex);
    // toast.success(`Color ${swatch.color.hex} copied to clipboard`);
  };

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   }).format(price);
  // };

  const getLRVCategory = (lrv: number) => {
    if (lrv >= 70)
      return {
        label: "Light",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
      };
    if (lrv >= 30)
      return {
        label: "Medium",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
      };
    return {
      label: "Dark",
      color:
        "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
    };
  };

  const lrvCategory = getLRVCategory(swatch.material_category_id);

  // Compact List View
  if (variant === "list" && layoutMode === "compact") {
    return (
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={cn("w-full", className)}
        >
          <Card
            className="cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden bg-card border-border"
            onClick={() => handleViewDetails(swatch.id!)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center p-3">
              {/* Compact Color Preview */}
              <div className="w-12 h-12 flex-shrink-0 relative rounded-md overflow-hidden border border-border">
                <img
                  src={
                    `${swatch.bucket_path}` === "default"
                      ? `${path}/${swatch.photo}`
                      : `${newPath}/${swatch.bucket_path}`
                  }
                  alt={swatch.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.backgroundColor = swatch.color || "#ffffff";
                    target.style.display = "block";
                    target.src = "";
                  }}
                />
              </div>

              {/* Compact Content */}
              <div className="flex-1 min-w-0 ml-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate text-foreground">
                      {swatch.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded text-muted-foreground">
                        {swatch.color ?? "#000000"}
                      </code>
                      {/* <span className="text-xs text-green-600 font-medium">
                        {formatPrice(swatch.description ?? "")}
                      </span> */}
                    </div>
                  </div>

                  {/* Compact Actions */}
                  {showActions && (
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyColor}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>

                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleFavorite}
                        className={cn(
                          'h-8 w-8 p-0',
                          isFavorite && 'text-red-500 hover:text-red-600'
                        )}
                      >
                        <Heart className={cn('h-3 w-3', isFavorite && 'fill-current')} />
                      </Button> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </TooltipProvider>
    );
  }

  // Compact Grid View
  if (variant === "grid" && layoutMode === "compact") {
    return (
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={cn("w-full", className)}
        >
          <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-card border-border"
            onClick={() => handleViewDetails(swatch.id!)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Compact Color Preview */}
            <div className="relative aspect-square">
              <img
                src={
                  `${swatch.bucket_path}` === "default"
                    ? `${path}/${swatch.photo}`
                    : `${newPath}/${swatch.bucket_path}`
                }
                alt={swatch.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = swatch.color || "#ffffff";
                  target.style.display = "block";
                  target.src = "";
                }}
              />

              {/* Compact overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Compact color info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white text-xs">
                  <div className="font-medium truncate">{swatch.title}</div>
                  <div className="opacity-90">{swatch.description}</div>
                </div>
              </div>

              {/* Compact action buttons */}
              {showActions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2 flex space-x-1"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleToggleFavorite(e, swatch.id, profile)}
                    className={cn(
                      "h-6 w-6 p-0 bg-white/90 hover:bg-white",
                      profile?.favorite_materials !== null &&
                        profile?.favorite_materials !== undefined &&
                        profile?.favorite_materials.includes(swatch.id) &&
                        "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3",
                        profile?.favorite_materials !== null &&
                          profile?.favorite_materials !== undefined &&
                          profile?.favorite_materials.includes(swatch.id) &&
                          "fill-current"
                      )}
                    />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChange(swatch.id);
                    }}
                    className={cn("h-6 w-6 p-0 bg-white/90 hover:bg-white")}
                  >
                    <Edit2 className={cn("h-3 w-3")} />
                  </Button>
                </motion.div>
              )}

              {/* Premium badge for compact */}
              {/* {swatch.pricing.per_gallon > 80 && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500 text-yellow-900 text-xs px-1 py-0">
                    Pro
                  </Badge>
                </div>
              )} */}
            </div>

            {/* Compact footer */}
            {/* <div className="p-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600 font-medium">
                  {formatPrice(swatch.pricing.per_gallon)}s
                </span>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {swatch.brand}
                </Badge>
              </div>
            </div> */}
          </Card>
        </motion.div>
      </TooltipProvider>
    );
  }

  // Detailed List View (existing implementation)
  if (variant === "list") {
    return (
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={cn("w-full", className)}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-card border-border"
            onClick={() => handleViewDetails(swatch.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex">
              {/* Color Preview */}
              <div className="w-24 h-24 flex-shrink-0 relative">
                <img
                  src={
                    `${swatch.bucket_path}` === "default"
                      ? `${path}/${swatch.photo}`
                      : `${newPath}/${swatch.bucket_path}`
                  }
                  alt={swatch.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.backgroundColor = swatch.color || "#000000";
                    target.style.display = "block";
                    target.src = "";
                  }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg truncate text-foreground">
                        {swatch.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {swatch.color}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {swatch.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {/* <span>{swatch.brand}</span>
                      <span>•</span>
                      <span>{swatch.category}</span>
                      <span>•</span>
                      <span>{swatch.finish}</span>
                      <span>•</span>
                      <span>LRV {swatch.color.lrv}</span> */}
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
                            onClick={(e) =>
                              handleToggleFavorite(e, swatch.id, profile)
                            }
                            className={cn(
                              "h-8 w-8 p-0",
                              profile?.favorite_materials !== null &&
                                profile?.favorite_materials !== undefined &&
                                profile?.favorite_materials.includes(
                                  swatch.id
                                ) &&
                                "text-red-500 hover:text-red-600"
                            )}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                profile?.favorite_materials !== null &&
                                  profile?.favorite_materials !== undefined &&
                                  profile?.favorite_materials.includes(
                                    swatch.id
                                  ) &&
                                  "fill-current"
                              )}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {profile?.favorite_materials !== null &&
                          profile?.favorite_materials !== undefined &&
                          profile?.favorite_materials.includes(swatch.id)
                            ? "Remove from favorites"
                            : "Add to favorites"}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(swatch.id)}
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
                {/* <div className="mt-3 flex items-center justify-between">
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
                </div> */}
              </div>
            </div>
          </Card>
        </motion.div>
      </TooltipProvider>
    );
  }

  // Detailed Grid View (existing implementation)
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cn("w-full", className)}
      >
        <Card
          className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden bg-card border-border"
          onClick={() => handleViewDetails(swatch.id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Color Preview */}
          <div className="relative aspect-square">
            <img
              src={
                `${swatch.bucket_path}` === "default"
                  ? `${path}/${swatch.photo}`
                  : `${newPath}/${swatch.bucket_path}`
              }
              alt={swatch.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.backgroundColor = swatch.color || "#ffffff";
                target.style.display = "block";
                target.src = "";
              }}
            />

            {/* Overlay with color info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Color details overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between text-white text-sm">
                <div>
                  <div className="font-medium">{swatch.title}</div>
                  <div className="text-xs opacity-90">
                    Description: {swatch.description}
                  </div>
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
                    onClick={(e) => handleToggleFavorite(e, swatch.id, profile)}
                    className={cn(
                      "h-8 w-8 p-0 bg-white/90 hover:bg-white",
                      profile?.favorite_materials !== null &&
                        profile?.favorite_materials !== undefined &&
                        profile?.favorite_materials.includes(swatch.id) &&
                        "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        profile?.favorite_materials !== null &&
                          profile?.favorite_materials !== undefined &&
                          profile?.favorite_materials.includes(swatch.id) &&
                          "fill-current"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {profile?.favorite_materials !== null &&
                  profile?.favorite_materials !== undefined &&
                  profile?.favorite_materials.includes(swatch.id)
                    ? "Remove from favorites"
                    : "Add to favorites"}
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
            {/* {swatch.pricing.per_gallon > 80 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Award className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )} */}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate text-foreground">
                  {swatch.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {swatch.description}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {swatch.material_brand_id}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {swatch.finish_needed}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0 hidden">
            {/* Pricing */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-green-600">
                <DollarSign className="h-4 w-4" />
                {/* <span className="font-semibold">{formatPrice(swatch.pricing.per_gallon)}</span> */}
                <span className="text-xs text-muted-foreground">/gal</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {/* {formatPrice(swatch.pricing.per_sqft)}/sq ft */}
              </span>
            </div>

            {/* Quick specs */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                {/* <span>Dry: {swatch.dry_time_touch}</span> */}
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="h-3 w-3" />
                {/* <span>{swatch.coating_type}</span> */}
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="h-3 w-3" />
                {/* <span>{swatch.application.coverage_sqft_per_gal} sq ft/gal</span> */}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {/* {swatch.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))} */}
              {/* {swatch.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{swatch.tags.length - 3}
                </Badge>
              )} */}
            </div>

            {/* Certifications */}
            {/* {swatch.certifications.length > 0 && (
              <div className="flex items-center space-x-1 mt-3">
                <Award className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  {swatch.certifications[0]}
                  {swatch.certifications.length > 1 && ` +${swatch.certifications.length - 1}`}
                </span>
              </div>
            )} */}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
