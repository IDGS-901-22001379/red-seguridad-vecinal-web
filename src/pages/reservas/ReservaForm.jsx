// src/pages/reservas/ReservaForm.jsx
import { useEffect, useMemo, useState } from "react";

export default function ReservaForm({
  open,
  onClose,
  onSubmit,
  usuarios = [],
  amenidades = [],
  initial,
}) {
  const [form, setForm] = useState({
    usuarioID: "",
    amenidadID: "",
    fechaReserva: "",
    horaInicio: "",
    horaFin: "",
    motivo: "",
  });
  const [errors, setErrors] = useState({});

  const isEdit = useMemo(() => !!initial?.reservaID, [initial]);

  useEffect(() => {
    if (initial) {
      setForm({
        usuarioID: initial.usuarioID ?? "",
        amenidadID: initial.amenidadID ?? "",
        fechaReserva: initial.fechaReserva?.slice(0, 10) ?? "",
        horaInicio: initial.horaInicio ?? "",
        horaFin: initial.horaFin ?? "",
        motivo: initial.motivo ?? "",
      });
    } else {
      setForm({
        usuarioID: "",
        amenidadID: "",
        fechaReserva: "",
        horaInicio: "",
        horaFin: "",
        motivo: "",
      });
    }
    setErrors({});
  }, [initial, open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.usuarioID) newErrors.usuarioID = "Selecciona un usuario.";
    if (!form.amenidadID) newErrors.amenidadID = "Selecciona una amenidad.";
    if (!form.fechaReserva) newErrors.fechaReserva = "La fecha es obligatoria.";
    if (!form.horaInicio)
      newErrors.horaInicio = "La hora de inicio es obligatoria.";
    if (!form.horaFin) newErrors.horaFin = "La hora de fin es obligatoria.";
    if (!form.motivo.trim())
      newErrors.motivo = "Describe el motivo de la reserva.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      usuarioID: Number(form.usuarioID),
      amenidadID: Number(form.amenidadID),
      fechaReserva: form.fechaReserva,
      horaInicio: form.horaInicio,
      horaFin: form.horaFin,
      motivo: form.motivo.trim(),
    };

    onSubmit?.(payload, initial);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? "Editar reserva" : "Nueva reserva"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 text-sm">
          {/* Usuario */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-800">Usuario</label>
            <select
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              value={form.usuarioID}
              onChange={(e) => handleChange("usuarioID", e.target.value)}
            >
              <option value="">Selecciona un usuario...</option>
              {usuarios.map((u) => (
                <option key={u.usuarioID} value={u.usuarioID}>
                  {u.nombreCompleto ?? u.nombre}
                </option>
              ))}
            </select>
            {errors.usuarioID && (
              <p className="text-xs text-rose-600 mt-0.5">{errors.usuarioID}</p>
            )}
          </div>

          {/* Amenidad */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-800">Amenidad</label>
            <select
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              value={form.amenidadID}
              onChange={(e) => handleChange("amenidadID", e.target.value)}
            >
              <option value="">Selecciona una amenidad...</option>
              {amenidades.map((a) => (
                <option key={a.amenidadID} value={a.amenidadID}>
                  {a.nombre}
                </option>
              ))}
            </select>
            {errors.amenidadID && (
              <p className="text-xs text-rose-600 mt-0.5">
                {errors.amenidadID}
              </p>
            )}
          </div>

          {/* Fecha */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-800">
              Fecha de reserva
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              value={form.fechaReserva}
              onChange={(e) => handleChange("fechaReserva", e.target.value)}
            />
            {errors.fechaReserva && (
              <p className="text-xs text-rose-600 mt-0.5">
                {errors.fechaReserva}
              </p>
            )}
          </div>

          {/* Horario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-medium text-slate-800">
                Hora de inicio
              </label>
              <input
                type="time"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                value={form.horaInicio}
                onChange={(e) => handleChange("horaInicio", e.target.value)}
              />
              {errors.horaInicio && (
                <p className="text-xs text-rose-600 mt-0.5">
                  {errors.horaInicio}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-800">
                Hora de fin
              </label>
              <input
                type="time"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                value={form.horaFin}
                onChange={(e) => handleChange("horaFin", e.target.value)}
              />
              {errors.horaFin && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.horaFin}</p>
              )}
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-800">
              Motivo de la reserva
            </label>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              value={form.motivo}
              onChange={(e) => handleChange("motivo", e.target.value)}
              placeholder="Ej. Reunión familiar, clase de yoga, evento social..."
            />
            {errors.motivo && (
              <p className="text-xs text-rose-600 mt-0.5">{errors.motivo}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isEdit ? "Guardar cambios" : "Crear reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
