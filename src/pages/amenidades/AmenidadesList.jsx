// src/pages/amenidades/AmenidadesList.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import AmenidadesContext from "../../context/Amenidades/AmenidadesContext";
import AmenidadForm from "./AmenidadForm";

export default function AmenidadesList() {
  const {
    amenidades,
    tiposAmenidad,
    listarAmenidades,
    listarTiposAmenidad,
    registrarAmenidad,
    actualizarAmenidad,
    errorAmenidades,
  } = useContext(AmenidadesContext);

  const [busqueda, setBusqueda] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [amenidadEdit, setAmenidadEdit] = useState(null);

  useEffect(() => {
    listarAmenidades();
    listarTiposAmenidad();
  }, [listarAmenidades, listarTiposAmenidad]);

  const handleNueva = () => {
    setAmenidadEdit(null);
    setOpenForm(true);
  };

  const handleEditar = (amenidad) => {
    setAmenidadEdit(amenidad);
    setOpenForm(true);
  };

  const handleCerrarForm = () => {
    setOpenForm(false);
    setAmenidadEdit(null);
  };

  const handleSubmitForm = async (values) => {
    if (amenidadEdit?.amenidadID) {
      await actualizarAmenidad(amenidadEdit.amenidadID, values);
    } else {
      await registrarAmenidad(values);
    }
    setOpenForm(false);
    setAmenidadEdit(null);
  };

  const amenidadesFiltradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return amenidades || [];

    return (amenidades || []).filter((a) => {
      return (
        a.nombre?.toLowerCase().includes(term) ||
        a.ubicacion?.toLowerCase().includes(term) ||
        a.tipoAmenidadNombre?.toLowerCase().includes(term)
      );
    });
  }, [busqueda, amenidades]);

  return (
    <div className="p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Amenidades</h1>
          <p className="text-sm text-slate-500">
            Administra las amenidades del condominio (gimnasio, alberca,
            salones, etc.).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              className="w-full sm:w-64 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Buscar por nombre, tipo o ubicación..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-sm">
              🔍
            </span>
          </div>

          <button
            type="button"
            onClick={handleNueva}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            + Nueva amenidad
          </button>
        </div>
      </div>

      {/* Error */}
      {errorAmenidades && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorAmenidades}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                  Ubicación
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">
                  Capacidad
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">
                  Horario
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">
                  Estado
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {amenidadesFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No hay amenidades registradas.
                  </td>
                </tr>
              ) : (
                amenidadesFiltradas.map((a) => (
                  <tr
                    key={a.amenidadID}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {a.nombre}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {a.tipoAmenidadNombre}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{a.ubicacion}</td>
                    <td className="px-4 py-3 text-center text-slate-700">
                      {a.capacidad}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">
                      {a.horarioInicio?.slice(0, 5)} -{" "}
                      {a.horarioFin?.slice(0, 5)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {a.activo ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleEditar(a)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal formulario */}
      {openForm && (
        <AmenidadForm
          open={openForm}
          onClose={handleCerrarForm}
          onSubmit={handleSubmitForm}
          tiposAmenidad={tiposAmenidad}
          initial={amenidadEdit}
        />
      )}
    </div>
  );
}
