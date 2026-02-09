// Api for Single Palette Generation with axios
import axios from 'axios';
import { store } from '@/redux/store';
import { NewSinglePalletModel, singlePalletApiModeModel, SinglePalletModel } from '@/models/genAiModel/SinglePalletGenAModel';
///material/material/apply-material%27
// const BASE_URL = 'http://localhost:8000/api/v1';
//https://mahimavalenza.in/api/v1/material/material/apply-material

const BASE_URL = import.meta.env.VITE_APP_NEW_BACKEND_URL;
export const generateSinglePalletImage = async (requestData: NewSinglePalletModel) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/ai/generate`, requestData,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.genAiToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating single pallet image:', error);
    throw error;
  }
};

export const generateSinglePalletRoofImage = async (requestData: singlePalletApiModeModel) => {
  try {
    const response = await axios.post(`${BASE_URL}/material/material/roof-vizualize-material`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error generating single pallet image:', error);
    throw error;
  }
};


