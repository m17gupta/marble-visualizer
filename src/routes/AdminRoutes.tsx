import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminPanel from "@/AdminPannel/AdminPanel";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUserProfile } from "@/redux/slices/user/userProfileSlice";
import StudioTemplate from "@/pages/studioPage/StudioTemplate";

const AdminRoutes = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { userSubscriptionPlan } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );
  const { profile } = useSelector((state: RootState) => state.userProfile);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <Routes>
      {/* Default admin route redirects to dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Individual admin routes */}
      <Route path="/dashboard" element={<AdminPanel />} />
      <Route path="/analytics" element={<AdminPanel />} />
      <Route path="/user" element={<AdminPanel />} />
      <Route path="/user-plan" element={<AdminPanel />} />
      <Route path="/projects" element={<AdminPanel />} />
      <Route path="/demo_project" element={<AdminPanel />} /> 
      <Route path="/studio/:id" element={ <StudioTemplate/>} />
      <Route path="/roles" element={<AdminPanel />} />
      <Route path="/permissions" element={<AdminPanel />} />
      {/* <Route path="/materials" element={<AdminPanel />} /> */}
      <Route path="/brand" element={<AdminPanel />} />
      <Route path="/category" element={<AdminPanel />} />
      <Route path="/style" element={<AdminPanel />} />
      <Route path="/material-segment" element={<AdminPanel />} />
      <Route path="/data-library" element={<AdminPanel />} />
      <Route path="/reports" element={<AdminPanel />} />
      <Route path="/word-assistant" element={<AdminPanel />} />
      <Route path="/materials" element={<AdminPanel />} />
      <Route path="/addmaterials" element={<AdminPanel />} />
      <Route path="/material/:id" element={<AdminPanel />} />
      <Route path="/addmaterials/:id" element={<AdminPanel />} />
      <Route path="/material-connections" element={<AdminPanel />} />
      <Route path="/material-attributes" element={<AdminPanel />} />
      <Route path="/add-project" element={<AdminPanel />} />

      {/* Catch all route for any unmatched admin paths */}
      <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
