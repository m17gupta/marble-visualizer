import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export class JobService {

  
    // get mask segment jobs
    static async getMaskSegmentJobs(urlpaths:string) {
        try {
            const apiPath = "beta/beta-object-url";
            const modelData = await axios.post(
                `${backendUrl}/${apiPath}?url=${urlpaths}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (modelData && modelData.status === 200) {
                return modelData.data;
            }
            throw new Error(modelData.data.error || 'Failed to fetch mask segment jobs');
        } catch (error) {
            console.error('Error fetching mask segment jobs:', error);
            throw new Error((error as Error).message || 'Failed to fetch mask segment jobs');
        }
    }

            }
           