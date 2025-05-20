// navigation/StackNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import OnboardingScreen from "../screens/OnboardingScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = ({ user, hasUserInfo }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      ) : !hasUserInfo ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : null}
      <Stack.Screen name="BottomNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
