import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import DataLibrary from "./pages/DataLibrary";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import UserProfiles from "./pages/UserProfiles";
import MaterialBrands from "./pages/MaterialBrand";
import MaterialBrandStyles from "./pages/MaterialStyles";
import MaterialCategories from "./pages/MaterialCategories";
import { MaterialLibrary } from "./components/products/MaterialLibrary";
import { MaterialDetail } from "./pages/SingleMaterial";
import MaterialSegment from "./pages/MaterialSegment";
import MaterialConnections from "./pages/MaterialConnections";
import MaterialAttributes from "./pages/MaterialAttributes";
import AddProject from "./pages/AddProject";
//import ProductAddEditPage from "@/components/swatchBook/MaterialAddPage";
import DemoProject from "./pages/DemoProject";
import Role from "./pages/Role";
import Permission from "./pages/Permission";
import ProductAddEditPage from "@/components/swatchBook/MaterialAddPage";

export type AdminPage =
  | "dashboard"
  | "analytics"
  | "user"
  | "user-plan"
  | "projects"
  | "materials"
  | "brand"
  | "category"
  | "style"
  | "material-segment"
  | "material-connections"
  | "data-library"
  | "reports"
  | "word-assistant"
  | "addmaterials"
  | "material"
  | "addSwatch"
  | "material-attributes"
  | "add-project"
  | "demo_project"
  | "roles"
  | "permissions";

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPageFromUrl = (): AdminPage => {
    const path = location.pathname.replace("/admin/", "");
    if (path === "" || path === "admin") return "dashboard";
    if (path.startsWith("addmaterials")) return "addmaterials";
    return path as AdminPage;
  };

  const [currentPage, setCurrentPage] = useState<AdminPage>(
    getCurrentPageFromUrl
  );

  useEffect(() => {
    setCurrentPage(getCurrentPageFromUrl());
  }, [location.pathname]);

  const handlePageChange = (page: AdminPage) => {
    navigate(`/admin/${page}`);
  };

  const getPageTitle = (page: AdminPage): string => {
    const titles: Record<AdminPage, string> = {
      dashboard: "Dashboard",
      analytics: "Analytics",
      user: "User Profiles",
      "user-plan": "User Plans",
      projects: "Projects",
      demo_project: "Demo Project",
      materials: "Material Library",
      brand: "Material Brands",
      category: "Material Categories",
      style: "Material Styles",
      "material-segment": "Material Segments",
      "material-connections": "Material Connections",
      "data-library": "Data Library",
      reports: "Reports",
      "word-assistant": "Word Assistant",
      addmaterials: "Add Materials",
      material: "Material Details",
      addSwatch: "Add Swatch",
      "material-attributes": "Manage Attributes",
      "add-project": "Add Project",
      "roles": "User Roles",
      "permissions": "Permissions",
    };
    return titles[page] || page;
  };

  const getPageDescription = (page: AdminPage): string => {
    const descriptions: Record<AdminPage, string> = {
      dashboard: "Overview of your admin workspace",
      analytics: "View insights and analytics data",
      user: "Manage user profiles and permissions",
      "user-plan": "Manage user subscription plans",
      projects: "View and manage all projects",
      demo_project: "View and manage demo projects",
      materials: "Browse and manage material library",
      brand: "Manage material brand information",
      category: "Organize material categories",
      style: "Manage material style variants",
      "material-segment": "Configure material segments",
      "material-connections": "Connect brands, categories, and segments",
      "data-library": "Access data library resources",
      reports: "Generate and view reports",
      "word-assistant": "AI-powered word assistance",
      addmaterials: "Add new materials to library",
      material: "View material details",
      addSwatch: "Add new swatch",
      "material-attributes": "Manage Attributes",
      "add-project": "Create and configure new projects",
      "roles": "Manage user roles and access levels",
      "permissions": "Set permissions for different roles",
    };
    return descriptions[page] || "";
  };

  const renderContent = () => {
    const params = useParams<{ id: string }>();

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "analytics":
        return <Analytics />;
      case "projects":
        return <Projects />;
      case "add-project":
        return <AddProject />;
      case "category":
        return <MaterialCategories />;
      case "data-library":
        return <DataLibrary />;
      case "reports":
        return <Reports />;
      case "user":
        return <UserProfiles />;
      case "roles":
        return <Role />;
      case "permissions":
        return <Permission/>
      case "user-plan":

        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  User Plan Management
                </h2>
                <p className="text-gray-600">
                  User subscription plans management
                </p>
              </div>
            </div>
          </div>
        );
      case "demo_project":
        return <DemoProject />;

      case "materials":
        return <MaterialLibrary />;
      case "addmaterials":
        return <ProductAddEditPage />;
      case "brand":
        return <MaterialBrands />;
      case "style":
        return <MaterialBrandStyles />;
      case "material-segment":
        return <MaterialSegment />;
      case "material-connections":
        return <MaterialConnections />;
      case "material-attributes":
        return <MaterialAttributes />;
      case "word-assistant":
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Word Assistant
                </h2>
                <p className="text-gray-600">Word assistant management page</p>
              </div>
            </div>
          </div>
        );
      case `material/${params.id}`:
        return <MaterialDetail productId={Number(params.id)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Page Header */}
        <header className="bg-white border-b border-gray-200 py-4 shadow-sm flex-shrink-0 px-10">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {getPageTitle(currentPage)}
              </h1>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {getPageDescription(currentPage)}
              </p>
            </div>

            {/* Breadcrumb indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 flex-shrink-0">
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-blue-600 font-medium truncate">
                {getPageTitle(currentPage)}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
