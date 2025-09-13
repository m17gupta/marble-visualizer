export interface SubscriptionPlanModel {
  id: string; // uuid
  user_id: string;
  started_at: Date | null; // ISO timestamp string
  expires_at: Date | null; // ISO timestamp string
  status: string;
  payment_id: string; // ISO timestamp string
  created_at: Date | null; // smallint
  plan_feature_id: string;
  credits: string;
  modified_at: string;
}