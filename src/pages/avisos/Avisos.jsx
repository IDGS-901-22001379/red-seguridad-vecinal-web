// src/pages/avisos/Avisos.jsx
import { useEffect, useState, useCallback, useContext, useMemo } from "react";
import AvisosContext from "@/context/Avisos/AvisosContext";
import AvisosList from "./AvisosList";
import AvisoForm from "./AvisoForm";

export default function Avisos() {
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
  } = useContext(AvisosContext);

  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
    orden: "recientes",
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // -------- PRIORIDAD DE CATEGORÍAS --------
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

  // -------- FILTROS + ORDEN + PAGINACIÓN --------
  const data = useMemo(() => {
    let arr = [...(avisos || [])];

    if (query.q?.trim()) {
      const q = query.q.toLowerCase();
      arr = arr.filter(
        (a) =>
          a.titulo?.toLowerCase().includes(q) ||
          a.descripcion?.toLowerCase().includes(q)
      );
    }

    if (query.categoriaId) {
      arr = arr.filter((a) => a.categoriaID === query.categoriaId);
    }

    if (query.orden === "prioridad") {
      arr.sort(
        (a, b) =>
          catPriority(a.categoriaID) - catPriority(b.categoriaID) ||
          new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );
    } else {
      arr.sort(
        (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );
    }

    const total = arr.length;
    const start = (query.page - 1) * query.pageSize;
    const end = start + query.pageSize;

    return {
      items: arr.slice(start, end),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }, [avisos, categorias, query, catPriority]);

  // -------- CARGA INICIAL (FIX: SIN LOOP) --------
  useEffect(() => {
    getCategoriasAviso();
    getAvisos();
  }, []);

  // -------- ACCIONES --------
  const onSubmitForm = async (values) => {
    const ok = editing
      ? await actualizarAviso({ ...values, avisoID: editing.avisoID })
      : await crearAviso(values);

    if (ok) {
      alert(editing ? "Aviso actualizado" : "Aviso creado");
      setShowForm(false);
    }
  };

  const onDelete = async (item) => {
    if (!confirm(`¿Eliminar el aviso "${item.titulo}"?`)) return;
    const ok = await eliminarAviso(item.avisoID);
    if (ok) alert("Aviso eliminado");
  };

  const catMap = useMemo(
    () =>
      categorias.reduce((acc, c) => {
        acc[c.categoriaID] = c.nombre;
        return acc;
      }, {}),
    [categorias]
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Avisos</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Nuevo aviso
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border bg-rose-50 text-rose-700 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <AvisosList
        loading={loading}
        error={error}
        data={data}
        onEdit={(item) => {
          setEditing(item);
          setShowForm(true);
        }}
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
