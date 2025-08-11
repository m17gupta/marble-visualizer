import { JobCommentModel } from "@/models/commentsModel/CommentModel";
import { JobCommentResponse, JobCommentsApi } from "./JobCommentApi";


export class JobCommentService {
    static async fetchJobComments(jobId: number): Promise<JobCommentResponse> {
       return JobCommentsApi.fetchJobComments(jobId);
    }

    static async addJobComment(comment: JobCommentModel): Promise<JobCommentResponse> {
      return JobCommentsApi.addJobComment(comment);
    }

// update replies to a job comment
    static async updateJobCommentReply(jobId: number, reply: string): Promise<JobCommentResponse> {
        return JobCommentsApi.updateJobCommentReply(jobId, reply);
    }

}