import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { AboutTabProps } from "../../../types/exercises";

const AboutTab = ({ exercise, formatDate }: AboutTabProps) => {
  if (!exercise) return null;

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(400)}
      className="flex-1"
    >
      {/* Exercise Image */}
      <View className="w-full h-72">
        {exercise.image ? (
          <Image
            source={{ uri: exercise.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-dark-800 items-center justify-center">
            <Ionicons name="barbell-outline" size={80} color="#BBFD00" />
            <Text className="text-white mt-4">No image available</Text>
          </View>
        )}
        <View className="absolute bottom-4 right-4">
          <TouchableOpacity className="bg-primary rounded-full p-3 shadow-lg">
            <Ionicons name="play" size={24} color="#121212" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise Info */}
      <View className="px-6 pt-6">
        <View className="flex-row justify-between mb-3">
          <Text className="text-white text-2xl font-bold">{exercise.name}</Text>
        </View>

        <View className="flex-row mb-6">
          <View className="bg-dark-800 rounded-full px-3 py-1 mr-2">
            <Text className="text-primary">{exercise.bodyPart}</Text>
          </View>
          <View className="bg-dark-800 rounded-full px-3 py-1">
            <Text className="text-primary">{exercise.category}</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-dark-800 rounded-3xl p-5 border border-dark-700 mb-6">
          <Text className="text-white text-lg font-bold mb-4">Stats</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-400">Frequency</Text>
              <Text className="text-white font-bold text-xl">
                {exercise.frequency}x
              </Text>
              <Text className="text-gray-400 text-xs">per week</Text>
            </View>

            <View>
              <Text className="text-gray-400">Last performed</Text>
              <Text className="text-white font-bold text-xl">
                {formatDate(exercise.lastPerformed)}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View className="bg-dark-800 rounded-3xl p-5 border border-dark-700 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Instructions
          </Text>
          {exercise.instructions.map((instruction, index) => (
            <View key={index} className="flex-row mb-3 last:mb-0">
              <Text className="text-primary text-base font-bold mr-2">
                {index + 1}.
              </Text>
              <Text className="text-white flex-1">{instruction}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default AboutTab;
