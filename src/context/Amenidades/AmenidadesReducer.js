// src/context/Amenidades/AmenidadesReducer.js
import { AMENIDADES_ACTIONS } from "./ActionsTypes";

export default function AmenidadesReducer(state, action) {
  switch (action.type) {
    case AMENIDADES_ACTIONS.LISTAR:
      return {
        ...state,
        amenidades: action.payload,
        error: null,
      };

    case AMENIDADES_ACTIONS.OBTENER:
      return {
        ...state,
        amenidadSeleccionada: action.payload,
        error: null,
      };

    case AMENIDADES_ACTIONS.REGISTRAR:
      return {
        ...state,
        amenidades: [...state.amenidades, action.payload],
        error: null,
      };

    case AMENIDADES_ACTIONS.ACTUALIZAR:
      return {
        ...state,
        amenidades: state.amenidades.map((a) =>
          a.amenidadID === action.payload.amenidadID ? action.payload : a
        ),
        error: null,
      };

    case AMENIDADES_ACTIONS.TIPOS_AMENIDAD:
      return {
        ...state,
        tiposAmenidad: action.payload,
        error: null,
      };

    case AMENIDADES_ACTIONS.ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
