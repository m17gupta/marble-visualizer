import { LucideIcon } from "lucide-react";

export interface Category {
  icon: LucideIcon;
  label: string;
  count: number;
  active?: boolean;
}

export interface GalleryCardProps {
  src: string;
  idx: number;
  onUse?: (idx: number) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

export interface HeaderSectionProps {
  onUpload: () => void;
  onQROpen: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PreviewBoxProps {
  imageSrc?: string;
  alt?: string;
}

export interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeUrl?: string;
}

export interface DemoRoomsPanelProps {
  images: string[];
  selectedIdx: number | null;
  onImageSelect: (idx: number) => void;
  onImageClick: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}