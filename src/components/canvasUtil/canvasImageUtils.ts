// canvasImageUtils.ts
// Utility functions for loading and adding images to a Fabric.js canvas with CORS and fetch strategies.
import * as fabric from "fabric";


/**
 * Adds an HTMLImageElement to a Fabric.js canvas, scaling and centering it to fit.
 * @param imgElement The HTMLImageElement to add.
 * @param canvas The Fabric.js canvas instance.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @param backgroundImageRef Ref to store the fabric.Image instance.
 * @param onImageLoad Optional callback when image is loaded.
 */
export const AddImageToCanvas = (
  imgElement: HTMLImageElement,
      canvasRef: React.RefObject<fabric.Canvas>,
  width: number,
  height: number,
  backgroundImageRef: React.MutableRefObject<fabric.Image | null>,
  onImageLoad?: () => void
) => {
  const canvas = canvasRef.current;
  if (!canvas) return
  const fabricImage = new fabric.Image(imgElement, {
    selectable: false,
    evented: false,
    excludeFromExport: false,
  
  });

  // Calculate scaling to fit canvas
  const canvasAspect = width / height;
  const imgAspect = imgElement.width / imgElement.height;

  let scale;
  if (imgAspect > canvasAspect) {
    scale = width / imgElement.width;
    console.log("scale", scale);
  } else {
    scale = height / imgElement.height;
    console.log("scale", scale);
  }

  // const scaleX=1280/ imgElement.width;
  // const scaleY=720/ imgElement.height;
  // console.log("scaleX",scaleX);
  // console.log("scaleY",scaleY);
  fabricImage.scale(scale);
  fabricImage.set({
    left: (width - imgElement.width * scale) / 2,
    top: (height - imgElement.height * scale) / 2,
    
  });

  // Store reference and add to canvas
  backgroundImageRef.current = fabricImage;
  canvas.add(fabricImage);
  canvas.sendObjectToBack(fabricImage);
  canvas.renderAll();

  // Call the onImageLoad callback if provided
  if (onImageLoad) {
    onImageLoad();
  }
};

/**
 * Loads an image using the HTMLImageElement with a specified CORS mode.
 * @param imageUrl The image URL.
 * @param corsMode The CORS mode ("anonymous", "use-credentials", or null).
 * @returns Promise resolving to an HTMLImageElement.
 */
export const LoadImageWithCORS = (
  imageUrl: string,
  corsMode: string | null = "anonymous"
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const imgElement = new window.Image();
    if (corsMode) {
      imgElement.crossOrigin = corsMode;
    }
    imgElement.onload = () => resolve(imgElement);
    imgElement.onerror = (error) => reject(error);
    imgElement.src = imageUrl;
  });
};

/**
 * Loads an image using fetch with a specified request mode, then creates an HTMLImageElement from the blob.
 * @param imageUrl The image URL.
 * @param fetchMode The fetch RequestMode ("cors", "no-cors", "same-origin").
 * @returns Promise resolving to an HTMLImageElement.
 */
export const LoadImageWithFetch = async (
  imageUrl: string,
  fetchMode: RequestMode
): Promise<HTMLImageElement> => {
  try {
    const response = await fetch(imageUrl, {
      mode: fetchMode,
      credentials: "omit",
      cache: "no-cache",
      headers: {
        Accept: "image/*",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const imgElement = new window.Image();
      imgElement.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(imgElement);
      };
      imgElement.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image from blob"));
      };
      imgElement.src = objectUrl;
    });
  } catch (error) {
    throw new Error(`Fetch failed with mode ${fetchMode}: ${error}`);
  }
};
