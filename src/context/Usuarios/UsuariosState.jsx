import React, { useReducer } from "react";
import axios from "axios";

import UsuariosContext from "./UsuariosContext";
import UsuariosReducer from "./UsuariosReducer";
import { USUARIOS_ACTIONS } from "./ActionsTypes";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5165/api";

const UsuariosState = ({ children }) => {
  const initialState = {
    usuarios: [],
    usuarioSeleccionado: null,
    tiposUsuario: [],
    error: null,
<<<<<<< HEAD
    loading: false,
    saving: false,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
  };

  const [state, dispatch] = useReducer(UsuariosReducer, initialState);

  const listarUsuarios = async () => {
<<<<<<< HEAD
    dispatch({ type: USUARIOS_ACTIONS.LOADING });
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
    try {
      const res = await axios.get(`${API_URL}/Usuarios`);
      dispatch({
        type: USUARIOS_ACTIONS.LISTAR,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

<<<<<<< HEAD
  const obtenerUsuario = async (id) => {
    dispatch({ type: USUARIOS_ACTIONS.LOADING });
=======
  // Obtener usuario por ID
  const obtenerUsuario = async (id) => {
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
    try {
      const res = await axios.get(`${API_URL}/Usuarios/${id}`);
      dispatch({
        type: USUARIOS_ACTIONS.OBTENER,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

<<<<<<< HEAD
  const registrarUsuario = async (usuario) => {
    dispatch({ type: USUARIOS_ACTIONS.SAVING });
    try {
      const res = await axios.post(`${API_URL}/Usuarios/register`, usuario);
=======
  // Registrar usuario
  const registrarUsuario = async (usuario) => {
    try {
      const res = await axios.post(`${API_URL}/Usuarios/register`, usuario);

>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
      dispatch({
        type: USUARIOS_ACTIONS.REGISTRAR,
        payload: res.data,
      });
<<<<<<< HEAD
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.error || err.message;

      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
        details: err.response?.data,
      };
    }
  };

  const actualizarUsuario = async (usuario) => {
    dispatch({ type: USUARIOS_ACTIONS.SAVING });
    try {
      const res = await axios.put(`${API_URL}/Usuarios/update`, usuario);
      dispatch({
        type: USUARIOS_ACTIONS.ACTUALIZAR,
        payload: res.data,
      });
      listarUsuarios();
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

<<<<<<< HEAD
  const obtenerTiposUsuario = async () => {
    dispatch({ type: USUARIOS_ACTIONS.LOADING });
=======
  // Actualizar usuario
  const actualizarUsuario = async (usuario) => {
    try {
      const res = await axios.put(`${API_URL}/Usuarios/update`, usuario);

      dispatch({
        type: USUARIOS_ACTIONS.ACTUALIZAR,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

  // Obtener tipos de usuario
  const obtenerTiposUsuario = async () => {
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
    try {
      const res = await axios.get(`${API_URL}/Usuarios/tipos-usuario`);
      dispatch({
        type: USUARIOS_ACTIONS.TIPOS_USUARIO,
        payload: res.data,
      });
<<<<<<< HEAD
      listarUsuarios();
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

  const eliminarUsuario = async (id) => {
    dispatch({ type: USUARIOS_ACTIONS.SAVING });
    try {
      await axios.put(`${API_URL}/Usuarios/desactivar/${id}`, {
        motivo: "Dado de baja",
      });
      dispatch({
        type: USUARIOS_ACTIONS.ELIMINAR,
        payload: id,
      });
      listarUsuarios();
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

  const clearError = () => {
    dispatch({ type: USUARIOS_ACTIONS.CLEAR_ERROR });
  };

  const reactivarUsuario = async (id) => {
    dispatch({ type: USUARIOS_ACTIONS.SAVING });
    try {
      const res = await axios.put(`${API_URL}/Usuarios/reactivar/${id}`);

      dispatch({
        type: USUARIOS_ACTIONS.REACTIVAR,
        payload: res.data,
      });
      listarUsuarios();
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
    } catch (err) {
      dispatch({
        type: USUARIOS_ACTIONS.ERROR,
        payload: err.message,
      });
    }
  };

  return (
    <UsuariosContext.Provider
      value={{
        usuarios: state.usuarios,
        usuarioSeleccionado: state.usuarioSeleccionado,
        tiposUsuario: state.tiposUsuario,
        error: state.error,
<<<<<<< HEAD
        loading: state.loading,
        saving: state.saving,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d

        listarUsuarios,
        obtenerUsuario,
        registrarUsuario,
        actualizarUsuario,
<<<<<<< HEAD
        eliminarUsuario,
        reactivarUsuario,
        obtenerTiposUsuario,
        clearError,
=======
        obtenerTiposUsuario,
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};

export default UsuariosState;
