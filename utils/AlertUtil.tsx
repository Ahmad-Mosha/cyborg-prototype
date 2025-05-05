import React from "react";
import { Alert, Platform } from "react-native";
import CustomAlert from "@/components/ui/CustomAlert";

// State management for CustomAlert
let alertState = {
  visible: false,
  title: "",
  message: "",
  buttons: [],
  icon: undefined,
  iconColor: undefined,
  onClose: () => {},
};

// Callback to update alert state - will be set by AlertHost component
let setAlertState: any = null;

// Add debounce mechanism to prevent multiple alerts
let isAlertActive = false;
let alertQueue: Array<() => void> = [];

// Function to process queued alerts
const processNextAlert = () => {
  if (alertQueue.length > 0 && !isAlertActive) {
    isAlertActive = true;
    const nextAlert = alertQueue.shift();
    if (nextAlert) nextAlert();
  }
};

// AlertHost component to be placed at the root of your app
export const AlertHost = () => {
  const [state, setState] = React.useState(alertState);

  // Set the setter function when component mounts
  React.useEffect(() => {
    setAlertState = setState;
    return () => {
      setAlertState = null;
    };
  }, []);

  return (
    <CustomAlert
      visible={state.visible}
      title={state.title}
      message={state.message}
      buttons={state.buttons}
      icon={state.icon}
      iconColor={state.iconColor}
      onClose={() => {
        setState((prev) => ({ ...prev, visible: false }));
        isAlertActive = false;
        setTimeout(processNextAlert, 300); // Process next alert after a short delay
        state.onClose();
      }}
    />
  );
};

// Function to show alerts consistently through the app
export const showAlert = (
  title: string,
  message: string,
  buttons: any[] = [{ text: "OK" }],
  icon?: string,
  iconColor?: string
) => {
  const showAlertFn = () => {
    if (Platform.OS === "web" || !setAlertState) {
      // Fallback to regular Alert on web or when AlertHost is not mounted
      Alert.alert(title, message, buttons);
      isAlertActive = false;
      setTimeout(processNextAlert, 300);
      return;
    }

    // Use our custom alert
    setAlertState({
      visible: true,
      title,
      message,
      buttons: buttons.map((btn) => ({
        text: btn.text,
        style: btn.style,
        onPress: () => {
          setAlertState((prev: any) => ({ ...prev, visible: false }));
          isAlertActive = false;
          setTimeout(processNextAlert, 300);
          if (btn.onPress) btn.onPress();
        },
      })),
      icon,
      iconColor,
      onClose: () => {
        isAlertActive = false;
        setTimeout(processNextAlert, 300);
      },
    });
  };

  // If an alert is already active, queue this one
  if (isAlertActive) {
    alertQueue.push(showAlertFn);
  } else {
    isAlertActive = true;
    showAlertFn();
  }
};

// Shorthand for a confirmation dialog
export const confirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon?: string
) => {
  showAlert(
    title,
    message,
    [
      {
        text: cancelText,
        style: "cancel",
        onPress: onCancel || (() => {}),
      },
      {
        text: confirmText,
        onPress: onConfirm,
      },
    ],
    icon
  );
};

// Shorthand for a destructive confirmation dialog
export const destructiveAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText = "Delete",
  cancelText = "Cancel",
  icon?: string
) => {
  showAlert(
    title,
    message,
    [
      {
        text: cancelText,
        style: "cancel",
        onPress: onCancel || (() => {}),
      },
      {
        text: confirmText,
        style: "destructive",
        onPress: onConfirm,
      },
    ],
    icon || "warning",
    "#FF4757"
  );
};

export default { showAlert, confirmAlert, destructiveAlert, AlertHost };
