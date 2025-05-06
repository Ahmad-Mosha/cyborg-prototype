import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CalendarProps, CalendarDay } from "../../types/history";

const Calendar: React.FC<CalendarProps> = ({
  activeDate,
  onSelectDate,
  activeDates = [],
  isDark,
  isVisible,
  onClose,
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const insets = useSafeAreaInsets();

  // Month names for display
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Calculate days in month and first day of month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  // Generate days array for the month
  const days: CalendarDay[] = [];
  // Add empty spaces for days before the 1st day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: "", isCurrentMonth: false });
  }
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(i).padStart(2, "0")}`;
    days.push({
      day: i,
      isCurrentMonth: true,
      isActive: activeDates.some((date) => date === dateString),
      dateString,
    });
  }

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  if (!isVisible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <View
        style={{
          width: "90%",
          backgroundColor: isDark ? "#1E1E1E" : "#FFF",
          borderRadius: 20,
          padding: 16,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        {/* Calendar Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "white" : "#121212"}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDark ? "white" : "#121212",
            }}
          >
            {months[selectedMonth]} {selectedYear}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={goToPrevMonth}
              style={{ padding: 5, marginRight: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextMonth} style={{ padding: 5 }}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Week day headers */}
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
            (day, index) => (
              <Text
                key={index}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "500",
                  color: isDark ? "#A0A0A0" : "#666",
                  fontSize: 12,
                }}
              >
                {day}
              </Text>
            )
          )}
        </View>

        {/* Calendar grid */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {days.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: "14.28%",
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                if (item.isCurrentMonth && item.day && item.dateString) {
                  onSelectDate(item.dateString);
                  onClose();
                }
              }}
              disabled={!item.isCurrentMonth || !item.day}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    item.isActive && item.isCurrentMonth
                      ? isDark
                        ? "#333"
                        : "#f0f0f0"
                      : "transparent",
                  borderWidth: activeDate === item.dateString ? 2 : 0,
                  borderColor: "#BBFD00",
                }}
              >
                {item.isActive && (
                  <View
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      width: 5,
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: "#BBFD00",
                    }}
                  />
                )}
                <Text
                  style={{
                    color: !item.isCurrentMonth
                      ? "transparent"
                      : isDark
                      ? "white"
                      : "#121212",
                    fontWeight: item.isActive ? "bold" : "normal",
                  }}
                >
                  {item.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#BBFD00",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 50,
            }}
            onPress={onClose}
          >
            <Text style={{ color: "#121212", fontWeight: "bold" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Calendar;
