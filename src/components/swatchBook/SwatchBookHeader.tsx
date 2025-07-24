import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { RootState } from "@/redux/store";

export function SwatchBookHeader() {
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.userProfile);

  const canImport = profile?.role === "admin" || profile?.role === "vendor";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          SwatchBook
        </h1>
        <p className="text-muted-foreground">
          Discover and explore our comprehensive collection of paint swatches
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/swatch/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Swatch
        </Button>

        {canImport && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/swatch/import")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Swatches
          </Button>
        )}
      </div>
    </div>
  );
}
