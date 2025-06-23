import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Material {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: 'texture' | 'color' | 'pattern';
  thumbnail: string;
  previewUrl?: string;
  textureUrl?: string;
  color?: string;
  description: string;
  tags: string[];
  price?: number;
  isPremium: boolean;
  createdAt: string;
}

interface MaterialsState {
  materials: Material[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  materials: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

// Mock materials data
const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Concrete Wall',
    brand: 'Urban Materials',
    category: 'Architecture',
    type: 'texture',
    thumbnail: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    textureUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    description: 'High-resolution concrete texture with realistic surface details',
    tags: ['concrete', 'wall', 'urban', 'gray'],
    isPremium: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Natural Wood',
    brand: 'Forest Collection',
    category: 'Natural',
    type: 'texture',
    thumbnail: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    textureUrl: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    description: 'Beautiful natural wood grain pattern',
    tags: ['wood', 'natural', 'brown', 'grain'],
    isPremium: false,
    createdAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    name: 'Brick Pattern',
    brand: 'Classic Materials',
    category: 'Architecture',
    type: 'texture',
    thumbnail: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    textureUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    description: 'Traditional red brick wall texture',
    tags: ['brick', 'red', 'wall', 'traditional'],
    isPremium: true,
    price: 9.99,
    createdAt: '2024-01-13T14:20:00Z',
  },
  {
    id: '4',
    name: 'Ocean Blue',
    brand: 'Color Palette Pro',
    category: 'Colors',
    type: 'color',
    thumbnail: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    color: '#2E86AB',
    description: 'Calming ocean blue color',
    tags: ['blue', 'ocean', 'calm', 'water'],
    isPremium: false,
    createdAt: '2024-01-12T11:45:00Z',
  },
  {
    id: '5',
    name: 'Marble Texture',
    brand: 'Luxury Surfaces',
    category: 'Luxury',
    type: 'texture',
    thumbnail: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    textureUrl: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    description: 'Elegant white marble with natural veining',
    tags: ['marble', 'white', 'luxury', 'elegant'],
    isPremium: true,
    price: 19.99,
    createdAt: '2024-01-11T16:30:00Z',
  },
  {
    id: '6',
    name: 'Forest Green',
    brand: 'Nature Colors',
    category: 'Colors',
    type: 'color',
    thumbnail: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    color: '#355E3B',
    description: 'Deep forest green color',
    tags: ['green', 'forest', 'nature', 'deep'],
    isPremium: false,
    createdAt: '2024-01-10T08:15:00Z',
  },
  {
    id: '7',
    name: 'Metal Steel',
    brand: 'Industrial Materials',
    category: 'Industrial',
    type: 'texture',
    thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    textureUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    description: 'Brushed steel metal texture',
    tags: ['metal', 'steel', 'industrial', 'silver'],
    isPremium: false,
    createdAt: '2024-01-09T13:20:00Z',
  },
  {
    id: '8',
    name: 'Fabric Weave',
    brand: 'Textile Collection',
    category: 'Textile',
    type: 'texture',
    thumbnail: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    textureUrl: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    description: 'Soft fabric weave pattern',
    tags: ['fabric', 'textile', 'soft', 'weave'],
    isPremium: false,
    createdAt: '2024-01-08T10:45:00Z',
  },
];

// Async thunk to fetch materials
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be: return await materialsAPI.getAll();
      return mockMaterials;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch materials');
    }
  }
);

// Async thunk to search materials
export const searchMaterials = createAsyncThunk(
  'materials/searchMaterials',
  async ({ query, category }: { query: string; category?: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = mockMaterials;
      
      if (query) {
        filtered = filtered.filter(material =>
          material.name.toLowerCase().includes(query.toLowerCase()) ||
          material.description.toLowerCase().includes(query.toLowerCase()) ||
          material.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }
      
      if (category) {
        filtered = filtered.filter(material => material.category === category);
      }
      
      return filtered;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search materials');
    }
  }
);

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch materials
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload;
        state.categories = [...new Set(action.payload.map(m => m.category))];
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Search materials
      .addCase(searchMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload;
      })
      .addCase(searchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  clearSearch,
  clearError,
} = materialsSlice.actions;

export default materialsSlice.reducer;