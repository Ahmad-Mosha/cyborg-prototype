import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface RecordsHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string | undefined;
  recordsHistory: {
    estimated1RM?: Array<{ value: number; date: string }>;
    maxWeight?: Array<{ value: number; date: string }>;
    maxVolume?: Array<{ value: number; date: string }>;
  };
}

const RecordsHistoryModal = ({
  visible,
  onClose,
  exerciseName,
  recordsHistory,
}: RecordsHistoryModalProps) => {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
        {/* Header */}
        <View
          className={
            isDark
              ? "bg-dark-800 px-6 pt-14 pb-4"
              : "bg-white px-6 pt-14 pb-4 shadow"
          }
        >
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={onClose}
              className={`${
                isDark ? "bg-dark-700" : "bg-light-200"
              } w-10 h-10 rounded-full items-center justify-center`}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold"
                  : "text-dark-900 text-lg font-bold"
              }
            >
              {exerciseName || "Exercise Records"}
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Estimated 1RM Section */}
          {recordsHistory?.estimated1RM &&
            recordsHistory.estimated1RM.length > 0 && (
              <View className="px-6 py-6">
                <Text
                  className={
                    isDark
                      ? "text-gray-400 uppercase font-bold mb-6"
                      : "text-gray-600 uppercase font-bold mb-6"
                  }
                >
                  Estimated 1RM
                </Text>

                {recordsHistory.estimated1RM.map((record, index) => (
                  <View
                    key={`1rm-${index}`}
                    className={`flex-row justify-between items-center py-4 border-b ${
                      isDark ? "border-dark-700" : "border-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        isDark
                          ? "text-white text-lg font-medium"
                          : "text-dark-900 text-lg font-medium"
                      }
                    >
                      {record.value} kg
                    </Text>
                    <Text
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      {record.date}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          {/* Max Weight Section */}
          {recordsHistory?.maxWeight && recordsHistory.maxWeight.length > 0 && (
            <View
              className={`px-6 py-6 border-t ${
                isDark ? "border-dark-700" : "border-gray-200"
              }`}
            >
              <Text
                className={
                  isDark
                    ? "text-gray-400 uppercase font-bold mb-6"
                    : "text-gray-600 uppercase font-bold mb-6"
                }
              >
                Max Weight
              </Text>

              {recordsHistory.maxWeight.map((record, index) => (
                <View
                  key={`weight-${index}`}
                  className={`flex-row justify-between items-center py-4 border-b ${
                    isDark ? "border-dark-700" : "border-gray-200"
                  }`}
                >
                  <Text
                    className={
                      isDark
                        ? "text-white text-lg font-medium"
                        : "text-dark-900 text-lg font-medium"
                    }
                  >
                    {record.value} kg
                  </Text>
                  <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {record.date}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Max Volume Section */}
          {recordsHistory?.maxVolume && recordsHistory.maxVolume.length > 0 && (
            <View
              className={`px-6 py-6 border-t ${
                isDark ? "border-dark-700" : "border-gray-200"
              }`}
            >
              <Text
                className={
                  isDark
                    ? "text-gray-400 uppercase font-bold mb-6"
                    : "text-gray-600 uppercase font-bold mb-6"
                }
              >
                Max Volume
              </Text>

              {recordsHistory.maxVolume.map((record, index) => (
                <View
                  key={`volume-${index}`}
                  className={`flex-row justify-between items-center py-4 border-b ${
                    isDark ? "border-dark-700" : "border-gray-200"
                  }`}
                >
                  <Text
                    className={
                      isDark
                        ? "text-white text-lg font-medium"
                        : "text-dark-900 text-lg font-medium"
                    }
                  >
                    {record.value} kg
                  </Text>
                  <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {record.date}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default RecordsHistoryModal;
