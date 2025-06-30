import { JobModel } from "../jobModel/JobModel";

export interface ProjectModel {
    id?: number;
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
    status?: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    progress?: number;
    thumbnail?: string;
    jobData?:JobModel[]
}

export interface CreateProjectRequest {
    name: string;
    description?: string;
    visibility?: 'public' | 'private';
    status?: 'active' | 'pending' | 'completed';
     thumbnail?: string;
    user_id?: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
    user_id?: string;
}