import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';

export interface SegmentPoint {
  x: number;
  y: number;
}

export interface SegmentMaterial {
  materialId: string;
  materialName: string;
  materialType: 'texture' | 'color' | 'pattern';
  previewUrl?: string;
  textureUrl?: string;
  color?: string;
  appliedAt: string;
}

export interface Segment {
  id: string;
  name: string;
  type?: string; // Added segment type for swatch recommendations
  points: SegmentPoint[];
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
  zIndex: number;
  groupId?: string;
  material?: SegmentMaterial;
  createdAt: string;
  updatedAt: string;
}

interface SegmentsState {
  segments: Segment[];
  activeSegmentId: string | null;
  selectedSegmentIds: string[];
  copiedSegment: Segment | null;
  isDrawing: boolean;
  currentPoints: SegmentPoint[];
  canvasHistory: string[];
  historyIndex: number;
  maxHistorySize: number;
  error: string | null;
}

const initialState: SegmentsState = {
  segments: [],
  activeSegmentId: null,
  selectedSegmentIds: [],
  copiedSegment: null,
  isDrawing: false,
  currentPoints: [],
  canvasHistory: [],
  historyIndex: -1,
  maxHistorySize: 50,
  error: null,
};

// Generate random colors for new segments
const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Async thunk for saving segments to backend
export const saveSegments = createAsyncThunk(
  'segments/saveSegments',
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { segments: SegmentsState };
      const { segments } = state.segments;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be: return await segmentsAPI.save(projectId, segments);
      return segments;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save segments';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for loading segments from backend
export const loadSegments = createAsyncThunk(
  'segments/loadSegments',
  async (projectId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data - in a real app, this would be: return await segmentsAPI.load(projectId);
      return [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load segments';
      return rejectWithValue(errorMessage);
    }
  }
);

const segmentsSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    // Drawing state management
    startDrawing: (state) => {
      state.isDrawing = true;
      state.currentPoints = [];
    },
    addPoint: (state, action: PayloadAction<SegmentPoint>) => {
      if (state.isDrawing) {
        state.currentPoints.push(action.payload);
      }
    },
    finishDrawing: (state, action: PayloadAction<{ name?: string; type?: string; projectId?: string }>) => {
      if (state.isDrawing && state.currentPoints.length >= 3) {
        const maxZIndex = Math.max(...state.segments.map(s => s.zIndex), 0);
        
        const newSegment: Segment = {
          id: Date.now().toString(),
          name: action.payload.name || `Segment ${state.segments.length + 1}`,
          type: action.payload.type || 'walls', // Default to walls
          points: [...state.currentPoints],
          fillColor: generateRandomColor(),
          strokeColor: '#000000',
          strokeWidth: 2,
          opacity: 0.7,
          visible: true,
          zIndex: maxZIndex + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        state.segments.push(newSegment);
        state.activeSegmentId = newSegment.id;
      }
      
      state.isDrawing = false;
      state.currentPoints = [];
    },
    cancelDrawing: (state) => {
      state.isDrawing = false;
      state.currentPoints = [];
    },
    
    // Segment management
    selectSegment: (state, action: PayloadAction<string | null>) => {
      state.activeSegmentId = action.payload;
      if (action.payload) {
        state.selectedSegmentIds = [action.payload];
      } else {
        state.selectedSegmentIds = [];
      }
    },
    selectMultipleSegments: (state, action: PayloadAction<string[]>) => {
      state.selectedSegmentIds = action.payload;
      state.activeSegmentId = action.payload[0] || null;
    },
    updateSegment: (state, action: PayloadAction<{ id: string; updates: Partial<Segment> }>) => {
      const { id, updates } = action.payload;
      const segmentIndex = state.segments.findIndex(s => s.id === id);
      if (segmentIndex !== -1) {
        state.segments[segmentIndex] = {
          ...state.segments[segmentIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteSegment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.segments = state.segments.filter(s => s.id !== id);
      if (state.activeSegmentId === id) {
        state.activeSegmentId = null;
      }
      state.selectedSegmentIds = state.selectedSegmentIds.filter(sid => sid !== id);
    },
    duplicateSegment: (state, action: PayloadAction<string>) => {
      const originalSegment = state.segments.find(s => s.id === action.payload);
      if (originalSegment) {
        const maxZIndex = Math.max(...state.segments.map(s => s.zIndex), 0);
        
        const duplicatedSegment: Segment = {
          ...originalSegment,
          id: Date.now().toString(),
          name: `${originalSegment.name} Copy`,
          points: originalSegment.points.map(p => ({ x: p.x + 10, y: p.y + 10 })),
          zIndex: maxZIndex + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.segments.push(duplicatedSegment);
        state.activeSegmentId = duplicatedSegment.id;
      }
    },
    
    // Copy/Paste functionality
    copySegment: (state, action: PayloadAction<string>) => {
      const segment = state.segments.find(s => s.id === action.payload);
      if (segment) {
        state.copiedSegment = { ...segment };
      }
    },
    pasteSegment: (state) => {
      if (state.copiedSegment) {
        const maxZIndex = Math.max(...state.segments.map(s => s.zIndex), 0);
        
        const pastedSegment: Segment = {
          ...state.copiedSegment,
          id: Date.now().toString(),
          name: `${state.copiedSegment.name} Copy`,
          points: state.copiedSegment.points.map(p => ({ x: p.x + 20, y: p.y + 20 })),
          zIndex: maxZIndex + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        state.segments.push(pastedSegment);
        state.activeSegmentId = pastedSegment.id;
      }
    },
    clearCopiedSegment: (state) => {
      state.copiedSegment = null;
    },
    
    // Grouping functionality
    groupSegments: (state, action: PayloadAction<string[]>) => {
      const segmentIds = action.payload;
      if (segmentIds.length < 2) return;
      
      const groupId = `group_${Date.now()}`;
      segmentIds.forEach(id => {
        const segment = state.segments.find(s => s.id === id);
        if (segment) {
          segment.groupId = groupId;
          segment.updatedAt = new Date().toISOString();
        }
      });
    },
    ungroupSegments: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      state.segments.forEach(segment => {
        if (segment.groupId === groupId) {
          delete segment.groupId;
          segment.updatedAt = new Date().toISOString();
        }
      });
    },
    
    // Layer order management
    bringForward: (state, action: PayloadAction<string>) => {
      const segment = state.segments.find(s => s.id === action.payload);
      if (segment) {
        const maxZIndex = Math.max(...state.segments.map(s => s.zIndex));
        if (segment.zIndex < maxZIndex) {
          segment.zIndex += 1;
          segment.updatedAt = new Date().toISOString();
        }
      }
    },
    sendBackward: (state, action: PayloadAction<string>) => {
      const segment = state.segments.find(s => s.id === action.payload);
      if (segment) {
        const minZIndex = Math.min(...state.segments.map(s => s.zIndex));
        if (segment.zIndex > minZIndex) {
          segment.zIndex -= 1;
          segment.updatedAt = new Date().toISOString();
        }
      }
    },
    bringToFront: (state, action: PayloadAction<string>) => {
      const segment = state.segments.find(s => s.id === action.payload);
      if (segment) {
        const maxZIndex = Math.max(...state.segments.map(s => s.zIndex));
        segment.zIndex = maxZIndex + 1;
        segment.updatedAt = new Date().toISOString();
      }
    },
    sendToBack: (state, action: PayloadAction<string>) => {
      const segment = state.segments.find(s => s.id === action.payload);
      if (segment) {
        const minZIndex = Math.min(...state.segments.map(s => s.zIndex));
        segment.zIndex = minZIndex - 1;
        segment.updatedAt = new Date().toISOString();
      }
    },
    
    // Material assignment
    assignMaterialToSegment: (state, action: PayloadAction<{ segmentId: string; material: MaterialModel; projectId?: string }>) => {
      const { segmentId, material } = action.payload;
      const segment = state.segments.find(s => s.id === segmentId);
      
      if (segment) {
        const segmentMaterial: SegmentMaterial = {
          materialId: material.id.toString(),
          materialName: material.title,
          materialType: 'color', // Default type, could be determined from material_type_id
          previewUrl: material.photo,
          textureUrl: material.bucket_path,
          color: material.color,
          appliedAt: new Date().toISOString(),
        };
        
        segment.material = segmentMaterial;
        segment.updatedAt = new Date().toISOString();
        
        // Update visual properties based on material
        if (material.color) {
          segment.fillColor = material.color;
        }
      }
    },
    removeMaterialFromSegment: (state, action: PayloadAction<string>) => {
      const segmentId = action.payload;
      const segment = state.segments.find(s => s.id === segmentId);
      
      if (segment) {
        // Restore original color
        segment.fillColor = generateRandomColor();
        segment.material = undefined;
        segment.updatedAt = new Date().toISOString();
      }
    },
    
    // History management
    saveToHistory: (state, action: PayloadAction<string>) => {
      const canvasState = action.payload;
      
      // Remove any history after current index (when undoing then making new changes)
      if (state.historyIndex < state.canvasHistory.length - 1) {
        state.canvasHistory = state.canvasHistory.slice(0, state.historyIndex + 1);
      }
      
      // Add new state to history
      state.canvasHistory.push(canvasState);
      
      // Limit history size
      if (state.canvasHistory.length > state.maxHistorySize) {
        state.canvasHistory = state.canvasHistory.slice(-state.maxHistorySize);
      }
      
      state.historyIndex = state.canvasHistory.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.canvasHistory.length - 1) {
        state.historyIndex++;
      }
    },
    clearHistory: (state) => {
      state.canvasHistory = [];
      state.historyIndex = -1;
    },
    
    // Utility
    clearAllSegments: (state) => {
      state.segments = [];
      state.activeSegmentId = null;
      state.selectedSegmentIds = [];
      state.isDrawing = false;
      state.currentPoints = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save segments
      .addCase(saveSegments.fulfilled, () => {
        // Segments saved successfully
      })
      .addCase(saveSegments.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Load segments
      .addCase(loadSegments.fulfilled, (state, action) => {
        state.segments = action.payload;
        state.activeSegmentId = null;
        state.selectedSegmentIds = [];
      })
      .addCase(loadSegments.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  startDrawing,
  addPoint,
  finishDrawing,
  cancelDrawing,
  selectSegment,
  selectMultipleSegments,
  updateSegment,
  deleteSegment,
  duplicateSegment,
  copySegment,
  pasteSegment,
  clearCopiedSegment,
  groupSegments,
  ungroupSegments,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  assignMaterialToSegment,
  removeMaterialFromSegment,
  saveToHistory,
  undo,
  redo,
  clearHistory,
  clearAllSegments,
  clearError,
} = segmentsSlice.actions;

export default segmentsSlice.reducer;