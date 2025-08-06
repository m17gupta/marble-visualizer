import { 
  InspirationalColorApi,
  InspirationColorApiResponse, 

} from './InspirationalColorApi';


export class InspirationalColorService {
  /**
   * Get all inspiration colors with optional filtering
   */
  static async getInspirationColors( ): Promise<InspirationColorApiResponse> {
   return await  InspirationalColorApi.fetchInspirationColors();
  }

 
  
 
}

export default InspirationalColorService;
