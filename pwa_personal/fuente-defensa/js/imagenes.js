export function cargarDiapositiva(diapositiva) {
  const imagen = diapositiva.querySelector('img[data-src]');
  if (!imagen) return;
  imagen.src = imagen.dataset.src;
  delete imagen.dataset.src;
}
