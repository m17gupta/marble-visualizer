import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";
import { FaInfo } from "react-icons/fa6";

import { FaRegStar } from "react-icons/fa";

type Props = {
  selectedMasterArray?: any;
  selectedMaterialSegment?: any;
};

export function SwatchRecommendations() {
  const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
  const newPath = "https://betadzinly.s3.us-east-2.amazonaws.com/material/";
  const {
    materials,
    wallMaterials,
    doorMaterials,
    roofMaterials,
    windowMaterials,
    trimMaterials,
  } = useSelector((state: RootState) => state.materials);
  const { selectedMaterialSegment } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const [recommendedSwatches, setRecommendedSwatches] = useState<
    MaterialModel[]
  >([]);

  const { selectedMasterArray } = useSelector(
    (state: RootState) => state.masterArray
  );
  // update the selected Swatch recommentation
  useEffect(() => {
    if (
      selectedMasterArray &&
      wallMaterials &&
      wallMaterials.length > 0 &&
      doorMaterials &&
      doorMaterials.length > 0 &&
      roofMaterials &&
      roofMaterials.length > 0 &&
      windowMaterials &&
      windowMaterials.length > 0 &&
      trimMaterials &&
      trimMaterials.length > 0
    ) {
      // Fetch recommended swatches based on the selected segment type
      const fetchRecommendedSwatches = async () => {
        // Here you would typically call an API to get the recommended swatches
        // For now, we will just filter the materials based on the selected segment type
        let filteredMaterials: MaterialModel[] = [];
        const title = selectedMasterArray.name;
        switch (title) {
          case "Wall":
            filteredMaterials = wallMaterials;

            break;
          case "Door":
            filteredMaterials = doorMaterials;
            break;
          case "Roof":
            filteredMaterials = roofMaterials;
            break;
          case "Window":
            filteredMaterials = windowMaterials;
            break;
          case "Trim":
            filteredMaterials = trimMaterials;
            break;
          default:
            filteredMaterials = materials; // Fallback to all materials
        }
        setRecommendedSwatches(filteredMaterials);
      };

      fetchRecommendedSwatches();
    }
  }, [
    selectedMasterArray,
    wallMaterials,
    doorMaterials,
    roofMaterials,
    windowMaterials,
    trimMaterials,
    materials,
  ]);

  return (
    <Card className="border-none border-gray-200 rounded-lg shadow-sm p-3">
      <CardHeader className="pb-4 p-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            {selectedMaterialSegment?.name || "All Materials"}
            {/* Recommended for */}
          </CardTitle>
          <Badge variant="secondary" className="text-xs cursor-pointer">
            {/* {recommendedSwatches.length} swatches */}
            View All
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground pb-4">
          Choose from curated materials for your{" "}
          {selectedMaterialSegment?.name?.toLowerCase() || "project"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-1 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] pb-40 pt-4">
        {recommendedSwatches && recommendedSwatches.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
            <AnimatePresence>
              {recommendedSwatches.map((swatch) => (
                <Card
                  key={swatch.id}
                  className="cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg overflow-hidden bg-card border border-border rounded-xl border-gray-900">
                  {/* Image/Color Preview */}
                  <div className="aspect-square relative overflow-hidden group">
                    <img
                      src={
                        swatch.bucket_path === "default"
                          ? `${path}/${swatch.photo}`
                          : `${newPath}/${swatch.bucket_path}`
                      }
                      alt={swatch.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.backgroundColor =
                          swatch.color || "#908e8eff";
                        target.style.display = "block";
                        target.src = "";
                        target.alt = swatch.id
                          ? String(swatch.id)
                          : "image not available";
                      }}
                    />

                    {/* Info Icon - top-left */}
                    <span
                      role="button"
                      className="absolute top-1 left-1 bg-black bg-opacity-45 p-1 rounded-full text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100">
                      <FaInfo className="w-3 h-3" />
                    </span>

                    {/* Star Icon - top-right */}
                    <span
                      role="button"
                      className="absolute top-1 right-1 bg-black bg-opacity-45 p-1 rounded-full text-white hover:bg-yellow-400 transition-colors opacity-0 group-hover:opacity-100">
                      <FaRegStar className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No recommended swatches available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
