import { supabase } from "@/lib/supabase";
import { ProjectModel } from "@/models";
import { SinglePalletGenAiOutPutModel } from "@/models/genAiModel/SinglePalletGenAModel";


export interface GenAiDBResponse {
    status: string;
  data: SinglePalletGenAiOutPutModel | null;
  error?: Error | null;
}

export interface GenAiUpdateResponse {
    status: string;
    image: SinglePalletGenAiOutPutModel | null;
    project: ProjectModel | null;
    error?: Error | null;
}

export const GenAiSinglePalletAPI = {
  // insert single pallet genAi images into table
  async insertSinglePalletGenAiImages(data: SinglePalletGenAiOutPutModel): Promise<GenAiDBResponse> {
    try {
      const { data: insertedData, error } = await supabase
           .from("genai_single_pallet")
           .insert(data)
           .select()
           .single();

         if (error) {
           throw new Error(`Error inserting data: ${error.message}`);
         }
        console.log("Inserted single pallet genAi images:", insertedData);
         return {
              status: "success",
                data: insertedData,
         }
     } catch (error) {
         console.error("Error inserting single pallet genAi images:", error);
            return {
           status: "error",
           data: null,
           error: error instanceof Error ? error : new Error("Unknown error"),
         };
     }
    },

    // update single pallet genAi images into table
    async updateSinglePalletGenAiImages({ updatedData, projectId }: { updatedData: Partial<SinglePalletGenAiOutPutModel>, projectId: number }): Promise<GenAiUpdateResponse> {
      try {
          const { data: updatedDatas, error } = await supabase
            .from("genai_single_pallet")
            .update(updatedData)
            .eq("id", updatedData.id)
            .select()
            .single();  
            if (error) {
              throw new Error(`Error updating data: ${error.message}`);
            }
            
           const {data:updatedProject,error:projectError}  = await supabase
               .from("projects")
               .update({updated_at:new Date().toISOString()})
               .eq("id", projectId)
               .select()
               .single();
            return{
              status: "success",
              image: updatedDatas,
              project:updatedProject
            }
      } catch (error) {
          console.error("Error updating single pallet genAi images:", error);
          throw error;
      }
    },

    // delete single pallet image from DB
 async deleteSinglePalletGenAiImagesId(imageId: string): Promise<{ status: boolean }> {
  try {
    const { error } = await supabase
      .from("genai_single_pallet")
      .delete()
      .eq("id", imageId);

    if (error) {
      console.error(`Error deleting data: ${error.message}`);
      return { status: false };
    }
    return { status: true };
  } catch (error) {
    console.error("Error deleting single pallet genAi images:", error);
    return { status: false };
  }
},
    // delete single pallet genAi images from table
    async deleteSinglePalletGenAiImages(jobId: string): Promise<void> {
      try {
          const { error } = await supabase
            .from("genai_single_pallet")
            .delete()
            .eq("jobID", jobId);

          if (error) {
              throw new Error(`Error deleting data: ${error.message}`);
          }
      } catch (error) {
          console.error("Error deleting single pallet genAi images:", error);
          throw error;
      }
    },

    // getAll single pallet genAi images from table
    async getAllSinglePalletGenAiImages(jobId: number): Promise<SinglePalletGenAiOutPutModel[]> {
      try {
          const { data, error } = await supabase
            .from("genai_single_pallet")
            .select("*")
            .eq("jobID", jobId);

          if (error) {
              throw new Error(`Error fetching data: ${error.message}`);
          }

          return data as SinglePalletGenAiOutPutModel[];
      } catch (error) {
          console.error("Error fetching all single pallet genAi images:", error);
          throw error;
      }
    },
  }
