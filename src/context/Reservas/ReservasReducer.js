// src/context/Reservas/ReservasReducer.js
import {
  RESERVAS_SET_LOADING,
  RESERVAS_SET_ERROR,
  RESERVAS_SET_LIST,
  RESERVAS_SET_USUARIO_LIST,
  RESERVAS_ADD,
  RESERVAS_UPDATE,
  RESERVAS_SET_SELECTED,
} from "./ActionsTypes";

export const reservasInitialState = {
  reservas: [], // lista general (admin)
  reservasUsuario: [], // lista para un usuario
  selected: null, // reserva seleccionada (detalle / editar)
  loading: false,
  error: null,
};

export default function ReservasReducer(state, action) {
  switch (action.type) {
    case RESERVAS_SET_LOADING:
      return { ...state, loading: action.payload };

    case RESERVAS_SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case RESERVAS_SET_LIST:
      return {
        ...state,
        reservas: action.payload,
        loading: false,
        error: null,
      };

    case RESERVAS_SET_USUARIO_LIST:
      return {
        ...state,
        reservasUsuario: action.payload,
        loading: false,
        error: null,
      };

    case RESERVAS_ADD:
      return {
        ...state,
        reservas: [action.payload, ...state.reservas],
        reservasUsuario: [action.payload, ...state.reservasUsuario],
      };

    case RESERVAS_UPDATE:
      return {
        ...state,
        reservas: state.reservas.map((r) =>
          r.reservaID === action.payload.reservaID ? action.payload : r
        ),
        reservasUsuario: state.reservasUsuario.map((r) =>
          r.reservaID === action.payload.reservaID ? action.payload : r
        ),
      };

    case RESERVAS_SET_SELECTED:
      return { ...state, selected: action.payload };

    default:
      return state;
  }
}
