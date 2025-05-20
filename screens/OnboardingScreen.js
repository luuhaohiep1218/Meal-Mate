import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import QuestionFlow from "../components/QuestionFlow";

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleComplete = (answers) => {
    console.log("All answers:", answers);
    // Chuyển hướng đến BottomTabNavigator
    navigation.replace("BottomNavigator");
  };

  return (
    <View style={{ flex: 1 }}>
      <QuestionFlow onComplete={handleComplete} />
    </View>
  );
};

export default OnboardingScreen;
