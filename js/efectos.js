/* efectos.js - Animación de aparición al hacer scroll.
   Se carga después de que app.js dibuje las tarjetas y menu.js mueva los filtros. */

/* Prepara las animaciones una vez por documento. Si el navegador carece
   de IntersectionObserver, deja el contenido visible sin añadir clases. */
(function inicializarEfectos() {
    const marca = Symbol.for("pagina-personal.Efectos");
    if (document[marca] || !("IntersectionObserver" in window)) return;
    document[marca] = true;

    /* Anima cada elemento la primera vez que entra en pantalla. Al dejar
       de observarlo, se evita seguir recibiendo avisos para ese elemento. */
    const observador = new IntersectionObserver(entradas => {
        for (const entrada of entradas) {
            if (!entrada.isIntersecting || !entrada.target.isConnected) continue;
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
        }
    }, { threshold: 0.12 });

    /* Prepara un elemento y conserva su retraso si ya estaba marcado.
       También reanuda la observación de los elementos pendientes al volver. */
    function marcar(el, retraso = 0) {
        if (el.classList.contains("visible")) return;
        if (!el.classList.contains("reveal")) {
            el.classList.add("reveal");
            el.style.setProperty("--d", retraso + "s");
        }
        observador.observe(el);
    }

    /* Escalona las tarjetas por su posición en la fila. Solo observa las
       que todavía deben aparecer, incluidas las recién creadas al filtrar. */
    function marcarTarjetas(grid) {
        [...grid.children].forEach((col, i) => {
            if (col.classList.contains("col-12")) marcar(col, (i % 3) * 0.12);
        });
    }

    const selectorFijos = ".titulo-seccion, .horario-documento, .contenedor-musica, .filtros, .form-caja, .seccion-frase .container, .footer .container";
    const selectorGrids = "#grid-pasatiempos, #grid-intereses, #grid-juegos";
    const gridJuegos = document.getElementById("grid-juegos");

    /* En Juegos, libera las tarjetas retiradas aunque nunca hayan entrado
       en pantalla. Un solo observador detecta cada redibujado de la lista. */
    const cambiosJuegos = gridJuegos && new MutationObserver(cambios => {
        for (const cambio of cambios) {
            for (const nodo of cambio.removedNodes) {
                if (nodo.nodeType === Node.ELEMENT_NODE) observador.unobserve(nodo);
            }
        }
        marcarTarjetas(gridJuegos);
    });

    /* Registra los elementos que están en el documento y excluye los filtros
       que el menú movió al panel, donde deben aparecer sin animación de scroll. */
    function activarObservadores() {
        document.querySelectorAll(selectorFijos).forEach(el => {
            if (!el.closest(".hamb-panel")) marcar(el);
        });
        document.querySelectorAll(selectorGrids).forEach(marcarTarjetas);
        cambiosJuegos?.observe(gridJuegos, { childList: true });
    }

    /* Desconecta los observadores al salir y descarta avisos pendientes.
       Al volver desde la caché de navegación se observan los pendientes
       sin repetir las animaciones de los elementos ya visibles. */
    window.addEventListener("pagehide", () => {
        cambiosJuegos?.disconnect();
        observador.disconnect();
        observador.takeRecords();
    });
    window.addEventListener("pageshow", ev => {
        if (ev.persisted) activarObservadores();
    });
    activarObservadores();
})();
