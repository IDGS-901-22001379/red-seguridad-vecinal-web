// src/context/Amenidades/AmenidadesState.jsx
import { useReducer } from "react";
import AmenidadesContext from "./AmenidadesContext";
import AmenidadesReducer from "./AmenidadesReducer";
import { AMENIDADES_ACTIONS } from "./ActionsTypes";
import { AmenidadesAPI } from "../../services/amenidades.api";

const initialState = {
  amenidades: [],
  amenidadSeleccionada: null,
  tiposAmenidad: [],
  error: null,
};

export default function AmenidadesState({ children }) {
  const [state, dispatch] = useReducer(AmenidadesReducer, initialState);

  // ====== ACCIONES ======

  const listarAmenidades = async () => {
    try {
      const data = await AmenidadesAPI.getAll();
      dispatch({ type: AMENIDADES_ACTIONS.LISTAR, payload: data });
    } catch (error) {
      dispatch({
        type: AMENIDADES_ACTIONS.ERROR,
        payload: error.message || "Error al listar amenidades",
      });
    }
  };

  const obtenerAmenidad = async (id) => {
    try {
      const data = await AmenidadesAPI.getById(id);
      dispatch({ type: AMENIDADES_ACTIONS.OBTENER, payload: data });
    } catch (error) {
      dispatch({
        type: AMENIDADES_ACTIONS.ERROR,
        payload: error.message || "Error al obtener amenidad",
      });
    }
  };

  const registrarAmenidad = async (payload) => {
    try {
      const data = await AmenidadesAPI.create(payload);
      dispatch({ type: AMENIDADES_ACTIONS.REGISTRAR, payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: AMENIDADES_ACTIONS.ERROR,
        payload: error.message || "Error al registrar amenidad",
      });
      throw error;
    }
  };

  // Solo si tu backend tiene PUT /api/Amenidades/{id}
  const actualizarAmenidad = async (id, payload) => {
    try {
      const data = await AmenidadesAPI.update(id, payload);
      dispatch({ type: AMENIDADES_ACTIONS.ACTUALIZAR, payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: AMENIDADES_ACTIONS.ERROR,
        payload: error.message || "Error al actualizar amenidad",
      });
      throw error;
    }
  };

  const listarTiposAmenidad = async () => {
    try {
      const data = await AmenidadesAPI.getTiposAmenidad();
      dispatch({ type: AMENIDADES_ACTIONS.TIPOS_AMENIDAD, payload: data });
    } catch (error) {
      dispatch({
        type: AMENIDADES_ACTIONS.ERROR,
        payload: error.message || "Error al listar tipos de amenidad",
      });
    }
  };

  return (
    <AmenidadesContext.Provider
      value={{
        // state
        amenidades: state.amenidades,
        amenidadSeleccionada: state.amenidadSeleccionada,
        tiposAmenidad: state.tiposAmenidad,
        errorAmenidades: state.error,

        // actions
        listarAmenidades,
        obtenerAmenidad,
        registrarAmenidad,
        actualizarAmenidad,
        listarTiposAmenidad,
      }}
    >
      {children}
    </AmenidadesContext.Provider>
  );
}
