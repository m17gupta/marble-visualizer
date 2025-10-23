import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/user/authSlice";
import userProfileSlice from "./slices/user/userProfileSlice";
import projectSlice from "./slices/projectSlice";
import studioSlice from "./slices/studioSlice";
import segmentsSlice from "./slices/segmentsSlice";
import canvasSlice from "./slices/canvasSlice"; // New canvas slice
import materialsSlice from "./slices/materialSlices/materialsSlice";
import materialSegmentSlice from "./slices/materialSlices/materialSegmentSlice";
import genAiSlice from "./slices/visualizerSlice/genAiSlice"; // New GenAI slice

import jobSlice from "./slices/jobSlice"; // New job slice based on JobModel
import activityLogsSlice from "./slices/activityLogsSlice";
import swatchSlice from "./slices/swatchSlice";
import categorySlice from "./slices/materialSlices/categorySlice"; // New category slice
import brandSlice from "./slices/materialSlices/brandSlice"; // New brand slice
import StyleSlice from "./slices/materialSlices/StyleSlice"; // Assuming styles are part of swatches
import inspirationalColorSlice from "./slices/InspirationalSlice/inspirationalColorSlice"; // New inspirational color slice
import inspirationalImageSlice from "./slices/InspirationalSlice/inspirationalImageSlice"; // New inspirational image slice
import inspirationTabSlice from "./slices/InspirationalSlice/InspirationTabSlice"; // New inspiration tab slice
import { authMiddleware, errorMiddleware } from "@/middlewares/authMiddleware";
import subscriptionPlanSlice from "./slices/user/subscriptionPlanSlice"; //
import workspaceSlice from "./slices/visualizerSlice/workspaceSlice";
import tabControlSlice from "./slices/TabControlSlice"; // New tab control slice
import masterArraySlice from "./slices/MasterArraySlice"; // New master array slice
import projectAnalyseSlice from "./slices/projectAnalyseSlice";
import jobCommentsSlice from "./slices/comments/JobComments"; // New job comments slice
import FilterSwatchSlice from "./slices/swatch/FilterSwatchSlice";
import TestCanvasSlices from "./slices/TestCanvasSlices"; // New TestCanvas slice
import FabricCanvasSlice from "./slices/FabricCanvasSlice";
import PlanFeatureSlice from "./slices/planFeatureSlice/PlanFeatureSlice";
import adminProjectSlice from "../AdminPannel/reduxslices/adminProjectSlice";
import adminBrandSlice from "../AdminPannel/reduxslices/MaterialBrandSlice";
import adminMaterialCategorySlice from "../AdminPannel/reduxslices/adminMaterialCategorySlice";

//import designCoordinatorSlice from "./slices/user/design_coordinatorSlice";
//import NewGenAiSlice from "./slices/visualizerSlice/NewGenAiSlice";
//import shareProjectSlice from "./slices/shareProject/ShareProjectSlice";
//import visitorInfoSlice from "./slices/shareProject/VisterInfoSlice"; // New visitor info slice
import adminMaterialLibSlice from "../AdminPannel/reduxslices/adminMaterialLibSlice";
import adminMaterialSegmentSlice from "../AdminPannel/reduxslices/adminMaterialSegment";
//import InformationSlice from "./slices/InformationSlice";
import adminMaterialConnectionSlice from "../AdminPannel/reduxslices/adminMaterialConnectionSlice";
import adminMaterialAttributesSlice from "../AdminPannel/reduxslices/adminMaterialAttributeSlice";
import demoMasterArraySlice from "./slices/demoProjectSlice/DemoMasterArraySlice";
import demoCanvasSlice from "./slices/demoProjectSlice/DemoCanvasSlice";
import RoleSlice from "@/AdminPannel/reduxslices/RoleSlice";
import permissionSlice from "@/AdminPannel/reduxslices/Role_PermissionSlice";
import Role_permissionSlice from "@/AdminPannel/reduxslices/Role_PermissionSlice";
export const store = configureStore({
  reducer: {
    role_permission: Role_permissionSlice,
    role:RoleSlice,
    demoCanvas: demoCanvasSlice,
    demoMasterArray: demoMasterArraySlice,
    // shareProject: shareProjectSlice,
    // visitorInfo: visitorInfoSlice, // New visitor info slice
    auth: authSlice,
    userProfile: userProfileSlice,
    // designCoordinator: designCoordinatorSlice,
    subscriptionPlan: subscriptionPlanSlice,
    projects: projectSlice,
    masterArray: masterArraySlice,
    segments: segmentsSlice,
    // information: InformationSlice,
    canvas: canvasSlice,
    jobComments: jobCommentsSlice, // New job comments slice
    // New canvas slice
    materials: materialsSlice,
    materialSegments: materialSegmentSlice,
    genAi: genAiSlice, // New GenAI slice
    // newGenAi: NewGenAiSlice,
    filterSwatch: FilterSwatchSlice,
    jobs: jobSlice, // New job slice based on JobModel
    activityLogs: activityLogsSlice,
    swatches: swatchSlice,
    categories: categorySlice, // New category slice
    brands: brandSlice, // New brand slice
    styles: StyleSlice, // Assuming styles are part of swatches
    inspirationalColors: inspirationalColorSlice, // New inspirational color slice
    inspirationalImages: inspirationalImageSlice, // New inspirational image slice
    inspirationTab: inspirationTabSlice, // New inspiration tab slice

    workspace: workspaceSlice, // New workspace slice
    studio: studioSlice,
    tabControl: tabControlSlice,
    projectAnalyse: projectAnalyseSlice,
    testCanvas: TestCanvasSlices, // New TestCanvas slice
    fabricCanvas: FabricCanvasSlice,
    planFeature: PlanFeatureSlice,
    adminProjects: adminProjectSlice,
    adminBrands: adminBrandSlice,
    adminMaterials: adminMaterialCategorySlice,
    adminMaterialSegmemt: adminMaterialSegmentSlice,
    materialsdetails: adminMaterialLibSlice,
    materialconnection: adminMaterialConnectionSlice,
    materialattibutes: adminMaterialAttributesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: [
          "studio.uploadedImageFile",
          // Temporarily ignore visitor info paths during development
          "visitorInfo.timestamp",
        ],
      },
    }).concat(authMiddleware, errorMiddleware),
  devTools: process.env.NODE_ENV !== "production" || import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
