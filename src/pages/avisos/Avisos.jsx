// src/pages/avisos/Avisos.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { AvisosAPI } from "../../services/avisos.api";
import AvisosList from "./AvisosList";
import AvisoForm from "./AvisoForm";

export default function Avisos() {
  const [cats, setCats] = useState([]); // [{ categoriaID, nombre, prioridad? }]
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
    orden: "recientes",
    // q?: string
    // categoriaId?: number
  });

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // { ...aviso } o null

  // Diccionario ID → Nombre para resolver categorías en la tabla
  const catMap = useMemo(
    () =>
      Object.fromEntries(
        (cats || []).map((c) => [String(c.categoriaID), String(c.nombre)])
      ),
    [cats]
  );

  // Cargar categorías desde /api/Avisos/categorias-aviso
  const loadCats = useCallback(async () => {
    try {
      const res = await AvisosAPI.getCategorias();
      const list = Array.isArray(res) ? res : [];
      // Ordena por prioridad (si viene) y luego por nombre
      const ordenadas = [...list].sort(
        (a, b) =>
          Number(a?.prioridad ?? 99) - Number(b?.prioridad ?? 99) ||
          String(a?.nombre ?? "").localeCompare(String(b?.nombre ?? ""))
      );
      setCats(ordenadas);
    } catch (e) {
      console.error(e);
      setCats([]); // tolerante: sin categorías no truena
    }
  }, []);

  // Cargar avisos
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await AvisosAPI.list(query);
      setData(res);
    } catch (e) {
      setError(e?.message || "Error cargando avisos");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadCats();
  }, [loadCats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      await AvisosAPI.remove(item.avisoID);
      await loadData();
      alert("Aviso eliminado");
    } catch (e) {
      alert(e?.message || "No se pudo eliminar");
    }
  };

  const onSubmitForm = async (values) => {
    try {
      if (editing) {
        await AvisosAPI.update(editing.avisoID, values);
        alert("Aviso actualizado");
      } else {
        await AvisosAPI.create(values);
        alert("Aviso creado");
      }
      setShowForm(false);
      await loadData();
    } catch (e) {
      alert(e?.message || "Error al guardar");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Avisos (Admin)</h1>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Nuevo aviso
        </button>
      </div>

      {/* Filtros arriba de la tabla */}
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <input
          className="border rounded-xl p-2"
          placeholder="Buscar por título o descripción…"
          value={query.q || ""}
          onChange={(e) =>
            setQuery((q) => ({ ...q, q: e.target.value, page: 1 }))
          }
        />

        {/* Filtro por categoría */}
        <select
          className="border rounded-xl p-2"
          value={query.categoriaId ?? ""} // "" = todas
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              categoriaId: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            }))
          }
        >
          <option value="">Todas las categorías</option>
          {cats.map((c) => (
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
        catMap={catMap} // ← pasa el mapa a la tabla
      />

      {/* Modal de formulario */}
      {showForm && (
        <AvisoForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={onSubmitForm}
          categorias={cats} // ← categorías para el select del form
          initial={editing}
        />
      )}
    </div>
  );
}
