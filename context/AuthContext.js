import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../firebaseConfig";

// Hoàn tất session xác thực nếu đang chờ
WebBrowser.maybeCompleteAuthSession();

// Tạo context xác thực
const AuthContext = createContext();

// Thông tin clientId cho từng nền tảng
const googleClientIds = {
  expoClientId: "384508604797-55c7svjfqq9de2nlc3bnpbmguqbsn957.apps.googleusercontent.com",
  iosClientId: "384508604797-lk2sjv5kmtm5i2cujqkb11nojvgu2uke.apps.googleusercontent.com",
  androidClientId: "384508604797-um7ohonkodsvboiigfu0mpadosftuokh.apps.googleusercontent.com",
  redirectUri: "https://auth.expo.io/@hungnq18/Mealmate", // Phải khớp với Google Console

};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUserInfo, setHasUserInfo] = useState(null);
  const [checkingInfo, setCheckingInfo] = useState(true);
  const [error, setError] = useState(null);

  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    ...googleClientIds,
    redirectUri,
  });

  // Lưu hoặc xóa user vào AsyncStorage
  const handleUserStorage = async (firebaseUser) => {
    if (firebaseUser) {
      await AsyncStorage.setItem("@user", JSON.stringify(firebaseUser));
    } else {
      await AsyncStorage.removeItem("@user");
    }
  };

  // Kiểm tra user lưu trong bộ nhớ
  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUser(userData);
    } catch (err) {
      console.error("Error loading local user:", err);
      setError(err.message || "Failed to load local user data");
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra thông tin chi tiết của user trên Firestore
  const checkUserInfo = useCallback(async () => {
    try {
      setCheckingInfo(true);
      setError(null);

      if (!user?.uid) {
        setHasUserInfo(false);
        return;
      }

      const docSnap = await getDoc(doc(db, "users", user.uid));
      const data = docSnap.data();

      const hasAnswers = data?.height && data?.weight && data?.age;
      setHasUserInfo(!!hasAnswers);
    } catch (err) {
      console.error("Error checking user info:", err);
      setError(err.message || "Failed to load user data");
      setHasUserInfo(false);
    } finally {
      setCheckingInfo(false);
    }
  }, [user]);

  // Xử lý phản hồi sau khi người dùng đăng nhập Google
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) => {
        console.error("Error signing in with Google:", err);
        setError(err.message || "Google Sign-In failed");
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
      setUser(firebaseUser || null);
      await handleUserStorage(firebaseUser);

      if (!firebaseUser) {
        setHasUserInfo(false);
        setCheckingInfo(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Kiểm tra thông tin chi tiết khi có user
  useEffect(() => {
    if (user) checkUserInfo();
  }, [user, checkUserInfo]);

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

// Hook tiện lợi để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
