// import { MouseEvent, useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { AppDispatch, RootState } from "@/redux/store";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import {
//   ArrowLeft,
//   Heart,
//   Share2,
//   Copy,
//   Palette,
//   DollarSign,
//   Clock,
//   Droplets,
//   Award,
//   Package,
//   Ruler,
//   Shield,
//   Tag,
//   Layers,
//   Eye,
//   Info,
//   CheckCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { fetchSwatchBySlug, toggleFavorite } from "@/redux/slices/swatchSlice";
// import { getMaterialById } from "@/services/material";
// import { updateUserProfile } from "@/redux/slices/userProfileSlice";
// import { supabase } from "@/lib/supabase";

// export function SwatchDetailsPage() {
//   const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
//   const newPath = "https://betadzinly.s3.us-east-2.amazonaws.com/material/";
//   const params = useParams<{ id: string }>();
//   const id = params.id !== undefined ? parseInt(params.id) : 0;
//   const { profile } = useSelector((state: RootState) => state.userProfile);
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   // const { swatches, favorites, isLoading, error } = useSelector(
//   //   (state: RootState) => state.swatches
//   // );

//   const [currentSwatch, setCurrentSwatch] = useState({
//     _id: "static-id-123",
//     title: "Ocean Breeze Blue",
//     brand: "NovaPaints",
//     sku: "NP-OBB-001",
//     description: "A calming oceanic blue perfect for bedrooms and lounges.",
//     category: "Interior",
//     style: "Modern",
//     finish: "Matte",
//     coating_type: "Acrylic",
//     pricing: {
//       per_gallon: 39.99,
//       per_sqft: 0.45,
//     },
//     dry_time_touch: "30 mins",
//     dry_time_recoat: "2 hours",
//     tags: ["soothing", "trendy", "calm"],
//     segment_types: ["residential", "hospitality"],
//     certifications: ["GreenGuard Certified", "LEED Compliant"],
//     container_sizes: ["Quart", "Gallon", "5 Gallon"],
//     application: {
//       recommended_substrates: ["Drywall", "Plaster", "Wood"],
//       coverage_sqft_per_gal: 350,
//     },
//     color: {
//       hex: "#3BAFDA",
//       rgb: "59, 175, 218",
//       lrv: 65,
//     },
//   });

//   useEffect(() => {
//     const fetchMaterialById = async (id: number) => {
//       const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (!error) {
//         console.log(data);
//         // setCurrentSwatch(data)
//       }
//     };
//     fetchMaterialById(id);
//   }, [id]);

//   // useEffect(() => {
//   //   const fetchMaterialById = async (id: number) => {
//   //     const data = await getMaterialById(id);
//   //   };

//   //   fetchMaterialById(id);
//   // }, []);

//   const { materials, isLoading, error, pagination } = useSelector(
//     (state: RootState) => state.materials
//   );
//   const material = useMemo(() => {
//     return materials.find((d) => {
//       return d.id == id;
//     });
//   }, [materials]);

//   // const currentSwatch = materials.find((d)=>d.id==id)

//   const [activeTab, setActiveTab] = useState("overview");
//   // const [imageLoaded, setImageLoaded] = useState(false);

//   // useEffect(() => {
//   //   if (id !== null) {
//   //     dispatch(fetchSwatchBySlug(id));
//   //   }
//   // }, [id, dispatch]);

//   const isFavorite = currentSwatch
//     ? profile?.favorite_materials!.includes(id)
//     : false;

//   const handleToggleFavorite = async (
//     e: MouseEvent,
//     id: number,
//     profile: any
//   ) => {
//     e.stopPropagation();
//     const fav =
//       profile?.favorite_materials == null ? [] : profile.favorite_materials;
//     const newFav = [...fav];
//     if (isFavorite) {
//       await dispatch(
//         updateUserProfile({
//           userId: profile !== null ? profile.user_id! : "",
//           updates: {
//             favorite_materials: newFav.filter((idx) => idx !== id),
//           },
//         })
//       );
//     } else {
//       newFav.push(id);
//       await dispatch(
//         updateUserProfile({
//           userId: profile !== null ? profile.user_id! : "",
//           updates: {
//             favorite_materials: newFav,
//           },
//         })
//       );
//     }
//     toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
//   };

//   const handleCopyColor = () => {
//     if (!currentSwatch) return;

//     navigator.clipboard.writeText(currentSwatch.color.hex);
//     toast.success(`Color ${currentSwatch.color.hex} copied to clipboard`);
//   };

//   const handleShare = async () => {
//     if (!currentSwatch) return;
//     // try {
//     //   await navigator.share({
//     //     title: currentSwatch.title,
//     //     text: currentSwatch.description,
//     //     url: window.location.href,
//     //   });
//     // } catch (erro) {
//     //   // Fallback to copying URL
//     //   navigator.clipboard.writeText(window.location.href);
//     //   toast.success('Link copied to clipboard');
//     // }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price);
//   };

//   const getLRVCategory = (lrv: number) => {
//     if (lrv >= 70)
//       return {
//         label: "Light",
//         color: "bg-yellow-100 text-yellow-800",
//         description: "Reflects most light, ideal for small spaces",
//       };
//     if (lrv >= 30)
//       return {
//         label: "Medium",
//         color: "bg-orange-100 text-orange-800",
//         description: "Balanced light reflection, versatile for most rooms",
//       };
//     return {
//       label: "Dark",
//       color: "bg-gray-100 text-gray-800",
//       description: "Absorbs most light, creates dramatic atmosphere",
//     };
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center space-x-4">
//           <Skeleton className="h-10 w-20" />
//           <Skeleton className="h-8 w-48" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <Skeleton className="aspect-square rounded-lg" />
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-3/4" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-2/3" />
//             <div className="space-y-2">
//               {[...Array(5)].map((_, i) => (
//                 <Skeleton key={i} className="h-12 w-full" />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !currentSwatch) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold mb-4">Swatch not found</h2>
//         <p className="text-muted-foreground mb-6">
//           The swatch you're looking for doesn't exist or has been removed.
//         </p>
//         <Button onClick={() => navigate("/swatchbook")}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to SwatchBook
//         </Button>
//       </div>
//     );
//   }

//   const lrvCategory = getLRVCategory(currentSwatch.color.lrv);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-6 p-6"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/app/swatchbook")}
//           className="flex items-center space-x-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           <span>Back to Materials</span>
//         </Button>

//         <div className="flex items-center space-x-2">
//           <Button variant="outline" size="sm" onClick={handleShare}>
//             <Share2 className="h-4 w-4 mr-2" />
//             Share
//           </Button>

//           <Button
//             variant={isFavorite ? "default" : "outline"}
//             size="sm"
//             onClick={(e) => handleToggleFavorite(e, id, profile)}
//             className={cn(
//               isFavorite &&
//                 "text-red-500 hover:text-red-600 bg-white border-red-400"
//             )}
//           >
//             <Heart
//               className={cn("h-4 w-4 mr-2", isFavorite && "fill-current")}
//             />
//             {isFavorite ? "Favorited" : "Add to Favorites"}
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Color Preview */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Card className="overflow-hidden">
//             <div className="relative aspect-square">
//               <div className="w-full h-full transition-all duration-300">
//                 <img
//                   className="w-full"
//                   src={
//                     `${material?.bucket_path}` === "default"
//                       ? `${path}/${material?.photo}`
//                       : `${newPath}/${material?.bucket_path}`
//                   }
//                   alt=""
//                 />
//               </div>

//               {/* Color overlay info */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//               <div className="absolute bottom-6 left-6 right-6">
//                 <div className="flex items-end justify-between text-white">
//                   <div>
//                     <h2 className="text-2xl font-bold mb-1">
//                       {currentSwatch.color.hex}
//                     </h2>
//                     <p className="text-sm opacity-90">
//                       {currentSwatch.color.rgb}
//                     </p>
//                     <p className="text-sm opacity-90">
//                       LRV {currentSwatch.color.lrv}
//                     </p>
//                   </div>
//                   <Badge className={lrvCategory.color} variant="secondary">
//                     {lrvCategory.label}
//                   </Badge>
//                 </div>
//               </div>

//               {/* Copy color button */}
//               <Button
//                 variant="secondary"
//                 size="sm"
//                 onClick={handleCopyColor}
//                 className="absolute top-4 right-4 bg-white/90 hover:bg-white"
//               >
//                 <Copy className="h-4 w-4 mr-2" />
//                 Copy Color
//               </Button>
//             </div>
//           </Card>
//         </motion.div>

//         {/* Details */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="space-y-6"
//         >
//           {/* Basic Info */}
//           <div>
//             <div className="flex items-start justify-between mb-3">
//               <div>
//                 <h1 className="text-3xl font-bold">{material?.title}</h1>
//                 <p className="text-lg text-muted-foreground">
//                   {currentSwatch.brand}
//                 </p>
//               </div>
//               <Badge variant="outline" className="text-sm">
//                 {currentSwatch.sku}
//               </Badge>
//             </div>

//             <p className="text-muted-foreground mb-4">
//               {material?.description}
//             </p>

//             <div className="flex flex-wrap gap-2 mb-4">
//               <Badge variant="secondary">{currentSwatch.category}</Badge>
//               <Badge variant="secondary">{currentSwatch.style}</Badge>
//               <Badge variant="secondary">{currentSwatch.finish}</Badge>
//               <Badge variant="secondary">{currentSwatch.coating_type}</Badge>
//             </div>
//           </div>

//           {/* Pricing */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg flex items-center">
//                 <DollarSign className="h-5 w-5 mr-2" />
//                 Pricing
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Per Gallon</p>
//                   <p className="text-2xl font-bold text-green-600">
//                     {formatPrice(currentSwatch.pricing.per_gallon)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Per Sq Ft</p>
//                   <p className="text-2xl font-bold text-green-600">
//                     {formatPrice(currentSwatch.pricing.per_sqft)}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Specs */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg flex items-center">
//                 <Info className="h-5 w-5 mr-2" />
//                 Quick Specs
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">Dry Time (Touch)</span>
//                 </div>
//                 <span className="text-sm font-medium">
//                   {currentSwatch.dry_time_touch}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">Dry Time (Recoat)</span>
//                 </div>
//                 <span className="text-sm font-medium">
//                   {currentSwatch.dry_time_recoat}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Ruler className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">Coverage</span>
//                 </div>
//                 <span className="text-sm font-medium">
//                   {currentSwatch.application.coverage_sqft_per_gal} sq ft/gal
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Eye className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">Light Reflectance</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium">
//                     {currentSwatch.color.lrv}
//                   </span>
//                   <Badge
//                     className={`${lrvCategory.color} text-xs`}
//                     variant="secondary"
//                   >
//                     {lrvCategory.label}
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Detailed Information Tabs */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.2 }}
//       >
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full grid-cols-5">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="application">Application</TabsTrigger>
//             <TabsTrigger value="specifications">Specifications</TabsTrigger>
//             <TabsTrigger value="certifications">Certifications</TabsTrigger>
//             <TabsTrigger value="availability">Availability</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview" className="mt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Palette className="h-5 w-5 mr-2" />
//                     Color Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label className="text-sm font-medium">Hex Code</Label>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <div
//                         className="w-6 h-6 rounded border"
//                         style={{ backgroundColor: currentSwatch.color.hex }}
//                       />
//                       <code className="text-sm bg-muted px-2 py-1 rounded">
//                         {currentSwatch.color.hex}
//                       </code>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={handleCopyColor}
//                         className="h-6 w-6 p-0"
//                       >
//                         <Copy className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-sm font-medium">RGB Values</Label>
//                     <code className="block text-sm bg-muted px-2 py-1 rounded mt-1">
//                       {currentSwatch.color.rgb}
//                     </code>
//                   </div>

//                   <div>
//                     <Label className="text-sm font-medium">
//                       Light Reflectance Value
//                     </Label>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <span className="text-sm font-medium">
//                         {currentSwatch.color.lrv}
//                       </span>
//                       <Badge className={lrvCategory.color} variant="secondary">
//                         {lrvCategory.label}
//                       </Badge>
//                     </div>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {lrvCategory.description}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Tag className="h-5 w-5 mr-2" />
//                     Tags & Categories
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">
//                       Style Tags
//                     </Label>
//                     <div className="flex flex-wrap gap-1">
//                       {currentSwatch.tags.map((tag) => (
//                         <Badge
//                           key={tag}
//                           variant="secondary"
//                           className="text-xs"
//                         >
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">
//                       Application Areas
//                     </Label>
//                     <div className="flex flex-wrap gap-1">
//                       {currentSwatch.segment_types.map((type) => (
//                         <Badge
//                           key={type}
//                           variant="outline"
//                           className="text-xs capitalize"
//                         >
//                           {type}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="application" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Layers className="h-5 w-5 mr-2" />
//                   Application Guidelines
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <Label className="text-sm font-medium mb-3 block">
//                     Recommended Substrates
//                   </Label>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {currentSwatch.application.recommended_substrates.map(
//                       (substrate) => (
//                         <div
//                           key={substrate}
//                           className="flex items-center space-x-2 p-3 border rounded-lg"
//                         >
//                           <CheckCircle className="h-4 w-4 text-green-600" />
//                           <span className="text-sm">{substrate}</span>
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">
//                       Coverage
//                     </Label>
//                     <div className="text-2xl font-bold text-primary">
//                       {currentSwatch.application.coverage_sqft_per_gal}
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       square feet per gallon
//                     </p>
//                   </div>

//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">
//                       Finish Type
//                     </Label>
//                     <div className="text-lg font-semibold">
//                       {currentSwatch.finish}
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {currentSwatch.coating_type} coating
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="specifications" className="mt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Clock className="h-5 w-5 mr-2" />
//                     Drying Times
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between p-3 border rounded-lg">
//                     <span className="text-sm font-medium">Touch Dry</span>
//                     <span className="text-sm">
//                       {currentSwatch.dry_time_touch}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between p-3 border rounded-lg">
//                     <span className="text-sm font-medium">Recoat Time</span>
//                     <span className="text-sm">
//                       {currentSwatch.dry_time_recoat}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Droplets className="h-5 w-5 mr-2" />
//                     Product Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between p-3 border rounded-lg">
//                     <span className="text-sm font-medium">Coating Type</span>
//                     <span className="text-sm">
//                       {currentSwatch.coating_type}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between p-3 border rounded-lg">
//                     <span className="text-sm font-medium">Finish</span>
//                     <span className="text-sm">{currentSwatch.finish}</span>
//                   </div>
//                   <div className="flex items-center justify-between p-3 border rounded-lg">
//                     <span className="text-sm font-medium">Style</span>
//                     <span className="text-sm">{currentSwatch.style}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="certifications" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Award className="h-5 w-5 mr-2" />
//                   Certifications & Standards
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {currentSwatch.certifications.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {currentSwatch.certifications.map((cert) => (
//                       <div
//                         key={cert}
//                         className="flex items-center space-x-3 p-4 border rounded-lg"
//                       >
//                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                           <Shield className="h-5 w-5 text-green-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium">{cert}</h4>
//                           <p className="text-sm text-muted-foreground">
//                             Certified standard
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-muted-foreground">
//                     <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                     <p>No certifications listed for this product</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="availability" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Package className="h-5 w-5 mr-2" />
//                   Container Sizes & Availability
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <Label className="text-sm font-medium mb-3 block">
//                     Available Sizes
//                   </Label>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {currentSwatch.container_sizes.map((size) => (
//                       <div
//                         key={size}
//                         className="flex items-center justify-between p-3 border rounded-lg"
//                       >
//                         <span className="text-sm font-medium">{size}</span>
//                         <Badge variant="secondary" className="text-xs">
//                           In Stock
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <Separator />

//                 <div>
//                   <Label className="text-sm font-medium mb-3 block">
//                     Pricing by Size
//                   </Label>
//                   <div className="space-y-2">
//                     {currentSwatch.container_sizes.map((size) => {
//                       // Mock pricing calculation based on size
//                       const multiplier = size.includes("Quart")
//                         ? 0.25
//                         : size.includes("5")
//                         ? 4.5
//                         : 1;
//                       const price =
//                         currentSwatch.pricing.per_gallon * multiplier;

//                       return (
//                         <div
//                           key={size}
//                           className="flex items-center justify-between p-3 bg-muted rounded-lg"
//                         >
//                           <span className="text-sm">{size}</span>
//                           <span className="text-sm font-semibold text-green-600">
//                             {formatPrice(price)}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </motion.div>
//     </motion.div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Layers } from "lucide-react";
import { RootState } from "@/redux/store";
import { supabase } from "@/lib/supabase";

export function SwatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.userProfile);

  const [currentSwatch, setCurrentSwatch] = useState<any>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterialById = async (id: number) => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError("Swatch not found");
      } else {
        setCurrentSwatch(data);
        setSelectedVariantIndex(0); // Default to first variant
      }
      setLoading(false);
    };

    if (id) fetchMaterialById(id);
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-80" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error || !currentSwatch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Swatch not found</h2>
        <p className="text-muted-foreground mb-6">
          The swatch you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/swatchbook")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to SwatchBook
        </Button>
      </div>
    );
  }

  const variants = currentSwatch.attribute_values || [];
  const selectedVariant = variants[selectedVariantIndex] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/swatchbook")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Materials</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {currentSwatch.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label className="text-muted-foreground text-sm">SKU</Label>
            <p>{currentSwatch.sku}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Description</Label>
            <p>{currentSwatch.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Select Variant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedVariantIndex.toString()}
              onValueChange={(value) => setSelectedVariantIndex(Number(value))}
            >
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select a Variant" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant: any, index: number) => (
                  <SelectItem key={index} value={index.toString()}>
                    Variant #{index + 1} -{" "}
                    {variant?.price ? `₹${variant.price}` : "No Price"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Details</span>
                <Badge className="text-sm">
                  {selectedVariant.price
                    ? `₹${selectedVariant.price}`
                    : "No Price"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(selectedVariant).map(([key, attr]: any) => {
                  if (key === "price") return null;

                  if (
                    typeof attr?.value === "string" &&
                    attr.value.includes(",")
                  ) {
                    // Comma-separated values, show in a dropdown
                    const options = attr.value
                      .split(",")
                      .map((opt: string) => opt.trim());
                    return (
                      <div key={key}>
                        <Label className="text-xs text-muted-foreground">
                          {attr.keyname}
                        </Label>
                        <select className="w-full mt-1 border rounded p-1 text-sm">
                          {options.map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  return (
                    <div key={key}>
                      <Label className="text-xs text-muted-foreground">
                        {attr.keyname}
                      </Label>
                      <div>
                        {attr.value} {attr.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
