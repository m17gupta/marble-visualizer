import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateBreadCrumbs } from "@/redux/slices/visualizerSlice/workspaceSlice";

const Breadcrumb = () => {
  const { breadcrumbs } = useSelector((state: RootState) => state.workspace);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleBreadcrumbClick = (index: number, crumb: string) => {
    // Handle navigation based on breadcrumb click
    if (crumb === "Projects") {
      dispatch(updateBreadCrumbs("Projects"));
      navigate("/app/projects");
    } else if (crumb === "Studio") {
      // Stay on current studio page
    }
  };

  return (
    <nav className="absolute top-4 left-[calc(25%+2rem)] z-20 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
      <ol className="flex items-center space-x-1 text-sm">
        {/* <li>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/app/projects')}
          >
            <Home className="h-3 w-3 mr-1" />
            Projects
          </Button>
        </li> */}

        {breadcrumbs && breadcrumbs.length > 0 && (
          <>
            {/* <ChevronRight className="h-3 w-3 text-muted-foreground" /> */}
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 ${
                      index === breadcrumbs.length - 1
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => handleBreadcrumbClick(index, crumb)}
                  >
                    {crumb}
                  </Button>
                </li>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
