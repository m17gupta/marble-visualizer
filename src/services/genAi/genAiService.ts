import { supabase } from "@/lib/supabase";
import {
  GenAiChat,
  GenAiRequest,
  GenAiResponse,
} from "@/models/genAiModel/GenAiModel";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
// "https://nexus.dzinly.org/api/v1/ai/ai/generate-image"
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
      const response = await axios.post(
        `${this.baseUrl}/generate-image`,
        request,
        {
          headers: {
            Accept: "application/json",
            "X-API-Key": "dorg_sk_ioLOcqR2HTPtXNv44ItBW3RCL4NjLeuWitgP-vJuO3s",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Failed to submit GenAI request"
        );
      }

      return response;
    } catch (error) {
      console.error("Error submitting GenAI request:", error);
      throw error;
    }
  }

  // get task id from the response
  async getChatTaskId(request: string) {
    try {
      console.log("_____<<<statrted");
      const response = await axios.get(
        `${this.baseUrl}/generate-image/status/${request}`,
        {
          headers: {
            Accept: "application/json",
            "X-API-Key": "dorg_sk_ioLOcqR2HTPtXNv44ItBW3RCL4NjLeuWitgP-vJuO3s",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Failed to submit GenAI request"
        );
      }

      return response;
    } catch (error) {
      console.error("Error getting task ID:", error);
      throw error;
    }
  }
  // get all genAi _chat from table "gen_ai_chats" based on job id
  async getAllGenAiChats(jobId: number): Promise<GenAiChat[]> {
    try {
      const { data, error } = await supabase
        .from("genai_chat")
        .select("*")
        .eq("job_id", jobId);

      if (error) {
        throw new Error(error.message || "Failed to fetch GenAI chats");
      }
      return data;
    } catch (error) {
      console.error("Error fetching GenAI chats:", error);
      throw error;
    }
  }

  // update genAi _chat into table
  async insertGenAiChat(chatData: GenAiChat): Promise<GenAiChat> {
    try {
      // First check if a record with the same task_id already exists
      const { data: existingData } = await supabase
        .from("genai_chat")
        .select("*")
        .eq("task_id", chatData.task_id)
        .maybeSingle();

      // If a record with this task_id already exists, return it and don't insert again
      if (existingData) {
        return existingData as GenAiChat;
      }

      // Otherwise, proceed with insertion
      const { data, error } = await supabase
        .from("genai_chat")
        .insert(chatData)
        .select(); // Add select() to retrieve the inserted data

      if (error) {
        throw new Error(error.message || "Failed to insert GenAI chat");
      }

      if (data && data.length > 0) {
        return data[0] as GenAiChat;
      } else {
        return chatData;
      }
    } catch (error) {
      console.error("Error inserting GenAI chat:", error);
      throw error;
    }
  }
}
export const genAiService = new GenAiService();
export default genAiService;
