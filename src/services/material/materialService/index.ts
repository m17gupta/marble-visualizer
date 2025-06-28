// Export Material API
export * from './MaterialApi';

// Export Material Service
export * from './MaterialService';

// Export Material Model
export * from '../../../models/swatchBook/material/MaterialModel';

// Create and export a default instance
import { MaterialService } from './MaterialService';
export const materialService = MaterialService;

// Export convenience functions
export const {
  createMaterial,
  getMaterials,
  getMaterialById,
  getMaterialsByCategoryId,
  getMaterialsByBrandId,
  updateMaterial,
  deleteMaterial,
  toggleMaterialStatus,

  getMaterialCount,
  deleteMaterials,
  
  getActiveMaterials,
  searchMaterials,
} = MaterialService;
