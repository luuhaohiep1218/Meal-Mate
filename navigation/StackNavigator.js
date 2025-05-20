
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { useAuth } from "../context/AuthContext";
const Stack = createNativeStackNavigator();

const StackNavigator = ({ user }) => {
  const { hasUserInfo } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      ) : !hasUserInfo ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : null}
      <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
