import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import MealModal from "../components/modals/MealModal";
const DailyScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [mealCalories, setMealCalories] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [totalCalories, setTotalCalories] = useState(0);

  const mealData = [
    {
      type: "breakfast",
      name: "Bữa sáng",
      icon: "coffee",
      suggestion: "418-586",
      maxCalories: 586,
    },
    {
      type: "lunch",
      name: "Bữa trưa",
      icon: "utensils",
      suggestion: "502-670",
      maxCalories: 670,
    },
    {
      type: "dinner",
      name: "Bữa tối",
      icon: "drumstick-bite",
      suggestion: "653-854",
      maxCalories: 854,
    },
  ];

  const handleMealPress = (meal) => {
    setCurrentMeal(meal);
    setModalVisible(true);
  };

  const handleAddFood = (mealType, items, calories) => {
    setMealCalories({
      ...mealCalories,
      [mealType]: calories,
    });
    setTotalCalories(
      Object.values({
        ...mealCalories,
        [mealType]: calories,
      }).reduce((a, b) => a + b, 0)
    );
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Nâng cấp</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mealmate</Text>
        <View style={styles.headerIcons}>
          <Ionicons
            name="calendar"
            size={24}
            color="#000"
            style={styles.icon}
          />
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </View>
      </View>

      {/* Calorie Info */}
      <View style={styles.circleContainer}>
        <Text style={styles.kcalText}>
          <Text style={styles.kcalValue}>0</Text>/1674{" "}
        </Text>
        <Text style={styles.kcalLabel}>kcal</Text>
      </View>

      {/* Date */}
      <View style={styles.dateRow}>
        <Ionicons name="chevron-back" size={20} />
        <Ionicons name="calendar" size={18} />
        <Text style={styles.dateText}>Hôm nay, 28 tháng 03</Text>
        <Ionicons name="chevron-forward" size={20} />
      </View>

      {/* Meals */}
      <View style={styles.mealContainer}>
        {mealData.map((meal, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mealCard}
            onPress={() => handleMealPress(meal)}
          >
            <FontAwesome5 name={meal.icon} size={24} color="#000" />
            <View style={styles.mealInfo}>
              <Text style={styles.mealTitle}>{meal.name}</Text>
              <Text style={styles.mealSuggestion}>
                {mealCalories[meal.type] > 0
                  ? `${mealCalories[meal.type]} kcal`
                  : `Gợi ý: ${meal.suggestion} kcal`}
              </Text>
            </View>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ))}
      </View>

      {currentMeal && (
        <MealModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          
          onAddFood={(items, calories) =>
            handleAddFood(currentMeal.type, items, calories)
          }
          maxCalories={currentMeal.maxCalories}
          mealType={currentMeal.type}
          mealName={currentMeal.name}
        />
      )}
    </ScrollView>
  );
};

export default DailyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upgradeButton: {
    backgroundColor: "#FFC107",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  upgradeText: {
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    marginRight: 8,
  },
  circleContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  kcalText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  kcalValue: {
    fontSize: 36,
  },
  kcalLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  macros: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  macroItem: {
    alignItems: "center",
    width: "30%",
  },
  macroLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 14,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  mealContainer: {
    gap: 12,
    marginBottom: 40,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    padding: 16,
    borderRadius: 12,
    justifyContent: "space-between",
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  mealSuggestion: {
    fontSize: 14,
    color: "#555",
  },
});
