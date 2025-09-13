import { SubscriptionPlanApi, userSubscriptionPlanRespone} from './SubscriptionPlanApi';
import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel';

export class SubscriptionPlanService {
  /**
   * Get all subscription plans with optional filtering
   */
  static async getUserPlans(userId: string): Promise<userSubscriptionPlanRespone> {
    return await SubscriptionPlanApi.getUserSubscriptionPlans(userId);
    
  }





}
