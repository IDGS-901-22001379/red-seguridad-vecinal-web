export const session = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("session")) || null;
    } catch {
      return null;
    }
  },
  set(data) {
    localStorage.setItem("session", JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem("session");
  },
};
