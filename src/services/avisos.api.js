// src/services/avisos.api.js
// Requiere que ./http.js exporte una instancia axios configurada como: export const http = axios.create({...})

import { http } from "./http";

/**
 * Listado de avisos con filtros y paginación.
 * @param {Object} params
 * @param {number=} params.categoriaId
 * @param {string=} params.q               // texto libre: busca en título/descripcion
 * @param {string|Date=} params.desde      // ISO: '2025-11-01'
 * @param {string|Date=} params.hasta      // ISO
 * @param {number=} params.page            // default 1
 * @param {number=} params.pageSize        // default 10
 * @param {('recientes'|'prioridad')=} params.orden
 */
async function list(params = {}) {
  const qp = new URLSearchParams();

  if (params.categoriaId) qp.set("categoriaId", params.categoriaId);
  if (params.q) qp.set("q", params.q);
  if (params.desde) qp.set("desde", toIsoDate(params.desde));
  if (params.hasta) qp.set("hasta", toIsoDate(params.hasta));
  qp.set("page", params.page ?? 1);
  qp.set("pageSize", params.pageSize ?? 10);
  qp.set("orden", params.orden ?? "recientes");

  const { data } = await http.get(`/api/Avisos?${qp.toString()}`);
  return data; // {items, total, page, pageSize}
}

/** Obtiene un aviso por id */
async function getById(id) {
  const { data } = await http.get(`/api/Avisos/${id}`);
  return data;
}

/**
 * Crea un aviso (ADMIN).
 * @param {Object} payload
 * @param {number} payload.usuarioID
 * @param {number} payload.categoriaID
 * @param {string} payload.titulo
 * @param {string} payload.descripcion
 * @param {string|Date=} payload.fechaEvento
 */
async function create(payload) {
  const body = {
    usuarioID: payload.usuarioID,
    categoriaID: payload.categoriaID,
    titulo: payload.titulo?.trim(),
    descripcion: payload.descripcion?.trim(),
    fechaEvento: payload.fechaEvento
      ? toIsoDateTime(payload.fechaEvento)
      : null,
    // fechaPublicacion la pone el backend
  };
  const { data } = await http.post(`/api/Avisos`, body);
  return data;
}

/**
 * Actualiza un aviso (ADMIN).
 * @param {number} id
 * @param {Object} payload
 */
async function update(id, payload) {
  const body = {
    categoriaID: payload.categoriaID,
    titulo: payload.titulo?.trim(),
    descripcion: payload.descripcion?.trim(),
    fechaEvento: payload.fechaEvento
      ? toIsoDateTime(payload.fechaEvento)
      : null,
  };
  const { data } = await http.put(`/api/Avisos/${id}`, body);
  return data;
}

/** Elimina un aviso (ADMIN). */
async function remove(id) {
  await http.delete(`/api/Avisos/${id}`);
  return true;
}

/** Lista de categorías de Aviso (con prioridad si tu backend la expone). */
async function getCategorias() {
  const { data } = await http.get(`/api/Avisos/categorias-aviso`);
  return data; // [{categoriaID, nombre, prioridad?}]
}

/* Helpers */
function toIsoDate(d) {
  if (!d) return null;
  const x = typeof d === "string" ? new Date(d) : d;
  // solo YYYY-MM-DD
  return x.toISOString().slice(0, 10);
}
function toIsoDateTime(d) {
  if (!d) return null;
  const x = typeof d === "string" ? new Date(d) : d;
  return x.toISOString();
}

export const AvisosAPI = {
  list,
  getById,
  create,
  update,
  remove,
  getCategorias,
};
