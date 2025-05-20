import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebaseConfig";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Welcome');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thông tin người dùng</Text>
      <Button
        title="Đăng xuất"
        onPress={handleSignOut}
        color="#E53935"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ProfileScreen;
