// src/pages/reservas/ReservasList.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import ReservasContext from "../../context/Reservas/ReservasContext";

function formatFecha(fecha) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatHora(hora) {
  if (!hora) return "-";
  // admite "HH:mm" o "HH:mm:ss"
  const [hh = "00", mm = "00"] = hora.split(":");
  const d = new Date();
  d.setHours(Number(hh), Number(mm), 0, 0);
  return d.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const estadoBadgeClasses = (estado) => {
  const e = (estado || "").toLowerCase();
  if (e === "aprobada" || e === "aceptada" || e === "activo")
    return "bg-emerald-100 text-emerald-700";
  if (e === "rechazada") return "bg-rose-100 text-rose-700";
  if (e === "cancelada") return "bg-slate-100 text-slate-700";
  // pendiente u otro
  return "bg-amber-100 text-amber-700";
};

export default function ReservasList() {
  const { reservas, loading, fetchAll, cambiarEstadoReserva, cancelarReserva } =
    useContext(ReservasContext);

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("ALL");

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estadosDisponibles = useMemo(() => {
    const set = new Set();
    (reservas || []).forEach((r) => {
      if (r.estado) set.add(r.estado);
    });
    return Array.from(set);
  }, [reservas]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (reservas || []).filter((r) => {
      if (estadoFilter !== "ALL" && r.estado !== estadoFilter) return false;

      if (!q) return true;

      const usuarioNombre =
        r.usuarioNombre ||
        `${r.usuarioNombreCompleto ?? ""}` ||
        `${r.usuario?.nombre ?? ""} ${r.usuario?.apellidoPaterno ?? ""} ${
          r.usuario?.apellidoMaterno ?? ""
        }`;

      const amenidadNombre = r.amenidadNombre || r.amenidad?.nombre || "";

      const codigo = String(r.reservaID ?? "");

      const hayCoincidencia =
        usuarioNombre.toLowerCase().includes(q) ||
        amenidadNombre.toLowerCase().includes(q) ||
        codigo.toLowerCase().includes(q);

      return hayCoincidencia;
    });
  }, [reservas, search, estadoFilter]);

  const handleActualizarEstado = async (reserva, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;
    try {
      await cambiarEstadoReserva(reserva.reservaID, nuevoEstado);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado de la reserva.");
    }
  };

  const handleCancelar = async (reserva) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    try {
      await cancelarReserva(reserva.reservaID);
    } catch (err) {
      console.error(err);
      alert("No se pudo cancelar la reserva.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Título principal */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Administración de reservas
        </h1>
        <p className="mt-1 text-slate-600 max-w-2xl">
          Revisa, aprueba o rechaza las reservas de amenidades realizadas por
          los residentes del fraccionamiento.
        </p>
      </div>

      {/* Tarjeta principal tipo "hero" */}
      <section className="bg-emerald-600 rounded-3xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-white text-lg font-semibold">
            Reservas de amenidades
          </h2>
          <p className="text-emerald-50 text-sm md:text-[15px]">
            Consulta el estado de las reservas, verifica horarios y administra
            los espacios comunes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAll}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-emerald-50/40 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
        >
          <span className="mr-2 inline-block rotate-0">⟳</span>
          Recargar
        </button>
      </section>

      {/* Filtros: búsqueda + select estado */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500"
            placeholder="Buscar por nombre de usuario, amenidad o ID de reserva..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-56">
          <select
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            {estadosDisponibles.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl border border-emerald-700/60 overflow-hidden shadow-sm">
        <div className="bg-emerald-700 text-white text-sm font-semibold grid grid-cols-[1.6fr,1.4fr,1.2fr,1fr,1.3fr] gap-3 px-6 py-3">
          <div>Usuario / Amenidad</div>
          <div>Fecha</div>
          <div>Horario</div>
          <div>Estado</div>
          <div className="text-right">Acciones</div>
        </div>

        {loading && (
          <div className="px-6 py-6 text-center text-slate-500 text-sm">
            Cargando reservas...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-6 text-center text-slate-500 text-sm">
            No se encontraron reservas con los filtros seleccionados.
          </div>
        )}

        {!loading &&
          filtered.map((r) => {
            const usuarioNombre =
              r.usuarioNombre ||
              `${r.usuarioNombreCompleto ?? ""}` ||
              `${r.usuario?.nombre ?? ""} ${r.usuario?.apellidoPaterno ?? ""} ${
                r.usuario?.apellidoMaterno ?? ""
              }`.trim();

            const amenidadNombre =
              r.amenidadNombre || r.amenidad?.nombre || "Amenidad";

            return (
              <div
                key={r.reservaID}
                className="grid grid-cols-[1.6fr,1.4fr,1.2fr,1fr,1.3fr] gap-3 px-6 py-4 border-t border-slate-100 text-sm items-center hover:bg-emerald-50/40 transition-colors"
              >
                {/* Usuario + amenidad */}
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    {usuarioNombre || "Usuario"}
                  </span>
                  <span className="text-xs text-slate-500">
                    ID usuario: {r.usuarioID ?? "-"}
                  </span>
                  <span className="text-xs text-emerald-700 mt-1">
                    {amenidadNombre}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ID reserva: {r.reservaID ?? "-"}
                  </span>
                </div>

                {/* Fecha */}
                <div className="text-sm text-slate-700">
                  {formatFecha(r.fechaReserva)}
                </div>

                {/* Horario */}
                <div className="text-xs text-slate-700">
                  <div>
                    De:{" "}
                    <span className="font-medium">
                      {formatHora(r.horaInicio)}
                    </span>
                  </div>
                  <div>
                    A:{" "}
                    <span className="font-medium">{formatHora(r.horaFin)}</span>
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <span
                    className={
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold " +
                      estadoBadgeClasses(r.estado)
                    }
                  >
                    {r.estado || "Pendiente"}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-2">
                  {/* Aprobada */}
                  <button
                    type="button"
                    onClick={() => handleActualizarEstado(r, "Aprobada")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                  >
                    Aprobar
                  </button>

                  {/* Rechazar */}
                  <button
                    type="button"
                    onClick={() => handleActualizarEstado(r, "Rechazada")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                  >
                    Rechazar
                  </button>

                  {/* Cancelar (si aplica) */}
                  <button
                    type="button"
                    onClick={() => handleCancelar(r)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
