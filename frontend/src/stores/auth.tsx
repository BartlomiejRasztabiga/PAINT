import create from "zustand";
import { persist } from 'zustand/middleware'

type AuthStoreState = {
  token: string | null,
  currentUserId: string | null,
}

type AuthStoreActions = {
  setToken: (token: string) => void,
  setCurrentUserId: (userId: string) => void,
  logout: () => void,
  isLoggedIn: () => boolean,
}

const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  persist(
    (set, get) => ({
      token: "",
      currentUserId: null,
      setToken: (token: string) => set({ token }),
      setCurrentUserId: (userId: string) => set({ currentUserId: userId }),
      logout: () => set({ token: "", currentUserId: null }),
      isLoggedIn: () => get().token !== "" && get().currentUserId !== null,
    }),
    {
      name: "pis-auth",
      getStorage: () => localStorage,
      partialize: (state) => ({ token: state.token, currentUserId: state.currentUserId }),
    }
  )
);

export default useAuthStore;