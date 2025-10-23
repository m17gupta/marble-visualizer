import { Project } from "@/AdminPannel/reduxslices/adminProjectSlice";
import { supabase } from "@/lib/supabase";
import {
  HouseSegmentModel,
  HouseSegmentResponse,
  ProjectModel,
} from "@/models/projectModel/ProjectModel";

interface ProjectApiResponse {
  data: Project[] | Project;
  status: boolean;
}

export class AdminProjectService {
  /**
   * get project by user id
   */
  static async getProjectByPagination(
    orderby: string,
    order: string
  ): Promise<ProjectApiResponse> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`id,name,user_id(full_name, id),description,status,thumbnail,created_at,updated_at,jobs:job(id,title,jobType,full_image,thumbnail,created_at,updated_at,segments,distance_ref)`) // join jobs
        .order(`${orderby}`, { ascending: order == "asec" ? true : false });

      if (!error) {
        return {
          data: data as Project[],
          status: true,
        } as ProjectApiResponse;
      } else {
        return {
          data: [],
          status: false,
        } as ProjectApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: [],
        status: false,
      } as ProjectApiResponse;
    }
  }

  static async getSingleProjectJobs(
    project: Project
  ): Promise<ProjectApiResponse> {
    try {
      const { data, error } = await supabase
        .from("job")
        .select(
          `id,title,jobType,full_image,thumbnail,created_at,updated_at,segments,distance_ref`
        )
        .eq("project_id", project.id);

      const projectWithJobs = { ...project, jobs: data };

      if (!error) {
        return {
          data: projectWithJobs as Project,
          status: true,
        } as ProjectApiResponse;
      } else {
        return {
          data: project,
          status: false,
        } as ProjectApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: {},
        status: false,
      } as ProjectApiResponse;
    }
  }
}
