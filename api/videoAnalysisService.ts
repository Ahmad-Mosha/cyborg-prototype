import { VideoAnalysisResult } from "../types/cyborg";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

// Use the appropriate IP address for the simulator/emulator/physical device
// For physical Android devices, we need to use the Mac's actual IP address on the local network
const API_BASE_URL = Platform.select({
  ios: "http://localhost:8080",
  // For Android emulator use 10.0.2.2, for physical devices use actual IP
  android: __DEV__
    ? Platform.constants.uiMode.includes("emulator")
      ? "http://10.0.2.2:8080"
      : "http://192.168.1.3:8080"
    : "http://192.168.1.3:8080",
});

// Your Mac's actual IP address on the local network
const SERVER_IP = "192.168.1.3"; // Your confirmed IP address

export const videoAnalysisService = {
  /**
   * Upload a video for form analysis
   * @param videoUri - URI of the video file to upload
   * @returns Analysis result with exercise, performance and errors
   */
  async analyzeVideo(videoUri: string): Promise<VideoAnalysisResult> {
    try {
      console.log(`Starting video analysis for: ${videoUri}`);

      // Create proper filename from URI
      const uriParts = videoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      // Create form data for the file upload
      const formData = new FormData();

      // For Android physical devices, we need to get the actual file path
      let fileToUpload: any = {
        uri: videoUri,
        name: `exercise.${fileType || "mp4"}`,
        type: `video/${fileType || "mp4"}`,
      };

      // Handle Android content:// URIs by copying to a FileSystem location if needed
      if (Platform.OS === "android" && videoUri.startsWith("content://")) {
        try {
          console.log("Converting Android content URI to file URI");
          const fileInfo = await FileSystem.getInfoAsync(videoUri);
          console.log("File info:", fileInfo);

          if (!fileInfo.exists) {
            // Create a temporary file from the content URI
            const tempFilePath = `${FileSystem.cacheDirectory}temp_video.mp4`;
            console.log(`Copying to temporary file: ${tempFilePath}`);

            // Copy the file to a location we can access
            await FileSystem.copyAsync({
              from: videoUri,
              to: tempFilePath,
            });

            fileToUpload = {
              uri: tempFilePath,
              name: "exercise.mp4",
              type: "video/mp4",
            };
          }
        } catch (err) {
          console.error("Error processing Android content URI:", err);
          // Continue with original URI if there's an error
        }
      }

      formData.append("video", fileToUpload);

      // Try different server addresses if the main one fails
      const possibleServerAddresses = [
        `http://${SERVER_IP}:8080`,
        API_BASE_URL,
        "http://localhost:8080",
      ];

      let lastError: Error | null = null;
      let response: Response | null = null;

      // Try each server address until one works
      for (const serverUrl of possibleServerAddresses) {
        console.log(`Attempting to connect to: ${serverUrl}/analyze`);

        try {
          response = await fetch(`${serverUrl}/analyze`, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
              Connection: "close", // Close connection after response
            },
          });

          console.log(`Response status from ${serverUrl}: ${response.status}`);

          if (response.ok) {
            console.log("Connection successful!");
            break; // Exit the loop if we get a successful response
          }
        } catch (err) {
          console.log(`Connection to ${serverUrl} failed:`, err);
          lastError = err instanceof Error ? err : new Error(String(err));
        }
      }

      // If no successful connection was established
      if (!response || !response.ok) {
        throw lastError || new Error("Failed to connect to any server");
      }

      const result: VideoAnalysisResult = await response.json();
      console.log("Analysis result:", result);
      return result;
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw error;
    }
  },
};

export default videoAnalysisService;
