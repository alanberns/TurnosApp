import { useEffect, useState } from "react";
import { fetchServicios } from "../../db/service/fetchServicios";
import { obtenerConfigYSlots, generarSlotsOfrecibles, reservarTurnoYSlots } from "../../db/dbTurnos";
import Paso1Servicio from "../../components/sacarTurno/Paso1Servicio";
import Paso2FechaHorario from "../../components/sacarTurno/Paso2FechaHorario";
import Paso3Confirmacion from "../../components/sacarTurno/Paso3Confirmacion";
import { useAuthStore } from "../../store/useAuthStore";

const TAMANO_SLOT_MIN = 15;

export default function SacarTurno() {
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [step, setStep] = useState(1);
  const [servicioSel, setServicioSel] = useState(null);

  const [fecha, setFecha] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const [slots, setSlots] = useState([]);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [horaSel, setHoraSel] = useState("");

  const [confirming, setConfirming] = useState(false);

  const user = useAuthStore((state) => state.user);

  // Helpers
  const formatDateInput = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const todayStr = formatDateInput(new Date());
  const fechaStr = formatDateInput(fecha);

  function dateFromDayAndTime(fecha, horaSel) {
    const [h, m] = horaSel.split(":").map(Number);
    const d = new Date(fecha); // usa la zona horaria local (AR)
    d.setHours(h, m, 0, 0);
    return d;
  }
  

  // Paso 1: cargar servicios
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingServicios(true);
        const data = await fetchServicios();
        if (alive) setServicios(data);
      } catch {
        if (alive) setError("No pudimos cargar los servicios.");
      } finally {
        if (alive) setLoadingServicios(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Paso 2: cargar slots ofrecibles
  useEffect(() => {
    if (!servicioSel) return;

    let alive = true;
    (async () => {
      try {
        setLoadingHoras(true);
        const { horarioAtencion, turnosSimultaneos, slotsRegistrados, minutosSlot } =
          await obtenerConfigYSlots(fecha);

        const ofrecibles = generarSlotsOfrecibles(
          fecha,
          horarioAtencion,
          minutosSlot,
          slotsRegistrados,
          turnosSimultaneos,
          servicioSel.duracionMinutos
        );

        if (alive) setSlots(ofrecibles); 
      } catch (err) {
        console.error(err);
        if (alive) setError("No pudimos cargar los horarios.");
        if (alive) setSlots([]);
      } finally {
        if (alive) setLoadingHoras(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [servicioSel, fecha]);

  // Paso 3: confirmar turno (stub temporal)
  const handleConfirm = async () => {
    if (!user?.uid) {
      setError("Tenés que iniciar sesión para reservar.");
      return;
    }
    if (!servicioSel || !horaSel) return;
  
    setConfirming(true);
    setError("");
    setSuccessMsg("");
  
    try {
      const inicioDate = dateFromDayAndTime(fecha, horaSel);
    
      const { turnoId } = await reservarTurnoYSlots({
        slotInicio: inicioDate,
        duracionMinutos: servicioSel.duracionMinutos,
        userUid: user.uid,
        servicioUid: servicioSel.id
      });
  
      setSuccessMsg(`Turno confirmado (${turnoId}) para ${horaSel} de ${servicioSel.nombre}`);
      setStep(1);
      setServicioSel(null);
      setHoraSel("");
    } catch (e) {
      console.error(e);
      setError(
        e.message === "Sin disponibilidad en uno de los tramos."
          ? "Ese horario se reservó recién. Elegí otro."
          : "No pudimos confirmar el turno. Probá de nuevo."
      );
    } finally {
      setConfirming(false);
    }
  };
  
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Sacar turno</h1>
      <p className="text-gray-600 mb-6">
        Elegí un servicio, seleccioná fecha y horario, y confirmá tu reserva.
      </p>

      {/* Mensajes */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {successMsg}
        </div>
      )}

      {/* Render dinámico por step */}
      {step === 1 && (
        <Paso1Servicio
          servicios={servicios}
          loading={loadingServicios}
          onSelect={(serv) => {
            setServicioSel(serv);
            setHoraSel("");
            setStep(2);
          }}
        />
      )}

      {step === 2 && servicioSel && (
        <Paso2FechaHorario
          servicio={servicioSel}
          fechaStr={fechaStr}
          todayStr={todayStr}
          onFechaChange={(e) => {
            const [y, m, d] = e.target.value.split("-").map(Number);
            setFecha(new Date(y, m - 1, d));
            setHoraSel("");
          }}
          slots={slots}
          loading={loadingHoras}
          horaSel={horaSel}
          onHoraChange={setHoraSel}
          onBack={() => {
            setServicioSel(null);
            setHoraSel("");
            setStep(1);
          }}
          onContinuar={() => setStep(3)}
        />
      )}

      {step === 3 && servicioSel && horaSel && (
        <Paso3Confirmacion
          servicio={servicioSel}
          fecha={fecha}
          horaSel={horaSel}
          confirming={confirming}
          onBack={() => setStep(2)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
