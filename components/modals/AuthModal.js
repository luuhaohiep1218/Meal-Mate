import React, { useState } from "react";
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
  Alert,
  ScrollView,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const AuthModal = ({ visible, onClose }) => {
  const { promptAsync } = useAuth();
  const [screen, setScreen] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClose = () => {
    onClose();
    setScreen("login");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      handleClose();
    } catch (error) {
      Alert.alert("Đăng nhập thất bại", error.message);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      handleClose();
    } catch (error) {
      Alert.alert("Đăng ký thất bại", error.message);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.topHalf} />
          <View style={styles.bottomSheet}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.content}>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TextInput
                  placeholder="Mật khẩu"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />

                {screen === "register" && (
                  <TextInput
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                )}

                {screen === "login" && (
                  <>
                    <TouchableOpacity style={{ alignSelf: "flex-end" }}>
                      <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.loginButton}
                      onPress={handleLogin}
                    >
                      <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.googleButton}
                      onPress={() => promptAsync()}
                    >
                      <Text style={styles.googleButtonText}>
                        TIẾP TỤC VỚI GOOGLE
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                      <Text>Không có tài khoản? </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setScreen("register");
                          setEmail("");
                          setPassword("");
                        }}
                      >
                        <Text style={styles.registerText}>Tạo tài khoản</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {screen === "register" && (
                  <>
                    <TouchableOpacity
                      style={styles.loginButton}
                      onPress={handleRegister}
                    >
                      <Text style={styles.loginButtonText}>ĐĂNG KÝ</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                      <Text>Đã có tài khoản? </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setScreen("login");
                          setEmail("");
                          setPassword("");
                        }}
                      >
                        <Text style={styles.registerText}>Đăng nhập</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
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
    height: "60%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  content: {
    flexGrow: 1,
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

export default AuthModal;
