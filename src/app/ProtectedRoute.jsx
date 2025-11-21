// src/app/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { session as sessionUtil } from "../utils/session";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();

  let auth = null;

  // 1) Primero intentamos con el helper session.js
  if (sessionUtil?.getUser) {
    auth = sessionUtil.getUser();
  } else if (sessionUtil?.get) {
    auth = sessionUtil.get();
  }

  // 2) Fallback: leer directo del localStorage
  if (!auth) {
    try {
      const raw =
        localStorage.getItem("rsv_user") || // clave que usamos en session.js
        localStorage.getItem("session"); // por si antes usabas esta
      auth = raw ? JSON.parse(raw) : null;
    } catch {
      auth = null;
    }
  }

  // 3) Resolver userId desde distintos formatos
  const userId =
    auth?.userId ?? auth?.usuarioID ?? auth?.raw?.usuarioID ?? null;

  // Si NO hay sesión válida -> ir a login
  if (!userId) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname || "/admin/dashboard" }}
      />
    );
  }

  // 4) Validar roles si se pasaron (ej. roles={[2]} para solo admin)
  if (roles?.length && !roles.includes(auth.tipoUsuarioID)) {
    // Usuario logeado pero sin permiso -> mándalo al dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 5) Todo bien, mostrar el contenido protegido
  return children;
}
