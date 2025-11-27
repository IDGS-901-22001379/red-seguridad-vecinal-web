// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "leaflet/dist/leaflet.css";
import "./styles/tailwind.css";
import { AuthProvider } from "./context/AuthContext";
import MapaState from "./context/Mapa/MapaState";
import PagosState from "./context/Pagos/PagosState";
import UsuariosState from "./context/Usuarios/UsuariosState";
import AvisosState from "./context/Avisos/AvisosState";
import PerfilState from "./context/Perfil/PerfilState";
import EstadisticasState from "./context/Estadisticas/EstadisticasState";
import AmenidadesState from "./context/Amenidades/AmenidadesState";
import ReservasState from "./context/Reservas/ReservasState";
import ServiciosState from "./context/Servicios/ServiciosState";
import ReportesState from "./context/Reportes/ReportesState";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UsuariosState>
        <PerfilState>
          <AvisosState>
            <PagosState>
              <ServiciosState>
                <MapaState>
                  <EstadisticasState>
                    <AmenidadesState>
                      <ReservasState>
                        <ReportesState>
                          <RouterProvider router={router} />
                        </ReportesState>
                      </ReservasState>
                    </AmenidadesState>
                  </EstadisticasState>
                </MapaState>
              </ServiciosState>
            </PagosState>
          </AvisosState>
        </PerfilState>
      </UsuariosState>
    </AuthProvider>
  </React.StrictMode>
);
