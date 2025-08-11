import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "./store/useAuthStore";
import { fetchUserInfo } from "./db/user/fetchUserInfo";
import { fetchUserTurnos } from "./db/user/fetchUserTurnos";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const [info, turnos] = await Promise.all([
          fetchUserInfo(user.uid),
          fetchUserTurnos(user.uid),
        ]);

        setUser({
          user: user,
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
