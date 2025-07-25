import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LoginPage } from "@/pages/LoginPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { ProjectsPage } from "@/pages/projectPage/ProjectsPage";
// import { StudioPage } from "@/routes/StudioPage";
import { StudioPage } from "@/pages/StudioPage";
import { ProfilePage } from "@/pages/ProfilePage";
// import { MaterialsPage } from '@/pages/MaterialsPage';

import { SwatchDetailsPage } from "@/pages/SwatchDetailsPage";
// import { SwatchCreatePage } from '@/pages/SwatchCreatePage';
// import { SwatchImportPage } from '@/pages/SwatchImportPage';
import { PublicProjectPage } from "@/pages/PublicProjectPage";
import { MainLayout } from "@/layouts/MainLayout";
import { PrivateRoute } from "@/components/PrivateRoute";
import { SwatchBookPage } from "@/pages/SwatchBookPage";
import MainLandingPage from "@/pages/MainLandingPage";
import WorkspaceProjectPage from "@/pages/WorkspaceProjectPage";
import Homepage from "@/pages/Homepage";
import ProjectPdf from "@/pages/ProjectPdf";

export function AppRouter() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/projects" replace /> : <Homepage />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/projects" replace /> : <LoginPage />
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/projects" replace /> : <SignUpPage />
        }
      />

      {/* Public project viewing - no authentication required */}
      <Route path="/project/public/:slug" element={<PublicProjectPage />} />

      {/* Public landing page - no authentication required */}
      <Route path="/workspace" element={<MainLandingPage />} />

      <Route path="/pdf" element={<ProjectPdf />} />

      <Route
        path="/workspace/project/:projectId"
        element={<WorkspaceProjectPage />}
      />
      <Route path="/design-hub/project/:id" element={<StudioPage />} />

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
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* <Route path="studio" element={<StudioPage />} /> */}
        <Route path="studio/:id" element={<StudioPage />} />
        {/* <Route path="materials" element={<MaterialsPage />} /> */}
        <Route path="swatchbook" element={<SwatchBookPage />} />
        <Route path="swatch/:id" element={<SwatchDetailsPage />} />
      </Route>

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
