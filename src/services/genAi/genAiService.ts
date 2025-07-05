import { supabase } from '@/lib/supabase';
import { GenAiChat, GenAiRequest, GenAiResponse } from '@/models/genAiModel/GenAiModel';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';
class GenAiService {
  // Base URL for the GenAI API
  private baseUrl = BASE_URL;

  /**
   * Submit a new GenAI request
   * @param request The GenAI request data
   * @returns The response from the GenAI API
   */
  async submitRequest(request: GenAiRequest): Promise<GenAiResponse> {
    try {
      const response= await axios.post(`${this.baseUrl}/openAI/apply-palette-openai`, request, {})
      console.log('GenAI request submitted:', response);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to submit GenAI request');
      }

      return  response;
    } catch (error) {
      console.error('Error submitting GenAI request:', error);
      throw error;
    }
  }

  // get task id from the response
 async getChatTaskId(request: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/apply-palette-status/${request}`, {});

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to submit GenAI request');
      }

      return response.data;
    } catch (error) {
      console.error('Error getting task ID:', error);
      throw error;
    }
  }
  // get all genAi _chat from table "gen_ai_chats" based on job id
async getAllGenAiChats(jobId: number): Promise<GenAiChat[]> {
  try {
      const {data, error} =  await supabase
        .from('genai_chat')
        .select('*')
        .eq('job_id', jobId);

      if (error) {
        throw new Error(error.message || 'Failed to fetch GenAI chats');
      }

      return data;
  } catch (error) {
    console.error('Error fetching GenAI chats:', error);
    throw error;
  }
}

// update genAi _chat into table
async insertGenAiChat(chatData: GenAiChat): Promise<GenAiChat> {
  try {
    const { data, error } = await supabase
      .from('genai_chat')
      .insert(chatData)

    if (error) {
      throw new Error(error.message || 'Failed to insert GenAI chat');
    }
    if (!data) {
      throw new Error('No data returned from insert operation');
    } 
    console.log('Inserted GenAI chat:', data[0]);

    return data[0];
  } catch (error) {
    console.error('Error inserting GenAI chat:', error);
    throw error;
  }
}


}
export const genAiService = new GenAiService();
export default genAiService;