// src/pages/finanzas/CargosServicios.jsx
import { useEffect, useMemo, useState } from "react";
import PagosServiciosAPI from "../../services/pagosServicios.api"; // servicio que creaste
import { UsuariosAPI } from "../../services/usuarios.api"; // export nombrado

// Helpers
const fmtMoney = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
    : n;

const fmtDate = (d) => {
  if (!d) return "-";
  const x = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(x.getTime())) return "-";
  return x.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const nombreUsuario = (u) => {
  const byPersona = [
    u?.persona?.nombre,
    u?.persona?.apellidoPaterno,
    u?.persona?.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");
  const byFlat = [u?.nombre, u?.apellidoPaterno, u?.apellidoMaterno]
    .filter(Boolean)
    .join(" ");
  return (
    byPersona ||
    byFlat ||
    u?.email ||
    `Usuario #${u?.usuarioID ?? ""}`
  ).trim();
};

const EstadoPill = ({ estado }) => {
  const colors =
    estado === "Pagado"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : estado === "Parcial"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-yellow-50 text-yellow-700 ring-yellow-200"; // Pendiente
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${colors}`}
    >
      {estado}
    </span>
  );
};

export default function CargosServicios() {
  const [rows, setRows] = useState([]); // filas enriquecidas con datos de usuario
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // Carga todos los cargos de servicios para todos los usuarios
  const loadAll = async () => {
    setErr("");
    setLoading(true);
    try {
      const usuarios = await UsuariosAPI.list(); // [{usuarioID,...}]
      const tareas = usuarios.map(async (u) => {
        const userId = u.usuarioID ?? u.id;
        if (!userId) return [];
        const cargos = await PagosServiciosAPI.getCargosServicio(
          Number(userId)
        );
        const nom = nombreUsuario(u);
        return cargos.map((c) => ({
          ...c,
          __usuarioId: userId,
          __usuarioNombre: nom,
        }));
      });

      const resultados = await Promise.all(tareas);
      setRows(resultados.flat());
    } catch (e) {
      setErr(e.message || "No se pudieron obtener los cargos de servicios.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // carga inicial
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // aplicar filtros locales
  const dataFiltrada = useMemo(() => {
    let list = rows;
    if (filtroEstado !== "Todos")
      list = list.filter((r) => r.estado === filtroEstado);
    if (filtroNombre.trim()) {
      const q = filtroNombre.trim().toLowerCase();
      list = list.filter((r) => r.__usuarioNombre.toLowerCase().includes(q));
    }
    return list;
  }, [rows, filtroEstado, filtroNombre]);

  return (
    <div className="p-4 md:p-6">
      {/* Encabezado */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
          Cargos de servicios
        </h1>
        <p className="text-slate-500 text-sm">
          Vista de administrador: todos los cargos de servicios por usuario.
        </p>
      </div>

      {/* Bloque de filtros: barra superior verde y botón azul */}
      <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <div className="px-4 md:px-6 py-3 bg-[#047857] text-white font-semibold">
          Búsqueda
        </div>
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Filtro por nombre */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Buscar por nombre
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2
                           text-slate-800 placeholder-slate-400 bg-white
                           leading-normal focus:outline-none
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. Yael, López..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Estado
              </label>
              <select
                className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option>Todos</option>
                <option>Pendiente</option>
                <option>Parcial</option>
                <option>Pagado</option>
              </select>
            </div>

            {/* Recargar datos */}
            <div className="flex items-end">
              <button
                onClick={loadAll}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium w-full"
              >
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
          </div>

          {err && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {err}
            </div>
          )}
        </div>
      </div>

      {/* Tabla (encabezado verde), sin título “Resultados” y franja verde clara abajo */}
      <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-2 bg-[#047857]" />
        <div className="overflow-x-auto bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#047857] text-white">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Concepto</th>
                <th className="px-4 py-3 font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Pagado</th>
                <th className="px-4 py-3 font-medium">Saldo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Solicitud</th>
                <th className="px-4 py-3 font-medium">Creado</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrada.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-slate-500"
                    colSpan={9}
                  >
                    {loading ? "Cargando..." : "Sin resultados"}
                  </td>
                </tr>
              )}

              {dataFiltrada.map((r) => (
                <tr
                  key={`${r.cargoServicioID}-${r.__usuarioId}`}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {r.__usuarioNombre}
                    </div>
                    <div className="text-xs text-slate-500">
                      #{r.__usuarioId}
                    </div>
                  </td>
                  <td className="px-4 py-3">{r.cargoServicioID}</td>
                  <td className="px-4 py-3">{r.concepto}</td>
                  <td className="px-4 py-3">{fmtMoney(r.monto)}</td>
                  <td className="px-4 py-3">
                    {r.montoPagado != null ? fmtMoney(r.montoPagado) : "-"}
                  </td>
                  <td className="px-4 py-3">{fmtMoney(r.saldoPendiente)}</td>
                  <td className="px-4 py-3">
                    <EstadoPill estado={r.estado} />
                  </td>
                  <td className="px-4 py-3">
                    {r?.solicitud ? (
                      <>
                        <div className="font-medium">
                          #{r.solicitud.solicitudID}
                        </div>
                        <div className="text-xs text-slate-600">
                          {r.solicitud.descripcion || "-"}
                        </div>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3">{fmtDate(r.fechaCreacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-3 bg-[#10B981]/20" />
      </div>
    </div>
  );
}
