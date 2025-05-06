import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { VideoAnalysisResult } from "@/types/cyborg";
import videoAnalysisService from "@/api/videoAnalysisService";

// Types for our analysis history
type AnalysisHistoryItem = {
  id: string;
  date: string;
  exercise: string;
  thumbnail?: string;
  result: VideoAnalysisResult;
};

// Status messages for different upload phases
type UploadStatus =
  | "idle"
  | "preparing"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

export default function VideoAnalysisScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<VideoAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>(
    []
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Mock function to load history - in a real app, this would come from storage or API
  useEffect(() => {
    // This is mock data - in a production app, you'd load this from storage or API
    setAnalysisHistory([
      {
        id: "1",
        date: "May 5, 2025",
        exercise: "Barbell Biceps Curl",
        thumbnail: "https://via.placeholder.com/100",
        result: {
          exercise: "Barbell Biceps Curl",
          overall_performance: "Incorrect",
          error_rate: 0.8,
          errors: [
            "Shoulders not level",
            "Incomplete curl - extend arms more",
            "Elbows too far forward",
          ],
        },
      },
      {
        id: "2",
        date: "May 1, 2025",
        exercise: "Squat",
        thumbnail: "https://via.placeholder.com/100",
        result: {
          exercise: "Squat",
          overall_performance: "Good",
          error_rate: 0.3,
          errors: ["Knees going too far forward"],
        },
      },
    ]);
  }, []);

  const handleUploadVideo = async () => {
    try {
      setErrorMessage(null);
      setUploadStatus("preparing");

      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        setUploadStatus("error");
        setErrorMessage(
          "Please allow access to your media library to upload videos."
        );
        Alert.alert(
          "Permission Required",
          "Please allow access to your media library to upload videos."
        );
        return;
      }

      // Launch video picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        setSelectedVideo(video.uri);

        // Check file size
        const fileInfo = await fetch(video.uri).then((r) => ({
          size: parseInt(r.headers.get("Content-Length") || "0"),
          type: r.headers.get("Content-Type"),
        }));

        console.log(
          `Selected video: size=${fileInfo.size}, type=${fileInfo.type}`
        );

        if (fileInfo.size > 30 * 1024 * 1024) {
          // 30MB
          setUploadStatus("error");
          setErrorMessage(
            "Video file is too large. Please select a smaller video (under 30MB)."
          );
          Alert.alert(
            "File Too Large",
            "Please select a smaller video file (under 30MB)."
          );
          return;
        }

        handleAnalyzeVideo(video.uri);
      } else {
        setUploadStatus("idle");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("error");
      setErrorMessage("There was a problem uploading your video.");
      Alert.alert("Upload Failed", "There was a problem uploading your video.");
    }
  };

  const handleRecordVideo = async () => {
    try {
      setErrorMessage(null);
      setUploadStatus("preparing");

      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        setUploadStatus("error");
        setErrorMessage("Please allow access to your camera to record videos.");
        Alert.alert(
          "Permission Required",
          "Please allow access to your camera to record videos."
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsEditing: true,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        setSelectedVideo(video.uri);
        handleAnalyzeVideo(video.uri);
      } else {
        setUploadStatus("idle");
      }
    } catch (error) {
      console.error("Error recording video:", error);
      setUploadStatus("error");
      setErrorMessage("There was a problem recording your video.");
      Alert.alert(
        "Recording Failed",
        "There was a problem recording your video."
      );
    }
  };

  const handleAnalyzeVideo = async (videoUri: string) => {
    setIsLoading(true);
    setUploadStatus("uploading");
    setUploadProgress(10);
    setCurrentAnalysis(null);

    try {
      // Simulate upload progress before actual analysis starts
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 5;
        });
      }, 500);

      // Set status to analyzing after 3 seconds
      setTimeout(() => {
        setUploadStatus("analyzing");
        setUploadProgress(80);
      }, 3000);

      // Call the video analysis service
      const result = await videoAnalysisService.analyzeVideo(videoUri);

      clearInterval(progressInterval);
      setUploadStatus("complete");
      setUploadProgress(100);
      setCurrentAnalysis(result);

      // Add to history (in a real app, you'd save this to storage or backend)
      const newHistoryItem: AnalysisHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        exercise: result.exercise,
        thumbnail: videoUri,
        result: result,
      };

      setAnalysisHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
    } catch (error) {
      console.error("Error analyzing video:", error);
      setUploadStatus("error");
      setErrorMessage(
        "There was a problem analyzing your video. This could be due to a network connection issue or server problem."
      );

      Alert.alert(
        "Analysis Failed",
        "There was a problem analyzing your video. Please check your network connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderHistoryItem = ({ item }: { item: AnalysisHistoryItem }) => (
    <TouchableOpacity
      className={
        isDark
          ? "bg-dark-800 mb-4 rounded-lg overflow-hidden"
          : "bg-white mb-4 rounded-lg overflow-hidden shadow-md"
      }
      onPress={() => {
        setCurrentAnalysis(item.result);
        setSelectedVideo(item.thumbnail || null);
      }}
    >
      <View className="flex-row">
        {item.thumbnail && (
          <View className="w-24 h-24 bg-gray-200">
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2">
              <Text className="text-white text-xs">{item.exercise}</Text>
            </View>
          </View>
        )}
        <View className="flex-1 p-3">
          <Text
            className={
              isDark ? "text-white font-bold" : "text-gray-800 font-bold"
            }
          >
            {item.exercise}
          </Text>
          <Text
            className={
              isDark ? "text-gray-400 text-xs" : "text-gray-500 text-xs"
            }
          >
            {item.date}
          </Text>
          <View className="flex-row items-center mt-1">
            <View
              className={
                item.result.overall_performance.toLowerCase() === "good"
                  ? "w-2 h-2 rounded-full bg-green-500 mr-2"
                  : "w-2 h-2 rounded-full bg-red-500 mr-2"
              }
            />
            <Text
              className={
                isDark
                  ? item.result.overall_performance.toLowerCase() === "good"
                    ? "text-green-400 text-xs"
                    : "text-red-400 text-xs"
                  : item.result.overall_performance.toLowerCase() === "good"
                  ? "text-green-600 text-xs"
                  : "text-red-600 text-xs"
              }
            >
              {item.result.overall_performance}
            </Text>
          </View>
        </View>
        <View className="justify-center pr-4">
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#A0A0A0" : "#777777"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAnalysisResult = () => {
    if (!currentAnalysis) return null;

    const errorColor = isDark ? "#FF6B6B" : "#FF4757";
    const goodColor = isDark ? "#4CD97B" : "#2ED573";

    return (
      <View className="mb-6">
        <View className="mb-4">
          <Text
            className={
              isDark
                ? "text-white text-xl font-bold"
                : "text-gray-900 text-xl font-bold"
            }
          >
            Analysis Results
          </Text>

          <View className="flex-row justify-between items-center mt-1">
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Exercise: {currentAnalysis.exercise}
            </Text>
            <View className="flex-row items-center">
              <View
                className={
                  currentAnalysis.overall_performance.toLowerCase() === "good"
                    ? "w-2 h-2 rounded-full bg-green-500 mr-2"
                    : "w-2 h-2 rounded-full bg-red-500 mr-2"
                }
              />
              <Text
                className={
                  currentAnalysis.overall_performance.toLowerCase() === "good"
                    ? isDark
                      ? "text-green-400"
                      : "text-green-600"
                    : isDark
                    ? "text-red-400"
                    : "text-red-600"
                }
              >
                {currentAnalysis.overall_performance} Form
              </Text>
            </View>
          </View>
        </View>

        <View
          className={
            isDark
              ? "bg-dark-800 rounded-lg p-4 mb-4"
              : "bg-white rounded-lg p-4 mb-4 shadow-md"
          }
        >
          <Text
            className={
              isDark
                ? "text-white font-bold mb-2"
                : "text-gray-900 font-bold mb-2"
            }
          >
            Issues Found:
          </Text>

          {currentAnalysis.errors.length > 0 ? (
            currentAnalysis.errors.map((error, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={16} color={errorColor} />
                <Text
                  className={isDark ? "text-white ml-2" : "text-gray-800 ml-2"}
                >
                  {error}
                </Text>
              </View>
            ))
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color={goodColor} />
              <Text
                className={isDark ? "text-white ml-2" : "text-gray-800 ml-2"}
              >
                No issues detected! Great form!
              </Text>
            </View>
          )}
        </View>

        <View
          className={
            isDark
              ? "bg-dark-800 rounded-lg p-4"
              : "bg-white rounded-lg p-4 shadow-md"
          }
        >
          <Text
            className={
              isDark
                ? "text-white font-bold mb-2"
                : "text-gray-900 font-bold mb-2"
            }
          >
            Performance Score:
          </Text>
          <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <View
              className={
                currentAnalysis.error_rate < 0.3
                  ? "h-full bg-green-500"
                  : currentAnalysis.error_rate < 0.7
                  ? "h-full bg-yellow-500"
                  : "h-full bg-red-500"
              }
              style={{ width: `${Math.max(5, 100 - currentAnalysis.error_rate * 100)}%` }}
            />
          </View>
          <Text
            className={
              isDark
                ? "text-gray-400 text-right mt-1"
                : "text-gray-600 text-right mt-1"
            }
          >
            {Math.max(1, Math.round(100 - currentAnalysis.error_rate * 100))}%
          </Text>
        </View>
      </View>
    );
  };

  // Render loading state with detailed status
  const renderLoadingState = () => {
    let statusMessage = "";
    let statusIcon = "hourglass-outline";

    switch (uploadStatus) {
      case "preparing":
        statusMessage = "Preparing video...";
        statusIcon = "film-outline";
        break;
      case "uploading":
        statusMessage = "Uploading video...";
        statusIcon = "cloud-upload-outline";
        break;
      case "analyzing":
        statusMessage = "Analyzing your form...";
        statusIcon = "fitness-outline";
        break;
      case "error":
        statusMessage = errorMessage || "An error occurred";
        statusIcon = "alert-circle-outline";
        break;
      default:
        statusMessage = "Processing...";
    }

    return (
      <View className="items-center justify-center py-8">
        {uploadStatus === "error" ? (
          <View className="items-center">
            <Ionicons name={statusIcon} size={48} color="#FF4757" />
            <Text
              className={
                isDark
                  ? "text-red-400 mt-4 text-center px-8"
                  : "text-red-600 mt-4 text-center px-8"
              }
            >
              {statusMessage}
            </Text>
            <TouchableOpacity
              className={
                isDark
                  ? "bg-dark-700 mt-4 px-4 py-2 rounded-lg"
                  : "bg-gray-200 mt-4 px-4 py-2 rounded-lg"
              }
              onPress={() => setUploadStatus("idle")}
            >
              <Text className={isDark ? "text-white" : "text-gray-800"}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Ionicons name={statusIcon} size={32} color="#4CD97B" />
            <ActivityIndicator
              size="large"
              color="#4CD97B"
              style={{ marginTop: 16 }}
            />
            <Text
              className={
                isDark
                  ? "text-white mt-4 text-center"
                  : "text-gray-800 mt-4 text-center"
              }
            >
              {statusMessage}
            </Text>

            {/* Progress bar */}
            <View className="w-4/5 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <View
                className="h-full bg-green-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              className={
                isDark
                  ? "mt-6 bg-dark-700 px-4 py-2 rounded-lg"
                  : "mt-6 bg-gray-200 px-4 py-2 rounded-lg"
              }
              onPress={() => {
                setIsLoading(false);
                setUploadStatus("idle");
              }}
            >
              <Text className={isDark ? "text-white" : "text-gray-800"}>
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold"
              : "text-gray-900 text-lg font-bold"
          }
        >
          Exercise Analysis
        </Text>
        <View style={{ width: 24 }} /> {/* Empty view for spacing */}
      </View>

      <View className="flex-1 p-4">
        {/* Video Upload Buttons */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={
              isDark
                ? "bg-dark-800 p-4 rounded-lg flex-1 mr-2 items-center"
                : "bg-white p-4 rounded-lg flex-1 mr-2 items-center shadow-md"
            }
            onPress={handleUploadVideo}
            disabled={isLoading}
          >
            <Ionicons
              name="cloud-upload"
              size={24}
              color={isDark ? "#4CD97B" : "#2ED573"}
            />
            <Text className={isDark ? "text-white mt-2" : "text-gray-800 mt-2"}>
              Upload Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={
              isDark
                ? "bg-dark-800 p-4 rounded-lg flex-1 ml-2 items-center"
                : "bg-white p-4 rounded-lg flex-1 ml-2 items-center shadow-md"
            }
            onPress={handleRecordVideo}
            disabled={isLoading}
          >
            <Ionicons
              name="videocam"
              size={24}
              color={isDark ? "#4CD97B" : "#2ED573"}
            />
            <Text className={isDark ? "text-white mt-2" : "text-gray-800 mt-2"}>
              Record Video
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          renderLoadingState()
        ) : (
          <>
            {/* Analysis Results */}
            {renderAnalysisResult()}

            {/* History Title */}
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold mb-3"
                  : "text-gray-900 text-xl font-bold mb-3"
              }
            >
              Analysis History
            </Text>

            {/* Analysis History */}
            <FlatList
              data={analysisHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="items-center py-8">
                  <Ionicons
                    name="fitness"
                    size={48}
                    color={isDark ? "#4CD97B" : "#2ED573"}
                  />
                  <Text
                    className={
                      isDark
                        ? "text-white text-center mt-4"
                        : "text-gray-800 text-center mt-4"
                    }
                  >
                    No analysis history yet.{"\n"}Upload or record a video to
                    get started!
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </View>
  );
}
