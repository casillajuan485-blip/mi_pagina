import {$} from './utilidades.js';
export function hidratarControles(raiz, espacio) {
  return $(raiz).off('.' + espacio);
}
