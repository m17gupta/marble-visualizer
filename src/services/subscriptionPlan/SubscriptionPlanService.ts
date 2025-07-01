import { SubscriptionPlanApi, SubscriptionPlanFilters } from './SubscriptionPlanApi';
import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel';

export class SubscriptionPlanService {
  /**
   * Get all subscription plans with optional filtering
   */
  static async getAllPlans(filters?: SubscriptionPlanFilters): Promise<SubscriptionPlanModel[]> {
    try {
      const plans = await SubscriptionPlanApi.getAllPlans(filters);
      console.log('SubscriptionPlanService - getAllPlans:', plans.length, 'plans fetched');
      return plans;
    } catch (error) {
      console.error('SubscriptionPlanService - getAllPlans error:', error);
      throw error;
    }
  }





}
