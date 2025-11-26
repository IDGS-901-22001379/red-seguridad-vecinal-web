import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertasContext from "@/context/Alertas/AlertasContext";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function AdminAlertaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    alertaDetalle,
    loading,
    error,
    getAlertaDetalle,
    atenderAlerta,
    isAlertaActiva,
    clearError,
  } = useContext(AlertasContext);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      getAlertaDetalle(id);
    }
  }, [id]);

  const cerrarDetalle = () => {
    navigate("/admin/alertas", { replace: true });
  };

  const handleAtender = () => {
    setShowConfirm(true);
  };

  const confirmarAtender = async () => {
    if (!alertaDetalle) return;
    await atenderAlerta(alertaDetalle.alertaID);
    setShowConfirm(false);
    cerrarDetalle();
  };

  const formatFecha = (fecha) => {
    return fecha ? new Date(fecha).toLocaleString() : "—";
  };

  const DetalleItem = ({ label, value }) => (
    <div className="flex gap-4 py-2">
      <div className="w-32 text-slate-500 font-medium">{label}</div>
      <div className="flex-1 font-semibold text-slate-800">{value}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={cerrarDetalle} />
      
      <div className="relative w-[95%] max-w-2xl bg-white rounded-2xl shadow-2xl">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {alertaDetalle ? `Alerta #${alertaDetalle.alertaID}` : "Detalle de Alerta"}
          </h2>
          <button
            onClick={cerrarDetalle}
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <span>×</span>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading && <div className="py-8 text-center text-slate-500">Cargando detalle...</div>}
          {error && <div className="py-8 text-center text-red-600">{error}</div>}
          
          {!loading && !error && alertaDetalle && (
            <div className="space-y-1">
              <DetalleItem label="Folio" value={`#${alertaDetalle.alertaID}`} />
              <DetalleItem label="Fecha/Hora" value={formatFecha(alertaDetalle.fechaHora)} />
              <DetalleItem label="Vecino" value={alertaDetalle.nombreUsuario || `Usuario #${alertaDetalle.usuarioID}`} />
              <DetalleItem label="Email" value={alertaDetalle.emailUsuario || "—"} />
              <DetalleItem label="Tipo" value={alertaDetalle.tipoUsuario || "—"} />
              <DetalleItem label="Ubicación" value={`${alertaDetalle.latitud || "—"}, ${alertaDetalle.longitud || "—"}`} />
              
              <div className="flex gap-4 py-2">
                <div className="w-32 text-slate-500 font-medium">Estado</div>
                <div className="flex-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    isAlertaActiva(alertaDetalle) 
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}>
                    {isAlertaActiva(alertaDetalle) ? "ACTIVA" : "ATENDIDA"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={cerrarDetalle}
            className="px-4 py-2 rounded-full bg-slate-600 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Volver
          </button>
          
          {alertaDetalle && isAlertaActiva(alertaDetalle) && (
            <button
              onClick={handleAtender}
              className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Atender Alerta
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmarAtender}
        title="Confirmar Atención"
        confirmText="Atender Alerta"
        cancelText="Cancelar"
        message={
          alertaDetalle 
            ? `¿Estás seguro de marcar la alerta #${alertaDetalle.alertaID} como atendida?`
            : ""
        }
      />
    </div>
  );
}