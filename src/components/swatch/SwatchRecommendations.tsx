import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";
import { FaInfo } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  addPaletteImage,
  addUpdateRequestPalette,
  updateNewPalletRequest,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { newPalletRequest } from "@/models/genAiModel/GenAiModel";

export function SwatchRecommendations() {
  const dispatch = useDispatch();

  const [userSelectedSegmentState, setUserSelectedSegmentState] = useState<
    SegmentModal[]
  >([]);
  const [broken, setBroken] = useState<Record<string | number, boolean>>({});

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
  const { selectedMasterArray, userSelectedSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const [recommendedSwatches, setRecommendedSwatches] = useState<
    MaterialModel[]
  >([]);

  const s3DefaultBase =
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
  const s3NewBase = "https://betadzinly.s3.us-east-2.amazonaws.com/material";

  const computeImageUrl = (swatch: MaterialModel): string | null => {
    const clean = (v?: string | null) =>
      (v ?? "").toString().trim().replace(/^null$|^undefined$/i, "");
    const bucket = clean((swatch as any).bucket_path);
    const photo = clean((swatch as any).photo);

    if (bucket && bucket !== "default") {
      return `${s3NewBase}/${bucket}`;
    }
    if (bucket === "default" && photo) {
      return `${s3DefaultBase}/${photo}`;
    }
    return null;
  };

  const markBroken = (id: string | number) =>
    setBroken((prev) => ({ ...prev, [id]: true }));

  const clearBroken = () => setBroken({});

  useEffect(() => {
    if (userSelectedSegment && userSelectedSegment.length > 0) {
      setUserSelectedSegmentState(userSelectedSegment);
    } else {
      setUserSelectedSegmentState([]);
    }
  }, [userSelectedSegment]);

  useEffect(() => {
    if (
      selectedMasterArray &&
      wallMaterials &&
      doorMaterials &&
      roofMaterials &&
      windowMaterials &&
      trimMaterials
    ) {
      let filtered: MaterialModel[] = [];
      switch (selectedMasterArray.name) {
        case "Wall":
          filtered = wallMaterials;
          break;
        case "Door":
          filtered = doorMaterials;
          break;
        case "Roof":
          filtered = roofMaterials;
          break;
        case "Window":
          filtered = windowMaterials;
          break;
        case "Trim":
          filtered = trimMaterials;
          break;
        default:
          filtered = materials || [];
      }
      setRecommendedSwatches(filtered || []);
      clearBroken();
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

  const handleSelectedSwatch = (swatch: MaterialModel) => {
    const url = computeImageUrl(swatch);

    if (url) {
      dispatch(addPaletteImage(url));
    }

    dispatch(setCanvasType("hover"));

    if (userSelectedSegmentState && userSelectedSegmentState.length > 0) {
      const allSegName = userSelectedSegmentState.map((seg) => seg.short_title);
      const groupName = userSelectedSegmentState[0]?.group_label_system;
      const allSegments = userSelectedSegmentState.map((seg) => seg.annotation_points_float);
      console.log("All Segments:", allSegments);
      // dispatch(
      //   addUpdateRequestPalette({
      //     id: swatch.id,
      //     segments: allSegName,
      //     groupName,
      //     url: url || "",
      //   })
      // );

      const data:newPalletRequest = {
        title: groupName??"",
        segments: (allSegments?.filter(Boolean) as number[][]) || [],
        palletUrl: url || "",
      };
      console.log("Pallet Data:", data);
      dispatch(updateNewPalletRequest(data));
    }
  };

  const cards = useMemo(
    () =>
      (recommendedSwatches || []).map((swatch) => {
        const url = computeImageUrl(swatch);
        const isBroken = broken[swatch.id];
        const hideImage = !url || isBroken;

        return { swatch, url, hideImage };
      }),
    [recommendedSwatches, broken]
  );

  if (!selectedMasterArray?.name) return null;

  return (
    <Card className="border-none border-gray-200 rounded-lg shadow-sm p-3">
      <CardHeader className="pb-4 p-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            {selectedMaterialSegment?.name || "All Materials"}
          </CardTitle>
          <Badge variant="secondary" className="text-xs cursor-pointer">
            View All
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground pb-4">
          Choose from curated materials for your{" "}
          {selectedMaterialSegment?.name?.toLowerCase() || "project"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-1 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] pb-40 pt-4">
        {cards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
            <AnimatePresence>
              {cards.map(({ swatch, url, hideImage }) =>
                hideImage ? null : (
                  <Card
                    key={swatch.id}
                    className="cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg overflow-hidden bg-card border border-border rounded-xl"
                  >
                    <div
                      className="aspect-square relative overflow-hidden group"
                      onClick={() => handleSelectedSwatch(swatch)}
                      role="button"
                    >
                      <LazyLoadImage
                        src={url as string}
                        alt={swatch.title || `material-${swatch.id}`}
                        className="w-full h-full object-cover"
                        onError={() => markBroken(swatch.id)}
                      />

                      <span className="absolute top-1 left-1 bg-black/45 p-1 rounded-full text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 pointer-events-none">
                        <FaInfo className="w-3 h-3" />
                      </span>

                      <span className="absolute top-1 right-1 bg-black/45 p-1 rounded-full text-white hover:bg-yellow-400 transition-colors opacity-0 group-hover:opacity-100 pointer-events-none">
                        <FaRegStar className="w-3 h-3" />
                      </span>
                    </div>
                  </Card>
                )
              )}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-muted-foreground">No recommended swatches available.</p>
        )}
      </CardContent>
    </Card>
  );
}
