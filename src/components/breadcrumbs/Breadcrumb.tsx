import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateBreadCrumbs } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { clearCurrentImage } from "@/redux/slices/studioSlice";

const Breadcrumb = () => {
  const { breadcrumbs } = useSelector((state: RootState) => state.workspace);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleBreadcrumbClick = (index: number, crumb: string) => {
    if (crumb === "Projects") {
      dispatch(clearCurrentImage());
      dispatch(updateBreadCrumbs("Projects"));
      navigate("/app/projects");
    }
  };

  return (
    <nav className=" bg-transparent border-none shadow-none relative z-10">
      <ol className="flex items-center space-x-1 text-sm">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-3 rounded-none shadow-none border-none bg-transparent ${
                      index === breadcrumbs.length - 1
                        ? "text-foreground font-semibold"
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
