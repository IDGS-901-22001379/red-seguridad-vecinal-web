// context/Alertas/AlertasState.jsx
import React, { useReducer } from "react";
import AlertasContext from "./AlertasContext";
import {
  GET_ALERTAS,
  GET_ALERTAS_USUARIO,
  GET_ALERTA_DETALLE,
  CREAR_ALERTA,
  ATENDER_ALERTA,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  SET_NOTIFICATION,
  CLEAR_NOTIFICATION,
} from "./ActionTypes";
import { AlertasReducer } from "./AlertasReducer";
import axios from "axios";

const initialState = {
  alertas: [],
  alertasUsuario: [],
  alertaDetalle: null,
  loading: false,
  error: null,
  notification: null,
};

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5165/api";

const AlertasState = (props) => {
  const [state, dispatch] = useReducer(AlertasReducer, initialState);

  const setLoading = (value) => dispatch({ type: SET_LOADING, payload: value });
  const setError = (error) => dispatch({ type: SET_ERROR, payload: error });
  const clearError = () => dispatch({ type: CLEAR_ERROR });
  const setNotification = (notification) => dispatch({ type: SET_NOTIFICATION, payload: notification });
  const clearNotification = () => dispatch({ type: CLEAR_NOTIFICATION });

  const getAlertas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/Alertas`);
      
      dispatch({
        type: GET_ALERTAS,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      console.error("Error al obtener alertas:", error);
      setError("No se pudieron cargar las alertas.");
      return [];
    }
  };

  const getAlertasByUsuario = async (usuarioId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/Alertas/usuario/${usuarioId}`);
      
      dispatch({
        type: GET_ALERTAS_USUARIO,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      console.error("Error al obtener alertas del usuario:", error);
      setError("No se pudieron cargar las alertas del usuario.");
      return [];
    }
  };

  const getAlertaDetalle = async (alertaId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/Alertas/${alertaId}`);
      
      dispatch({
        type: GET_ALERTA_DETALLE,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      console.error("Error al obtener detalle de alerta:", error);
      setError("No se pudo cargar el detalle de la alerta.");
      return null;
    }
  };

  const crearAlerta = async (alertaData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/Alertas`, alertaData);
      
      dispatch({
        type: CREAR_ALERTA,
        payload: res.data,
      });

      setNotification({
        type: "success",
        message: "Alerta creada exitosamente",
      });

      return res.data;
    } catch (error) {
      console.error("Error al crear alerta:", error);
      setError("No se pudo crear la alerta.");
      return null;
    }
  };

  const atenderAlerta = async (alertaId) => {
    try {
      setLoading(true);
      await axios.put(`${API}/Alertas/${alertaId}/estado`, { activa: false });
      
      dispatch({
        type: ATENDER_ALERTA,
        payload: alertaId,
      });

      setNotification({
        type: "success",
        message: `Alerta #${alertaId} marcada como atendida`,
      });

      return true;
    } catch (error) {
      console.error("Error al atender alerta:", error);
      setError("No se pudo atender la alerta.");
      return false;
    }
  };

  const isAlertaActiva = (alerta) => {
    return alerta?.activa === true || alerta?.activa === 1 || alerta?.estatus === "Activa";
  };

  return (
    <AlertasContext.Provider
      value={{
        alertas: state.alertas,
        alertasUsuario: state.alertasUsuario,
        alertaDetalle: state.alertaDetalle,
        loading: state.loading,
        error: state.error,
        notification: state.notification,

        getAlertas,
        getAlertasByUsuario,
        getAlertaDetalle,
        crearAlerta,
        atenderAlerta,
        isAlertaActiva,
        setError,
        clearError,
        setNotification,
        clearNotification,
      }}
    >
      {props.children}
    </AlertasContext.Provider>
  );
};

export default AlertasState;