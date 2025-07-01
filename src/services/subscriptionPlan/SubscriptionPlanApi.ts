import { supabase } from '@/lib/supabase';
import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel';

export interface SubscriptionPlanFilters {
  is_active?: boolean;
  sort_by?: 'sort_order' | 'price' | 'created_at';
  sort_direction?: 'asc' | 'desc';
}

export class SubscriptionPlanApi {
  /**
   * Get all subscription plans
   */
  static async getAllPlans(filters?: SubscriptionPlanFilters): Promise<SubscriptionPlanModel[]> {
    try {
      let query = supabase
        .from('subscription_plans')
        .select('*');

      // Apply filters
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      // Apply sorting
      const sortBy = filters?.sort_by || 'sort_order';
      const sortDirection = filters?.sort_direction || 'asc';
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw new Error(`Failed to fetch subscription plans: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPlans:', error);
      throw error;
    }
  }




}
