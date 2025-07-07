import * as fabric from "fabric";

export const drawLines = (
  mouseX: number,
  mouseY: number,
  canvasRef: React.RefObject<fabric.Canvas>,
  zoom: number
) => {
  const canvas = canvasRef.current;

  if (!canvas) {
    return;
  }

  // Remove previous lines
  const existingObjects = canvas.getObjects();
  const existingTempLines = existingObjects.filter(
    (obj) => (obj as fabric.Object & { name?: string }).name === "horizontalLine" ||
      (obj as fabric.Object & { name?: string }).name === "verticalLine"
  );
  existingTempLines.forEach((line) => {
    canvas.remove(line);
  });
  //  console.log("zoom",zoom)

  const horizontalLine = new fabric.Line(
    [0, mouseY, canvas.width ?? 0, mouseY],
    {
      stroke: "white",
      strokeWidth: 1 / zoom,
      selectable: false,
      strokeDashArray: [8, 8],
      opacity: 0.5,
      name: "horizontalLine",
    }
  );

  // Create vertical dashed line
  const verticalLine = new fabric.Line(
    [mouseX, 0, mouseX, canvas.height ?? 0],
    {
      stroke: "white",
      strokeWidth: 1 / zoom,
      selectable: false,
      strokeDashArray: [8, 8],
      opacity: 0.5,
      name: "verticalLine",
    }
  );

  // Add lines to canvas
  canvas.add(horizontalLine);
  canvas.add(verticalLine);
  canvas.renderAll();
};

export const RemoveGridLine = (canvasRef: React.RefObject<fabric.Canvas>) => {
  const canvas = canvasRef.current;

  if (!canvas) {
    return;
  }

  // Remove previous lines
  const existingObjects = canvas.getObjects();
  const linesToRemove = existingObjects.filter(
    (obj) => (obj as fabric.Object & { name?: string }).name === "horizontalLine" ||
      (obj as fabric.Object & { name?: string }).name === "verticalLine"
  );
  linesToRemove.forEach((line) => {
    canvas.remove(line);
  });
  canvas.renderAll();
}