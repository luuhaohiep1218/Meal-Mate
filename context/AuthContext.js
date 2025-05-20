import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Khởi tạo là true để chờ kiểm tra user
  const [hasUserInfo, setHasUserInfo] = useState(null);
  const [checkingInfo, setCheckingInfo] = useState(true);
  const [error, setError] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "384508604797-lk2sjv5kmtm5i2cujqkb11nojvgu2uke.apps.googleusercontent.com",
    androidClientId:
      "384508604797-2pvba89k1hp5c4iopi00hka14nb45rgs.apps.googleusercontent.com",
  });

  // Hàm kiểm tra thông tin người dùng trong Firestore
  const checkUserInfo = useCallback(async () => {
    try {
      setCheckingInfo(true);
      setError(null);

      if (!user || !user.uid) {
        setHasUserInfo(false);
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        const hasAnswers = data?.height && data?.weight && data?.age;

        setHasUserInfo(!!hasAnswers);
      } else {
        setHasUserInfo(false);
      }
    } catch (error) {
      console.error("Error checking user info:", error);
      setError(error.message || "Failed to load user data");
      setHasUserInfo(false);
    } finally {
      setCheckingInfo(false);
    }
  }, [user]);

  // Kiểm tra user từ AsyncStorage
  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null; // Sửa lỗi: JSON.stringify -> JSON.parse
      setUser(userData);
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
      setError(error.message || "Failed to load local user data");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý phản hồi từ Google Sign-In
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.error("Error signing in with Google:", error);
        setError(error.message || "Google Sign-In failed");
      });
    } else if (response?.type === "error") {
      console.error("Google Sign-In error:", response);
      setError("Google Sign-In failed");
    }
  }, [response]);

  // Theo dõi trạng thái đăng nhập Firebase
  useEffect(() => {
    checkLocalUser();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem("@user", JSON.stringify(firebaseUser));
        // Kiểm tra thông tin người dùng ngay sau khi đăng nhập
        checkUserInfo();
      } else {
        setUser(null);
        setHasUserInfo(false);
        setCheckingInfo(false);
        await AsyncStorage.removeItem("@user");
      }
    });

    return () => unsubscribe();
  }, [checkUserInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        promptAsync,
        loading,
        hasUserInfo,
        setHasUserInfo,
        checkingInfo,
        error,
        checkUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
