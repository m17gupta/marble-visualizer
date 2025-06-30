// Export Style API
export { StyleApi } from './StyleApi';

// Export Style Service
export { StyleService } from './StyleService';

// Export Types
export type {
  CreateStyleRequest,
  UpdateStyleRequest,
  StyleFilters,
  StyleApiResponse,
} from './StyleApi';

// Default export for convenience
import { StyleService } from './StyleService';
export const styleService = StyleService;
