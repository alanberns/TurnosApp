import { useState } from "react";

export default function InfoMessage({ type = "info", message }) {
  const [visible, setVisible] = useState(true);

  const baseStyles = "p-3 rounded-md text-sm font-medium mt-2 relative";
  const styles = {
    info: "bg-blue-100 text-blue-800 border border-blue-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    error: "bg-red-100 text-red-800 border border-red-300",
  };

  if (!visible) return null;

  return (
    <div className={`${baseStyles} ${styles[type]}`}>
      {message}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 text-lg text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
}


