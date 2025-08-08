 export const ConvertArea = (area: number, selectedUnit: string): string => {
    // Convert from sq. m to other units
    let convertedArea = area;
    switch (selectedUnit) {
      case "sq. ft":
        convertedArea = area * 10.764; // 1 sq.m = 10.764 sq.ft
        break;
      case "sq. in":
        convertedArea = area * 1550; // 1 sq.m = 1550 sq.in
        break;
      case "sq. cm":
        convertedArea = area * 10000; // 1 sq.m = 10000 sq.cm
        break;
      default:
        convertedArea = area;
    }
    return convertedArea.toFixed(2);
  };