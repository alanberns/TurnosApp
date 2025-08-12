export default function Paso2FechaHorario({
    servicio,
    fechaStr,
    todayStr,
    onFechaChange,
    slots,
    loading,
    horaSel,
    onHoraChange,
    onBack,
    onContinuar
  }) {
    return (
      <section className="rounded border p-4 bg-white mt-6">
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-gray-600 hover:text-gray-800 underline"
            onClick={onBack}
          >
            ← Cambiar servicio
          </button>
          <div className="text-sm text-gray-600">
            {servicio.nombre} — {servicio.duracionMinutos} min
          </div>
        </div>
  
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          className="border rounded px-3 py-2 mb-4"
          value={fechaStr}
          min={todayStr}
          onChange={onFechaChange}
        />
  
        {loading ? (
          <p className="text-gray-500">Cargando horarios...</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">Elegí un horario:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((s) => {
                const label = s.fechaHoraInicio.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                });
                const selected = horaSel === label;
                return (
                  <button
                    key={s.id + label}
                    type="button"
                    disabled={!s.disponible}
                    className={`px-3 py-2 rounded border text-sm
                      ${
                        !s.disponible
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white hover:bg-indigo-50"
                      }
                    `}
                    aria-pressed={selected}
                    onClick={() => onHoraChange(label)}
                    title={s.disponible ? "Disponible" : "Completo"}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
  
            <div className="mt-6 flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded ${
                  !horaSel
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                disabled={!horaSel}
                onClick={onContinuar}
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </section>
    );
  }
  