import * as fabric from 'fabric';
//
export const CreateCustomCursor = (): string => {
  const cursorCanvas = document.createElement("canvas");
  cursorCanvas.width = 40;
  cursorCanvas.height = 40;
  const ctx = cursorCanvas.getContext("2d");

  if (ctx) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    // Draw horizontal line
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(40, 20);
    ctx.stroke();

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(20, 40);
    ctx.stroke();
  }

  return cursorCanvas.toDataURL("image/png", 1);
};

export const UpdateCursorOffset = (canvas: fabric.Canvas, customCursor: string, offsetX: number, offsetY: number): void => {
  const zoom = canvas.getZoom(); // Get current zoom level
  const adjustedOffsetX = Math.round(offsetX / zoom); // Scale X offset
  const adjustedOffsetY = Math.round(offsetY / zoom); // Scale Y offset
  console.log('Zoom Level:', zoom, 'Adjusted Offsets:', adjustedOffsetX, adjustedOffsetY);
  canvas.defaultCursor = `url(${customCursor}) ${adjustedOffsetX} ${adjustedOffsetY}, crosshair`;
  canvas.hoverCursor = `url(${customCursor}) ${adjustedOffsetX} ${adjustedOffsetY}, crosshair`;
  canvas.moveCursor = `url(${customCursor}) ${adjustedOffsetX} ${adjustedOffsetY}, crosshair`;
};