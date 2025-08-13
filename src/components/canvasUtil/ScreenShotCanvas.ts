import * as fabric from "fabric";

/**
 * Takes a screenshot of a canvas element and returns it as a data URL or blob
 * @param canvas - The canvas element to capture
 * @param format - Image format ('image/png', 'image/jpeg', 'image/webp')
 * @param quality - Image quality (0-1, only for lossy formats like JPEG)
 * @param returnBlob - Whether to return a blob instead of data URL
 * @returns Promise<string|Blob> - Data URL string or Blob object
 */
export async function takeCanvasScreenshot(
  canvas: HTMLCanvasElement, 
  format: string = 'image/png', 
  quality: number = 1.0, 
  returnBlob: boolean = false
): Promise<string | Blob> {
  try {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Invalid canvas element provided');
    }

    if (returnBlob) {
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, format, quality);
      });
    } else {
      return canvas.toDataURL(format, quality);
    }
  } catch (error) {
    console.error('Error taking canvas screenshot:', error);
    throw error;
  }
}

/**
 * Downloads the canvas screenshot as a file
 * @param canvas - The canvas element to capture
 * @param filename - The filename for the download
 * @param format - Image format
 */
export async function downloadCanvasScreenshot(
  canvas: HTMLCanvasElement, 
  filename: string = 'canvas-screenshot.png', 
  format: string = 'image/png'
): Promise<void> {
  try {
    const dataURL = await takeCanvasScreenshot(canvas, format);
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL as string;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading canvas screenshot:', error);
    throw error;
  }
}

/**
 * Takes a screenshot of a Fabric.js canvas with annotations
 * @param fabricCanvas - The Fabric.js canvas instance
 * @param format - Image format ('image/png', 'image/jpeg', 'image/webp')
 * @param quality - Image quality (0-1, only for lossy formats like JPEG)
 * @param multiplier - Scale multiplier for higher resolution screenshots
 * @returns Promise<string> - Data URL string
 */
export async function takeFabricCanvasScreenshot(
  fabricCanvas: fabric.Canvas,
  format: string = 'image/png',
  quality: number = 1.0,
  multiplier: number = 1
): Promise<string> {
  try {
    if (!fabricCanvas) {
      throw new Error('Invalid Fabric.js canvas provided');
    }

    // Use Fabric.js built-in method to export canvas with all objects
    const dataURL = fabricCanvas.toDataURL({
      format: format.replace('image/', '') as fabric.ImageFormat, // Remove 'image/' prefix for Fabric.js
      quality: quality,
      multiplier: multiplier, // For higher resolution screenshots
    });

    return dataURL;
  } catch (error) {
    console.error('Error taking Fabric.js canvas screenshot:', error);
    throw error;
  }
}

/**
 * Downloads the Fabric.js canvas screenshot as a file
 * @param fabricCanvas - The Fabric.js canvas instance
 * @param filename - The filename for the download
 * @param format - Image format
 * @param quality - Image quality (0-1)
 * @param multiplier - Scale multiplier for higher resolution
 */
export async function downloadFabricCanvasScreenshot(
  fabricCanvas: fabric.Canvas,
  filename: string = 'canvas-annotation-screenshot.png',
  format: string = 'image/png',
  quality: number = 1.0,
  multiplier: number = 2
): Promise<void> {
  try {
    const dataURL = await takeFabricCanvasScreenshot(fabricCanvas, format, quality, multiplier);
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading Fabric.js canvas screenshot:', error);
    throw error;
  }
}