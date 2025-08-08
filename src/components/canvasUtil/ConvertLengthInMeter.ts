  export const ConvertToMeters = (value: number, unit: string): number => {
    if (isNaN(value)) return 0;

    switch (unit) {
      case "ft":
        return value * 0.3048; // 1 foot = 0.3048 meters
      case "in":
        return value * 0.0254; // 1 inch = 0.0254 meters
      case "cm":
        return value * 0.01; // 1 cm = 0.01 meters
      case "m":
        return value; // already in meters
      default:
        return value;
    }
  };