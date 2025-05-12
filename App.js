import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";

import { useAuth } from "./context/AuthContext";

import StackNavigator from "./navigation/StackNavigator";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LoadingScreen from "./screens/LoadingScreen";

const AppNav = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return user ? <BottomTabNavigator /> : <StackNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNav />
      </NavigationContainer>
    </AuthProvider>
  );
}
