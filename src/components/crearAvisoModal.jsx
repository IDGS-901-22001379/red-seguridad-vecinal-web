import { useState, useEffect, useContext, useRef } from "react";
import ReportesContext from "../context/Reportes/ReportesContext";

const CrearAvisoModal = ({ open, onClose, reporte }) => {
  const { categoriasAviso, fetchCategoriasAviso, createAviso, loading } = useContext(ReportesContext);
  
  const [form, setForm] = useState({
    categoriaID: "",
    titulo: "",
    descripcion: "",
    fechaEvento: "",
  });

  const hasLoaded = useRef(false); // Para evitar loops

  // Cargar categorías SOLO UNA VEZ cuando se abre
  useEffect(() => {
    if (open && !hasLoaded.current) {
      console.log("🔄 Cargando categorías...");
      fetchCategoriasAviso();
      hasLoaded.current = true;
    }
    
    // Reset cuando se cierra
    if (!open) {
      hasLoaded.current = false;
    }
  }, [open]);

  // Pre-llenar con datos del reporte SOLO cuando cambia el reporte
  useEffect(() => {
    if (open && reporte && categoriasAviso.length > 0) {
      console.log("📝 Prellenando con reporte:", reporte.reporteID);
      
      setForm({
        categoriaID: String(categoriasAviso[0].CategoriaID || categoriasAviso[0].categoriaID || "1"),
        titulo: `Resolución: ${reporte.titulo}`,
        descripcion: `Se ha atendido el reporte #${reporte.reporteID}:\n\n` +
                    `• Tipo: ${reporte.tipoReporte}\n` +
                    `• Descripción original: ${reporte.descripcion}\n` +
                    `• Ubicación: ${reporte.direccionTexto}\n` +
                    `• Fecha reporte: ${new Date(reporte.fechaCreacion).toLocaleDateString()}\n\n` +
                    `RESOLUCIÓN:\n[Describir aquí las acciones tomadas y recomendaciones para la comunidad]`,
        fechaEvento: "",
      });
    }
  }, [reporte, open, categoriasAviso]); // Solo cuando cambian estos

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.categoriaID || !form.titulo.trim() || !form.descripcion.trim()) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const avisoData = {
        usuarioID: 1, // ID del admin
        categoriaID: Number(form.categoriaID),
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fechaEvento: form.fechaEvento || null,
      };
      
      console.log("📤 Creando aviso con:", avisoData);
      
      await createAviso(avisoData);
      alert("Aviso creado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al crear aviso:", error);
      alert("Error al crear el aviso: " + (error.message || "Error del servidor"));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Crear Aviso a la Comunidad
          </h2>
          {reporte && (
            <p className="text-sm text-slate-600 mt-1">
              Basado en el reporte: <strong>"{reporte.titulo}"</strong> (ID: {reporte.reporteID})
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoriaID"
              value={form.categoriaID}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={categoriasAviso.length === 0}
            >
              {categoriasAviso.length === 0 ? (
                <option>Cargando categorías...</option>
              ) : (
                <>
                  <option value="">Selecciona una categoría</option>
                  {categoriasAviso.map((cat) => (
                    <option 
                      key={cat.CategoriaID || cat.categoriaID} 
                      value={String(cat.CategoriaID || cat.categoriaID)}
                    >
                      {cat.Nombre || cat.nombre}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows="6"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500 resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha del Evento (opcional)
            </label>
            <input
              type="datetime-local"
              name="fechaEvento"
              value={form.fechaEvento}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || categoriasAviso.length === 0}
              className="px-4 py-2 text-sm rounded-lg border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {loading ? "Creando..." : "Crear Aviso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearAvisoModal;