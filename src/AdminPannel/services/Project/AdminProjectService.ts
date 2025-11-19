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
        .select("*,jobs(*)") // try the likely relation names
        .order("created_at", { ascending: false });

      console.log("project dtaat---", data);
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

    static async changeUserId(
    projectId: number,
    userId:string
  ): Promise<{status:boolean}> {

    try {
      const {   error } = await supabase
        .from("projects")
        .update({ user_id: userId })
        .eq("id", projectId);

      if (!error) {
        
        return {
         
          status: true,
        } 
      } else {
          
        return {
       
          status: false,
        }
      }
    } catch (error) {
      console.log("err", error);
      return {
        data: [],
        status: false,
      } as ProjectApiResponse;
    }
  }
}
