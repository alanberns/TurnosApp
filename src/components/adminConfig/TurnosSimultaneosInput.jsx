export function TurnosSimultaneosInput({ value, onChange }) {
    return (
      <label className="block mt-4">
        Turnos simultáneos:
        <input
          type="number"
          min="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border p-1 ml-2"
        />
      </label>
    );
  }
  