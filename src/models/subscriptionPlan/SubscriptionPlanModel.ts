export interface SubscriptionPlanModel {
  id: string; // uuid
  title: string;
  description: string;
  features: string[]; // text[]
  sort_order: number;
  created_at: string; // ISO timestamp string
  price: number; // smallint
  price_type: string;
  name: string;
  is_active: boolean;
}