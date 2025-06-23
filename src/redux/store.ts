import { configureStore } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import projectSlice from './slices/projectSlice';
import studioSlice from './slices/studioSlice';
import segmentsSlice from './slices/segmentsSlice';
import materialsSlice from './slices/materialsSlice';
import jobsSlice from './slices/jobsSlice';
import activityLogsSlice from './slices/activityLogsSlice';
import swatchSlice from './slices/swatchSlice';
import { authMiddleware, errorMiddleware } from '@/middlewares/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectSlice,
    studio: studioSlice,
    segments: segmentsSlice,
    materials: materialsSlice,
    jobs: jobsSlice,
    activityLogs: activityLogsSlice,
    swatches: swatchSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['studio.uploadedImageFile'],
      },
    }).concat(authMiddleware, errorMiddleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors for recommended swatches
export const selectRecommendedSwatches = createSelector(
  [(state: RootState) => state.swatches.swatches, (state: RootState) => state.studio.selectedSegmentType],
  (swatches, selectedSegmentType) => {
    if (!selectedSegmentType) return [];
    return swatches.filter(swatch => 
      swatch.segment_types.includes(selectedSegmentType)
    );
  }
);

export const selectRecommendedSwatchesByCategory = createSelector(
  [selectRecommendedSwatches],
  (recommendedSwatches) => {
    return recommendedSwatches.reduce((acc, swatch) => {
      const category = swatch.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(swatch);
      return acc;
    }, {} as Record<string, typeof recommendedSwatches>);
  }
);