import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LoginPage } from '@/pages/LoginPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { StudioPage } from '@/pages/StudioPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { SwatchBookPage } from '@/pages/SwatchBookPage';
import { SwatchDetailsPage } from '@/pages/SwatchDetailsPage';
import { SwatchCreatePage } from '@/pages/SwatchCreatePage';
import { SwatchImportPage } from '@/pages/SwatchImportPage';
import { PublicProjectPage } from '@/pages/PublicProjectPage';
import { MainLayout } from '@/layouts/MainLayout';
import { PrivateRoute } from '@/components/PrivateRoute';

export function AppRouter() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/projects" replace />
          ) : (
            <LoginPage />
          )
        } 
      />

      {/* Public project viewing - no authentication required */}
      <Route 
        path="/project/public/:slug" 
        element={<PublicProjectPage />} 
      />

      {/* Protected routes - TEMPORARY: No role restrictions, just authentication */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="studio" element={<StudioPage />} />
        <Route path="studio/:id" element={<StudioPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="swatchbook" element={<SwatchBookPage />} />
        <Route path="swatch/:slug" element={<SwatchDetailsPage />} />
        {/* TEMPORARY: Remove role restrictions for swatch creation and import */}
        <Route path="swatch/create" element={<SwatchCreatePage />} />
        <Route path="swatch/import" element={<SwatchImportPage />} />
      </Route>

      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={isAuthenticated ? "/projects" : "/login"} 
            replace 
          />
        } 
      />
    </Routes>
  );
}