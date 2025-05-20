import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { View } from "react-native";
import QuestionFlow from "../components/QuestionFlow";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { user, setHasUserInfo } = useAuth();

  const handleComplete = async (answers) => {
    console.log("All answers:", answers);

    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          {
            ...answers,
            createdAt: new Date(),
          },
          { merge: true }
        );

        setHasUserInfo(true);
        navigation.replace("BottomTab");
      } else {
        console.warn("No authenticated user found.");
      }
    } catch (error) {
      console.error("Error saving onboarding answers:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <QuestionFlow onComplete={handleComplete} />
    </View>
  );
};

export default OnboardingScreen;
