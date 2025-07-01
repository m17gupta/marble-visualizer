import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ProjectsPage } from '@/pages/projectPage/ProjectsPage';
import { StudioPage } from '@/pages/StudioPage';
import { ProfilePage } from '@/pages/ProfilePage';
// import { MaterialsPage } from '@/pages/MaterialsPage';

import { SwatchDetailsPage } from '@/pages/SwatchDetailsPage';
// import { SwatchCreatePage } from '@/pages/SwatchCreatePage';
// import { SwatchImportPage } from '@/pages/SwatchImportPage';
import { PublicProjectPage } from '@/pages/PublicProjectPage';
import { MainLayout } from '@/layouts/MainLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { SwatchBookPage } from '@/pages/SwatchBookPage';
import LandingPage from '@/pages/LandingPage';
import DzinlyLandingDemo from '@/pages/DzinlyLandingDemo';

export function AppRouter() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/projects" replace />
          ) : (
            <LandingPage />
          )
        } 
      />
      
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
      
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? (
            <Navigate to="/projects" replace />
          ) : (
            <SignUpPage />
          )
        } 
      />

      {/* Public project viewing - no authentication required */}
      <Route 
        path="/project/public/:slug" 
        element={<PublicProjectPage />} 
      />

      {/* Demo route for Dzinly Landing */}
      <Route 
        path="/demo" 
        element={<DzinlyLandingDemo />} 
      />

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
        <Route path="studio" element={<StudioPage />} />
        <Route path="studio/:id" element={<StudioPage />} />
        {/* <Route path="materials" element={<MaterialsPage />} /> */}
        <Route path="swatchbook" element={<SwatchBookPage />} /> 
        <Route path="swatch/:slug" element={<SwatchDetailsPage />} />
       
      </Route>

      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={isAuthenticated ? "/app/projects" : "/"} 
            replace 
          />
        } 
      />
    </Routes>
  );
}