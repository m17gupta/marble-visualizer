import { JobCommentModel } from "@/models/commentsModel/CommentModel";
import { AddJobCommentResponse, JobCommentResponse, JobCommentsApi, UpdateJobCommentReplyResponse } from "./JobCommentApi";


export class JobCommentService {
    static async fetchJobComments(jobId: number): Promise<JobCommentResponse> {
       return JobCommentsApi.fetchJobComments(jobId);
    }

    static async addJobComment(comment: JobCommentModel): Promise<AddJobCommentResponse> {
      return JobCommentsApi.addJobComment(comment);
    }

// update replies to a job comment
    static async updateJobCommentReply(commentId: string, reply: string): Promise<UpdateJobCommentReplyResponse> {
        return JobCommentsApi.updateJobCommentReply(commentId, reply);
    }

    // Change the status of a job comment
    static async changeJobCommentStatus(commentId: string, status: string): Promise<UpdateJobCommentReplyResponse> {
        return JobCommentsApi.changeCommentStatus(commentId, status);
    }

    static async deleteJobComment(commentId: string): Promise<{ success: boolean; error?: string }> {
        return JobCommentsApi.deleteJobComment(commentId);
    }

}