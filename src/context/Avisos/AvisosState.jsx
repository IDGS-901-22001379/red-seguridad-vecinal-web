import React, { useReducer } from "react";
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

const AvisosState = (props) => {
  const [state, dispatch] = useReducer(AvisosReducer, initialState);

  const setLoading = (value) => dispatch({ type: SET_LOADING, payload: value });
  const setError = (error) => dispatch({ type: SET_ERROR, payload: error });
  const clearError = () => dispatch({ type: CLEAR_ERROR });

  const getAvisos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/Avisos`);

      dispatch({ type: GET_AVISOS, payload: res.data });
      return res.data;
    } catch (err) {
      setError("Error obteniendo avisos.", err);
      return [];
    }
  };

  const getAviso = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/Avisos/${id}`);

      dispatch({ type: GET_AVISO, payload: res.data });
      return res.data;
    } catch (err) {
      setError("Error obteniendo el aviso.", err);
      return null;
    }
  };

  const crearAviso = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/Avisos`, data);

      dispatch({ type: CREATE_AVISO, payload: res.data });
      return res.data;
    } catch (err) {
      setError("No se pudo crear el aviso.", err);
      return null;
    }
  };

  const actualizarAviso = async (data) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API}/Avisos`, data);

      dispatch({ type: UPDATE_AVISO, payload: res.data });
      return res.data;
    } catch (err) {
      setError("No se pudo actualizar el aviso.", err);
      return null;
    }
  };

  const eliminarAviso = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/Avisos/${id}`);

      dispatch({ type: DELETE_AVISO, payload: id });
      return true;
    } catch (err) {
      setError("No se pudo eliminar el aviso.", err);
      return false;
    }
  };

  const getCategoriasAviso = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/Avisos/categorias-aviso`);

      dispatch({ type: GET_AVISOS_CATEGORIAS, payload: res.data });
      return res.data;
    } catch (err) {
      setError("Error obteniendo categorías de avisos.", err);
      return [];
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
      {props.children}
    </AvisosContext.Provider>
  );
};

export default AvisosState;
