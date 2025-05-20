import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LoadingScreen from "./screens/LoadingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

const AppNav = () => {
  const { user, loading } = useAuth();
  const [hasUserInfo, setHasUserInfo] = useState(null);
  const [checkingInfo, setCheckingInfo] = useState(true);
  const [error, setError] = useState(null);

  const checkUserInfo = useCallback(async () => {
    try {
      console.log(
        "checkUserInfo started, user:",
        user ? user.uid : null,
        "loading:",
        loading
      );
      setCheckingInfo(true);

      if (!user || !user.uid) {
        console.log("No user or user.uid, setting hasUserInfo to false");
        setHasUserInfo(false);
        return;
      }

      // Chỉ kiểm tra AsyncStorage
      const cachedHasUserInfo = await AsyncStorage.getItem(
        `userInfo_${user.uid}`
      );
      console.log("Cached userInfo:", cachedHasUserInfo);
      setHasUserInfo(cachedHasUserInfo ? JSON.parse(cachedHasUserInfo) : false);
    } catch (error) {
      console.error("Error in checkUserInfo:", error);
      setError(error.message || "Failed to load user data");
      setHasUserInfo(false);
    } finally {
      setCheckingInfo(false);
      console.log("checkUserInfo completed, checkingInfo:", false);
    }
  }, [user]);

  useEffect(() => {
    console.log("AppNav mounted, running checkUserInfo");
    checkUserInfo();
  }, [checkUserInfo]);

  // Debug trạng thái định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("AppNav state:", {
        user: user ? user.uid : null,
        loading,
        checkingInfo,
        hasUserInfo,
        error,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [user, loading, checkingInfo, hasUserInfo, error]);

  if (error) {
    console.log("Rendering error screen:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
        <Button
          title="Retry"
          onPress={() => {
            console.log("Retry pressed");
            setError(null);
            setCheckingInfo(true);
            checkUserInfo();
          }}
        />
      </View>
    );
  }

  // if (loading || checkingInfo || hasUserInfo === null) {
  //   console.log(
  //     "Rendering LoadingScreen: loading=",
  //     loading,
  //     "checkingInfo=",
  //     checkingInfo,
  //     "hasUserInfo=",
  //     hasUserInfo
  //   );
  //   return <LoadingScreen />;
  // }

  if (!user) {
    console.log("Rendering WelcomeScreen: no user");
    return <WelcomeScreen />;
  }

  if (!hasUserInfo) {
    console.log("Rendering OnboardingScreen: hasUserInfo=", hasUserInfo);
    return <OnboardingScreen setHasUserInfo={setHasUserInfo} />;
  }

  console.log("Rendering BottomTabNavigator");
  return <BottomTabNavigator />;
};

export default function App() {
  console.log("App mounted");
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNav />
      </NavigationContainer>
    </AuthProvider>
  );
}
