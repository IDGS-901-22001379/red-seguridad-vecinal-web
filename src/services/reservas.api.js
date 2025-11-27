// src/services/reservas.api.js
import { http } from "./http";

const BASE = "/Reservas";

/**
 * Servicio para consumir el backend de Reservas.
 * Usa la base /api configurada en http.js
 */
const ReservasAPI = {
  /**
   * Lista todas las reservas (uso admin).
   */
  getAll(signal) {
    return http.get(BASE, { signal });
  },

  /**
   * Obtiene las reservas de un usuario específico.
   * @param {number} usuarioId
   */
  getByUsuario(usuarioId, signal) {
    return http.get(`${BASE}/usuario/${usuarioId}`, { signal });
  },

  /**
   * Obtiene una reserva por id.
   * @param {number} id
   */
  getById(id, signal) {
    return http.get(`${BASE}/${id}`, { signal });
  },

  /**
   * Crea una nueva reserva.
   * body esperado:
   * {
   *   usuarioID,
   *   amenidadID,
   *   fechaReserva: "YYYY-MM-DD",
   *   horaInicio: "HH:mm",
   *   horaFin: "HH:mm",
   *   motivo: "..."
   * }
   */
  create(data) {
    return http.post(BASE, data);
  },

  /**
   * Cancela una reserva (PUT /api/Reservas/{id}/cancelar)
   */
  cancelar(id) {
    return http.put(`${BASE}/${id}/cancelar`);
  },

  /**
   * Cambia el estado de una reserva (aprobada, rechazada, etc.)
   * body: { estado: "string" }
   */
  actualizarEstado(id, estado) {
    return http.put(`${BASE}/${id}/estado`, { estado });
  },
};

export default ReservasAPI;
