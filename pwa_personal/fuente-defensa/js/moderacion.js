import {normalize} from './utilidades.js';
const palabrasBloqueadas = new Set(['carajo','cojudo','cojuda','gilipollas','huevon','huevona','imbecil','mierda','pendejo','pendeja','puta','puto','putas','putos','cabron','cabrona','conchudo','conchuda','idiota']);
export function tienePalabrasInapropiadas(texto) {
  const palabras = normalize(texto).replace(/[\u200B-\u200D\uFEFF]/g, '').match(/[\p{L}\p{N}]+/gu) ?? [];
  return palabras.some(palabra => palabrasBloqueadas.has(palabra));
}
