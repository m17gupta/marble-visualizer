// /**
//  * Example usage of Inspirational Color and Image Services
//  * This file demonstrates how to use the newly created services
//  */

// import { InspirationalColorService } from './inspirationColorService';
// import { InspirationalImageService } from './inspirationImageService';

// /**
//  * Example: Fetch all inspirational colors
//  */
// export async function fetchAllColors() {
//   try {
//     const result = await InspirationalColorService.getInspirationColors();
    
//     if (result.success) {
//       console.log('Colors fetched successfully:', result.data);
//       return result.data;
//     } else {
//       console.error('Failed to fetch colors:', result.error);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching colors:', error);
//     return [];
//   }
// }

// /**
//  * Example: Search colors by name
//  */
// export async function searchColors(searchTerm: string) {
//   try {
//     const result = await InspirationalColorService.searchInspirationColors(searchTerm);
    
//     if (result.success) {
//       console.log(`Found ${result.data?.length} colors matching "${searchTerm}":`, result.data);
//       return result.data;
//     } else {
//       console.error('Search failed:', result.error);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error searching colors:', error);
//     return [];
//   }
// }

// /**
//  * Example: Fetch colors with pagination
//  */
// export async function fetchColorsPaginated(page: number = 1, pageSize: number = 10) {
//   try {
//     const result = await InspirationalColorService.getInspirationColorsPaginated(page, pageSize);
    
//     if (result.success && result.data) {
//       console.log(`Page ${page} of colors:`, {
//         colors: result.data.data,
//         totalCount: result.data.count,
//         totalPages: result.data.totalPages,
//         hasMore: result.data.hasMore
//       });
//       return result.data;
//     } else {
//       console.error('Failed to fetch colors with pagination:', result.error);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching colors with pagination:', error);
//     return null;
//   }
// }

// /**
//  * Example: Fetch all inspirational images
//  */
// export async function fetchAllImages() {
//   try {
//     const result = await InspirationalImageService.getInspirationImages();
    
//     if (result.success) {
//       console.log('Images fetched successfully:', result.data);
//       return result.data;
//     } else {
//       console.error('Failed to fetch images:', result.error);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching images:', error);
//     return [];
//   }
// }

// /**
//  * Example: Fetch images by color family
//  */
// export async function fetchImagesByColorFamily(colorFamilyId: number) {
//   try {
//     const result = await InspirationalImageService.getInspirationImagesByColorFamily(colorFamilyId);
    
//     if (result.success) {
//       console.log(`Images for color family ${colorFamilyId}:`, result.data);
//       return result.data;
//     } else {
//       console.error('Failed to fetch images by color family:', result.error);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching images by color family:', error);
//     return [];
//   }
// }

// /**
//  * Example: Search images by name
//  */
// export async function searchImages(searchTerm: string) {
//   try {
//     const result = await InspirationalImageService.searchInspirationImages(searchTerm);
    
//     if (result.success) {
//       console.log(`Found ${result.data?.length} images matching "${searchTerm}":`, result.data);
//       return result.data;
//     } else {
//       console.error('Search failed:', result.error);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error searching images:', error);
//     return [];
//   }
// }

// /**
//  * Example: Fetch only active images
//  */
// export async function fetchActiveImages(limit: number = 20) {
//   try {
//     const result = await InspirationalImageService.getActiveInspirationImages(limit);
    
//     if (result.success) {
//       console.log(`Active images (limit: ${limit}):`, result.data);
//       return result.data;
//     } else {
//       console.error('Failed to fetch active images:', result.error);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching active images:', error);
//     return [];
//   }
// }

// /**
//  * Example: Get images count by color family
//  */
// export async function getImagesCountByColorFamily() {
//   try {
//     const result = await InspirationalImageService.getInspirationImagesCountByColorFamily();
    
//     if (result.success) {
//       console.log('Images count by color family:', result.data);
//       return result.data;
//     } else {
//       console.error('Failed to get images count:', result.error);
//       return {};
//     }
//   } catch (error) {
//     console.error('Error getting images count:', error);
//     return {};
//   }
// }

// /**
//  * Example: Fetch images with pagination
//  */
// export async function fetchImagesPaginated(page: number = 1, pageSize: number = 12) {
//   try {
//     const result = await InspirationalImageService.getInspirationImagesPaginated(page, pageSize);
    
//     if (result.success && result.data) {
//       console.log(`Page ${page} of images:`, {
//         images: result.data.data,
//         totalCount: result.data.count,
//         totalPages: result.data.totalPages,
//         hasMore: result.data.hasMore
//       });
//       return result.data;
//     } else {
//       console.error('Failed to fetch images with pagination:', result.error);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching images with pagination:', error);
//     return null;
//   }
// }

// /**
//  * Example: Combined function to fetch colors and their associated images
//  */
// export async function fetchColorsWithImages() {
//   try {
//     // Fetch all colors
//     const colorsResult = await InspirationalColorService.getInspirationColors();
    
//     if (!colorsResult.success || !colorsResult.data) {
//       console.error('Failed to fetch colors');
//       return [];
//     }

//     // Get images count by color family
//     const imagesCountResult = await InspirationalImageService.getInspirationImagesCountByColorFamily();
//     const imagesCount = imagesCountResult.success ? imagesCountResult.data : {};

//     // Combine colors with their image counts
//     const colorsWithImageCounts = colorsResult.data.map(color => ({
//       ...color,
//       imageCount: imagesCount?.[parseInt(color.id)] || 0
//     }));

//     console.log('Colors with image counts:', colorsWithImageCounts);
//     return colorsWithImageCounts;

//   } catch (error) {
//     console.error('Error fetching colors with images:', error);
//     return [];
//   }
// }
