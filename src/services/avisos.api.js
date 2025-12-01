// src/services/avisos.api.js
import { http } from "./http";

/** Lista “cruda” del backend (array de avisos) */
async function listRaw() {
  return await http.get("/Avisos");
}

/** GET /api/Avisos/{id} */
async function getById(id) {
  return await http.get(`/Avisos/${id}`);
}

/** POST /api/Avisos  (crea) */
async function create(payload) {
  console.log("📤 Payload recibido en avisos.api.create:", payload);
  
  // ¡CORRECTO según tu backend!
  const body = {
    UsuarioID: Number(payload.usuarioID) || 1, // Debe ser > 0
    CategoriaID: Number(payload.categoriaID) || 1, // Debe ser > 0, nombre EXACTO
    Titulo: payload.titulo?.trim() || "Aviso sin título",
    Descripcion: payload.descripcion?.trim() || "Sin contenido", // Nombre EXACTO
    FechaEvento: payload.fechaEvento 
      ? new Date(payload.fechaEvento).toISOString()
      : null,
    // NOTA: Tu backend NO espera reporteID, fechaExpiracion, esUrgente, etc.
  };
  
  console.log("📤 Body EXACTO para tu backend:", JSON.stringify(body, null, 2));
  
  try {
    const result = await http.post("/Avisos", body);
    console.log("✅ Respuesta de API:", result);
    return result;
  } catch (error) {
    console.error("❌ Error en avisos.api.create:", error);
    throw error;
  }
}

/** PUT /api/Avisos  (actualiza) */
async function update(id, payload) {
  const body = {
    AvisoID: Number(id), // Para update
    CategoriaID: Number(payload.categoriaID),
    Titulo: payload.titulo?.trim(),
    Descripcion: payload.descripcion?.trim(),
    FechaEvento: payload.fechaEvento
      ? new Date(payload.fechaEvento).toISOString()
      : null,
  };
  return await http.put("/Avisos", body);
}

/** DELETE /api/Avisos/{id} */
async function remove(id) {
  await http.del(`/Avisos/${id}`);
  return true;
}

/** GET /api/Avisos/categorias-aviso → [{CategoriaID, Nombre, ...}] */
async function getCategorias() {
  return await http.get("/Avisos/categorias-aviso");
}

export const AvisosAPI = {
  listRaw,
  getById,
  create,
  update,
  remove,
  getCategorias,
};