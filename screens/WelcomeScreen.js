// WelcomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import AuthModal from "../components/modals/AuthModal";

export default function WelcomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")} // ảnh nền (nếu có), hoặc dùng màu nền
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo-mealmate.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.welcomeTitle}>
        Chào mừng bạn đến với{"\n"}Meal Mate!
      </Text>
      <Text style={styles.description}>
        Meal Mate giúp bạn khám phá các món ăn ngon và gợi ý thực đơn phù hợp
        với sở thích của bạn.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)} // Mở modal khi nhấn
        >
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>

      <AuthModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffef9",
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    alignItems: "center",
    alignSelf: "center",
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  welcomeTitle: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 35,
    marginTop: 130,
    color: "#000",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "400",
    marginHorizontal: 16,
    marginBottom: 40,
    color: "#333",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: "#f89c1c",
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
});
