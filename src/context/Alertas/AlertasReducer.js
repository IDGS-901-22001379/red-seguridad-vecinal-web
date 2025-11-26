// context/Alertas/AlertasReducer.js
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

export const AlertasReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_ALERTAS:
      return {
        ...state,
        alertas: payload,
        loading: false,
        error: null,
      };

    case GET_ALERTAS_USUARIO:
      return {
        ...state,
        alertasUsuario: payload,
        loading: false,
        error: null,
      };

    case GET_ALERTA_DETALLE:
      return {
        ...state,
        alertaDetalle: payload,
        loading: false,
        error: null,
      };

    case CREAR_ALERTA:
      return {
        ...state,
        alertas: [payload, ...state.alertas],
        loading: false,
        error: null,
      };

    case ATENDER_ALERTA:
      return {
        ...state,
        alertas: state.alertas.map(alerta =>
          alerta.alertaID === payload
            ? { ...alerta, activa: false, estatus: "Atendida" }
            : alerta
        ),
        alertaDetalle: state.alertaDetalle?.alertaID === payload 
          ? { ...state.alertaDetalle, activa: false, estatus: "Atendida" }
          : state.alertaDetalle,
        loading: false,
        error: null,
      };

    case SET_LOADING:
      return { ...state, loading: payload };

    case SET_ERROR:
      return { ...state, error: payload, loading: false };

    case CLEAR_ERROR:
      return { ...state, error: null };

    case SET_NOTIFICATION:
      return { ...state, notification: payload };

    case CLEAR_NOTIFICATION:
      return { ...state, notification: null };

    default:
      return state;
  }
};