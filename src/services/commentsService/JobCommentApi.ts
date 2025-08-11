import { supabase } from "@/lib/supabase";
import { JobCommentModel } from "@/models/commentsModel/CommentModel";


export interface JobCommentResponse {
    success: boolean;
    data: JobCommentModel[];
    error?: string;
}
export interface AddJobCommentResponse {
    success: boolean;
    data: JobCommentModel;
    error?: string; 
}
export class JobCommentsApi {

    // fetch job comments by job ID
    static async fetchJobComments(jobId: number): Promise<JobCommentResponse> {
     try{
   const { data, error } = await supabase
        .from("job_comments")
        .select("*")
        .eq("job_id", jobId);
    
        if (error) {
        throw new Error(`Error fetching job comments: ${error.message}`);
        }
    
        return {
            success: true,
            data: data as JobCommentModel[],
        }
     }catch (error) {
        console.error("Error fetching job comments:", error);
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
     }
    }

    static async addJobComment(comment: JobCommentModel): Promise<AddJobCommentResponse> {
        const { data, error } = await supabase
        .from("job_comments")
        .insert(comment)
        .select();

    if (error) {
        throw new Error(`Error adding job comment: ${error.message}`);
        }
        console.log("New job comment added:", data);
        return {
            success: true,
            data: data[0] as JobCommentModel, // Assuming data is an array with one item
        }
    }

    // update replies to a job comment
    static async updateJobCommentReply(jobId: number, reply: string): Promise<JobCommentResponse> {
        try {
            const { data, error } = await supabase
                .from("job_comments")
                .update({
                    comments: reply,
                    updated_at: new Date().toISOString(),
                })
                .eq("job_id", jobId)
                .select("*");
        
            if (error) {
                throw new Error(`Error updating job comment reply: ${error.message}`);
            }
        
            return {
                success: true,
                data: data as JobCommentModel[],
            };
        } catch (error) {
            console.error("Error updating job comment reply:", error);
            return {
                success: false,
                data: [],
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}