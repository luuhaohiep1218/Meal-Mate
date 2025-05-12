import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { db } from "../firebaseConfig"; // điều chỉnh đường dẫn nếu cần

const MenuScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu món ăn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Thực Đơn</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#f89c1c" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
    color: "#f89c1c",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  name: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MenuScreen;
