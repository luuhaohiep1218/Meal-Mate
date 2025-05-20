import { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { doc, getDoc } from "firebase/firestore";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { db } from "./firebaseConfig";

import StackNavigator from "./navigation/StackNavigator";
import LoadingScreen from "./screens/LoadingScreen";

// const AppNav = () => {
//   const { user, loading } = useAuth();

//   if (loading) return <LoadingScreen />;

//   return user ? <BottomTabNavigator /> : <WelcomeScreen />;
// };
const AppNav = () => {
  const { user, loading } = useAuth();
  const [hasUserInfo, setHasUserInfo] = useState(false);
  const [checkingInfo, setCheckingInfo] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        if (!user || !user.uid) {
          setCheckingInfo(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));

        // More robust check for user info
        const userData = userDoc.data();
        const hasRequiredInfo =
          userData &&
          userData.age !== undefined &&
          userData.height !== undefined &&
          userData.weight !== undefined;

        setHasUserInfo(hasRequiredInfo);
        setCheckingInfo(false);
      } catch (error) {
        console.error("Error checking user info:", error);
        setError(error);
        setCheckingInfo(false);
      }
    };

    checkUserInfo();
  }, [user]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading user data. Please try again.</Text>
        <Button title="Retry" onPress={() => setCheckingInfo(true)} />
      </View>
    );
  }

  if (loading || checkingInfo) return <LoadingScreen />;

  // Chỉ trả về StackNavigator, truyền props
  return <StackNavigator user={user} hasUserInfo={hasUserInfo} />;
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
