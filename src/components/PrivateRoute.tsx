import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { initializeAuth } from "@/redux/slices/authSlice";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types/auth";
// import { fetchProjects } from "@/redux/slices/projectSlice";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function PrivateRoute({
  children,
  requiredRole = "user",
}: PrivateRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, isInitialized, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { profile } = useSelector((state: RootState) => state.userProfile);
  const location = useLocation();



  // Initialize auth on mount
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  // useEffect(() => {
  //   if (isAuthenticated && user?.id) {
  //    // dispatch(fetchProjects(user.id));
  //   }
  // }, [ isAuthenticated, user?.id]);

  // Show loading spinner while initializing or checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRole && user && profile) {
    const roleHierarchy: Record<UserRole, number> = {
      user: 0,
      viewer: 1,
      vendor: 2,
      editor: 3,
      admin: 4,
    };

    const userRoleLevel = roleHierarchy[profile.role as UserRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this resource.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: {requiredRole} | Your role: {profile.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
