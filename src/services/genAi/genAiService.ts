import { GenAiRequest, GenAiResponse } from '@/models/genAiModel/GenAiModel';

class GenAiService {
  // Base URL for the GenAI API
  private baseUrl = '/api/genai';

  /**
   * Submit a new GenAI request
   * @param request The GenAI request data
   * @returns The response from the GenAI API
   */
  async submitRequest(request: GenAiRequest)  {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include', // Include cookies in request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit GenAI request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting GenAI request:', error);
      throw error;
    }
  }

  /**
   * Check the status of a GenAI request
   * @param requestId The ID of the request to check
   * @returns The updated status and any results
   */
  async checkStatus(requestId: string): Promise<GenAiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${requestId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies in request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check GenAI status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking GenAI status:', error);
      throw error;
    }
  }

  /**
   * Cancel a GenAI request
   * @param requestId The ID of the request to cancel
   * @returns The response from the cancel operation
   */
  async cancelRequest(requestId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${requestId}/cancel`, {
        method: 'POST',
        credentials: 'include', // Include cookies in request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel GenAI request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling GenAI request:', error);
      throw error;
    }
  }
}

export const genAiService = new GenAiService();
export default genAiService;
