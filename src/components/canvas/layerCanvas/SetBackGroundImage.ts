import * as fabric from "fabric";

export const setBackgroundImage = (
  canvas: fabric.Canvas,
  url: string,
  onLoading?: (loading: boolean) => void
) => {
  if (onLoading) onLoading(true);

  fabric.Image.fromURL(url, { crossOrigin: "anonymous" })
    .then((img: fabric.Image) => {
      if (!img) {
        if (onLoading) onLoading(false);
        return;
      }
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Scale image to exactly 800x600
      img.scaleToWidth(canvasWidth); 
        img.scaleToHeight(canvasHeight);
      

      // Set the image as canvas background (Fabric.js v6 way)
      canvas.backgroundImage = img;

      // Set background image properties
      img.set({
        scaleX: canvasWidth / img.width,
        scaleY: canvasHeight / img.height,
        originX: "left",
        originY: "top",
      });

      console.log("Background image set:", img.width, img.height);
      canvas.renderAll();

      if (onLoading) onLoading(false);
    })
    .catch((error) => {
      console.error("Error loading background image:", error);
      if (onLoading) onLoading(false);
    });
};
