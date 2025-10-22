import {
  Home,
  CookingPot,
  Bath,
  Warehouse,
  Bed,
  Building2,
  Layers,
} from "lucide-react";
import { Category } from "./types";

export const DEFAULT_ROOM_IMAGE = "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/AAA1111.jpg";

export const DEMO_IMAGES = Array(1).fill(DEFAULT_ROOM_IMAGE);

export const CATEGORIES: Category[] = [
  { icon: Home, label: "Living Room", count: 9, active: true },
  { icon: CookingPot, label: "Kitchen", count: 16 },
  { icon: Bath, label: "Bathroom", count: 21 },
  { icon: Warehouse, label: "Outdoor", count: 15 },
  { icon: Bed, label: "Bedroom", count: 21 },
  { icon: Building2, label: "Commercial", count: 13 },
  { icon: Layers, label: "Elevation", count: 9 },
  { icon: Layers, label: "Counter Tops", count: 10 },
];

export const DEFAULT_QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://your-upload-link.example";