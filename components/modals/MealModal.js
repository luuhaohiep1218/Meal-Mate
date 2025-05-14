import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const MealModal = ({
  visible,
  onClose,
  onAddFood,
  maxCalories,
  mealType,
  mealName,
}) => {
  const [mealItems, setMealItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchMealItems = async () => {
      try {
        setMealItems([]);
        setSelectedItems([]);
        setTotalCalories(0);

        // Truy vấn có điều kiện: chỉ lấy các recipe thuộc category tương ứng
        const q = query(
          collection(db, "recipes"),
          where("category", "==", mealType)
        );

        const querySnapshot = await getDocs(q);

        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        setMealItems(items);
      } catch (error) {
        console.error(`Error fetching recipes for ${mealType}:`, error);
      }
    };

    if (visible) {
      fetchMealItems();
    }
  }, [mealType, visible]);

  const handleSelectItem = (item) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );

    if (isSelected) {
      // Nếu đã chọn → bỏ chọn
      const updatedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );
      setSelectedItems(updatedItems);
      setTotalCalories(totalCalories - item.calories);
    } else {
      const newTotal = totalCalories + item.calories;

      if (newTotal > maxCalories) {
        Alert.alert(
          "Vượt quá lượng calo đề xuất",
          `${mealName} đề xuất tối đa ${maxCalories} kcal. Bạn đã chọn ${newTotal} kcal.`,
          [{ text: "OK" }]
        );
        return;
      }

      setSelectedItems([...selectedItems, item]);
      setTotalCalories(newTotal);
    }
  };

  const handleAddToMeal = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một món ăn");
      return;
    }
    onAddFood(selectedItems, totalCalories);
    onClose();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemCalories}>{item.calories} kcal</Text>
      {selectedItems.some((selected) => selected.id === item.id) && (
        <Ionicons name="checkmark" size={20} color="green" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{mealName}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Đã chọn: {selectedItems.length} món
              </Text>
              <Text style={styles.summaryText}>
                Tổng calo: {totalCalories}/{maxCalories} kcal
              </Text>
            </View>

            <FlatList
              data={mealItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Tắt scroll của FlatList vì đã có ScrollView bên ngoài
              contentContainerStyle={styles.listContainer}
            />
          </ScrollView>

          <TouchableOpacity style={styles.addButton} onPress={handleAddToMeal}>
            <Text style={styles.addButtonText}>
              Thêm vào {mealName.toLowerCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Thêm padding để tránh bị button che
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
  },
  itemCalories: {
    fontSize: 14,
    color: "#666",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    bottom: 30, // Tăng khoảng cách từ dưới lên
    left: 16,
    right: 16,
    backgroundColor: "#FFC107",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MealModal;
