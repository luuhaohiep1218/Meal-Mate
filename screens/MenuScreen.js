import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import CategoryList from "../components/CategoryList";
import { db } from "../firebaseConfig";

const MenuScreen = () => {
  const navigation = useNavigation();
  const [categorizedRecipes, setCategorizedRecipes] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(categorizedRecipes);

  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const grouped = {
        breakfast: data.filter((item) => item.category === "breakfast"),
        lunch: data.filter((item) => item.category === "lunch"),
        dinner: data.filter((item) => item.category === "dinner"),
      };

      setCategorizedRecipes(grouped);
      setFilteredRecipes(grouped); // Set filtered recipes initially to all recipes
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu món ăn:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filter recipes based on search query
    const filtered = {
      breakfast: categorizedRecipes.breakfast.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
      lunch: categorizedRecipes.lunch.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
      dinner: categorizedRecipes.dinner.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    };
    setFilteredRecipes(filtered);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Mealmate</Text>

        {/* Header with search and filter */}
        <View style={styles.headerOptions}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Gợi ý thực đơn */}
        <TouchableOpacity style={styles.suggestButton}>
          <Text style={styles.suggestButtonText}>✏️ Gợi ý thực đơn</Text>
        </TouchableOpacity>

        {/* Món nổi bật */}
        <View style={styles.featuredBox}>
          <Text style={styles.featuredTitle}>Nổi bật</Text>
          <Text style={styles.featuredList}>
            1. Cá kho riềng{"\n"}
            2. Thịt luộc kèm cà pháo{"\n"}
            3. Gà rang gừng{"\n"}
            4. Rau muống luộc{"\n"}
            5. Su hào xào thịt bò{"\n"}
            6. Chè đỗ đen
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#f89c1c" />
        ) : (
          <>
            {filteredRecipes.breakfast.length > 0 && (
              <CategoryList
                title="Món ăn sáng"
                data={filteredRecipes.breakfast}
                navigation={navigation}
              />
            )}
            {filteredRecipes.lunch.length > 0 && (
              <CategoryList
                title="Món ăn trưa"
                data={filteredRecipes.lunch}
                navigation={navigation}
              />
            )}
            {filteredRecipes.dinner.length > 0 && (
              <CategoryList
                title="Món ăn tối"
                data={filteredRecipes.dinner}
                navigation={navigation}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
    color: "#f89c1c",
  },
  headerOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: "#f89c1c",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  suggestButton: {
    backgroundColor: "#f89c1c",
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  suggestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  featuredBox: {
    backgroundColor: "#fff2d9",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  featuredList: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
});

export default MenuScreen;
