import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import DailyScreen from "../screens/DailyScreen";
import MenuScreen from "../screens/MenuScreen";
import AddScreen from "../screens/AddScreen";
import RecipeBookScreen from "../screens/RecipeBookScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#EA580C",
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Hằng ngày":
              return <Ionicons name="calendar" size={size} color={color} />;
            case "Thực đơn":
              return (
                <FontAwesome5 name="clipboard-list" size={size} color={color} />
              );
            case "Thêm":
              return <Ionicons name="add-circle" size={48} color={color} />;
            case "Sách nấu ăn":
              return <Ionicons name="book" size={size} color={color} />;
            case "Thông tin":
              return (
                <Ionicons name="person-outline" size={size} color={color} />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Hằng ngày" component={DailyScreen} />
      <Tab.Screen name="Thực đơn" component={MenuScreen} />
      <Tab.Screen name="Thêm" component={AddScreen} />
      <Tab.Screen name="Sách nấu ăn" component={RecipeBookScreen} />
      <Tab.Screen name="Thông tin" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
