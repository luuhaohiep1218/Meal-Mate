
import React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoadingScreen from "./screens/LoadingScreen";
import StackNavigator from "./navigation/StackNavigator";


const AppNav = () => {
  const { user, loading, hasUserInfo, checkingInfo, error, checkUserInfo } =
    useAuth();

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
        <Button
          title="Retry"
          onPress={() => {
            checkUserInfo();
          }}
        />
      </View>
    );
  }

  // if (loading || checkingInfo || hasUserInfo === null) {
  //   return <LoadingScreen />;
  // }

  return <StackNavigator user={user} />;

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
