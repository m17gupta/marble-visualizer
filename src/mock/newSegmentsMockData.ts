import { Segment } from "@/redux/slices/segmentsSlice";

interface SegmentWithMeasurements extends Segment {
  // Additional properties from your sample data
  group?: string;
  seg_type?: string;
  label?: string;
  seg_name?: string;
  seg_short?: string;
  seg_dimension_pixel?: number[];
  perimeter_pixel?: number;
  perimeter_feet?: number;
  annotation_type?: 'manual' | 'system';
  annotation?: number[];
  bb_annotation_float?: number[];
  bb_annotation_int?: number[];
  bb_dimension_pixel?: number[];
  bb_dimension_feet?: number[];
  bb_area_pixel?: number;
  bb_area_sqft?: number;
  svg_path?: string;
  skew_value?: {
    skew_x: number;
    skew_y: number;
  };
  long_trim_seg_dist?: number[][];
  annotation_area_pixel?: number;
  annotation_area_sqft?: number;
  designer?: any[];
}

// Convert the raw segment data to the format expected by the application
const convertSegmentData = (segmentData: any): Segment[] => {
  const segments: Segment[] = [];
  
  // Skip the _id field
  Object.entries(segmentData).forEach(([key, value]) => {
    if (key === '_id') return;
    
    // Cast value to its actual type
    const segData = value as any;
    
    // Create fill color based on segment type
    let fillColor = '#E8DAEF'; // Default color
    let strokeColor = '#000000';
    
    switch (segData.seg_type?.toLowerCase()) {
      case 'wall':
        fillColor = '#E8DAEF'; // Light purple
        break;
      case 'roof':
        fillColor = '#CD6155'; // Red
        break;
      case 'trim':
        fillColor = '#F9E79F'; // Light yellow
        break;
      case 'window':
        fillColor = '#AED6F1'; // Light blue
        break;
      case 'door':
        fillColor = '#E59866'; // Light brown
        break;
      case 'floor':
        fillColor = '#7DCEA0'; // Light green
        break;
      case 'garage door':
        fillColor = '#D7BDE2'; // Lavender
        break;
      case 'gutter':
        fillColor = '#85C1E9'; // Sky blue
        break;
      case 'light':
        fillColor = '#F7DC6F'; // Light yellow
        break;
      default:
        fillColor = '#D5F5E3'; // Light green
    }
    
    // Convert annotation points to the format expected by the app
    const points = [];
    if (segData.annotation && segData.annotation.length >= 2) {
      for (let i = 0; i < segData.annotation.length; i += 2) {
        points.push({
          x: segData.annotation[i],
          y: segData.annotation[i + 1]
        });
      }
    }
    
    const segment: SegmentWithMeasurements = {
      id: key,
      name: segData.seg_name || key,
      type: segData.seg_type?.toLowerCase() || 'unknown',
      points: points,
      fillColor: fillColor,
      strokeColor: strokeColor,
      strokeWidth: 2,
      opacity: 0.85,
      visible: true,
      zIndex: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Additional properties from your data
      group: segData.group,
      seg_type: segData.seg_type,
      label: segData.label,
      seg_name: segData.seg_name,
      seg_short: segData.seg_short,
      seg_dimension_pixel: segData.seg_dimension_pixel,
      perimeter_pixel: segData.perimeter_pixel,
      perimeter_feet: segData.perimeter_feet,
      annotation_type: segData.annotation_type,
      annotation: segData.annotation,
      bb_annotation_float: segData.bb_annotation_float,
      bb_annotation_int: segData.bb_annotation_int,
      bb_dimension_pixel: segData.bb_dimension_pixel,
      bb_dimension_feet: segData.bb_dimension_feet,
      bb_area_pixel: segData.bb_area_pixel,
      bb_area_sqft: segData.bb_area_sqft,
      svg_path: segData.svg_path,
      skew_value: segData.skew_value,
      long_trim_seg_dist: segData.long_trim_seg_dist,
      annotation_area_pixel: segData.annotation_area_pixel,
      annotation_area_sqft: segData.annotation_area_sqft,
    };
    
    segments.push(segment);
  });
  
  return segments;
};

// Your sample data
const rawSegmentData = {
  "_id": {
    "$oid": "686371ffd52fa7081ff9a154"
  },
  "Wall1": {
    "group": "Wall1",
    "seg_type": "Wall",
    "label": "Wall1",
    "seg_name": "Wall1",
    "seg_short": "WL1",
    "seg_dimension_pixel": [
      181,
      69
    ],
    "perimeter_pixel": 574,
    "annotation_type": "manual",
    "annotation": [
      140.6,
      74.07,
      44.21,
      139.36,
      32.91,
      139.57,
      30.36,
      142.31,
      249.99,
      141.89,
      246.03,
      139.57,
      233.59,
      139.15
    ],
    "bb_annotation_float": [
      47,
      75,
      228,
      144
    ],
    "bb_annotation_int": [
      30,
      74,
      249,
      142
    ],
    "bb_dimension_pixel": [
      219,
      68
    ],
    "bb_area_pixel": 14892,
    "svg_path": "M118,75L118,86L86,113L47,129L47,144L228,144L228,131L156,89L153,75L118,75Z",
    "skew_value": {
      "skew_x": 122.1,
      "skew_y": 311.08
    },
    "designer": []
  },
  "Wall2": {
    "group": "Wall1",
    "seg_type": "Wall",
    "label": "Wall2",
    "seg_name": "Wall2",
    "seg_short": "WL2",
    "seg_dimension_pixel": [
      111,
      88
    ],
    "perimeter_pixel": 343.67,
    "annotation_type": "system",
    "annotation": [
      565,
      171,
      565,
      259,
      602,
      219,
      623,
      217,
      642,
      192,
      676,
      176,
      565,
      171
    ],
    "bb_annotation_float": [
      565,
      171,
      676,
      259
    ],
    "bb_annotation_int": [
      565,
      171,
      676,
      259
    ],
    "bb_dimension_pixel": [
      111,
      88
    ],
    "bb_area_pixel": 1910,
    "svg_path": "M565,171L565,259L602,219L623,217L642,192L676,176L565,171Z",
    "skew_value": {
      "skew_x": 92.58,
      "skew_y": 267.42
    },
    "designer": []
  },
  "Wall3": {
    "group": "Wall1",
    "seg_type": "Wall",
    "label": "Wall3",
    "seg_name": "Wall3",
    "seg_short": "WL3",
    "seg_dimension_pixel": [
      43,
      30
    ],
    "perimeter_pixel": 146,
    "annotation_type": "system",
    "annotation": [
      150,
      395,
      150,
      425,
      193,
      425,
      193,
      395,
      150,
      395
    ],
    "bb_annotation_float": [
      150,
      395,
      193,
      425
    ],
    "bb_annotation_int": [
      150,
      395,
      193,
      425
    ],
    "bb_dimension_pixel": [
      43,
      30
    ],
    "bb_area_pixel": 560,
    "svg_path": "M150,395L150,425L193,425L193,395L150,395Z",
    "skew_value": {
      "skew_x": 124.9,
      "skew_y": 235.1
    },
    "designer": []
  },
  "Wall4": {
    "group": "Wall1",
    "seg_type": "Wall",
    "label": "Wall4",
    "seg_name": "Wall4",
    "seg_short": "WL4",
    "seg_dimension_pixel": [
      414,
      190
    ],
    "perimeter_pixel": 1543,
    "annotation_type": "system",
    "annotation": [
      976,
      284,
      986,
      324,
      986,
      283,
      943,
      273,
      572,
      273,
      572,
      449,
      596,
      463,
      602,
      319,
      946,
      319,
      959,
      329,
      962,
      463,
      986,
      463,
      976,
      284
    ],
    "bb_annotation_float": [
      572,
      273,
      986,
      463
    ],
    "bb_annotation_int": [
      572,
      273,
      986,
      463
    ],
    "bb_dimension_pixel": [
      414,
      190
    ],
    "bb_area_pixel": 10674,
    "svg_path": "M976,284L986,324L986,283L943,273L572,273L572,449L596,463L602,319L946,319L959,329L962,463L986,463L976,284Z",
    "skew_value": {
      "skew_x": 147.06,
      "skew_y": 324.27
    },
    "designer": []
  },
  
  "Roof1": {
    "group": "Roof1",
    "seg_type": "Roof",
    "label": "Roof1",
    "seg_name": "Roof1",
    "seg_short": "RF1",
    "perimeter_pixel": 1280,
    "annotation_type": "manual",
    "annotation": [
      198.33,
      95.57,
      566.53,
      96.71,
      569.09,
      106.25,
      778.5,
      104.67,
      701.97,
      155.86,
      586.71,
      154.14,
      585.33,
      149.67,
      276.89,
      151.39,
      269.06,
      141.77,
      263.52,
      141.77
    ],
    "bb_annotation_int": [
      198,
      95,
      778,
      155
    ],
    "bb_dimension_pixel": [
      580,
      60
    ],
    "bb_area_pixel": 34800,
    "designer": []
  },
  "Trim1": {
    "group": "Trim1",
    "seg_type": "Trim",
    "label": "Trim1",
    "seg_name": "Trim1",
    "seg_short": "TR1",
    "perimeter_pixel": 1286,
    "annotation_type": "manual",
    "annotation": [
      548.6,
      261.04,
      556.79,
      259.37,
      785.79,
      101.24,
      886.62,
      170.3,
      1015.83,
      259.87,
      1021.76,
      258.87,
      1022.63,
      267.21,
      675.21,
      268.88,
      547.91,
      269.88
    ],
    "bb_annotation_int": [
      547,
      101,
      1022,
      269
    ],
    "bb_dimension_pixel": [
      475,
      168
    ],
    "bb_area_pixel": 79800,
    "designer": []
  },
  "Window1": {
    "group": "Window1",
    "seg_type": "Window",
    "label": "Window1",
    "seg_name": "Window1",
    "seg_short": "WI1",
    "annotation_type": "manual",
    "annotation": [
      51.15,
      154.69,
      133.56,
      152.88,
      128.82,
      269.46,
      60.62,
      272.64
    ],
    "bb_annotation_int": [
      51,
      152,
      133,
      272
    ],
    "bb_dimension_pixel": [
      82,
      120
    ],
    "perimeter_pixel": 404,
    "perimeter_feet": 20.2,
    "annotation_area_pixel": 17673.083000000006,
    "annotation_area_sqft": 44.18,
    "long_trim_seg_dist": [
      [
        51.15,
        154.69,
        133.56,
        152.88,
        82.42987443882224
      ],
      [
        133.56,
        152.88,
        128.82,
        269.46,
        116.67632150526514
      ],
      [
        128.82,
        269.46,
        60.62,
        272.64,
        68.27409757733894
      ]
    ],
    "bb_area_pixel": 9840,
    "bb_area_sqft": 24.6,
    "bb_dimension_feet": [
      4.1,
      6
    ],
    "designer": []
  },
  
  "Door1": {
    "group": "Door1",
    "seg_type": "Door",
    "label": "Door1",
    "seg_name": "Door1",
    "seg_short": "DR1",
    "annotation_type": "manual",
    "annotation": [
      320.15,
      380.69,
      380.56,
      380.88,
      380.82,
      560.46,
      320.62,
      560.64
    ],
    "bb_annotation_int": [
      320,
      380,
      381,
      561
    ],
    "bb_dimension_pixel": [
      61,
      181
    ],
    "perimeter_pixel": 482,
    "perimeter_feet": 24.1,
    "annotation_area_pixel": 10991,
    "annotation_area_sqft": 27.48,
    "svg_path": "M320,381L381,381L381,561L320,561L320,381Z",
    "bb_area_pixel": 11041,
    "bb_area_sqft": 27.6,
    "bb_dimension_feet": [
      3.05,
      9.05
    ],
    "designer": []
  },
  "Door2": {
    "group": "Door2",
    "seg_type": "Door",
    "label": "Door2",
    "seg_name": "Door2",
    "seg_short": "DR2",
    "annotation_type": "system",
    "annotation": [
      720.15,
      390.69,
      780.56,
      390.88,
      780.82,
      570.46,
      720.62,
      570.64
    ],
    "bb_annotation_int": [
      720,
      390,
      781,
      571
    ],
    "bb_dimension_pixel": [
      61,
      181
    ],
    "perimeter_pixel": 482,
    "perimeter_feet": 24.1,
    "annotation_area_pixel": 10991,
    "annotation_area_sqft": 27.48,
    "svg_path": "M720,391L781,391L781,571L720,571L720,391Z",
    "bb_area_pixel": 11041,
    "bb_area_sqft": 27.6,
    "bb_dimension_feet": [
      3.05,
      9.05
    ],
    "designer": []
  },
  
  "Floor1": {
    "group": "Floor1",
    "seg_type": "Floor",
    "label": "Floor1",
    "seg_name": "Floor1",
    "seg_short": "FL1",
    "annotation_type": "manual",
    "annotation": [
      250.15,
      650.69,
      650.56,
      650.88,
      650.82,
      750.46,
      250.62,
      750.64
    ],
    "bb_annotation_int": [
      250,
      650,
      651,
      751
    ],
    "bb_dimension_pixel": [
      401,
      101
    ],
    "perimeter_pixel": 1004,
    "perimeter_feet": 50.2,
    "annotation_area_pixel": 40501,
    "annotation_area_sqft": 101.25,
    "svg_path": "M250,651L651,651L651,751L250,751L250,651Z",
    "bb_area_pixel": 40501,
    "bb_area_sqft": 101.25,
    "bb_dimension_feet": [
      20.05,
      5.05
    ],
    "designer": []
  },
  "Floor2": {
    "group": "Floor2",
    "seg_type": "Floor",
    "label": "Floor2",
    "seg_name": "Floor2",
    "seg_short": "FL2",
    "annotation_type": "system",
    "annotation": [
      700.15,
      650.69,
      900.56,
      650.88,
      900.82,
      750.46,
      700.62,
      750.64
    ],
    "bb_annotation_int": [
      700,
      650,
      901,
      751
    ],
    "bb_dimension_pixel": [
      201,
      101
    ],
    "perimeter_pixel": 604,
    "perimeter_feet": 30.2,
    "annotation_area_pixel": 20301,
    "annotation_area_sqft": 50.75,
    "svg_path": "M700,651L901,651L901,751L700,751L700,651Z",
    "bb_area_pixel": 20301,
    "bb_area_sqft": 50.75,
    "bb_dimension_feet": [
      10.05,
      5.05
    ],
    "designer": []
  },
  
  "GarageDoor1": {
    "group": "GarageDoor1",
    "seg_type": "Garage Door",
    "label": "GarageDoor1",
    "seg_name": "GarageDoor1",
    "seg_short": "GD1",
    "annotation_type": "manual",
    "annotation": [
      420.15,
      480.69,
      580.56,
      480.88,
      580.82,
      580.46,
      420.62,
      580.64
    ],
    "bb_annotation_int": [
      420,
      480,
      581,
      581
    ],
    "bb_dimension_pixel": [
      161,
      101
    ],
    "perimeter_pixel": 524,
    "perimeter_feet": 26.2,
    "annotation_area_pixel": 16261,
    "annotation_area_sqft": 40.65,
    "svg_path": "M420,481L581,481L581,581L420,581L420,481Z",
    "bb_area_pixel": 16261,
    "bb_area_sqft": 40.65,
    "bb_dimension_feet": [
      8.05,
      5.05
    ],
    "designer": []
  },
  "GarageDoor2": {
    "group": "GarageDoor2",
    "seg_type": "Garage Door",
    "label": "GarageDoor2",
    "seg_name": "GarageDoor2",
    "seg_short": "GD2",
    "annotation_type": "system",
    "annotation": [
      600.15,
      480.69,
      760.56,
      480.88,
      760.82,
      580.46,
      600.62,
      580.64
    ],
    "bb_annotation_int": [
      600,
      480,
      761,
      581
    ],
    "bb_dimension_pixel": [
      161,
      101
    ],
    "perimeter_pixel": 524,
    "perimeter_feet": 26.2,
    "annotation_area_pixel": 16261,
    "annotation_area_sqft": 40.65,
    "svg_path": "M600,481L761,481L761,581L600,581L600,481Z",
    "bb_area_pixel": 16261,
    "bb_area_sqft": 40.65,
    "bb_dimension_feet": [
      8.05,
      5.05
    ],
    "designer": []
  },
  
  "Gutter1": {
    "group": "Gutter1",
    "seg_type": "Gutter",
    "label": "Gutter1",
    "seg_name": "Gutter1",
    "seg_short": "GT1",
    "annotation_type": "manual",
    "annotation": [
      200.15,
      180.69,
      600.56,
      180.88,
      600.82,
      190.46,
      200.62,
      190.64
    ],
    "bb_annotation_int": [
      200,
      180,
      601,
      191
    ],
    "bb_dimension_pixel": [
      401,
      11
    ],
    "perimeter_pixel": 824,
    "perimeter_feet": 41.2,
    "annotation_area_pixel": 4411,
    "annotation_area_sqft": 11.03,
    "svg_path": "M200,181L601,181L601,191L200,191L200,181Z",
    "bb_area_pixel": 4411,
    "bb_area_sqft": 11.03,
    "bb_dimension_feet": [
      20.05,
      0.55
    ],
    "designer": []
  },
  "Gutter2": {
    "group": "Gutter2",
    "seg_type": "Gutter",
    "label": "Gutter2",
    "seg_name": "Gutter2",
    "seg_short": "GT2",
    "annotation_type": "system",
    "annotation": [
      650.15,
      180.69,
      900.56,
      180.88,
      900.82,
      190.46,
      650.62,
      190.64
    ],
    "bb_annotation_int": [
      650,
      180,
      901,
      191
    ],
    "bb_dimension_pixel": [
      251,
      11
    ],
    "perimeter_pixel": 524,
    "perimeter_feet": 26.2,
    "annotation_area_pixel": 2761,
    "annotation_area_sqft": 6.9,
    "svg_path": "M650,181L901,181L901,191L650,191L650,181Z",
    "bb_area_pixel": 2761,
    "bb_area_sqft": 6.9,
    "bb_dimension_feet": [
      12.55,
      0.55
    ],
    "designer": []
  },
  
  "Light1": {
    "group": "Light1",
    "seg_type": "Light",
    "label": "Light1",
    "seg_name": "Light1",
    "seg_short": "LT1",
    "annotation_type": "manual",
    "annotation": [
      350.15,
      220.69,
      370.56,
      220.88,
      370.82,
      240.46,
      350.62,
      240.64
    ],
    "bb_annotation_int": [
      350,
      220,
      371,
      241
    ],
    "bb_dimension_pixel": [
      21,
      21
    ],
    "perimeter_pixel": 84,
    "perimeter_feet": 4.2,
    "annotation_area_pixel": 441,
    "annotation_area_sqft": 1.1,
    "svg_path": "M350,221L371,221L371,241L350,241L350,221Z",
    "bb_area_pixel": 441,
    "bb_area_sqft": 1.1,
    "bb_dimension_feet": [
      1.05,
      1.05
    ],
    "designer": []
  },
  "Light2": {
    "group": "Light2",
    "seg_type": "Light",
    "label": "Light2",
    "seg_name": "Light2",
    "seg_short": "LT2",
    "annotation_type": "system",
    "annotation": [
      450.15,
      220.69,
      470.56,
      220.88,
      470.82,
      240.46,
      450.62,
      240.64
    ],
    "bb_annotation_int": [
      450,
      220,
      471,
      241
    ],
    "bb_dimension_pixel": [
      21,
      21
    ],
    "perimeter_pixel": 84,
    "perimeter_feet": 4.2,
    "annotation_area_pixel": 441,
    "annotation_area_sqft": 1.1,
    "svg_path": "M450,221L471,221L471,241L450,241L450,221Z",
    "bb_area_pixel": 441,
    "bb_area_sqft": 1.1,
    "bb_dimension_feet": [
      1.05,
      1.05
    ],
    "designer": []
  }
};

// Convert the data to the format expected by the application
export const newSegments = convertSegmentData(rawSegmentData);

// Group the segments by type for display
export const segmentsByType = newSegments.reduce((acc, segment) => {
  const type = segment.type || 'unknown';
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(segment);
  return acc;
}, {} as Record<string, Segment[]>);
