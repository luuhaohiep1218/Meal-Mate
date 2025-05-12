import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Prompt from "../shared/Prompt";
import { CalculateCaloriesAI } from "../services/AIModel";

const AddScreen = () => {
  const onContinue = async () => {
    const data = {
      weight: "65kg",
      height: "165cm",
      gender: "male",
      goal: "lose weight",
    };
    const PROMPT = JSON.stringify(data) + Prompt.CALORIES_PROMPT;
    console.log(PROMPT);
    const AIResult = await CalculateCaloriesAI(PROMPT);
    console.log(AIResult.choices[0].message.content);
    const AIResp = AIResult.choices[0].message.content;
    const JSONContent = JSON.parse(
      AIResp.replace("```json", "").replace("```", "")
    );
    console.log(JSONContent);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thêm bữa ăn</Text>
      <Button onPress={() => onContinue()} title=" click" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default AddScreen;
