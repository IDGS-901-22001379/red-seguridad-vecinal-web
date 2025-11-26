import { useEffect, useMemo, useState, useContext } from "react";
import PagosContext from "@/context/Pagos/PagosContext";

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

const EstadoPill = ({ estado }) => {
  const colors =
    estado === "Pagado"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : estado === "Pendiente"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-yellow-50 text-yellow-700 ring-yellow-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${colors}`}
    >
      {estado}
    </span>
  );
};

export default function CargosMantenimiento() {
  const { getAllCargosMantenimiento, loading: loadingPagos } =
    useContext(PagosContext);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Pendiente");

  const loadAll = async () => {
    try {
      setErr("");
      setLoading(true);

      const cargos = await getAllCargosMantenimiento();

      // Armar correctamente el nombre completo del usuario
      const formateados = cargos.map((c) => ({
        ...c,
        usuarioNombre: [c.usuarioNombre, c.usuarioApellidoP, c.usuarioApellidoM]
          .filter(Boolean)
          .join(" "),
      }));

      setRows(formateados);
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar los cargos de mantenimiento.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const dataFiltrada = useMemo(() => {
    let list = rows;

    if (filtroEstado !== "Todos") {
      list = list.filter((r) => r.estado === filtroEstado);
    }

    if (filtroNombre.trim()) {
      const q = filtroNombre.trim().toLowerCase();
      list = list.filter((r) => r.usuarioNombre?.toLowerCase().includes(q));
    }

    return list;
  }, [rows, filtroEstado, filtroNombre]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Cargos de Mantenimiento
      </h1>
      <p className="text-slate-500 mb-4">Cargos registrados en el sistema</p>

      <div className="rounded-2xl border border-slate-200 shadow mb-5 overflow-hidden">
        <div className="px-4 py-2 bg-emerald-700 text-white font-semibold">
          Búsqueda
        </div>

        <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-600">Buscar por nombre</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Ej. Oscar, López..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Estado</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Todos">Todos</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadAll}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {err && <p className="text-red-600 px-4 pb-3">{err}</p>}
      </div>

      <div className="rounded-xl border shadow overflow-hidden">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Concepto</th>
              <th className="px-4 py-3 text-left">Monto</th>
              <th className="px-4 py-3 text-left">Pagado</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Pendiente</th>
              <th className="px-4 py-3 text-left">Vence</th>
              <th className="px-4 py-3 text-left">Creado</th>
            </tr>
          </thead>

          <tbody>
            {dataFiltrada.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-slate-500">
                  {loading || loadingPagos ? "Cargando..." : "Sin resultados"}
                </td>
              </tr>
            )}

            {dataFiltrada.map((r) => (
              <tr key={r.cargoMantenimientoID} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.usuarioNombre}</div>
                  <div className="text-xs text-slate-500">#{r.usuarioId}</div>
                </td>

                <td className="px-4 py-3">{r.cargoMantenimientoID}</td>
                <td className="px-4 py-3">{r.concepto}</td>
                <td className="px-4 py-3">{fmtMoney(r.monto)}</td>
                <td className="px-4 py-3">
                  {r.montoPagado != null ? fmtMoney(r.montoPagado) : "-"}
                </td>
                <td className="px-4 py-3">
                  <EstadoPill estado={r.estado} />
                </td>
                <td className="px-4 py-3">{fmtMoney(r.saldoPendiente)}</td>
                <td className="px-4 py-3">{fmtDate(r.fechaVencimiento)}</td>
                <td className="px-4 py-3">{fmtDate(r.fechaCreacion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
