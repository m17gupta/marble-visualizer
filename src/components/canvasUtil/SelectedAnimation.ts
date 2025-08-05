import * as fabric from "fabric";
import { PointModel } from "./CreatePolygon";

export const SelectedAnimation = (
    canvasRef: React.RefObject<fabric.Canvas>,
    annotatonPoints: number[],
    segName: string,
    color: string = "#FE0056"
) => {
    const canvas = canvasRef?.current;
    if (!canvas || !annotatonPoints || annotatonPoints.length === 0 || !color) return; // Return early if canvas is null

    const polyName = `SelectedPolygon`;
    const point: PointModel[] = [];
    for (let i = 0; i < annotatonPoints.length; i += 2) {
        const x = annotatonPoints[i];
        const y = annotatonPoints[i + 1];
        point.push({ x, y });
    }

    const polygon = new fabric.Polygon(point, {

        fill: "transparent",
        originX: "left",
        originY: "top",
        hasBorders: false,
        hasControls: false,
        stroke: color ?? "#FE0056",
        strokeWidth: 2,
        opacity: 10, // Initial opacity
        visible: true,
        lockMovementX: true,
        lockMovementY: true,
    });
(polygon as any).name = polyName;
    canvas.add(polygon);
    canvas.renderAll();

    let opacity = 1; // Start with full opacity
    let increasing = false;

    let animationFrameId: number;

    const flickerStroke = () => {
        opacity = increasing ? opacity + 0.1 : opacity - 0.1;

        if (opacity >= 1) increasing = false;
        if (opacity <= 0.3) increasing = true;

        polygon.set("stroke", `rgba(254, 0, 86, ${opacity})`); // Animate stroke transparency
        canvas.renderAll();

        animationFrameId = requestAnimationFrame(flickerStroke);
    };

    flickerStroke(); // Start animation

    // Stop flickering after 5 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        polygon.set("stroke", color ?? "#FE0056"); // Reset stroke to original color
        canvas.renderAll();
    }, 2000);


};


