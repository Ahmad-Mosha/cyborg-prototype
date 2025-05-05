import React, { useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ExerciseDetailModalProps } from "../../types/exercises";
import AboutTab from "./tabs/AboutTab";
import HistoryTab from "./tabs/HistoryTab";
import RecordsTab from "./tabs/RecordsTab";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const ExerciseDetailModal = ({
  visible,
  onClose,
  exercise,
  isFavorite,
  onToggleFavorite,
  activeTab,
  setActiveTab,
  exerciseHistoryData,
  exerciseRecordsData,
  onViewRecordsHistory,
  formatDate,
}: ExerciseDetailModalProps) => {
  // Ref for the FlatList to handle programmatic navigation between tabs
  const tabFlatListRef = useRef<FlatList>(null);
  const { isDark } = useTheme();

  // Shared values for animations
  const tabScrollX = useSharedValue(0);
  const activeTabIndex = useSharedValue(0);

  // Handle tab selection with smooth scroll animation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Calculate index based on tab name
    const tabIndex = tab === "about" ? 0 : tab === "history" ? 1 : 2;

    // Scroll to the selected tab with animation
    tabFlatListRef.current?.scrollToIndex({
      animated: true,
      index: tabIndex,
    });
  };

  // Handle scroll end to update active tab
  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const tabIndex = Math.round(contentOffsetX / width);

    // Update shared values for animation
    tabScrollX.value = contentOffsetX;
    activeTabIndex.value = tabIndex;

    // Update active tab based on scroll position
    const tabNames = ["about", "history", "records"];
    setActiveTab(tabNames[tabIndex]);
  };

  // Handle scroll during swipe to update indicator in real-time
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    tabScrollX.value = contentOffsetX;

    // Calculate current tab index based on scroll position
    const currentIndex = contentOffsetX / width;
    activeTabIndex.value = currentIndex;
  };

  // Render tab content
  const renderTabContent = ({ item }: { item: string }) => {
    if (item === "about") {
      return (
        <View style={{ width }} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <AboutTab exercise={exercise} formatDate={formatDate} />
          </ScrollView>
        </View>
      );
    }
    if (item === "history") {
      return (
        <View style={{ width }} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <HistoryTab exerciseHistoryData={exerciseHistoryData} />
          </ScrollView>
        </View>
      );
    }
    if (item === "records") {
      return (
        <View style={{ width }} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <RecordsTab
              exerciseRecordsData={exerciseRecordsData}
              onViewRecordsHistory={onViewRecordsHistory}
            />
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-white"}>
        {/* Header */}
        <View
          className={
            isDark ? "bg-dark-900 px-6 pt-14 pb-4" : "bg-white px-6 pt-14 pb-4"
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
              Exercise Details
            </Text>
            <TouchableOpacity
              onPress={() => exercise && onToggleFavorite(exercise.id)}
              className={`${
                isDark ? "bg-dark-700" : "bg-light-200"
              } w-10 h-10 rounded-full items-center justify-center`}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#FF6B6B" : isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View
          className={
            isDark
              ? "flex-row bg-dark-900 border-b border-dark-800"
              : "flex-row bg-white border-b border-gray-200"
          }
        >
          {["about", "history", "records"].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabChange(tab)}
              className="flex-1 items-center py-4"
            >
              <Text
                className={`text-base ${
                  activeTab === tab
                    ? "text-primary font-semibold"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={useAnimatedStyle(() => {
              // Calculate the position of the tab indicator based on scroll position
              const tabWidth = width / 3;
              const position = tabScrollX.value / width;

              return {
                position: "absolute",
                bottom: 0,
                left: position * tabWidth,
                width: tabWidth,
                height: 1,
                backgroundColor: "#BBFD00",
              };
            })}
          />
        </View>

        {/* Swipeable Tab Content */}
        <FlatList
          ref={tabFlatListRef}
          data={["about", "history", "records"]}
          renderItem={renderTabContent}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={
            activeTab === "about" ? 0 : activeTab === "history" ? 1 : 2
          }
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={handleScrollEnd}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Ensures smooth indicator movement
          snapToAlignment="start"
          snapToInterval={width}
          decelerationRate="fast"
          bounces={false}
          removeClippedSubviews={true} // Better performance
        />
      </View>
    </Modal>
  );
};

export default ExerciseDetailModal;
