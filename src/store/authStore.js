import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,

  login: ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      if (existingUser.password === password) {
        localStorage.setItem("user", JSON.stringify({ username }));
        set({ user: { username } });
        return { success: true };
      } else {
        return { success: false, message: "Parol noto‘g‘ri" };
      }
    } else {
      // Yangi foydalanuvchi — ro‘yxatdan o‘tkazamiz
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify({ username }));
      set({ user: { username } });
      return { success: true };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useAuthStore;
