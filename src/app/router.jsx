// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";
import Avisos from "../pages/avisos/Avisos";
import Reportes from "../pages/reportes/Reportes";
import ReporteDetail from "../pages/reportes/ReporteDetail";

// Si ya tienes alertas, déjalas; si no, quita estos imports y rutas:
import AdminAlertasPage from "../pages/alertas/AdminAlertasPage";
import AdminAlertaDetalle from "../pages/alertas/AdminAlertaDetalle";

import NotFound from "../pages/misc/NotFound";

export const router = createBrowserRouter([
  // Público
  { path: "/auth/login", element: <Login /> },

  // Área protegida (admin)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Redirecciones base
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "admin", element: <Navigate to="/admin/dashboard" replace /> },

      // Módulos
      { path: "admin/dashboard", element: <Dashboard /> },

      // Avisos
      { path: "admin/avisos", element: <Avisos /> },

      // Reportes (lista + detalle)
      { path: "admin/reportes", element: <Reportes /> },
      { path: "admin/reportes/:id", element: <ReporteDetail /> },

      // Alertas (opcional)
      { path: "admin/alertas", element: <AdminAlertasPage /> },
      { path: "admin/alertas/:id", element: <AdminAlertaDetalle /> },

      // 404 interno
      { path: "*", element: <NotFound /> },
    ],
  },

  // 404 global
  { path: "*", element: <NotFound /> },
]);

export default router;
