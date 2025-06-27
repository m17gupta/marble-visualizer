// Export Brand API
export { BrandApi } from './BrandApi';

// Export Brand Service
export { BrandService } from './BrandService';

// Export Types
export type {
  CreateBrandRequest,
  UpdateBrandRequest,
  BrandFilters,
  BrandApiResponse,
} from './BrandApi';

// Default export for convenience
import { BrandService } from './BrandService';
export const brandService = BrandService;
