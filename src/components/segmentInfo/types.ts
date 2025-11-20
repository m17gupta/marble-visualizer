export interface SegmentData {
  id: string;
  name: string;
  image?: string;
  group: string;
  segType: string;
  label: string;
  segName: string;
  segShort: string;
  segDimensionPixel: string;
  perimeterPixel: string;
  annotationType: string;
  annotation: string;
  bbAnnotationInt: string;
  jsonData?: any;
  groundTruthValue?: any;
}

export interface SegmentField {
  key: string;
  label: string;
  value: string | number;
  editable?: boolean;
  copyable?: boolean;
}

export interface SegmentInfoPanelProps {
  segment: SegmentData;
  onUpdate?: (field: string, value: any) => void;
  onClose?: () => void;
}

export interface SegmentFieldProps {
  field: SegmentField;
  onEdit?: (key: string, value: any) => void;
  onCopy?: (value: string) => void;
}

export interface SegmentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface SegmentImageProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export type TabType = 'information' | 'jsonData' | 'groundTruthValue';