import { RequestUserPlan } from '@/models/userModel/UserPLanModel';
import { ResponseuserPlan, SubscriptionPlanApi, userSubscriptionPlanRespone} from './SubscriptionPlanApi';
import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel';

export class SubscriptionPlanService {
  /**
   * Get all subscription plans with optional filtering
   */
  static async getUserPlans(userId: string): Promise<userSubscriptionPlanRespone> {
    return await SubscriptionPlanApi.getUserSubscriptionPlans(userId);
    
  }

    // create user subscription
    static async createUserSubscription(userPlan: RequestUserPlan): Promise<ResponseuserPlan> {
      return await SubscriptionPlanApi.createUserSubscription(userPlan);
    }
  





}
