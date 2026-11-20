// DOMPurify prepara la ruta de tratamiento obligatoria de texto externo.
let purificador;
let carga;
export function prepararSanitizacion() {
  carga ??= import(new URL('js/librerias/dompurify.mjs', document.baseURI).href)
    .then(({default: instancia}) => {
      if (!instancia?.isSupported) throw new Error('DOMPurify no disponible');
      purificador = instancia;
    });
  return carga;
}

// El formulario y los catálogos llaman a esta función antes de mostrar o guardar texto.
export function textoSeguro(valor) {
  if (!purificador) throw new Error('Sanitización no inicializada');
  const texto = String(valor ?? '');
  const reglas = {ALLOWED_TAGS: [], ALLOWED_ATTR: []};
  if (!/[<&]/.test(texto)) return purificador.sanitize(texto, reglas);
  // El fragmento evita interpretar el resultado en el DOM de la página.
  const limpio = purificador.sanitize(texto.replaceAll('&', '&amp;'), {
    ...reglas, RETURN_DOM_FRAGMENT: true
  });
  return limpio.textContent;
}
