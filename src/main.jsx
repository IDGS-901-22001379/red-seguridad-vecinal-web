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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UsuariosState>
        <PerfilState>
          <AvisosState>
            <PagosState>
              <MapaState>
                <EstadisticasState>
                  <RouterProvider router={router} />
                </EstadisticasState>
              </MapaState>
            </PagosState>
          </AvisosState>
        </PerfilState>
      </UsuariosState>
    </AuthProvider>
  </React.StrictMode>
);
