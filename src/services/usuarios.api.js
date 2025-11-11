import { http } from "./http";

const base = "/Usuarios";
const EMAIL_ONLY = import.meta.env.VITE_AUTH_EMAIL_ONLY === "true";

export const UsuariosAPI = {
  // --- LOGIN normal (POST /login). Lo dejamos por si luego activas contraseña real
  login: ({ email, password }) =>
    http.post(`${base}/login`, { email, password }),

  // --- REGISTER / UPDATE / GETS tal cual
  register: (payload) => http.post(`${base}/register`, payload),
  update: (payload) => http.put(`${base}/update`, payload),
  list: () => http.get(base),
  getById: (id) => http.get(`${base}/${id}`),
  tipos: () => http.get(`${base}/tipos-usuario`),

  // --- NUEVO: findByEmail (lista -> match -> detalle)
  findByEmail: async (email) => {
    const all = await http.get(base); // [{ usuarioID, email, ... }]
    const hit = all.find(
      (u) => (u.email || "").toLowerCase() === (email || "").toLowerCase()
    );
    if (!hit) return null;
    const detail = await http.get(`${base}/${hit.usuarioID}`); // trae info completa
    return { listItem: hit, detail };
  },

  // --- NUEVO: login "inteligente" que usa findByEmail si EMAIL_ONLY=true
  loginSmart: async ({ email, password }) => {
    if (!EMAIL_ONLY) {
      // flujo normal contra /login
      const resp = await http.post(`${base}/login`, { email, password });
      return resp;
    }
    // flujo solo-email
    const found = await UsuariosAPI.findByEmail(email);
    if (!found) throw new Error("Correo no registrado.");
    return found.detail; // para el front es transparente
  },
};
