import { supabase } from '@/lib/supabase';
import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel';

export interface userSubscriptionPlanRespone{
  success?:boolean;
  data:SubscriptionPlanModel[] | null;
  error?:string | null;
}

export class SubscriptionPlanApi {
  /**
   * Get user subscription plans
   */
  static async getUserSubscriptionPlans(userId: string): Promise<userSubscriptionPlanRespone> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId);
      if (error) {
        throw error;
      }
      return { success: true, data, error: null };
    } catch (error) {
      console.error("SubscriptionPlanApi getUserSubscriptionPlans - Error:", error);
      return { success: false, data: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}


