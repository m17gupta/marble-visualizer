import { planFeaturesApi } from "./PlanFeaturesApi";


export class PlanFeaturesService {
    static async getPlanFeatures() {
        return planFeaturesApi.getPlanFeatures();
    }
}