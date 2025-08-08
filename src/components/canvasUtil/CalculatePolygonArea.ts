/**
 * Calculate the area of a polygon in square meters.
 * @param points - Flattened array of polygon vertices [x1, y1, x2, y2, x3, y3, ...]
 * @param pixelToMeterRatio - Ratio to convert pixels to meters (1 pixel = pixelToMeterRatio meters)
 * @returns Area in square meters
 */
export function calculatePolygonAreaInPixels(points: number[]): number {
  if (points.length < 6 || points.length % 2 !== 0) {
    throw new Error('Points array must have at least 6 elements (3 points) and even number of elements');
  }

  let area = 0;
  const n = points.length / 2; // Number of actual points

  // Shoelace formula for flattened array
  for (let i = 0; i < n; i++) {
    const currentX = points[i * 2];
    const currentY = points[i * 2 + 1];
    const nextX = points[((i + 1) % n) * 2];
    const nextY = points[((i + 1) % n) * 2 + 1];
    
    area += currentX * nextY;
    area -= nextX * currentY;
  }

  // Calculate area in pixels first
  const pixelArea = Math.abs(area) / 2;
  
  // Convert to square meters
  // // Since area is 2D, we need to square the pixel to meter ratio
  // const meterArea = pixelArea * Math.pow(pixelToMeterRatio, 2);
  
  return pixelArea;
}