import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Hoặc dùng icon từ thư viện khác
import { useNavigation } from "@react-navigation/native";

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#f89c1c" />
      </TouchableOpacity>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{recipe.name}</Text>

      {/* Nếu có thêm các field như mô tả, nguyên liệu, hướng dẫn thì thêm tại đây */}
      {recipe.description && (
        <Text style={styles.description}>{recipe.description}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "#f89c1c",
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    color: "#333",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 8,
  },
});

export default RecipeDetailScreen;
