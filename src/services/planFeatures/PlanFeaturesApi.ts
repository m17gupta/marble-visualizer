import { supabase } from "@/lib/supabase";
import axios from "axios";

export class planFeaturesApi {
    private static readonly TABLE_NAME = 'plan_features';

    // getPlan features
    static async getPlanFeatures() {
        try{
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) {
            throw new Error(error.message);
        }
        return data;

    }
    catch(error){
        console.error("Error fetching plan features:", error);
        throw error;
    }
    }   

}