export function getPolygonCentroid(points: number[]): { x: number; y: number } {
  // Convert string array to number array
  const coords = points;
  const n = coords.length / 2;
  let area = 0, cx = 0, cy = 0;

  for (let i = 0; i < n; i++) {
    const x0 = coords[2 * i];
    const y0 = coords[2 * i + 1];
    const x1 = coords[2 * ((i + 1) % n)];
    const y1 = coords[2 * ((i + 1) % n) + 1];
    const a = x0 * y1 - x1 * y0;
    area += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  area *= 0.5;
  cx /= (6 * area);
  cy /= (6 * area);
  return { x: cx, y: cy };
}

