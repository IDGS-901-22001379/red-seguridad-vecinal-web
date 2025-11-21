// src/pages/servicios/PersonalMantenimientoForm.jsx
import { useEffect, useState } from "react";

export default function PersonalMantenimientoForm({
  open,
  onClose,
  onSubmit,
  initial,
}) {
  const [form, setForm] = useState({
    personaID: "",
    puesto: "",
    fechaContratacion: "",
    sueldo: "",
    tipoContrato: "",
    turno: "",
    diasLaborales: "",
    notas: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        personaID: initial.personaID || "",
        puesto: initial.puesto || "",
        fechaContratacion: initial.fechaContratacion || "",
        sueldo: initial.sueldo ?? "",
        tipoContrato: initial.tipoContrato || "",
        turno: initial.turno || "",
        diasLaborales: initial.diasLaborales || "",
        notas: initial.notas || "",
      });
    } else {
      setForm({
        personaID: "",
        puesto: "",
        fechaContratacion: "",
        sueldo: "",
        tipoContrato: "",
        turno: "",
        diasLaborales: "",
        notas: "",
      });
    }
    setErrors({});
  }, [initial, open]);

  if (!open) return null;

  const validate = () => {
    const e = {};

    if (!String(form.personaID).trim()) e.personaID = "Persona requerida.";
    if (!form.puesto.trim()) e.puesto = "Puesto requerido.";
    if (!form.fechaContratacion) e.fechaContratacion = "Fecha requerida.";
    if (form.sueldo === "" || Number(form.sueldo) <= 0)
      e.sueldo = "Sueldo debe ser mayor a 0.";
    if (!form.tipoContrato.trim())
      e.tipoContrato = "Tipo de contrato requerido.";
    if (!form.turno.trim()) e.turno = "Turno requerido.";
    if (!form.diasLaborales.trim())
      e.diasLaborales = "Días laborales requeridos.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!validate()) return;

    const payload = {
      personaID: Number(form.personaID),
      puesto: form.puesto.trim(),
      fechaContratacion: form.fechaContratacion, // 'YYYY-MM-DD' desde el input date
      sueldo: Number(form.sueldo),
      tipoContrato: form.tipoContrato.trim(),
      turno: form.turno.trim(),
      diasLaborales: form.diasLaborales.trim(),
      notas: form.notas.trim() || null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="font-semibold text-slate-800">
            {initial
              ? "Editar personal de mantenimiento"
              : "Nuevo personal de mantenimiento"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Persona ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ID de persona (relación con Personas)
            </label>
            <input
              type="number"
              name="personaID"
              value={form.personaID}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.personaID && (
              <p className="text-xs text-red-500 mt-1">{errors.personaID}</p>
            )}
          </div>

          {/* Puesto y sueldo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Puesto
              </label>
              <input
                type="text"
                name="puesto"
                value={form.puesto}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.puesto && (
                <p className="text-xs text-red-500 mt-1">{errors.puesto}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sueldo mensual
              </label>
              <input
                type="number"
                name="sueldo"
                value={form.sueldo}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.sueldo && (
                <p className="text-xs text-red-500 mt-1">{errors.sueldo}</p>
              )}
            </div>
          </div>

          {/* Fecha y tipo contrato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fecha de contratación
              </label>
              <input
                type="date"
                name="fechaContratacion"
                value={form.fechaContratacion}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.fechaContratacion && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fechaContratacion}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de contrato
              </label>
              <select
                name="tipoContrato"
                value={form.tipoContrato}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecciona una opción</option>
                <option value="Indefinido">Indefinido</option>
                <option value="Temporal">Temporal</option>
                <option value="Por proyecto">Por proyecto</option>
              </select>
              {errors.tipoContrato && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.tipoContrato}
                </p>
              )}
            </div>
          </div>

          {/* Turno y días laborales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Turno
              </label>
              <input
                type="text"
                name="turno"
                value={form.turno}
                onChange={handleChange}
                placeholder="Ej. Matutino, Vespertino, Nocturno"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.turno && (
                <p className="text-xs text-red-500 mt-1">{errors.turno}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Días laborales
              </label>
              <input
                type="text"
                name="diasLaborales"
                value={form.diasLaborales}
                onChange={handleChange}
                placeholder="Ej. Lunes-Viernes"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.diasLaborales && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.diasLaborales}
                </p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notas
            </label>
            <textarea
              name="notas"
              rows={3}
              value={form.notas}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {initial ? "Guardar cambios" : "Registrar personal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
