import { ProjectModel } from '@/models/projectModel/ProjectModel';
import { ProjectAPI } from "./projectApi/ProjectApi";


export class ProjectService {
  /**
   * get project by user id
   */
  static async getProjectByUserId(user_id:string ) {
    return await ProjectAPI.getProjectByUserId(user_id);
  }

  
  /**
   * create project
   */ 
  static async createProject(project: ProjectModel) {
    return await ProjectAPI.createProject(project);
  }

}
