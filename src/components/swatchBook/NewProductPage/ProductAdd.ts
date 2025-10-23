import { LucideIcon } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ProductVariation {
  id: number;
  diameter: string;
  color: string;
}

export interface SidebarItemData {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

// Component Props export interfaces
export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, index?: number) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  name?: string;
  index?: number;
}

export interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  name?: string;
}

export interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  label?: string;
  name?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: LucideIcon;
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
  onClick: (label: string) => void;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export interface ProductModalInterface {
  id?: number;
  name?: string;
  brand_id?: number | null;
  product_category_id?: number | null;
  product_attribute_set_id?: number | null;
  create_at?: string;
  description?: string;
  photo?: string;
  bucket_path?: string;
  new_bucket?: number;
  ai_summary?: string;
  base_price?: string;
  material_segment_id?: number | null;
}
