export default function Paso1Servicio({ servicios, loading, onSelect }) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Elegí un servicio</h2>
        {loading ? (
          <p className="text-gray-500">Cargando servicios...</p>
        ) : servicios.length === 0 ? (
          <p className="text-gray-500">No hay servicios disponibles.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {servicios.map((serv) => (
              <li key={serv.id} className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col">
                <h3 className="text-lg font-bold mb-1">{serv.nombre}</h3>
                <p className="text-sm text-gray-600">Duración: {serv.duracionMinutos} min</p>
                {typeof serv.precio === "number" && (
                  <p className="text-sm text-gray-600 mt-1">Precio: ${serv.precio}</p>
                )}
                <button
                  className="mt-4 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
                  onClick={() => onSelect(serv)}
                >
                  Elegir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }
  