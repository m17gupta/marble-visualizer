
    export interface PlanFeatureModel {
  id: number;
  uuid: string;
  title: string;
  description?: string;
  features: string[];
  sort_order: number;
  created_at: string; // or Date if you parse it
  price: number;
  price_type: string;
  name: string;
  is_active: boolean;
  credits?: number; // Number of credits associated with the plan feature
}

// Export alias for backward compatibility
export type PlanFeature = PlanFeatureModel;


export interface UserPlan {
  id: string;                 // UUID
  user_id?: string;            // UUID of the user
  started_at?: string;         // ISO timestamp (e.g., "2025-08-06T12?:34?:56Z")
  expires_at?: string;         // ISO timestamp
  status?: string;             // e.g., "active", "expired"
  payment_id?: string;         // Payment reference or transaction ID
  created_at?: string;         // ISO timestamp
  plan_features?: PlanFeatureModel|null;      // UUID referring to PlanFeature
  credits?: number; 
  plan_feature_id?: string; // UUID of the plan feature
}

export interface RequestUserPlan {
  user_id?: string;
  started_at?: string; // ISO timestamp (e.g., "2025-08-06T12?:34?:56Z")
  expires_at?: string;
   status?: string; // e.g., "active", "expired"
  payment_id?: string; // Payment reference or transaction ID
  created_at?: string; // ISO timestamp
  credits?: number;
  plan_feature_id?: string; // UUID of the plan feature
}