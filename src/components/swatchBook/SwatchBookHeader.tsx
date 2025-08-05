import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import SwatchBookAddModal from "./SwatchBookAddModal";
import { supabase } from "@/lib/supabase";
import AttributeSetAddModal from "./AttributeSetAddModal";

export function SwatchBookHeader({ open, onOpenChange, edit }: any) {
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.userProfile);
  const [categories, setCategories] = useState<any[] | null>([]);

  useEffect(() => {
    const getMaterialCategory = async () => {
      const { data, error } = await supabase
        .from("materialcategories")
        .select("*");
      setCategories(data);
    };
    getMaterialCategory();
  }, []);

  const canImport = profile?.role === "admin" || profile?.role === "vendor";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Material Library
        </h1>
        <p className="text-muted-foreground">
          Discover and explore our comprehensive collection of paint swatches
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <AttributeSetAddModal />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigate("/app/addSwatch");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>

        {/* <SwatchBookAddModal
          open={open}
          categories={categories !== null ? categories : []}
          onOpenChange={onOpenChange}
          edit={edit}
        /> */}
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
