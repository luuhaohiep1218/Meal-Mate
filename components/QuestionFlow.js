import React, { useState, useRef, useEffect, useCallback } from "react";
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
import DatePicker from "react-native-date-picker";

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
      type: "multiple-choice",
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

  // Debug mount/unmount
  useEffect(() => {
    console.log(
      "QuestionFlow mounted, currentQuestionIndex:",
      currentQuestionIndex
    );
    return () => console.log("QuestionFlow unmounted");
  }, []);

  // Debug trạng thái định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("QuestionFlow state:", {
        currentQuestionIndex,
        answers,
        showDatePicker,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, answers, showDatePicker]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = useCallback(
    (value) => {
      console.log(`Answer for ${currentQuestion.id}:`, value);
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    },
    [currentQuestion.id]
  );

  const handleDateChange = useCallback(
    (selectedDate) => {
      console.log("Date picker selected:", selectedDate);
      setShowDatePicker(false);

      if (selectedDate) {
        try {
          const formattedDate = selectedDate.toISOString().split("T")[0];
          console.log("Selected date formatted:", formattedDate);
          handleAnswer(formattedDate);
          goToNextQuestion();
        } catch (error) {
          console.error("Error formatting date:", error);
          Alert.alert("Lỗi", "Không thể xử lý ngày đã chọn. Vui lòng thử lại.");
        }
      } else {
        console.log("No date selected");
      }
    },
    [handleAnswer]
  );

  const handleCancelDatePicker = useCallback(() => {
    console.log("Date picker cancelled");
    setShowDatePicker(false);
  }, []);

  const handleNumericInputSubmit = useCallback(() => {
    console.log("Numeric input submit:", inputValue);
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      Alert.alert("Lỗi", "Vui lòng nhập một số hợp lệ (ví dụ: 170)");
      return;
    }

    if (currentQuestion.min && numValue < currentQuestion.min) {
      Alert.alert(
        "Lỗi",
        `Giá trị phải lớn hơn hoặc bằng ${currentQuestion.min} ${
          currentQuestion.id === "height" ? "cm" : "kg"
        }`
      );
      return;
    }

    if (currentQuestion.max && numValue > currentQuestion.max) {
      Alert.alert(
        "Lỗi",
        `Giá trị phải nhỏ hơn hoặc bằng ${currentQuestion.max} ${
          currentQuestion.id === "height" ? "cm" : "kg"
        }`
      );
      return;
    }

    handleAnswer(numValue);
    setInputValue("");
    goToNextQuestion();
  }, [
    inputValue,
    currentQuestion.id,
    currentQuestion.min,
    currentQuestion.max,
    handleAnswer,
  ]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      console.log("Moving to next question:", currentQuestionIndex + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      console.log("Calling onComplete with answers:", answers);
      onComplete(answers);
    }
  }, [currentQuestionIndex, answers, onComplete]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      console.log("Moving to previous question:", currentQuestionIndex - 1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [currentQuestionIndex]);

  const isAnswerSelected = useCallback(() => {
    const selected = answers[currentQuestion.id] !== undefined;
    console.log(`Is answer selected for ${currentQuestion.id}:`, selected);
    return selected;
  }, [answers, currentQuestion.id]);

  const toggleDatePicker = useCallback(() => {
    console.log(
      "Toggling date picker, current showDatePicker:",
      showDatePicker
    );
    setShowDatePicker((prev) => !prev);
  }, [showDatePicker]);

  const isValidDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  };

  const renderQuestionInput = () => {
    console.log("Rendering question input for type:", currentQuestion.type);
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
                onPress={() => handleAnswer(option)}
                accessible={true}
                accessibilityLabel={option}
                accessibilityRole="button"
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "date":
        return (
          <View style={styles.dateInputContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={toggleDatePicker}
              accessible={true}
              accessibilityLabel="Chọn ngày sinh"
              accessibilityRole="button"
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
              <View style={styles.datePickerContainer}>
                <DatePicker
                  date={
                    answers[currentQuestion.id] &&
                    isValidDate(answers[currentQuestion.id])
                      ? new Date(answers[currentQuestion.id])
                      : new Date(
                          new Date().setFullYear(new Date().getFullYear() - 18)
                        )
                  }
                  onDateChange={handleDateChange}
                  mode="date"
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  androidVariant="nativeAndroid"
                  iosMode="spinner"
                  style={styles.datePicker}
                  accessible={true}
                  accessibilityLabel="Chọn ngày tháng năm sinh"
                  textColor="#333"
                  fadeToColor="white"
                />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelDatePicker}
                  accessible={true}
                  accessibilityLabel="Hủy chọn ngày"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
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
              accessible={true}
              accessibilityLabel={currentQuestion.title}
              accessibilityRole="textbox"
            />
            <TouchableOpacity
              style={styles.inputSubmitButton}
              onPress={handleNumericInputSubmit}
              accessible={true}
              accessibilityLabel="Xác nhận giá trị nhập"
              accessibilityRole="button"
            >
              <Text style={styles.inputSubmitText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        console.log("Unknown question type:", currentQuestion.type);
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
          <Text
            style={styles.questionTitle}
            accessible={true}
            accessibilityRole="header"
          >
            {currentQuestion.title}
          </Text>
          {renderQuestionInput()}
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={goToPreviousQuestion}
            accessible={true}
            accessibilityLabel="Quay lại câu hỏi trước"
            accessibilityRole="button"
          >
            <Text style={styles.navButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !isAnswerSelected() && styles.disabledButton,
          ]}
          onPress={goToNextQuestion}
          disabled={!isAnswerSelected()}
          accessible={true}
          accessibilityLabel={
            currentQuestionIndex === questions.length - 1
              ? "Hoàn thành khảo sát"
              : "Tiếp tục đến câu hỏi tiếp theo"
          }
          accessibilityRole="button"
        >
          <Text style={styles.navButtonText}>
            {currentQuestionIndex === questions.length - 1
              ? "Hoàn thành"
              : "Tiếp tục"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={styles.footerText}
        accessible={true}
        accessibilityRole="text"
      >
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
  datePickerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  datePicker: {
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
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
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
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
