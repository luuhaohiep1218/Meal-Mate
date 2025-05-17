// navigation/StackNavigator.js
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import BottomTabNavigator from "../navigation/BottomTabNavigator";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="BottomNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
