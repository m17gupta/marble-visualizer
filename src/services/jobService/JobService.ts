
           

 import { DistanceRefModal } from "@/models/jobModel/JobModel";
import { JobApi } from "@/services/jobService/JobApi";


 export class JobService {

    static async getMasterAnnotationData(segmentationInt: number[], segName: string) {

      const data = await  JobApi.getMasterData(segmentationInt, segName);
      console.log('Master Annotation Data jo servive :', data);
      return data;
      }
      

      static async getJobsByProjectId(projectId:number) {
          return await JobApi.getJobsByProjectId(projectId);
      }

      static async getJobById(jobId: number) {
          return await JobApi.getJobById(jobId);
      }

      static async updateJob(jobId: number, jobData: any) {
          return    await JobApi.updateJob(jobId, jobData);
      }
        static async createJob(jobData: any) {
            return await JobApi.createJob(jobData);
        }

        static async deleteJob(jobId: number) {
            return await JobApi.deleteJob(jobId);
        }

        static async updateJobSegments(jobId: number, segments: string) {
            return await JobApi.updateJobSegments(jobId, segments);
        }

        static async getAllJobs() {
            return await JobApi.getAllJobs();
        }

        static async updateDistanceRef(id: number, distanceRef: DistanceRefModal) {
            return await JobApi.updateDistanceRef(id, distanceRef);
        }

    }
