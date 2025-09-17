import { supabase } from '@/lib/supabase';
import { AuthError } from '@/models/AuthModel';
import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel';
import { RequestUserPlan, UserPlan } from '@/models/userModel/UserPLanModel';

export interface userSubscriptionPlanRespone{
  success?:boolean;
  data:SubscriptionPlanModel[] | null;
  error?:string | null;
}


export interface ResponseuserPlan {
  success?: boolean;
  error?: string;
  userplan?: UserPlan;
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

   // create user subscription
  static async createUserSubscription(
    userPlan: RequestUserPlan
  ): Promise<ResponseuserPlan> {
    console.log("createUserSubscription - Input userPlan:", userPlan);
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert(userPlan)
        .select();
      console.log("createUserSubscription - Supabase response data:", data);
      console.log("createUserSubscription - Supabase response error:", error);
      if (error) {
        throw error;
      }

      return { success: true, userplan: data[0] };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to create user subscription",
        status: 500,
        code: "SUBSCRIPTION_CREATE_FAILED",
      });
    }
  }
}


