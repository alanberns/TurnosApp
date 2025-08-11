// Convierte array de arrays a objeto { "0": [...], "1": [...] }
export function serializeHorarios(horariosArray) {
    const obj = {};
    for (let i = 0; i < 7; i++) {
      const franjas = Array.isArray(horariosArray?.[i]) ? horariosArray[i] : [];
      obj[String(i)] = franjas;
    }
    return obj;
  }
  
  // Convierte objeto/array desde DB a array de arrays para la UI
  export function deserializeHorarios(horariosDoc) {
    const result = [];
    if (Array.isArray(horariosDoc)) {
      for (let i = 0; i < 7; i++) {
        result[i] = Array.isArray(horariosDoc[i]) ? horariosDoc[i] : [];
      }
    } else {
      for (let i = 0; i < 7; i++) {
        const key = String(i);
        result[i] = Array.isArray(horariosDoc?.[key]) ? horariosDoc[key] : [];
      }
    }
    return result;
  }
  