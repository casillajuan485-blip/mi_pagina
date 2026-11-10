/* =====================================================
   efectos.js - Animación de aparición al hacer scroll
   Cargar DESPUÉS de app.js.
   Idea: cada elemento marcado con la clase "reveal" empieza
   invisible y, cuando entra en pantalla, recibe la clase
   "visible" y el CSS lo anima (sube y aparece).
===================================================== */

/* IntersectionObserver avisa cuando un elemento entra en la pantalla.
   threshold 0.12 = cuando se ve al menos el 12 % del elemento. */
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(en => {
        if (en.isIntersecting) {
            en.target.classList.add("visible");
            observador.unobserve(en.target);      /* se anima una sola vez */
        }
    });
}, { threshold: 0.12 });

/* Marca un elemento para que se anime. "retraso" escalona las tarjetas:
   cada una aparece un poquito después de la anterior. */
function marcar(el, retraso = 0) {
    if (el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    el.style.setProperty("--d", retraso + "s");
    observador.observe(el);
}

/* 1) Elementos fijos de la página */
document.querySelectorAll(
    ".titulo-seccion, .horario-documento, .contenedor-musica, .filtros, .form-caja, .seccion-frase .container, .footer .container"
).forEach(el => marcar(el));

/* 2) Tarjetas dibujadas por app.js (pasatiempos, intereses y juegos).
   Retraso máximo de 0.4 s para que no tarden en aparecer en listas largas. */
function marcarTarjetas(grid) {
    [...grid.children].forEach((col, i) => {
        if (col.classList.contains("col-12")) marcar(col, Math.min(i % 3, 3) * 0.12);
    });
}
const grids = document.querySelectorAll("#grid-pasatiempos, #grid-intereses, #grid-juegos");
grids.forEach(g => {
    marcarTarjetas(g);
    /* Los juegos se vuelven a dibujar al filtrar: MutationObserver detecta
       las tarjetas nuevas y también las anima. */
    new MutationObserver(() => marcarTarjetas(g)).observe(g, { childList: true });
});