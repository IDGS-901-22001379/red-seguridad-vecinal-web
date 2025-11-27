// src/context/Reservas/ReservasState.jsx
import { useReducer } from "react";
import ReservasContext from "./ReservasContext";
import ReservasReducer, { reservasInitialState } from "./ReservasReducer";
import {
  RESERVAS_SET_LOADING,
  RESERVAS_SET_ERROR,
  RESERVAS_SET_LIST,
  RESERVAS_SET_USUARIO_LIST,
  RESERVAS_ADD,
  RESERVAS_UPDATE,
  RESERVAS_SET_SELECTED,
} from "./ActionsTypes";
import ReservasAPI from "../../services/reservas.api";

const ReservasState = ({ children }) => {
  const [state, dispatch] = useReducer(ReservasReducer, reservasInitialState);

  // ========================
  // helpers
  // ========================
  const setLoading = (value) =>
    dispatch({ type: RESERVAS_SET_LOADING, payload: value });

  const setError = (err) =>
    dispatch({
      type: RESERVAS_SET_ERROR,
      payload: err?.message || "Ocurrió un error al cargar reservas",
    });

  // ========================
  // acciones
  // ========================

  // Admin: obtener todas las reservas
  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await ReservasAPI.getAll();
      dispatch({ type: RESERVAS_SET_LIST, payload: data || [] });
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Usuario: obtener reservas de un usuario
  const fetchByUsuario = async (usuarioId) => {
    if (!usuarioId) return;
    try {
      setLoading(true);
      const data = await ReservasAPI.getByUsuario(usuarioId);
      dispatch({ type: RESERVAS_SET_USUARIO_LIST, payload: data || [] });
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva reserva
  const createReserva = async (payload) => {
    try {
      setLoading(true);
      const nueva = await ReservasAPI.create(payload);
      dispatch({ type: RESERVAS_ADD, payload: nueva });
      return nueva;
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (id) => {
    try {
      setLoading(true);
      const actualizada = await ReservasAPI.cancelar(id);
      dispatch({ type: RESERVAS_UPDATE, payload: actualizada });
      return actualizada;
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado (aprobada, rechazado, etc.)
  const cambiarEstadoReserva = async (id, estado) => {
    try {
      setLoading(true);
      const actualizada = await ReservasAPI.actualizarEstado(id, estado);
      dispatch({ type: RESERVAS_UPDATE, payload: actualizada });
      return actualizada;
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const seleccionarReserva = (reserva) => {
    dispatch({ type: RESERVAS_SET_SELECTED, payload: reserva });
  };

  // ========================
  // provider
  // ========================
  return (
    <ReservasContext.Provider
      value={{
        ...state,
        fetchAll,
        fetchByUsuario,
        createReserva,
        cancelarReserva,
        cambiarEstadoReserva,
        seleccionarReserva,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
};

export default ReservasState;
