import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thông tin người dùng</Text>
      <Button
        title="Đăng xuất"
        onPress={async () => await signOut(auth)}
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
