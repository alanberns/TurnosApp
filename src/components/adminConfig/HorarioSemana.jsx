import { DiaHorarios } from "./DiaHorarios";

export function HorarioSemana({ diasSemana, horarios, onAgregar, onActualizar, onEliminar }) {
  return (
    <>
      <h3 className="mt-6 font-semibold">Horarios semanales</h3>
      {diasSemana.map((dia, idxDia) => (
        <DiaHorarios
          key={dia}
          dia={dia}
          franjas={horarios[idxDia] || []}
          onAdd={() => onAgregar(idxDia)}
          onUpdate={(idxFranja, campo, valor) => onActualizar(idxDia, idxFranja, campo, valor)}
          onDelete={(idxFranja) => onEliminar(idxDia, idxFranja)}
        />
      ))}
    </>
  );
}
