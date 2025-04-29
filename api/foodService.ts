import api from "./apiConfig";
import {
  FoodAnalysisResult,
  BarcodeProductResult,
  AnalyzeUrlRequest,
} from "../types/food";

export const foodService = {
  /**
   * Get product information by barcode
   * @param barcode UPC barcode number
   */
  async getProductByBarcode(barcode: string): Promise<BarcodeProductResult> {
    try {
      const response = await api.get<BarcodeProductResult>(
        `/recipes/grocery/upc/${barcode}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get product by barcode error:", error);
      throw error;
    }
  },

  /**
   * Analyze food from image file
   * @param imageFile The image file to upload
   */
  async analyzeFoodByImage(imageFile: FormData): Promise<FoodAnalysisResult> {
    try {
      const response = await api.post<FoodAnalysisResult>(
        "/recipes/analyze/file",
        imageFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Analyze food by image error:", error);
      throw error;
    }
  },

  /**
   * Analyze food from image URL
   * @param imageUrl URL of the food image
   */
  async analyzeFoodByUrl(imageUrl: string): Promise<FoodAnalysisResult> {
    try {
      const payload: AnalyzeUrlRequest = { url: imageUrl };
      const response = await api.post<FoodAnalysisResult>(
        "/recipes/analyze/url",
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error("Analyze food by URL error:", error);
      throw error;
    }
  },
};

export default foodService;
