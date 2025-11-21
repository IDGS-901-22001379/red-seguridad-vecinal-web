// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UsuariosAPI } from "../../services/usuarios.api";
import { session } from "../../utils/session";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Intenta parsear texto a JSON si es string
  const safeJson = (x) => {
    if (x == null) return x;
    if (typeof x === "string") {
      const t = x.trim();
      if (!t) return x;
      if (t.startsWith("{") || t.startsWith("[")) {
        try {
          return JSON.parse(t);
        } catch {
          /* ignore */
        }
      }
    }
    return x;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1) Trae usuarios y normaliza a arreglo (soporta texto o {data:[]})
      let listResp = await UsuariosAPI.list();
      listResp = safeJson(listResp);

      const list = Array.isArray(listResp)
        ? listResp
        : Array.isArray(listResp?.data)
        ? listResp.data
        : [];

      if (!Array.isArray(list) || list.length === 0) {
        throw new Error("Correo no registrado.");
      }

      // 2) Busca por email (case-insensitive + trim)
      const inputEmail = (form.email || "").trim().toLowerCase();
      const hit = list.find(
        (u) => (u.email || "").trim().toLowerCase() === inputEmail
      );
      if (!hit) throw new Error("Correo no registrado.");

      // 3) Trae detalle por id (también robusto a texto)
      let detail = await UsuariosAPI.getById(hit.usuarioID);
      detail = safeJson(detail);

      // 4) Normaliza el rol (acepta ID o texto "Administrador/Residente/Seguridad")
      const textToId = (t) => {
        const s = (t || "").toString().toLowerCase();
        if (s.startsWith("admin")) return 2;
        if (s.startsWith("resid")) return 3;
        if (s.startsWith("segur")) return 4;
        return null;
      };

      const tipoUsuarioID =
        detail?.tipoUsuarioID ??
        detail?.tipoUsuario?.tipoUsuarioID ??
        textToId(detail?.tipoUsuario) ??
        textToId(hit?.tipoUsuario) ??
        null;

      // 5) Guarda sesión y redirige
      const s = {
        raw: detail,
        userId: detail?.usuarioID ?? hit?.usuarioID,
        tipoUsuarioID,
        nombre: detail?.nombre ?? hit?.nombre ?? inputEmail,
        token: "dummy-token", // algo truthy por si ProtectedRoute revisa token
      };

      if (!s.userId) throw new Error("No se pudo validar la sesión.");

      // usa la API de session
      if (typeof session.setUser === "function") {
        session.setUser(s);
      } else if (typeof session.set === "function") {
        session.set(s);
      }

      const from = location.state?.from || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center font-inter text-ink">
      <div className="card w-[360px] sm:w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-emerald-200 overflow-hidden grid place-items-center bg-white">
            <img
              src="/logo/imagen_2025-10-26_192500425-removebg-preview-removebg-preview.png"
              alt="Red de Seguridad Vecinal"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <p className="mt-2 text-emerald-700 font-semibold text-sm">
            Red de Seguridad Vecinal
          </p>
        </div>

        <h1 className="text-[35px] leading-none font-extrabold text-center mb-4">
          Inicia sesión
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="usuario" className="block mb-1 font-medium">
              Usuario
            </label>
            {/* mostramos "Usuario" pero enviamos email */}
            <input
              id="usuario"
              name="usuario"
              type="email"
              placeholder="Ingrese su usuario"
              className="input"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Puedes escribir cualquiera por ahora"
              className="input"
              autoComplete="current-password"
              required={false}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-slate-500 mt-1">
              * Temporal: solo validamos el correo; la contraseña no se
              verifica.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>

        <div className="mt-5 text-sm text-center">
          <span className="text-slate-700">¿Necesitas ayuda?</span>{" "}
          <a href="#" className="help-link">
            Soporte técnico
          </a>
        </div>
      </div>
    </div>
  );
}
