import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "./store/useAuthStore";
import { fetchUserRole } from "./utils/fetchUserRole";
import { fetchUserInfo } from "./utils/fetchUserInfo";
import { fetchUserTurnos } from "./utils/fetchUserTurnos";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const [role, info, turnos] = await Promise.all([
          fetchUserRole(user.uid),
          fetchUserInfo(user.uid),
          fetchUserTurnos(user.uid),
        ]);

        setUser({
          user: user,
          role,
          info,
          turnos,
        });
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, []);

  return children;
}
