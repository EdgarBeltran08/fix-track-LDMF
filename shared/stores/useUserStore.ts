import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { auth, db } from "../services/firebase";

// Define la interfaz para el usuario
interface UserState {
  user: {
    id: string;
    displayName: string | null;
    role: string | null;
  } | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrateUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          set({ isAuthenticated: true });
        } catch (error: any) {
          console.error("Error al iniciar sesión:", error);
          throw error;
        }
      },

      signOut: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      },

      // Método para hidratar el estado del usuario desde Firebase.
      // Ahora maneja correctamente la obtención del rol y el estado de carga.
      hydrateUser: async (firebaseUser: User | null) => {
        if (firebaseUser) {
          try {
            // Obtenemos los custom claims para el rol
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let role = null;
          let displayNameFromDB = firebaseUser.displayName;
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || null;
            if(data.name){
              displayNameFromDB = data.name;
            }
          }
                console.log(`✅ Usuario autenticado: ${firebaseUser.email}`);
      console.log(`🔹 Rol detectado: ${role}`);
            set({
              user: {
                id: firebaseUser.uid,
                displayName: displayNameFromDB,
                role: role,
              },
              isAuthenticated: true,
            });
          } catch (error: any) {
            set({
              user: null,
              isAuthenticated: false,
            });
            console.error("Error en hydrateUser:", error);
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },

      // Método para limpiar el estado del usuario.
      // Este método se llamará automáticamente al cerrar la sesión.
      clearUser: () => {
        set({ user: null, isAuthenticated: false });
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
