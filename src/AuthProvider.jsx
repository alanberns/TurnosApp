import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "./store/useAuthStore";
import { fetchUserRole } from "./utils/fetchUserRole";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid); // o "user" por defecto
        setUser(user, role);
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, []);

  return children;
}
