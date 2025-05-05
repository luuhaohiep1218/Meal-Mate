import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const ModalLogin = ({ visible, onClose }) => {
  const { promptAsync } = useAuth();
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          {/* Đây là vùng chiếm nửa trên màn hình – để đóng modal */}
          <View style={styles.topHalf} />

          {/* Đây là vùng modal nửa dưới */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.bottomSheet}
            >
              <View style={styles.content}>
                {/* Email */}
                <TextInput placeholder="Email" style={styles.input} />

                {/* Password */}
                <TextInput
                  placeholder="Mật khẩu"
                  secureTextEntry
                  style={styles.input}
                />

                {/* Quên mật khẩu */}
                <TouchableOpacity style={{ alignSelf: "flex-end" }}>
                  <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                {/* Đăng nhập */}
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>

                {/* Google login */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={() => promptAsync()}
                >
                  <Text style={styles.googleButtonText}>
                    TIẾP TỤC VỚI GOOGLE
                  </Text>
                </TouchableOpacity>

                {/* Tạo tài khoản */}
                <View style={styles.footer}>
                  <Text>Không có tài khoản? </Text>
                  <TouchableOpacity>
                    <Text style={styles.registerText}>Tạo tài khoản</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topHalf: {
    flex: 1,
  },
  bottomSheet: {
    height: "50%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  forgotText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#f89c1c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#f89c1c",
    fontWeight: "bold",
  },
});

export default ModalLogin;
