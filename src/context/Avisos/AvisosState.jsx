import { useReducer } from "react";
import axios from "axios";
import AvisosContext from "./AvisosContext";

import {
  GET_AVISOS,
  GET_AVISO,
  CREATE_AVISO,
  UPDATE_AVISO,
  DELETE_AVISO,
  GET_AVISOS_CATEGORIAS,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from "./ActionsTypes";

import { AvisosReducer } from "./AvisosReducer";

const initialState = {
  avisos: [],
  avisoActual: null,
  categorias: [],
  loading: false,
  error: null,
};

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5165/api";

const AvisosState = ({ children }) => {
  const [state, dispatch] = useReducer(AvisosReducer, initialState);

  const setLoading = (value) => dispatch({ type: SET_LOADING, payload: value });

  const setError = (msg) => dispatch({ type: SET_ERROR, payload: msg });

  const clearError = () => dispatch({ type: CLEAR_ERROR });

  const getAvisos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Avisos`);
      dispatch({ type: GET_AVISOS, payload: res.data });
      return res.data;
    } catch {
      setError("Error obteniendo avisos.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAviso = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Avisos/${id}`);
      dispatch({ type: GET_AVISO, payload: res.data });
      return res.data;
    } catch {
      setError("Error obteniendo el aviso.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearAviso = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/Avisos`, data);
      dispatch({ type: CREATE_AVISO, payload: res.data });
      return res.data;
    } catch {
      setError("No se pudo crear el aviso.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const actualizarAviso = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API}/Avisos`, data);
      dispatch({ type: UPDATE_AVISO, payload: res.data });
      return res.data;
    } catch {
      setError("No se pudo actualizar el aviso.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const eliminarAviso = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API}/Avisos/${id}`);
      dispatch({ type: DELETE_AVISO, payload: id });
      getAvisos();
      return true;
    } catch {
      setError("No se pudo eliminar el aviso.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCategoriasAviso = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Avisos/categorias-aviso`);
      dispatch({ type: GET_AVISOS_CATEGORIAS, payload: res.data });
      return res.data;
    } catch {
      setError("Error obteniendo categorías.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <AvisosContext.Provider
      value={{
        avisos: state.avisos,
        avisoActual: state.avisoActual,
        categorias: state.categorias,
        loading: state.loading,
        error: state.error,

        getAvisos,
        getAviso,
        crearAviso,
        actualizarAviso,
        eliminarAviso,
        getCategoriasAviso,

        clearError,
        setError,
      }}
    >
      {children}
    </AvisosContext.Provider>
  );
};

export default AvisosState;
