const medidas = Object.create(null);
Object.defineProperty(window, 'metricasPWA', {value: medidas});
function registrar(nombre, valor) {
  const [bueno, pobre] = {CLS:[0.1,0.25], LCP:[2500,4000], INP:[200,500]}[nombre];
  medidas[nombre] = {
    valor: Number(valor.toFixed(nombre === 'CLS' ? 4 : 1)),
    unidad: nombre === 'CLS' ? 'sin unidad' : 'ms',
    estado: valor <= bueno ? 'bueno' : valor <= pobre ? 'por mejorar' : 'pobre',
    origen: 'PerformanceObserver (laboratorio)'
  };
}
export function activarMetricas() {
  if (!window.PerformanceObserver) return;
  const observadores = [];
  function observar(tipo, procesar, opciones = {}) {
    if (!PerformanceObserver.supportedEntryTypes.includes(tipo)) return;
    const observador = new PerformanceObserver(lista => procesar(lista.getEntries()));
    observador.observe({type:tipo, buffered:true, ...opciones});
    observadores.push({observador, procesar});
  }
  observar('largest-contentful-paint', entradas => {
    const ultima = entradas.at(-1);
    if (ultima) registrar('LCP', ultima.startTime);
  });
  let acumulado = 0, maximo = 0, inicio = -Infinity, anterior = -Infinity;
  observar('layout-shift', entradas => {
    for (const entrada of entradas) {
      if (entrada.hadRecentInput) continue;
      const t = entrada.startTime;
      if (t - inicio >= 5000 || t - anterior >= 1000) {
        inicio = t;
        acumulado = 0;
      }
      anterior = t;
      acumulado += entrada.value;
      maximo = Math.max(maximo, acumulado);
    }
    registrar('CLS', maximo);
  });
  if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) registrar('CLS', 0);
  const interacciones = new Map();
  const interaccionesMaximas = 50;
  observar('event', entradas => {
    for (const {interactionId, duration} of entradas) {
      if (interactionId) interacciones.set(interactionId, Math.max(duration, interacciones.get(interactionId) ?? 0));
    }
    const orden = [...interacciones].sort((a,b) => b[1] - a[1]);
    orden.slice(50).forEach(([id]) => interacciones.delete(id));
    const posicion = Math.floor((performance.interactionCount || interacciones.size) / 50);
    const registro = orden[Math.min(49, orden.length - 1, posicion)];
    if (registro) registrar('INP', registro[1]);
  }, {durationThreshold:16});
  window.addEventListener('pagehide', evento => {
    observadores.forEach(({observador, procesar}) => {
      procesar(observador.takeRecords());
      if (!evento.persisted) observador.disconnect();
    });
  });
}
