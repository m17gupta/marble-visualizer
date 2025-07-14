import { CanvasModel } from "@/models/canvasModel/CanvasModel";

export const renderPolygonMaskOnlyToCanvas = ({
  imageWidth,
  imageHeight,
  polygons,
  maskColor = 'rgba(0, 255, 0, 0.4)',
  strokeColor = 'green',
}: {
  imageWidth: number;
  imageHeight: number;
  polygons: CanvasModel[];
  maskColor?: string;
  strokeColor?: string;
}): string => {
  const canvas = document.createElement('canvas');
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  ctx.fillStyle = maskColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  polygons.forEach(points => {
    const allPoints = points.annotations
    ctx.beginPath();
    for (let i = 0; i < allPoints.length; i += 2) {
      const x = allPoints[i];
      const y = allPoints[i + 1];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  return canvas.toDataURL('image/png');
};

// New function that returns a Blob (file format)
export const renderPolygonMaskToBlob = ({
  imageWidth,
  imageHeight,
  polygons,
  maskColor = 'rgba(14, 1, 1, 0.4)',
  strokeColor = 'red',
  quality = 0.9,
}: {
  imageWidth: number;
  imageHeight: number;
  polygons: CanvasModel[];
  maskColor?: string;
  strokeColor?: string;
  quality?: number;
}): Promise<Blob | null> => {
  const canvas = document.createElement('canvas');
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return Promise.resolve(null);

  ctx.fillStyle = maskColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  polygons.forEach(points => {
    const allPoints = points.annotations
    ctx.beginPath();
    for (let i = 0; i < allPoints.length; i += 2) {
      const x = allPoints[i];
      const y = allPoints[i + 1];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', quality);
  });
};

// Function that returns a File object (extends Blob with filename)
export const renderPolygonMaskToFile = async ({
  imageWidth,
  imageHeight,
  polygons,
  maskColor = 'rgba(7, 7, 7, 0.4)',
  strokeColor = 'black',
  quality = 0.9,
  filename = 'mask.png',
}: {
  imageWidth: number;
  imageHeight: number;
  polygons: CanvasModel[];
  maskColor?: string;
  strokeColor?: string;
  quality?: number;
  filename?: string;
}): Promise<File | null> => {
  const blob = await renderPolygonMaskToBlob({
    imageWidth,
    imageHeight,
    polygons,
    maskColor,
    strokeColor,
    quality,
  });

  if (!blob) return null;

  return new File([blob], filename, { type: 'image/png' });
};
