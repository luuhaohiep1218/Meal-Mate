import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import Prompt from "../shared/Prompt";
import { CalculateCaloriesAI } from "../services/AIModel";
import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const AddScreen = () => {
  const onContinue = async () => {
    const data = {
      weight: "65kg",
      height: "165cm",
      gender: "male",
      goal: "lose weight",
    };
    const PROMPT = JSON.stringify(data) + Prompt.CALORIES_PROMPT;
    console.log(PROMPT);
    const AIResult = await CalculateCaloriesAI(PROMPT);
    const AIResp = AIResult.choices[0].message.content;
    const JSONContent = JSON.parse(
      AIResp.replace("```json", "").replace("```", "")
    );
    console.log(JSONContent);
  };

  const importSampleData = async () => {
    const sampleRecipes = [
      {
        id: "xYz12AbC34DeF56Gh",
        calories: 420,
        category: "dinner",
        chefTips:
          "Để thịt bò mềm hơn, hãy ướp với nước ép dứa khoảng 20 phút trước khi nấu.",
        createdAt: "May 14, 2025 at 10:15:22 AM UTC+7",
        description:
          "Bò xào lúc lắc là món ăn ngon miệng với thịt bò mềm và rau củ giòn, giàu protein và vitamin.",
        image:
          "https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/bo-luc-lac-thumb-1.jpg",
        ingredients: [
          { quantity: "400g", name: "Thịt bò thăn" },
          { quantity: "1 quả", name: "Ớt chuông đỏ" },
          { quantity: "1 củ", name: "Hành tây" },
          { quantity: "2 muỗng canh", name: "Dầu hào" },
          { quantity: "1 muỗng cà phê", name: "Tiêu" },
          { quantity: "2 muỗng canh", name: "Dầu ăn" },
        ],
        name: "Bò lúc lắc",
        preparationTime: 30,
        rating: 4.7,
        servings: 3,
        steps: [
          "Thái thịt bò thành miếng vuông vừa ăn.",
          "Ướp thịt với dầu hào, tiêu trong 15 phút.",
          "Cắt ớt chuông và hành tây thành miếng vuông.",
          "Xào thịt bò với dầu nóng trong 2 phút rồi gắp ra.",
          "Xào rau củ đến khi vừa chín tới.",
          "Trộn thịt bò vào lại, đảo đều và tắt bếp.",
        ],
        tags: ["Giàu protein", "Bữa tối nhanh", "Dễ làm"],
        totalReviews: 15,
        updatedAt: "May 14, 2025 at 10:30:45 AM UTC+7",
      },

      {
        id: "qWeRtY78UiOp90AsD",
        calories: 180,
        category: "breakfast",
        chefTips: "Thêm một chút bột quế vào bột làm bánh để tăng hương vị.",
        createdAt: "May 14, 2025 at 8:20:10 AM UTC+7",
        description:
          "Bánh pancake yến mạch là lựa chọn lành mạnh cho bữa sáng, giàu chất xơ và dễ tiêu hóa.",
        image:
          "https://cdn.tgdd.vn/Files/2020/10/23/1301037/cach-lam-banh-yen-mach-chuoi-cho-bua-sang-dinh-duong-7.jpg",
        ingredients: [
          { quantity: "100g", name: "Yến mạch" },
          { quantity: "1 quả", name: "Chuối chín" },
          { quantity: "1 quả", name: "Trứng" },
          { quantity: "100ml", name: "Sữa tươi không đường" },
          { quantity: "1/2 muỗng cà phê", name: "Bột nở" },
        ],
        name: "Pancake yến mạch chuối",
        preparationTime: 20,
        rating: 4.4,
        servings: 2,
        steps: [
          "Xay nhuyễn yến mạch thành bột.",
          "Nghiền chuối, trộn với trứng và sữa.",
          "Trộn đều hỗn hợp khô và ướt.",
          "Đổ từng muỗng bột lên chảo nóng.",
          "Rán đến khi vàng đều hai mặt.",
        ],
        tags: ["Healthy", "Giàu chất xơ", "Bữa sáng dinh dưỡng"],
        totalReviews: 8,
        updatedAt: "May 14, 2025 at 8:35:00 AM UTC+7",
      },
      {
        id: "zXcVbNmKl09PoIuYt",
        calories: 350,
        category: "lunch",
        chefTips: "Dùng nước dùng gà tự nấu sẽ làm món phở ngon hơn nhiều.",
        createdAt: "May 13, 2025 at 11:45:33 AM UTC+7",
        description:
          "Phở gà truyền thống với nước dùng ngọt thanh, thịt gà mềm và bánh phở dai ngon.",
        image: "https://cdn.tgdd.vn/2021/03/content/1-800x450-28.jpg",
        ingredients: [
          { quantity: "200g", name: "Bánh phở tươi" },
          { quantity: "150g", name: "Thịt gà luộc" },
          { quantity: "1 lít", name: "Nước dùng gà" },
          { quantity: "1 củ", name: "Hành tím" },
          { quantity: "1 nhúm", name: "Hành lá" },
          { quantity: "1 nhúm", name: "Rau thơm" },
          { quantity: "1 quả", name: "Chanh" },
        ],
        name: "Phở gà Hà Nội",
        preparationTime: 40,
        rating: 4.9,
        servings: 1,
        steps: [
          "Đun nóng nước dùng gà.",
          "Chần bánh phở qua nước sôi.",
          "Xếp phở vào tô, thêm thịt gà xé.",
          "Rưới nước dùng nóng lên.",
          "Trang trí với hành lá, rau thơm và chanh.",
        ],
        tags: ["Truyền thống", "Comfort food", "Bữa trưa no bụng"],
        totalReviews: 32,
        updatedAt: "May 13, 2025 at 12:15:00 PM UTC+7",
      },
      {
        id: "vEgAnT0asT123XyZ",
        calories: 320,
        category: "dinner",
        chefTips:
          "Rang đậu hũ với lửa nhỏ để có lớp vỏ giòn mà bên trong vẫn mềm.",
        createdAt: "May 15, 2025 at 6:30:15 PM UTC+7",
        description:
          "Đậu hũ sốt teriyaki thực vật với vị ngọt hài hòa, giàu protein thực vật.",
        image:
          "https://cdn.tgdd.vn/Files/2022/05/10/1433947/cach-lam-dau-hu-sot-teriyaki-chay-ngon-nhu-ngoai-hang-202205101429102859.jpg",
        ingredients: [
          { quantity: "2 bìa", name: "Đậu hũ non" },
          { quantity: "3 muỗng canh", name: "Sốt teriyaki" },
          { quantity: "1 thìa cà phê", name: "Gừng băm" },
          { quantity: "1/2 củ", name: "Hành tây" },
          { quantity: "1 muỗng canh", name: "Dầu mè" },
        ],
        name: "Đậu hũ sốt teriyaki",
        preparationTime: 25,
        rating: 4.5,
        servings: 2,
        steps: [
          "Chiên vàng đậu hũ",
          "Xào hành tây, gừng",
          "Thêm sốt teriyaki",
          "Áo đậu hũ với sốt",
          "Rưới dầu mè trước khi dùng",
        ],
        tags: ["Chay", "High-protein", "Dinh dưỡng"],
        totalReviews: 18,
        updatedAt: "May 15, 2025 at 6:45:00 PM UTC+7",
      },
      {
        id: "k0rEaNBBQ2025",
        calories: 450,
        category: "lunch",
        chefTips: "Dùng bột ớt Hàn Quốc (Gochugaru) để có vị chuẩn nhất.",
        createdAt: "May 14, 2025 at 12:20:00 PM UTC+7",
        description:
          "Kimchi jjigae - món canh cay truyền thống Hàn Quốc với vị chua cay đặc trưng.",
        image:
          "https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/kimchi-jjigae-thumb-1.jpg",
        ingredients: [
          { quantity: "1 chén", name: "Kimchi" },
          { quantity: "200g", name: "Thịt ba chỉ" },
          { quantity: "1/2 bìa", name: "Đậu hũ" },
          { quantity: "1 thìa", name: "Tỏi băm" },
          { quantity: "2 thìa", name: "Bột ớt Hàn Quốc" },
        ],
        name: "Kimchi jjigae",
        preparationTime: 40,
        rating: 4.8,
        servings: 3,
        steps: [
          "Xào thịt và kimchi",
          "Thêm nước đun sôi",
          "Nêm gia vị Hàn Quốc",
          "Cho đậu hũ vào cuối cùng",
          "Ăn kèm cơm trắng",
        ],
        tags: ["Spicy", "Comfort food", "Fermented"],
        totalReviews: 27,
        updatedAt: "May 14, 2025 at 12:50:00 PM UTC+7",
      },
      {
        id: "dEsSeRtM0nD4y",
        calories: 280,
        category: "snack",
        chefTips:
          "Để lạnh ít nhất 4 tiếng trước khi dùng để có kết cấu hoàn hảo.",
        createdAt: "May 16, 2025 at 9:00:00 AM UTC+7",
        description:
          "Panna cotta dừa thơm ngậy với lớp sốt xoài chua ngọt cân bằng.",
        image:
          "https://cdn.tgdd.vn/Files/2020/07/18/1273747/cach-lam-panna-cotta-dua-voi-sot-xoai-mat-lanh-cho-ngay-he-8.jpg",
        ingredients: [
          { quantity: "200ml", name: "Kem tươi" },
          { quantity: "100ml", name: "Nước cốt dừa" },
          { quantity: "3 lá", name: "Gelatin" },
          { quantity: "1 quả", name: "Xoài chín" },
        ],
        name: "Panna cotta dừa sốt xoài",
        preparationTime: 20,
        rating: 4.9,
        servings: 4,
        steps: [
          "Ngâm gelatin",
          "Đun nóng kem và dừa",
          "Hòa gelatin",
          "Đổ khuôn để nguội",
          "Xay xoài làm sốt",
        ],
        tags: ["Dessert", "Vegetarian", "Summer"],
        totalReviews: 33,
        updatedAt: "May 16, 2025 at 9:30:00 AM UTC+7",
      },
      {
        id: "bReAkF4sTqUiCk",
        calories: 350,
        category: "breakfast",
        chefTips: "Dùng chảo chống dính tốt để trứng không bị dính khi lật.",
        createdAt: "May 17, 2025 at 7:15:00 AM UTC+7",
        description:
          "Trứng ốp la kiểu Pháp với bánh mì nướng giòn, bữa sáng đơn giản mà đủ chất.",
        image:
          "https://cdn.tgdd.vn/2021/05/CookRecipe/Avatar/trung-op-la-kiểu-phap-thumb-1.jpg",
        ingredients: [
          { quantity: "2 quả", name: "Trứng gà" },
          { quantity: "2 lát", name: "Bánh mì sandwich" },
          { quantity: "1 thìa", name: "Bơ lạt" },
          { quantity: "1 nhúm", name: "Muối tiêu" },
        ],
        name: "Trứng ốp la kiểu Pháp",
        preparationTime: 10,
        rating: 4.2,
        servings: 1,
        steps: [
          "Đun chảy bơ",
          "Đập trứng vào chảo",
          "Rưới trứng lên bánh mì",
          "Nêm muối tiêu",
        ],
        tags: ["Quick", "Easy", "Classic"],
        totalReviews: 42,
        updatedAt: "May 17, 2025 at 7:30:00 AM UTC+7",
      },
      {
        id: "iT4l1aNp4St4",
        calories: 520,
        category: "dinner",
        chefTips: "Dùng nước luộc mì pha loãng sốt để tạo độ sánh tự nhiên.",
        createdAt: "May 15, 2025 at 7:00:00 PM UTC+7",
        description:
          "Pasta carbonara chuẩn vị Ý với sốt trứng béo ngậy và thịt guanciale giòn tan.",
        image:
          "https://cdn.tgdd.vn/2022/03/CookRecipe/Avatar/pasta-carbonara-thumb-1.jpg",
        ingredients: [
          { quantity: "200g", name: "Spaghetti" },
          { quantity: "2 quả", name: "Lòng đỏ trứng" },
          { quantity: "50g", name: "Parmesan" },
          { quantity: "100g", name: "Thịt guanciale" },
          { quantity: "1 thìa", name: "Tiêu đen" },
        ],
        name: "Pasta carbonara",
        preparationTime: 30,
        rating: 4.7,
        servings: 2,
        steps: [
          "Luộc mì al dente",
          "Chiên giòn thịt",
          "Trộn trứng và phô mai",
          "Kết hợp tất cả",
          "Nêm tiêu đen",
        ],
        tags: ["Italian", "Creamy", "Comfort food"],
        totalReviews: 29,
        updatedAt: "May 15, 2025 at 7:45:00 PM UTC+7",
      },
      {
        id: "sM0oTh1eB0wl",
        calories: 380,
        category: "lunch",
        chefTips: "Thêm hạt chia để tăng cường omega-3 và chất xơ.",
        createdAt: "May 16, 2025 at 11:30:00 AM UTC+7",
        description:
          "Bowl ăn kiêng với gạo lứt, rau củ nướng và ức gà áp chảo, cân bằng dinh dưỡng.",
        image:
          "https://cdn.tgdd.vn/Files/2021/08/12/1375882/healthy-bowl-voi-ga-va-rau-cu-nuong-5.jpg",
        ingredients: [
          { quantity: "1 chén", name: "Gạo lứt" },
          { quantity: "150g", name: "Ức gà" },
          { quantity: "1/2 quả", name: "Bơ" },
          { quantity: "1 thìa", name: "Dầu ô liu" },
          { quantity: "1 nhúm", name: "Hạt chia" },
        ],
        name: "Healthy bowl gà bơ",
        preparationTime: 35,
        rating: 4.6,
        servings: 1,
        steps: [
          "Nấu gạo lứt",
          "Áp chảo ức gà",
          "Nướng rau củ",
          "Xếp bowl",
          "Rắc hạt chia",
        ],
        tags: ["Diet", "Balanced", "Meal prep"],
        totalReviews: 21,
        updatedAt: "May 16, 2025 at 12:00:00 PM UTC+7",
      },
      {
        id: "t4c0TuEsD4y",
        calories: 480,
        category: "dinner",
        chefTips: "Làm nóng vỏ bánh tortilla trước khi cuốn để không bị rách.",
        createdAt: "May 17, 2025 at 6:45:00 PM UTC+7",
        description:
          "Taco thịt bò xay với sốt guacamole tươi mát và phô mai béo ngậy.",
        image:
          "https://cdn.tgdd.vn/2021/04/CookRecipe/Avatar/taco-thit-bo-thumb-1.jpg",
        ingredients: [
          { quantity: "200g", name: "Thịt bò xay" },
          { quantity: "4 cái", name: "Vỏ bánh tortilla" },
          { quantity: "1 quả", name: "Bơ" },
          { quantity: "1/2 chén", name: "Phô mai Cheddar" },
          { quantity: "2 thìa", name: "Bột ớt Mexico" },
        ],
        name: "Taco thịt bò",
        preparationTime: 25,
        rating: 4.4,
        servings: 2,
        steps: [
          "Xào thịt với gia vị",
          "Nghiền bơ làm sốt",
          "Làm nóng vỏ bánh",
          "Xếp nhân vào bánh",
          "Rắc phô mai",
        ],
        tags: ["Mexican", "Spicy", "Party food"],
        totalReviews: 19,
        updatedAt: "May 17, 2025 at 7:15:00 PM UTC+7",
      },
      {
        id: "j4p4n3s3R1c3",
        calories: 400,
        category: "lunch",
        chefTips: "Dùng chảo đá để có lớp cơm cháy vàng giòn đúng điệu.",
        createdAt: "May 18, 2025 at 12:00:00 PM UTC+7",
        description:
          "Cơm nắm Onigiri truyền thống Nhật Bản với nhân cá hồi và rong biển.",
        image:
          "https://cdn.tgdd.vn/Files/2020/08/27/1289144/cach-lam-com-nam-onigiri-nhan-ca-hoi-7.jpg",
        ingredients: [
          { quantity: "2 chén", name: "Cơm Nhật" },
          { quantity: "50g", name: "Cá hồi muối" },
          { quantity: "2 lá", name: "Rong biển khô" },
          { quantity: "1 thìa", name: "Mè rang" },
        ],
        name: "Onigiri cá hồi",
        preparationTime: 20,
        rating: 4.3,
        servings: 3,
        steps: [
          "Trộn cơm với mè",
          "Cho nhân cá hồi",
          "Nắm thành hình tam giác",
          "Quấn rong biển",
        ],
        tags: ["Japanese", "Portable", "Rice"],
        totalReviews: 14,
        updatedAt: "May 18, 2025 at 12:30:00 PM UTC+7",
      },
      {
        id: "tH41T0mY4m",
        calories: 380,
        category: "dinner",
        chefTips: "Vắt thêm chanh tươi khi ăn để tăng độ chua hài hòa.",
        createdAt: "May 19, 2025 at 6:30:00 PM UTC+7",
        description:
          "Tom yum goong - canh chua cay Thái Lan với tôm tươi và nấm hương thơm lừng.",
        image:
          "https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/tom-yum-goong-thumb-1.jpg",
        ingredients: [
          { quantity: "300g", name: "Tôm sú" },
          { quantity: "5 cây", name: "Sả" },
          { quantity: "3 lá", name: "Chanh kaffir" },
          { quantity: "2 thìa", name: "Sốt tom yum" },
          { quantity: "1 thìa", name: "Ớt tươi" },
        ],
        name: "Tom yum goong",
        preparationTime: 30,
        rating: 4.8,
        servings: 3,
        steps: [
          "Nấu nước dùng sả",
          "Thêm gia vị Thái",
          "Cho tôm và nấm",
          "Nêm nếm vừa ăn",
          "Trang trí ngò gai",
        ],
        tags: ["Thai", "Spicy", "Sour"],
        totalReviews: 26,
        updatedAt: "May 19, 2025 at 7:00:00 PM UTC+7",
      },
      {
        id: "vN3s3Ph0",
        calories: 600,
        category: "lunch",
        chefTips: "Chần bánh phở qua nước nóng trước khi ăn để bánh mềm đều.",
        createdAt: "May 20, 2025 at 11:00:00 AM UTC+7",
        description:
          "Phở bò chín nạc gầu với nước dùng ngọt xương, thơm mùi quế và hồi đặc trưng.",
        image:
          "https://cdn.tgdd.vn/2020/12/CookRecipe/Avatar/pho-bo-thumb-1.jpg",
        ingredients: [
          { quantity: "300g", name: "Bánh phở tươi" },
          { quantity: "200g", name: "Thịt bò nạc gầu" },
          { quantity: "1 lít", name: "Nước dùng xương bò" },
          { quantity: "3 củ", name: "Hành tím" },
          { quantity: "1 gói", name: "Gia vị phở" },
          { quantity: "1 bó", name: "Hành ngò" },
        ],
        name: "Phở bò Hà Nội",
        preparationTime: 60,
        rating: 4.9,
        servings: 2,
        steps: [
          "Hầm nước dùng 4 tiếng",
          "Thái thịt mỏng",
          "Chần bánh phở",
          "Chan nước dùng nóng",
          "Trang trí hành ngò",
        ],
        tags: ["Vietnamese", "Traditional", "Noodle"],
        totalReviews: 48,
        updatedAt: "May 20, 2025 at 11:45:00 AM UTC+7",
      },
    ];

    try {
      for (const item of sampleRecipes) {
        await setDoc(doc(collection(db, "recipes"), item.id), item);
      }
      Alert.alert("Thành công", "Đã import dữ liệu mẫu vào Firestore!");
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert("Lỗi", "Không thể import dữ liệu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thêm bữa ăn</Text>
      <Button onPress={onContinue} title="Tính calo AI" />
      <View style={{ marginTop: 20 }} />
      <Button onPress={importSampleData} title="Import dữ liệu mẫu" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default AddScreen;
