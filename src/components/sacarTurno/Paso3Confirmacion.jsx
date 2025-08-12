export default function Paso3Confirmacion({
    servicio,
    fecha,
    horaSel,
    confirming,
    onBack,
    onConfirm
  }) {
    return (
      <section className="rounded border p-4 bg-white mt-6">
        <button
          className="text-gray-600 hover:text-gray-800 underline mb-4"
          onClick={onBack}
        >
          ← Cambiar fecha u horario
        </button>
  
        <h2 className="text-xl font-semibold mb-3">Revisá y confirmá</h2>
        <ul className="text-gray-700 mb-6 space-y-1">
          <li><span className="font-medium">Servicio:</span> {servicio.nombre}</li>
          <li><span className="font-medium">Duración:</span> {servicio.duracionMinutos} min</li>
          <li>
            <span className="font-medium">Fecha:</span>{" "}
            {fecha.toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </li>
          <li><span className="font-medium">Horario:</span> {horaSel} hs</li>
          {typeof servicio.precio === "number" && (
            <li><span className="font-medium">Precio:</span> ${servicio.precio}</li>
          )}
        </ul>
  
        <div className="flex items-center gap-3">
          <button
            disabled={confirming}
            className={`px-4 py-2 rounded ${
              confirming
                ? "bg-gray-300 text-gray-600 cursor-wait"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            onClick={onConfirm}
          >
            {confirming ? "Confirmando..." : "Confirmar turno"}
          </button>
          <button
            className="px-4 py-2 rounded border hover:bg-gray-50"
            onClick={onBack}
          >
            Volver
          </button>
        </div>
      </section>
    );
  }
  