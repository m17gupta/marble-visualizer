import { PointModel } from "@/components/canvasUtil/test/CreatePolygonTest";
import { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useSelector } from "react-redux";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

type props = {
  canvasRef: React.RefObject<fabric.Canvas>;
};
const ShowRecpectiveSegType = ({ canvasRef }: props) => {
  const { selectedSegments } = useSelector(
    (state: RootState) => state.segments
  );
  const { canvasType, aiTrainImageWidth, aiTrainImageHeight } = useSelector(
    (state: RootState) => state.canvas
  );
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  // Store polygons by segment id
  const polygonsRef = useRef<{ [id: string]: fabric.Polygon }>({});

  // Color palette for polygons
  const colorPalette = [
    // '#FF1493', // pink
    '#1E90FF', // blue
    '#32CD32', // green
    '#FFA500', // orange
    '#FFD700', // gold
    '#8A2BE2', // purple
    '#00CED1', // turquoise
    '#FF4500', // red-orange
    '#00FF7F', // spring green
    '#DC143C', // crimson
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasType !== 'reannotation') return;

    // Remove polygons for segments that are no longer selected
    const currentIds = selectedSegments?.map(seg => String(seg.id)) || [];
    Object.keys(polygonsRef.current).forEach((id) => {
      if (!currentIds.includes(id)) {
        const poly = polygonsRef.current[id];
        if (canvas.getObjects().includes(poly)) {
          canvas.remove(poly);
        }
        delete polygonsRef.current[id];
      }
    });

    // Add polygons for new segments, assign color by index
    selectedSegments?.forEach((seg, idx) => {
      const segId = String(seg.id);
      if (!polygonsRef.current[segId]) {
        const color = colorPalette[idx % colorPalette.length];
        const poly = showSelectedPolygons(seg, color);
        if (poly) {
          polygonsRef.current[segId] = poly;
        }
      }
    });

    canvas.requestRenderAll();
  }, [selectedSegments, canvasType, canvasRef]);

  // show the polygon which are selected in the list
  const showSelectedPolygons = (seg: SegmentModal, customColor?: string): fabric.Polygon | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const ratioWidth = canvasWidth / aiTrainImageWidth;
    const ratioHeight = canvasHeight / aiTrainImageHeight;

    const {
      id,
      segment_type,
      group_label_system,
      short_title,
      annotation_points_float,
      segment_bb_float,
    } = seg;

    const segColor = customColor ||
      segments.find(
        (s: { name: string; color_code: string }) =>
          s.name === segment_type
      )?.color_code || "#FF1493";

    if (!annotation_points_float || annotation_points_float.length === 0) return;
    if (!segment_bb_float || segment_bb_float.length === 0) return;
    if (!group_label_system) return;
    if (!short_title) return;
    if (!segment_type) return;
    if (!segColor) return;
    if (!id) return;

    const annotation = annotation_points_float;
    if (!annotation || annotation.length === 0) {
      console.warn(
        `[collectPoints] No annotation points for segment: ${short_title}`
      );
      return;
    }
    const point: PointModel[] = [];
    for (let i = 0; i < annotation.length; i += 2) {
      const x = annotation[i] * ratioWidth;
      const y = annotation[i + 1] * ratioHeight;
      point.push({ x, y });
    }

      const polygon = new fabric.Polygon(point, {
        fill: "transparent",
        originX: segment_bb_float[0],
        originY: segment_bb_float[1],
        hasBorders: false,
        hasControls: false,
        stroke: segColor,
        strokeWidth: 2,
        opacity: 0.8,
        selectable: false,
        visible: true,
        lockMovementX: true,
        lockMovementY: true,
        strokeDashArray: [8, 4], // dashed line: 8px dash, 4px gap
      });
    canvas.add(polygon);
    return polygon;
  };
  

  return null;
  // <div>ShowRecpectiveSegType</div>
};

export default ShowRecpectiveSegType;
