import { 
  InspirationalImageApi, 
  InspirationImageApiResponse, 
} from './InspirationalImageApi';


export class InspirationalImageService {
  /**
   * Get all inspiration images with optional filtering
   */
  static async getInspirationImages(): Promise<InspirationImageApiResponse> {
    return await InspirationalImageApi.fetchInspirationImages();
  }




}

export default InspirationalImageService;
