import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const QuestionFlow = ({ onComplete }) => {
  const questions = [
    {
      id: "job",
      type: "multiple-choice",
      title: "Hiện tại bạn đang làm công việc gì?",
      options: [
        "Sinh viên",
        "Nhân viên văn phòng",
        "Freelancer",
        "Nội trợ",
        "Khác",
      ],
    },
    {
      id: "gender",
      type: "picker",
      title: "Giới tính của bạn?",
      options: ["Nam", "Nữ", "Khác"],
    },
    {
      id: "dob",
      type: "date",
      title: "Ngày sinh của bạn là gì?",
      placeholder: "Chọn ngày sinh",
    },
    {
      id: "height",
      type: "numeric-input",
      title: "Chiều cao của bạn là bao nhiêu? (cm)",
      placeholder: "Nhập chiều cao",
      min: 100,
      max: 250,
    },
    {
      id: "weight",
      type: "numeric-input",
      title: "Cân nặng hiện tại của bạn là bao nhiêu? (kg)",
      placeholder: "Nhập cân nặng",
      min: 30,
      max: 200,
    },
    {
      id: "goal",
      type: "multiple-choice",
      title: "Mục tiêu ăn uống của bạn là gì?",
      options: [
        "Giảm cân",
        "Tăng cân",
        "Duy trì cân nặng",
        "Tăng cơ bắp",
        "Cải thiện sức khỏe",
      ],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef();

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleAnswer(formattedDate);
      goToNextQuestion();
    }
  };

  const handleNumericInputSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      Alert.alert("Lỗi", "Vui lòng nhập số hợp lệ");
      return;
    }

    if (currentQuestion.min && numValue < currentQuestion.min) {
      Alert.alert("Lỗi", `Giá trị không được nhỏ hơn ${currentQuestion.min}`);
      return;
    }

    if (currentQuestion.max && numValue > currentQuestion.max) {
      Alert.alert("Lỗi", `Giá trị không được lớn hơn ${currentQuestion.max}`);
      return;
    }

    handleAnswer(numValue);
    setInputValue("");
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      onComplete(answers);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const isAnswerSelected = () => {
    if (currentQuestion.type === "picker") return true; // Picker luôn có giá trị mặc định
    return answers[currentQuestion.id] !== undefined;
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[currentQuestion.id] === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  handleAnswer(option);
                  setTimeout(goToNextQuestion, 300); // Tự động chuyển sau khi chọn
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "picker":
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={
                answers[currentQuestion.id] || currentQuestion.options[0]
              }
              onValueChange={(itemValue) => handleAnswer(itemValue)}
              style={styles.picker}
            >
              {currentQuestion.options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );

      case "date":
        return (
          <View style={styles.dateInputContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={
                  answers[currentQuestion.id]
                    ? styles.dateText
                    : styles.placeholderText
                }
              >
                {answers[currentQuestion.id] || currentQuestion.placeholder}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        );

      case "numeric-input":
        return (
          <View style={styles.numericInputContainer}>
            <TextInput
              style={styles.numericInput}
              keyboardType="numeric"
              placeholder={currentQuestion.placeholder}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleNumericInputSubmit}
            />
            <TouchableOpacity
              style={styles.inputSubmitButton}
              onPress={handleNumericInputSubmit}
            >
              <Text style={styles.inputSubmitText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Câu {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          {renderQuestionInput()}
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={goToPreviousQuestion}
          >
            <Text style={styles.navButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        {currentQuestion.type !== "numeric-input" && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={goToNextQuestion}
            disabled={!isAnswerSelected()}
          >
            <Text style={styles.navButtonText}>
              {currentQuestionIndex === questions.length - 1
                ? "Hoàn thành"
                : "Tiếp tục"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.footerText}>
        Chúng tôi sử dụng thông tin này để tính toán và cung cấp cho bạn các
        khuyến nghị được cá nhân hóa hàng ngày
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFC107",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
  questionContainer: {
    flex: 1,
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  optionsContainer: {
    marginHorizontal: 10,
  },
  optionButton: {
    backgroundColor: "#f8f8f8",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  dateInputContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
  numericInputContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  numericInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  inputSubmitButton: {
    backgroundColor: "#FFC107",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  inputSubmitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#e0e0e0",
  },
  nextButton: {
    backgroundColor: "#FFC107",
    marginLeft: "auto",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  footerText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});

export default QuestionFlow;
