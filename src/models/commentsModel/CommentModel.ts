export interface JobCommentModel {
    id?: string;
    project_id?: number,
    job_id?: number;
    segment_id?: number,
    segment_name?: string,
    position?: number[]
    jobComment?: CommentModel[];
    comments?: string
    status?: string; // Added status field
    created_at?: string; // Alternative date format
    updated_at?: string; // Alternative date format
}

export interface CommentModel {
    is_resolved: any;
    userId: string;
    name: string;
    commentText: string;
    created_at: string;
    updated_at: string;

}