import { Grid3X3, Link2, Package, Settings, Truck, Zap } from "lucide-react";
import { SelectOption, SidebarItemData } from "./ProductAdd";

export const sidebarItems: SidebarItemData[] = [
  { icon: Package, label: "Inventory", active: true, badge: "12" },
  { icon: Truck, label: "Shipping" },
  { icon: Link2, label: "Linked Products" },
  { icon: Settings, label: "Attributes", badge: "3" },
  { icon: Grid3X3, label: "Variations", active: false, badge: "1" },
  { icon: Zap, label: "Advanced" },
];

export const productTypeOptions: SelectOption[] = [
  { value: "simple", label: "Simple Product" },
  { value: "variable", label: "Variable Product" },
];

export const statusOptions: SelectOption[] = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "private", label: "Private" },
];

export const sizeOptions: SelectOption[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const colorOptions: SelectOption[] = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "blue", label: "Blue" },
];
