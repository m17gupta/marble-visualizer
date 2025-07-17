import { configureStore } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userProfileSlice from './slices/userProfileSlice';
import projectSlice from './slices/projectSlice';
import studioSlice from './slices/studioSlice';
import segmentsSlice from './slices/segmentsSlice';
import canvasSlice from './slices/canvasSlice'; // New canvas slice
import materialsSlice from './slices/materialSlices/materialsSlice';
import materialSegmentSlice from './slices/materialSlices/materialSegmentSlice';
import genAiSlice from './slices/visualizerSlice/genAiSlice'; // New GenAI slice

import jobSlice from './slices/jobSlice'; // New job slice based on JobModel
import activityLogsSlice from './slices/activityLogsSlice';
import swatchSlice from './slices/swatchSlice';
import categorySlice from './slices/materialSlices/categorySlice'; // New category slice
import brandSlice from './slices/materialSlices/brandSlice'; // New brand slice
import StyleSlice from './slices/materialSlices/StyleSlice'; // Assuming styles are part of swatches
import inspirationalColorSlice from './slices/InspirationalSlice/inspirationalColorSlice'; // New inspirational color slice
import inspirationalImageSlice from './slices/InspirationalSlice/inspirationalImageSlice'; // New inspirational image slice
import { authMiddleware, errorMiddleware } from '@/middlewares/authMiddleware';
import subscriptionPlanSlice from './slices/subscriptionPlanSlice'; // 
import workspaceSlice from './slices/visualizerSlice/workspaceSlice'; 
import  tabControlSlice from './slices/TabControlSlice'; // New tab control slice
export const store = configureStore({
  reducer: {
    auth: authSlice,
    userProfile: userProfileSlice,
    projects: projectSlice,
    studio: studioSlice,
    segments: segmentsSlice,
    canvas: canvasSlice, // New canvas slice
    materials: materialsSlice,
    materialSegments: materialSegmentSlice,
    genAi: genAiSlice, // New GenAI slice

    jobs: jobSlice, // New job slice based on JobModel
    activityLogs: activityLogsSlice,
    swatches: swatchSlice,
    categories: categorySlice, // New category slice
    brands: brandSlice, // New brand slice
    styles: StyleSlice, // Assuming styles are part of swatches
    inspirationalColors: inspirationalColorSlice, // New inspirational color slice
    inspirationalImages: inspirationalImageSlice, // New inspirational image slice
    subscriptionPlan: subscriptionPlanSlice,
    workspace: workspaceSlice, // New workspace slice

    tabControl:tabControlSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['studio.uploadedImageFile'],
      },
    }).concat(authMiddleware, errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production' || import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors for recommended swatch
