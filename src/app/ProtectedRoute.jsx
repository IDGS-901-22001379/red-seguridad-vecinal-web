// src/app/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("session")) || null;
  } catch {
    session = null; // fallback si el JSON está corrupto
  }

  const location = useLocation();

  if (!session?.userId) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
    );
  }

  if (roles?.length && !roles.includes(session.tipoUsuarioID)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
