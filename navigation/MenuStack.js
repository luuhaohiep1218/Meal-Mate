// navigation/MenuStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "../screens/MenuScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";

const Stack = createNativeStackNavigator();

const MenuStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header nếu không cần
      }}
    >
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
};

export default MenuStack;
