export interface ProjectModel {
    id?: number;
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
    created_at?: string;
    updated_at?: string;
    user_id?: string;
}

export interface CreateProjectRequest {
    name: string;
    description?: string;
    visibility?: 'public' | 'private';
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
}