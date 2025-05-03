import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedBodyParts: string[];
  selectedCategories: string[];
  toggleBodyPartFilter: (bodyPart: string) => void;
  toggleCategoryFilter: (category: string) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  bodyPartFilters: string[];
  categoryFilters: string[];
  filteredCount: number;
}

const FilterModal = ({
  visible,
  onClose,
  selectedBodyParts,
  selectedCategories,
  toggleBodyPartFilter,
  toggleCategoryFilter,
  resetFilters,
  applyFilters,
  bodyPartFilters,
  categoryFilters,
  filteredCount,
}: FilterModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/60"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className="absolute top-1/4 left-0 right-0 mx-4 bg-dark-900 rounded-3xl overflow-hidden border border-dark-700"
          style={{ zIndex: 9999 }}
        >
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">
                Filter ({filteredCount})
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-dark-800 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Category filter */}
            <Text className="text-white text-lg font-semibold mb-4">
              Category
            </Text>
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              className="max-h-[250px]"
            >
              <View className="flex-row flex-wrap mb-6">
                {categoryFilters.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategoryFilter(category)}
                    className={`mr-2 mb-2 rounded-full px-4 py-2 ${
                      selectedCategories.includes(category)
                        ? "bg-primary"
                        : "bg-dark-800"
                    }`}
                  >
                    <Text
                      className={
                        selectedCategories.includes(category)
                          ? "text-dark-900 font-medium"
                          : "text-white"
                      }
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Body part filter */}
              <Text className="text-white text-lg font-semibold mb-4">
                Body part
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {bodyPartFilters.map((bodyPart) => (
                  <TouchableOpacity
                    key={bodyPart}
                    onPress={() => toggleBodyPartFilter(bodyPart)}
                    className={`mr-2 mb-2 rounded-full px-4 py-2 ${
                      selectedBodyParts.includes(bodyPart)
                        ? "bg-primary"
                        : "bg-dark-800"
                    }`}
                  >
                    <Text
                      className={
                        selectedBodyParts.includes(bodyPart)
                          ? "text-dark-900 font-medium"
                          : "text-white"
                      }
                    >
                      {bodyPart}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Action buttons */}
            <View className="flex-row space-x-4 mt-4">
              <TouchableOpacity
                onPress={resetFilters}
                className="flex-1 py-3 border border-dark-700 rounded-full items-center"
              >
                <Text className="text-white font-medium">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                className="flex-1 py-3 bg-primary rounded-full items-center"
              >
                <Text className="text-dark-900 font-bold">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterModal;
