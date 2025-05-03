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
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-dark-900">
        {/* Header */}
        <View className="bg-dark-800 px-6 pt-14 pb-4">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={onClose}
              className="bg-dark-700 w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">
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
                <Text className="text-gray-400 uppercase font-bold mb-6">
                  Estimated 1RM
                </Text>

                {recordsHistory.estimated1RM.map((record, index) => (
                  <View
                    key={`1rm-${index}`}
                    className="flex-row justify-between items-center py-4 border-b border-dark-700"
                  >
                    <Text className="text-white text-lg font-medium">
                      {record.value} kg
                    </Text>
                    <Text className="text-gray-400">{record.date}</Text>
                  </View>
                ))}
              </View>
            )}

          {/* Max Weight Section */}
          {recordsHistory?.maxWeight && recordsHistory.maxWeight.length > 0 && (
            <View className="px-6 py-6 border-t border-dark-700">
              <Text className="text-gray-400 uppercase font-bold mb-6">
                Max Weight
              </Text>

              {recordsHistory.maxWeight.map((record, index) => (
                <View
                  key={`weight-${index}`}
                  className="flex-row justify-between items-center py-4 border-b border-dark-700"
                >
                  <Text className="text-white text-lg font-medium">
                    {record.value} kg
                  </Text>
                  <Text className="text-gray-400">{record.date}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Max Volume Section */}
          {recordsHistory?.maxVolume && recordsHistory.maxVolume.length > 0 && (
            <View className="px-6 py-6 border-t border-dark-700">
              <Text className="text-gray-400 uppercase font-bold mb-6">
                Max Volume
              </Text>

              {recordsHistory.maxVolume.map((record, index) => (
                <View
                  key={`volume-${index}`}
                  className="flex-row justify-between items-center py-4 border-b border-dark-700"
                >
                  <Text className="text-white text-lg font-medium">
                    {record.value} kg
                  </Text>
                  <Text className="text-gray-400">{record.date}</Text>
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
