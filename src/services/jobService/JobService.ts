// import axios from "axios";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// export class JobService {

  
//     // get mask segment jobs
//     static async getMaskSegmentJobs(urlpaths:string) {
//         try {
//             const apiPath = "beta/beta-object-url";
//             const modelData = await axios.post(
//                 `${backendUrl}/${apiPath}?url=${urlpaths}`,
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             if (modelData && modelData.status === 200) {
//                 return modelData.data;
//             }
//             throw new Error(modelData.data.error || 'Failed to fetch mask segment jobs');
//         } catch (error) {
//             console.error('Error fetching mask segment jobs:', error);
//             throw new Error((error as Error).message || 'Failed to fetch mask segment jobs');
//         }
//     }

//             }
           

 import { JobApi } from "@/services/jobService/JobApi";


 export class JobService {

    static async getMasterAnnotationData(segmentationInt: number[], segName: string) {

      return  await JobApi.getMasterData(segmentationInt, segName);
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

    }
