import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { auth } from "../services/firebase";

// Define la interfaz para el usuario
interface UserState {
  user: {
    id: string;
    displayName: string | null;
    role: string | null;
  } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrateUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      signIn: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          console.error("Error al iniciar sesión:", error);
          throw error;
        }
      },

      signOut: async () => {
        await signOut(auth);
        set({ user: null });
      },

      // Método para hidratar el estado del usuario desde Firebase.
      // Ahora maneja correctamente la obtención del rol y el estado de carga.
      hydrateUser: async (firebaseUser: User | null) => {
        if (firebaseUser) {
          try {
            // Obtenemos los custom claims para el rol
            const idTokenResult = await firebaseUser.getIdTokenResult();
            const role = (idTokenResult.claims.role as string) || null;

            set({
              user: {
                id: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                role: role,
              },
            });
          } catch (error: any) {
            set({
              user: null,
            });
            console.error("Error en hydrateUser:", error);
          }
        } else {
          set({ user: null });
        }
      },

      // Método para limpiar el estado del usuario.
      // Este método se llamará automáticamente al cerrar la sesión.
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: "user-storage", // Nombre del almacenamiento
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistimos el objeto de usuario y limpiamos el almacenamiento
      // cuando el usuario es nulo para un manejo más limpio del estado de sesión.
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (!state?.user) {
          state?.clearUser();
        }
      },
    }
  )
);

// Suscribirse a los cambios de autenticación
// Esto asegura que nuestra store esté siempre sincronizada con el estado de Firebase.
onAuthStateChanged(auth, async (firebaseUser) => {
  useUserStore.getState().hydrateUser(firebaseUser);
});
