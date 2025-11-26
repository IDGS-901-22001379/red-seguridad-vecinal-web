// src/pages/avisos/Avisos.jsx
import { useEffect, useState, useCallback, useContext, useMemo } from "react";
import AvisosContext from "@/context/Avisos/AvisosContext";
import AvisosList from "./AvisosList";
import AvisoForm from "./AvisoForm";

export default function Avisos() {
  const avisosContext = useContext(AvisosContext);

  const {
    avisos,
    categorias,
    loading,
    error,
    getAvisos,
    getCategoriasAviso,
    crearAviso,
    actualizarAviso,
    eliminarAviso,
    clearError,
  } = avisosContext;

  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
    orden: "recientes",
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const catPriority = useCallback(
    (catId) => {
      const c = categorias.find((x) => x.categoriaID === catId);
      if (c?.prioridad != null) return Number(c.prioridad);
      const n = (c?.nombre || "").toLowerCase();
      if (n.includes("alerta")) return 1;
      if (n.includes("evento")) return 2;
      return 3;
    },
    [categorias]
  );

  // USAR useMemo EN LUGAR DE useEffect + setState
  const data = useMemo(() => {
    let arr = Array.isArray(avisos) ? [...avisos] : [];

    // filtro q (título/descripcion)
    if (query.q?.trim()) {
      const q = query.q.trim().toLowerCase();
      arr = arr.filter(
        (a) =>
          (a.titulo || "").toLowerCase().includes(q) ||
          (a.descripcion || "").toLowerCase().includes(q)
      );
    }

    // filtro por categoría
    if (query.categoriaId) {
      arr = arr.filter(
        (a) => Number(a.categoriaID) === Number(query.categoriaId)
      );
    }

    // orden
    if (query.orden === "prioridad") {
      arr.sort(
        (a, b) =>
          catPriority(a.categoriaID) - catPriority(b.categoriaID) ||
          new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );
    } else {
      // recientes: fechaPublicacion DESC
      arr.sort(
        (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );
    }

    // paginación
    const total = arr.length;
    const start = (query.page - 1) * query.pageSize;
    const end = start + query.pageSize;
    const items = arr.slice(start, end);

    return { items, total, page: query.page, pageSize: query.pageSize };
  }, [avisos, query, catPriority]); // catPriority ya es memoizado

  // ----------------- carga de datos -----------------
  const loadCats = useCallback(async () => {
    try {
      await getCategoriasAviso();
    } catch (e) {
      console.error("Error cargando categorías:", e);
    }
  }, [getCategoriasAviso]);

  const loadData = useCallback(async () => {
    try {
      await getAvisos();
    } catch (e) {
      console.error("Error cargando avisos:", e);
    }
  }, [getAvisos]);

  // Cargar datos solo una vez al montar
  useEffect(() => {
    loadCats();
    loadData();
  }, []); // ← Array de dependencias VACÍO

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // ----------------- acciones -----------------
  const onCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const onDelete = async (item) => {
    if (!confirm(`¿Eliminar el aviso "${item.titulo}"?`)) return;
    try {
      const success = await eliminarAviso(item.avisoID);
      if (success) {
        alert("Aviso eliminado");
        // No necesitas llamar loadData() porque el contexto ya actualiza el estado
      } else {
        alert("No se pudo eliminar el aviso");
      }
    } catch (e) {
      alert(e?.message || "No se pudo eliminar");
    }
  };

  const onSubmitForm = async (values) => {
    try {
      let success;
      if (editing) {
        const updateData = { ...values, avisoID: editing.avisoID };
        success = await actualizarAviso(updateData);
        if (success) {
          alert("Aviso actualizado");
        }
      } else {
        success = await crearAviso(values);
        if (success) {
          alert("Aviso creado");
        }
      }

      if (success) {
        setShowForm(false);
        // No necesitas llamar loadData() porque el contexto ya actualiza el estado
      }
    } catch (e) {
      alert(e?.message || "Error al guardar");
    }
  };

  // Crear mapa de categorías para AvisosList
  const catMap = useMemo(
    () =>
      categorias.reduce((acc, cat) => {
        acc[cat.categoriaID] = cat.nombre;
        return acc;
      }, {}),
    [categorias]
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Avisos</h1>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Nuevo aviso
        </button>
      </div>

      {/* Mostrar error global */}
      {error && (
        <div className="mb-4 p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-rose-600 hover:text-rose-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <input
          className="border rounded-xl p-2"
          placeholder="Buscar por título o descripción…"
          value={query.q || ""}
          onChange={(e) =>
            setQuery((q) => ({ ...q, q: e.target.value, page: 1 }))
          }
        />
        <select
          className="border rounded-xl p-2"
          value={query.categoriaId ?? ""}
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              categoriaId: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            }))
          }
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.categoriaID} value={c.categoriaID}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          className="border rounded-xl p-2"
          value={query.orden}
          onChange={(e) =>
            setQuery((q) => ({ ...q, orden: e.target.value, page: 1 }))
          }
        >
          <option value="recientes">Orden: Recientes</option>
          <option value="prioridad">Orden: Prioridad</option>
        </select>
        <select
          className="border rounded-xl p-2"
          value={query.pageSize}
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              pageSize: Number(e.target.value),
              page: 1,
            }))
          }
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} por página
            </option>
          ))}
        </select>
      </div>

      <AvisosList
        loading={loading}
        error={error}
        data={data}
        onEdit={onEdit}
        onDelete={onDelete}
        onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        catMap={catMap}
      />

      {showForm && (
        <AvisoForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={onSubmitForm}
          categorias={categorias}
          initial={editing}
        />
      )}
    </div>
  );
}
