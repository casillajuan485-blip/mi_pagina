/* =====================================================
   menu.js - Menú hamburguesa (☰) en cada sección
   Cargar DESPUÉS de app.js y efectos.js.
   Qué hace:
   - Crea un botón ☰ y un panel en cada sección.
   - En Música y Juegos MUEVE los filtros (que dibuja app.js) dentro
     del panel; siguen funcionando igual porque se mueve el mismo
     elemento, no una copia.
   - En todas agrega atajos: siguiente sección, subir y ocultar contenido.
===================================================== */

const SECCIONES = ["pasatiempos", "intereses", "horarios", "musica", "juegos", "opinion"];

/* Cierra todos los paneles (menos "excepto") y restaura el ícono ☰ */
function cerrarPaneles(excepto) {
    document.querySelectorAll(".hamb-panel.abierto").forEach(p => {
        if (p === excepto) return;
        p.classList.remove("abierto");
        p.inert = true;
        p.setAttribute("aria-hidden", "true");
        const b = p.parentElement.querySelector(".hamb");
        b.setAttribute("aria-expanded", "false");
        b.innerHTML = '<i class="bi bi-list"></i>';
    });
}

SECCIONES.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const cont = sec.querySelector(".container");
    // OPTIMIZACIÓN: la marca evita duplicar botones, paneles y escuchadores
    // si la función de inicialización se ejecuta nuevamente.
    if (!cont || sec.dataset.menuInicializado === "true") return;
    sec.dataset.menuInicializado = "true";

    /* Botón ☰ */
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hamb";
    btn.setAttribute("aria-label", "Menú de la sección");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<i class="bi bi-list"></i>';

    /* Panel flotante */
    const panel = document.createElement("div");
    panel.className = "hamb-panel";
    /* Un panel cerrado también queda fuera del teclado y de los clics.
       Esto evita que sus filtros se activen sobre las tarjetas visibles. */
    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");

    /* Si la sección tiene filtros, se mueven al panel */
    const filtros = sec.querySelector(".filtros");
    if (filtros) {
        panel.innerHTML = '<div class="hamb-titulo">FILTROS</div>';
        filtros.classList.remove("reveal", "visible");           /* quita la animación de scroll */
        filtros.style.removeProperty("--d");
        panel.appendChild(filtros);

        /* El panel se cierra SOLO cuando eliges una subcategoría (2.º paso).
           Elegir la categoría o "Solo favoritos" lo deja abierto.
           Se usa composedPath() porque al elegir, app.js vuelve a dibujar los
           chips y el elemento tocado ya no está en la página. */
        panel.addEventListener("click", ev => {
            const ruta = ev.composedPath();
            const esChip = ruta[0].classList && ruta[0].classList.contains("chip");
            const enSub = ruta.some(n => n.dataset && n.dataset.nivel === "sub");
            if (esChip && enSub) setTimeout(() => cerrarPaneles(), 250);
        });
    }

    /* Atajos (aparecen en todas las secciones) */
    const acciones = document.createElement("div");
    acciones.className = "hamb-acciones";
    acciones.innerHTML = `
        <button type="button" data-a="sig"><i class="bi bi-arrow-down-circle"></i> Siguiente sección</button>
        <button type="button" data-a="inicio"><i class="bi bi-arrow-up-circle"></i> Subir al inicio</button>
        <button type="button" data-a="plegar"><i class="bi bi-eye-slash"></i> <span>Ocultar contenido</span></button>`;
    panel.appendChild(acciones);

    cont.prepend(panel);
    cont.prepend(btn);

    /* Abrir / cerrar el panel de esta sección */
    btn.addEventListener("click", ev => {
        ev.stopPropagation();
        cerrarPaneles(panel);                         /* solo uno abierto a la vez */
        const abre = !panel.classList.contains("abierto");
        panel.classList.toggle("abierto", abre);
        panel.inert = !abre;
        panel.setAttribute("aria-hidden", String(!abre));
        btn.setAttribute("aria-expanded", String(abre));
        btn.innerHTML = abre ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });

    /* Acciones del panel */
    acciones.addEventListener("click", ev => {
        const a = ev.target.closest("button")?.dataset.a;
        if (!a) return;
        if (a === "sig" && sec.nextElementSibling)
            sec.nextElementSibling.scrollIntoView({ behavior: "smooth" });
        if (a === "inicio") window.scrollTo({ top: 0, behavior: "smooth" });
        if (a === "plegar") {
            const plegada = sec.classList.toggle("plegada");
            const boton = ev.target.closest("button");
            boton.querySelector("span").textContent = plegada ? "Mostrar contenido" : "Ocultar contenido";
            boton.querySelector("i").className = plegada ? "bi bi-eye" : "bi bi-eye-slash";
        }
        cerrarPaneles();
    });
});

/* Tocar fuera de un panel o pulsar Esc lo cierra */
document.addEventListener("click", ev => {
    /* composedPath: la ruta original del clic, aunque el elemento tocado
       haya sido reemplazado al redibujar los chips de filtros */
    const dentro = ev.composedPath().some(n =>
        n.classList && (n.classList.contains("hamb-panel") || n.classList.contains("hamb")));
    if (!dentro) cerrarPaneles();
});
document.addEventListener("keydown", ev => { if (ev.key === "Escape") cerrarPaneles(); });

/* =====================================================
   NAVEGACIÓN COMPACTA PWA (sin alterar app.js original)
===================================================== */
(() => {
    const mediaMovil = window.matchMedia("(max-width: 767.98px)");
    const ids = ["inicio","pasatiempos","intereses","horarios","musica","juegos","opinion"];
    let vistaActual = "inicio";

    function cambiarVista(id) {
        if (!ids.includes(id)) return;
        cerrarMas(false);
        vistaActual = id;
        document.body.dataset.appVista = mediaMovil.matches ? id : "";
        if (!mediaMovil.matches) return;
        ids.forEach(nombre => {
            const seccion = document.getElementById(nombre);
            if (!seccion) return;
            const visible = nombre === id;
            seccion.classList.toggle("app-vista-activa", visible);
            if (visible) seccion.scrollTop = 0;
        });
        document.querySelectorAll("[data-app-vista]").forEach(boton => {
            const activo = boton.dataset.appVista === id;
            boton.classList.toggle("activo", activo);
            if (boton.closest(".app-movil-nav")) {
                boton.setAttribute("aria-current", activo ? "page" : "false");
            }
        });
        const enMas = ["intereses", "horarios", "opinion"].includes(id);
        botonMas?.classList.toggle("activo", enMas);
        botonMas?.setAttribute("aria-current", enMas ? "true" : "false");
        cerrarPaneles();
    }

    const botonMas = document.getElementById("app-mas-abrir");
    const panelMas = document.getElementById("app-mas-panel");
    const fondoMas = document.querySelector(".app-mas-fondo");
    const cerrarBoton = document.getElementById("app-mas-cerrar");
    let elementosInertes = [];

    /* Abre el panel y lleva el foco al primer acceso. El fondo queda inerte
       mientras el diálogo está abierto, para evitar pulsaciones accidentales
       y mantener la navegación con teclado dentro de sus controles. */
    function abrirMas() {
        if (!mediaMovil.matches || !panelMas || !panelMas.hidden) return;
        panelMas.hidden = false;
        fondoMas.hidden = false;
        botonMas.setAttribute("aria-expanded", "true");
        elementosInertes = [...document.body.children].filter(el =>
            el !== panelMas && el !== fondoMas && !el.inert &&
            !["SCRIPT", "LINK", "STYLE"].includes(el.tagName));
        elementosInertes.forEach(el => { el.inert = true; });
        panelMas.querySelector("[data-app-vista]").focus();
    }

    /* Cierra el diálogo y restaura la interacción de la página. Al cancelar,
       devuelve el foco a Más. Al elegir una vista, lo lleva a su título. */
    function cerrarMas(restaurarFoco = true) {
        if (!panelMas || panelMas.hidden) return;
        panelMas.hidden = true;
        fondoMas.hidden = true;
        botonMas.setAttribute("aria-expanded", "false");
        elementosInertes.forEach(el => { el.inert = false; });
        elementosInertes = [];
        if (restaurarFoco) botonMas.focus();
    }

    botonMas?.addEventListener("click", abrirMas);
    cerrarBoton?.addEventListener("click", () => cerrarMas());
    fondoMas?.addEventListener("click", () => cerrarMas());
    panelMas?.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-app-vista]");
        if (!boton || !panelMas.contains(boton)) return;
        const id = boton.dataset.appVista;
        cambiarVista(id);
        const titulo = document.querySelector("#" + id + " .titulo-seccion h2");
        if (titulo) {
            titulo.setAttribute("tabindex", "-1");
            titulo.focus({ preventScroll: true });
        }
    });
    /* Escape cancela. Tab y Mayús+Tab recorren los controles del diálogo
       sin perder el foco detrás del panel o en la barra del navegador. */
    panelMas?.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            evento.preventDefault();
            cerrarMas();
        }
        if (evento.key !== "Tab") return;
        const controles = [...panelMas.querySelectorAll("button")];
        const primero = controles[0];
        const ultimo = controles[controles.length - 1];
        if (evento.shiftKey && document.activeElement === primero) {
            evento.preventDefault();
            ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault();
            primero.focus();
        }
    });

    // INICIALIZACIÓN PROGRESIVA:(principio de hidratacion) el HTML ya contiene los botones.
    // Un solo listener delegado controla los botones actuales y futuros,
    // evitando registrar un listener por botón al volver a inicializar.
    const zonaNavegacion = document.querySelector(".app-movil-nav");
    if (zonaNavegacion && zonaNavegacion.dataset.eventosListos !== "true") {
        zonaNavegacion.dataset.eventosListos = "true";
        zonaNavegacion.addEventListener("click", evento => {
            const boton = evento.target.closest("[data-app-vista]");
            if (boton && zonaNavegacion.contains(boton)) {
                cambiarVista(boton.dataset.appVista);
            }
        });
    }

    // Accesos rápidos de la portada: reutilizan el mismo controlador.
    const accesos = document.querySelector(".app-movil-accesos");
    if (accesos && accesos.dataset.eventosListos !== "true") {
        accesos.dataset.eventosListos = "true";
        accesos.addEventListener("click", evento => {
            const boton = evento.target.closest("[data-app-vista]");
            if (boton && accesos.contains(boton)) cambiarVista(boton.dataset.appVista);
        });
    }

    // Los enlaces de la navbar original siguen funcionando en escritorio.
    // Si se usa un enlace interno en móvil, abrimos su panel.
    document.addEventListener("click", evento => {
        const enlace = evento.target.closest('a[href^="#"]');
        if (!enlace || !mediaMovil.matches) return;
        const id = enlace.getAttribute("href").slice(1);
        if (ids.includes(id)) {
            evento.preventDefault();
            cambiarVista(id);
        }
    });

    // Los accesos de cada menú de sección apuntan a paneles, no a scroll global.
    document.querySelectorAll(".hamb-acciones").forEach(acciones => {
        acciones.addEventListener("click", evento => {
            if (!mediaMovil.matches) return;
            const accion = evento.target.closest("[data-a]")?.dataset.a;
            if (accion === "sig" || accion === "inicio") {
                // En móvil cambiamos de vista; impedimos que el manejador
                // de escritorio también intente desplazar toda la página.
                evento.stopPropagation();
                evento.preventDefault();
            }
            if (accion === "sig") {
                const siguiente = ids[(ids.indexOf(vistaActual) + 1) % ids.length];
                cambiarVista(siguiente);
            } else if (accion === "inicio") {
                cambiarVista("inicio");
            }
        }, true);
    });

    const botonTema = document.getElementById("app-movil-tema");
    botonTema?.addEventListener("click", () => {
        document.getElementById("btn-tema")?.click();
        actualizarIconoTema();
    });
    function actualizarIconoTema() {
        const claro = document.documentElement.dataset.tema === "claro";
        botonTema?.setAttribute("aria-label", claro ? "Activar modo oscuro" : "Activar modo claro");
        botonTema?.setAttribute("title", claro ? "Activar modo oscuro" : "Activar modo claro");
        const icono = botonTema?.querySelector("i");
        if (icono) icono.className = claro ? "bi bi-sun-fill" : "bi bi-moon-stars";
    }
    // MEMORY LEAK: guardamos la referencia para desconectar el observador
    // al abandonar la página; al restaurar desde BFCache se vuelve a conectar.
    const observadorTema = new MutationObserver(actualizarIconoTema);
    function observarTema() {
        observadorTema.observe(document.documentElement, {
            attributes: true, attributeFilter: ["data-tema"]
        });
    }
    observarTema();
    window.addEventListener("pagehide", () => observadorTema.disconnect());
    window.addEventListener("pageshow", observarTema);
    actualizarIconoTema();

    function aplicarModo() {
        cerrarMas(false);
        document.body.dataset.appVista = mediaMovil.matches ? vistaActual : "";
        if (mediaMovil.matches) cambiarVista(vistaActual);
        else ids.forEach(id => document.getElementById(id)?.classList.remove("app-vista-activa"));
    }
    mediaMovil.addEventListener("change", aplicarModo);
    aplicarModo();
})();
