/**
 * Converts an array of fabric.Point objects to a flat array of numbers [x1, y1, x2, y2, ...]
 * @param current - Array of fabric.Point
 * @returns number[]
 */
export function convertPointsToNumbers(current: fabric.Point[]): number[] {
  return current.flatMap(point => [point.x, point.y]);
}