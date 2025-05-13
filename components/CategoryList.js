import React from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import icon

const CategoryList = ({ title, data, navigation }) => (
  <View style={styles.categoryContainer}>
    <Text style={styles.categoryTitle}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity style={styles.likeButton}>
            <Icon name="heart" size={24} color="#ff0000" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
    color: "#333",
  },
  card: {
    width: 140,
    marginHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  name: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  likeButton: {
    marginTop: 8,
    padding: 5,
  },
});

export default CategoryList;
