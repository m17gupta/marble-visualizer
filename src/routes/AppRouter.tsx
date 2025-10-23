import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LoginPage } from "@/pages/auth/login/LoginPage";
import { SignUpPage } from "@/pages/auth/signUp/SignUpPage";
import { ProjectsPage } from "@/pages/projectPage/ProjectsPage";
// import { StudioPage } from "@/routes/StudioPage";
import { StudioRoutes } from "@/routes/StudioRoutes";
import { ProfilePage } from "@/pages/ProfilePage";
// import { MaterialsPage } from '@/pages/MaterialsPage';

import { SwatchDetailsPage } from "@/pages/SwatchDetailsPage";
// import { SwatchCreatePage } from '@/pages/SwatchCreatePage';
// import { SwatchImportPage } from '@/pages/SwatchImportPage';
import { PublicProjectPage } from "@/pages/PublicProjectPage";
import { MainLayout } from "@/layouts/MainLayout";
import { PrivateRoute } from "@/components/PrivateRoute";
import { SwatchBookPage } from "@/pages/SwatchBookPage";

import WorkspaceProjectPage from "@/pages/WorkspaceProjectPage";
import Homepage from "@/pages/template/Homepage";
import ProjectPdf from "@/pages/ProjectPdf";
import SwatchAddPage from "@/components/swatchBook/SwatchAddPage";
import ProjectHome from "@/pages/projectPage/template/ProjectHome";
import AdminRoutes from "@/routes/AdminRoutes";
// import StudioTemplate from "@/pages/studioPage/StudioTemplate";
import VizualizerTemplate from "@/pages/vizualizer/VizualizerTemplate";
import WorkSpace from "@/pages/workSpace/WorkSpace";
import TryVisualizerPage from "@/pages/tryVizualizer/TryVisualizerPage";
import MainSamplePage from "@/components/demoProject/samplePlayBook/MainSamplePage";
import StudioTemplate from "@/pages/studioPage/StudioTemplate";

export function AppRouter() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.userProfile);

  return (
    <Routes>

            {/* <Route path="/share/:id" element={<SharePageTemplate />} />
      <Route path="/share" element={<ShareProPage />} /> */}
      <Route path="/try-visualizer" element={<TryVisualizerPage />} />
       <Route path="/try-visualizer/project/:id" element={<MainSamplePage />} />
      {/* <Route path="/try-visualizer/sample" element={<MainSamplePage />} />  */}
      {/* Public routes */}

            <Route
        path="/"
        element={

          <Homepage />
        }
      />
      {/* <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/projects" replace /> : <Homepage />
        }
      /> */}

      {/* <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/projects" replace /> : <LoginPage />
        }
      /> */}

 <Route
        path="/login"
        element={
          isAuthenticated && profile && profile.role ? (
            profile.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : profile.role === "support" ? (
              <Navigate to="/support/dashboard" replace />
            ) : profile.role === "manufacturer" ? (
              <Navigate to="/app/dashboard" replace />
            ) : profile.role === "user" ? (
              <Navigate to="/app/projects" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/projects" replace /> : <SignUpPage />
        }
      />

  {/* Conditional admin/user/designer routes based on profile.role */}
      {isAuthenticated && profile && profile.role === "admin" && (
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminRoutes />
            </PrivateRoute>
          }
        />
      )}

        {isAuthenticated &&
        profile &&
        (profile.role === "user" || profile.role === "manufacturer") && (
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {profile.role === "manufacturer" ? (
              <Route index element={<Navigate to="/app/dashboard" replace />} />
            ) : (
              <Route index element={<Navigate to="/app/projects" replace />} />
            )}

            {/* <Route index element={<Navigate to="/app/projects" replace />} /> */}
            <Route path="projects" element={<ProjectHome />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route path="studio/:id" element={<StudioTemplate />} />
            {/* Uncomment below for default page */}
            {/* <Route path="swatchbook/:id" element={< />} /> */}
            {/* <Route path="swatchbook" element={<MaterialsBookPage />} /> */}
            {/* <Route path="assets" element={<AssetsPage />} /> */}
            <Route path="addSwatch" element={<SwatchAddPage />} />
            {/* <Route
              path="swatchbook/:id"
              element={<CompactSwatchDetailsPage />}
            /> */}
            <Route path="addSwatch/:id" element={<SwatchAddPage />} />

            {/* manufacturer routes */}
            {profile.role === "manufacturer" && (
              <>
                {/* <Route path="dashboard" element={<DashBoardPage />} />
                <Route path="company-profile" element={<CompanyProfile />} />
                <Route path="materials" element={<MaterialLibrary />} />
                <Route path="materials/:id" element={<MaterialDetail />} />
                <Route path="addmaterials" element={<ProductAddEditPage />} /> */}
              </>
            )}
          </Route>
        )}
      <Route path="workspace" element={<WorkSpace />} />
      {/* Public project viewing - no authentication required */}
      <Route path="/project/public/:slug" element={<PublicProjectPage />} />

      {/* Public landing page - no authentication required */}
      <Route path="/vizualizer" element={<VizualizerTemplate />} />

      <Route path="/pdf" element={<ProjectPdf />} />

      <Route
        path="/workspace/project/:projectId"
        element={<WorkspaceProjectPage />}
      />
      {/* <Route path="/design-hub/project/:id" element={<StudioPage />} /> */}

      {/* Protected routes - TEMPORARY: No role restrictions, just authentication */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/app/projects" replace />} />
        <Route path="projects" element={<ProjectHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="workspace" element={<WorkSpace />} />
  {/* Studio routes must be nested under a parent Route */}
  <Route path="studio/*" element={<Outlet />}>
    <Route path="*" element={<StudioRoutes />} />
  </Route>
        {/* <Route path="materials" element={<MaterialsPage />} /> */}
        <Route path="swatchbook" element={<SwatchBookPage />} />
        <Route path="addSwatch" element={<SwatchAddPage />} />
        <Route path="swatchbook/:id" element={<SwatchDetailsPage />} />
        <Route path="addSwatch/:id" element={<SwatchAddPage />} />
      </Route>

      {/* Admin route - requires admin role */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminRoutes />
          </PrivateRoute>
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/app/projects" : "/"} replace />
        }
      />
    </Routes>
  );
}
