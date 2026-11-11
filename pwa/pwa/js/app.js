/* =====================================================
   app.js - Interactividad de la página personal
   Bloques: 1 Tema | 2 Datos | 3 Favoritos | 4 Tarjetas que se
   voltean | 5 Filtros | 6 Pasatiempos e Intereses | 7 Música |
   8 Juegos | 9 Formulario
===================================================== */

/* ---------- 1. MODO OSCURO / CLARO ----------
   Cambia el atributo data-tema de <html>; el CSS reacciona.
   La elección se guarda en localStorage. */
const btnTema = document.getElementById("btn-tema");
function aplicarTema(t) {
    document.documentElement.dataset.tema = t;
    btnTema.innerHTML = t === "claro"
        ? '<i class="bi bi-moon-stars-fill"></i>'
        : '<i class="bi bi-sun-fill"></i>';
    localStorage.setItem("tema", t);
}
aplicarTema(localStorage.getItem("tema") || "oscuro");
btnTema.addEventListener("click", () =>
    aplicarTema(document.documentElement.dataset.tema === "claro" ? "oscuro" : "claro"));

/* ---------- 2. DATOS (aquí agregas o editas contenido) ---------- */

/* Pasatiempos: insignia = etiqueta pequeña, icono = ícono de Bootstrap Icons */
const pasatiempos = [
    { titulo: "Dibujar", insignia: "Creatividad", icono: "bi-palette-fill",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
      desc: "Me gusta expresar mi creatividad, realizar dibujos y representar ideas mediante el arte cuando estoy en mis tiempos libres." },
    { titulo: "Ver películas", insignia: "Cine", icono: "bi-film",
      img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      desc: "Disfruto ver películas, conocer nuevas historias y entretenerme con diferentes géneros cinematográficos soy muy fanatico de las peliculas y las amo." },
    { titulo: "Videojuegos", insignia: "Gaming", icono: "bi-controller",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      desc: "Me gusta jugar videojuegos, superar desafíos y disfrutar de experiencias de aventura y estrategia en los juegos que juego y me entretienen demasiado amo los videojuegos :)." },
    { titulo: "Practicar Deportes", insignia: "Deporte", icono: "bi-dribbble",
      img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
      desc: "Me gusta practicar deportes, especialmente el fútbol, porque me ayuda a mantenerme activo y compartir con otras personas o amigos mas que todo me adapto a cualquier posesion en el futbol :)." },
    { titulo: "Escuchar música", insignia: "Música", icono: "bi-music-note-beamed",
      img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
      desc: "La música me acompaña en diferentes momentos y me permite relajarme y disfrutar de mi tiempo mas que todo cuando realizo tareas  o momentos de descanso me facina :)." },
    { titulo: "Jugar con mis mascotas", insignia: "Familia", icono: "bi-rocket-takeoff-fill",
      img: "img/pasatiempo.jpg",
      desc: "Jugar con mis mascotas me pone contento y feliz son mi familia de 4 patas mas mi hermano :) los amos a mis peluditos." }
];

const intereses = [
    { titulo: "Aprender inglés", insignia: "01", icono: "bi-translate",
      img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
      desc: "para poder mejorar mi vocabulario, pronunciación y capacidad de comunicación." },
    { titulo: "Bases de datos", insignia: "02", icono: "bi-database-fill",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      desc: "Aprender a diseñar, organizar y administrar información." },
    { titulo: "Programación", insignia: "03", icono: "bi-code-slash",
      img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
      desc: "Desarrollar mi lógica y aprender diferentes lenguajes de programación." },
    { titulo: "Desarrollo web", insignia: "04", icono: "bi-globe2",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      desc: "Crear páginas web utilizando HTML, CSS, Bootstrap y otras tecnologías." },
    { titulo: "Nuevas tecnologías", insignia: "05", icono: "bi-cpu-fill",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      desc: "Conocer herramientas digitales, inteligencia artificial y tendencias tecnológicas." },
    { titulo: "Desarrollo personal", insignia: "06", icono: "bi-rocket-takeoff-fill",
      img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80",
      desc: "Fortalecer mi disciplina, creatividad, responsabilidad y pensamiento lógico." }
];

/* Canciones: "id" es el código del video de YouTube (lo que va después de
   v= en el enlace). Si lo dejas vacío, el botón play abre una búsqueda en
   YouTube con el título y el artista. Pega aquí el id para ver la miniatura. */
const canciones = [
    { titulo: "Imagine", artista: "John Lennon", cat: "Clásicos", sub: "Balada", id: "YkgkThdzX-8" },
    { titulo: "And I Love Her", artista: "The Beatles", cat: "Clásicos", sub: "Rock clásico", id: "27CrzjaI-qw" },
    { titulo: "Right Now", artista: "Nick Jonas y Robin Schulz", cat: "Pop", sub: "Electrónica", id: "Sc97AUImI04" },
    { titulo: "I Know", artista: "Drake Bell", cat: "Pop", sub: "Pop rock", id: "IHPTi-SX_2s" },
    { titulo: "Somebody That I Used to Know", artista: "Gotye", cat: "Indie", sub: "Indie pop", id: "8UVNT4wvIGY" },
    { titulo: "Never Gonna Give You Up", artista: "Rick Astley", cat: "Clásicos", sub: "Pop 80s", id: "dQw4w9WgXcQ" },
    { titulo: "Rude", artista: "MAGIC!", cat: "Pop", sub: "Reggae pop", id: "PIh2xe4jnpk" },
    { titulo: "24K Magic", artista: "Bruno Mars", cat: "Pop", sub: "Funk pop", id: "UqyT8IEBkvY" },
    { titulo: "Lobo hombre en París", artista: "La Unión", cat: "Latino", sub: "Pop rock 80s", id: "sl4GO6pgRas" },
    { titulo: "Words", artista: "F. R. David", cat: "Clásicos", sub: "Pop 80s", id: "PTsSk0r_Tq8" },
    { titulo: "Put Your Head on My Shoulder", artista: "Paul Anka", cat: "Clásicos", sub: "Balada", id: "g9mFVdeP8c0" },
    { titulo: "Tengo todo excepto a ti", artista: "Luis Miguel", cat: "Latino", sub: "Balada", id: "R3DjH-4H_xU" },
    { titulo: "Close to You", artista: "Dayglow", cat: "Indie", sub: "Indie pop", id: "otPB54Wxf5c" },
    { titulo: "Every Breath You Take", artista: "The Police", cat: "Rock", sub: "Rock clásico", id: "OMOGaugKpzs" },
    { titulo: "In the Shadows", artista: "The Rasmus", cat: "Rock", sub: "Rock alternativo", id: "7gwO8-oqwFw" },
    { titulo: "OK", artista: "Robin Schulz ft. James Blunt", cat: "Pop", sub: "Electrónica", id: "P9-4xHVc7uk" },
    { titulo: "I Was Made for Lovin' You", artista: "KISS", cat: "Rock", sub: "Disco rock", id: "ZhIsAZO5gl0" },
    { titulo: "As Long as You Love Me", artista: "Backstreet Boys", cat: "Pop", sub: "Boy band", id: "0Gl2QnHNpkA" },
    { titulo: "Rock with You", artista: "Michael Jackson", cat: "Clásicos", sub: "Disco / Funk", id: "5X-Mrc2l1d0" },
    { titulo: "Wake Me Up Before You Go-Go", artista: "Wham!", cat: "Clásicos", sub: "Pop 80s", id: "pIgZ7gMze7A" },
    { titulo: "Nothin' on You", artista: "B.o.B ft. Bruno Mars", cat: "Hip hop", sub: "Rap pop", id: "8PTDv_szmL0" },
    { titulo: "Reptilia", artista: "The Strokes", cat: "Rock", sub: "Indie rock", id: "b8-tXG8KrWs" }
];

/* Juegos: nivel = de 1 a 5 (1 Principiante ... 5 Experto);
   desde = año en que conociste el juego. EDITA estos valores con los tuyos. */
const juegos = [
    { nombre: "Mobile Legends", img: "img/mobil.jpg", cat: "Estrategia", sub: "MOBA", nivel: 4, desde: 2019,
      desc: "Un juego de estrategia y batallas donde el trabajo en equipo es importante." },
    { nombre: "eFootball 2026", img: "img/efootbal.jpg", cat: "Deportes", sub: "Fútbol", nivel: 4, desde: 2021,
      desc: "Un juego de fútbol que combina competencia, táctica y habilidad." },
    { nombre: "Clash of Clans", img: "img/clash_of_clans.jpg", cat: "Estrategia", sub: "Construcción", nivel: 3, desde: 2017,
      desc: "Construcción, estrategia y batallas para desarrollar mi aldea." },
    { nombre: "Clash Royale", img: "img/clash_royal.jpg", cat: "Estrategia", sub: "Cartas y duelos", nivel: 3, desde: 2017,
      desc: "Duelos rápidos de cartas donde elijo mi mazo y defiendo mis torres." },
    { nombre: "Tekken", img: "img/teken.jpg", cat: "Lucha", sub: "Combate 1 vs 1", nivel: 3, desde: 2016,
      desc: "Combates entre personajes donde la técnica y los reflejos son importantes." },
    { nombre: "God of War", img: "img/good_of_war.jpg", cat: "Acción", sub: "Mitología", nivel: 3, desde: 2018,
      desc: "Una aventura llena de acción, mitología y grandes historias." },
    { nombre: "the simpsons Hit Run", img: "img/hit_run.jpg", cat: "Acción", sub: "Plataformas", nivel: 3, desde: 2018,
      desc: "Accion y aventura  con misiones por cumplir exploracion y elementos de aventura." },
    { nombre: "Cuphead", img: "img/cuphead.jpg", cat: "Acción", sub: "Plataformas", nivel: 2, desde: 2021,
      desc: "Plataformas y jefes muy difíciles con un estilo de dibujo animado clásico." },
    { nombre: "Five Nights at Freddy's", img: "img/freddys.jpg", cat: "Terror", sub: "Supervivencia", nivel: 3, desde: 2019,
      desc: "Sobrevivir las noches vigilando cámaras mientras los animatrónicos se acercan." },
    { nombre: "Left 4 Dead", img: "img/left4_dead.jpg", cat: "Terror", sub: "Zombis cooperativo", nivel: 2, desde: 2020,
      desc: "Disparos cooperativos contra hordas de zombis, donde el equipo lo es todo." },
    { nombre: "Silent Hill", img: "img/silent_hill.jpg", cat: "Terror", sub: "Horror psicológico", nivel: 2, desde: 2022,
      desc: "Terror psicológico entre niebla, misterio y una atmósfera inquietante." },
    { nombre: "Resident Evil", img: "img/resident_evil.jpg", cat: "Terror", sub: "Supervivencia", nivel: 3, desde: 2018,
      desc: "Supervivencia, puzzles y recursos limitados frente a criaturas mutantes." }
    
];
const NIVELES = ["Principiante", "Básico", "Intermedio", "Avanzado", "Experto"];

/* ---------- 3. FAVORITOS (se guardan en el navegador) ---------- */
const favs = {
    musica: new Set(JSON.parse(localStorage.getItem("favMusica") || "[]")),
    juegos: new Set(JSON.parse(localStorage.getItem("favJuegos") || "[]"))
};
function guardarFavs() {
    localStorage.setItem("favMusica", JSON.stringify([...favs.musica]));
    localStorage.setItem("favJuegos", JSON.stringify([...favs.juegos]));
}

/* Actualiza el corazón existente y su estado accesible. Al conservar el
   mismo botón se mantiene el foco, la posición de la lista y las tarjetas
   giradas, en lugar de reconstruir el contenido al cambiar un favorito. */
function actualizarBotonFavorito(boton, marcado) {
    boton.classList.toggle("on", marcado);
    boton.setAttribute("aria-pressed", String(marcado));
    boton.querySelector("i").className = marcado ? "bi bi-heart-fill" : "bi bi-heart";
}

/* Quita solo el elemento desmarcado cuando está activo Solo favoritos.
   Las demás filas conservan su identidad y sus eventos. Si no queda
   contenido, muestra el mismo aviso que utiliza el filtrado normal. */
function retirarFavoritoVisible(elemento, contenedor, mensaje) {
    elemento.remove();
    if (contenedor.children.length) return;
    const aviso = document.createElement("p");
    aviso.className = "vacio";
    aviso.textContent = mensaje;
    contenedor.appendChild(aviso);
}

/* ---------- 4. TARJETAS QUE SE VOLTEAN (reutilizable) ----------
   Una sola función crea las tarjetas de Pasatiempos, Intereses y Juegos.
   o.titulo, o.img, o.insignia, o.icono, o.desc  -> contenido
   o.extra(div) -> agrega datos extra al dorso (ej. nivel del juego)
   o.fav = {set, clave, alCambiar} -> muestra corazón de favorito */
const ACENTOS = ["var(--rosa)", "var(--amarillo)", "var(--violeta)", "var(--celeste)"];

function tarjetaFlip(o, i) {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    col.style.setProperty("--acento", ACENTOS[i % ACENTOS.length]); /* color por tarjeta */
    col.innerHTML = `
        <div class="flip" tabindex="0">
            <div class="flip-inner">
                <div class="flip-cara frente">
                    <img alt=""><span class="insignia"></span>
                    <h5></h5><small><i class="bi bi-arrow-repeat"></i> Toca para ver más</small>
                </div>
                <div class="flip-cara dorso"><h5></h5><p></p><div class="extra"></div></div>
            </div>
        </div>`;
    const img = col.querySelector("img");
    img.src = o.img; img.alt = o.titulo;
    img.onerror = () => img.classList.add("sin-foto");       /* si falta la foto, fondo de color */
    col.querySelector(".insignia").textContent = o.insignia;
    col.querySelectorAll("h5").forEach(h => h.textContent = o.titulo);
    col.querySelector(".dorso p").textContent = o.desc;
    if (o.extra) o.extra(col.querySelector(".extra"));
    const frente = col.querySelector(".frente");
    if (o.icono) {                                           /* ícono redondo arriba a la derecha */
        const ic = document.createElement("span");
        ic.className = "icono-flip";
        ic.innerHTML = `<i class="bi ${o.icono}"></i>`;
        frente.appendChild(ic);
    }
    const flip = col.querySelector(".flip");
    if (o.fav) {                                             /* corazón de favorito */
        const on = o.fav.set.has(o.fav.clave);
        const b = document.createElement("button");
        b.type = "button";
        b.className = "corazon" + (on ? " on" : "");
        b.setAttribute("aria-label", "Favorito");
        b.setAttribute("aria-pressed", String(on));
        b.innerHTML = `<i class="bi ${on ? "bi-heart-fill" : "bi-heart"}"></i>`;
        /* El botón queda fuera de flip-inner: su superficie táctil no
           participa en las transformaciones 3D de las caras de la tarjeta. */
        flip.appendChild(b);
    }
    const voltear = () => flip.classList.toggle("volteada");
    const corazon = flip.querySelector(":scope > .corazon");

    /* Marca o desmarca el favorito */
    const alternarFav = () => {
        const s = o.fav.set;
        s.has(o.fav.clave) ? s.delete(o.fav.clave) : s.add(o.fav.clave);
        guardarFavs();
        actualizarBotonFavorito(corazon, s.has(o.fav.clave));
        o.fav.alCambiar(col);
    };

    /* El propio botón atiende su clic nativo, también al usar Enter o
       Espacio. Detener la propagación evita activar el giro de la tarjeta.
       Un solo listener por botón funciona tanto con ratón como con toque. */
    corazon?.addEventListener("click", ev => {
        ev.stopPropagation();
        alternarFav();
    });
    /* La zona de contenido conserva el giro. La comprobación del botón
       protege el comportamiento si en el futuro se añade delegación. */
    flip.addEventListener("click", ev => {
        if (!ev.target.closest(".corazon")) voltear();
    });
    flip.addEventListener("keydown", ev => { if (ev.key === "Enter" && ev.target === flip) voltear(); });
    return col;
}

/* ---------- 5. FILTROS (sin buscador): botón Favoritos + chips ----------
   Dibuja las categorías y subcategorías y llama a "pintar" cuando cambian. */
function crearFiltros(contenedor, lista, pintar) {
    const estado = { cat: "Todas", sub: "Todas", soloFavs: false };
    const cats = ["Todas", ...new Set(lista.map(x => x.cat))];
    contenedor.innerHTML = `
        <div class="filtro-fila">
            <button type="button" class="btn-favs"><i class="bi bi-heart"></i> Solo favoritos</button>
        </div>
        <div class="chips" data-nivel="cat"></div>
        <div class="chips chips-sub" data-nivel="sub"></div>`;
    const chipsCat = contenedor.querySelector('[data-nivel="cat"]');
    const chipsSub = contenedor.querySelector('[data-nivel="sub"]');

    // INICIALIZACIÓN PROGRESIVA: un listener delegado por módulo,
    // incluso cuando refrescar() reconstruye los botones del filtro.
    const callbacksChips = new WeakMap();
    contenedor.addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-valor-filtro]");
        if (!boton || !contenedor.contains(boton)) return;
        const grupo = boton.closest(".chips");
        callbacksChips.get(grupo)?.(boton.dataset.valorFiltro);
    });

    function chips(div, valores, actual, alElegir) {
        div.innerHTML = "";
        // El callback actual queda asociado al contenedor, no a cada chip.
        callbacksChips.set(div, alElegir);
        valores.forEach(v => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "chip" + (v === actual ? " activo" : "");
            b.textContent = v;
            // El botón guarda el valor; el evento se gestiona desde el padre
            // para no crear un listener nuevo en cada repintado de chips.
            b.dataset.valorFiltro = v;
            div.appendChild(b);
        });
    }
    function refrescar() {
        chips(chipsCat, cats, estado.cat, v => { estado.cat = v; estado.sub = "Todas"; refrescar(); });
        const subs = estado.cat === "Todas" ? [] :
            ["Todas", ...new Set(lista.filter(x => x.cat === estado.cat).map(x => x.sub))];
        chips(chipsSub, subs, estado.sub, v => { estado.sub = v; refrescar(); });
        pintar(estado);
    }
    const bf = contenedor.querySelector(".btn-favs");
    bf.onclick = () => {
        estado.soloFavs = !estado.soloFavs;
        bf.classList.toggle("activo", estado.soloFavs);
        bf.querySelector("i").className = estado.soloFavs ? "bi bi-heart-fill" : "bi bi-heart";
        pintar(estado);
    };
    refrescar();
}
/* ¿El elemento pasa los filtros actuales? */
const pasa = (item, clave, e, setFavs) =>
    (e.cat === "Todas" || item.cat === e.cat) &&
    (e.sub === "Todas" || item.sub === e.sub) &&
    (!e.soloFavs || setFavs.has(clave));

/* ---------- 6. PASATIEMPOS E INTERESES ---------- */
pasatiempos.forEach((p, i) => document.getElementById("grid-pasatiempos").appendChild(tarjetaFlip(p, i)));
intereses.forEach((p, i) => document.getElementById("grid-intereses").appendChild(tarjetaFlip(p, i)));

/* ---------- 7. MÚSICA ---------- */
const listaMusica = document.getElementById("lista-musica");
const portada = document.getElementById("portada-video");
const tituloC = document.getElementById("titulo-cancion");
const artistaC = document.getElementById("artista-cancion");
const enlaceYT = document.getElementById("escuchar-youtube");
const pista = document.querySelector("#musica .pista-play");
/* Portada de reserva (SVG) para canciones sin id de YouTube */
const PORTADA_VACIA = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#1b1440"/><stop offset="1" stop-color="#12343b"/></linearGradient></defs>' +
    '<rect width="160" height="90" fill="url(#g)"/><text x="80" y="58" font-size="40" text-anchor="middle" fill="#62e6dc">♪</text></svg>');
let cancionActual = canciones[0].titulo;      /* la clave de favoritos es el título */

function seleccionar(c) {
    cancionActual = c.titulo;
    tituloC.textContent = c.titulo;
    artistaC.textContent = c.artista;
    if (c.id) {
        portada.src = `https://img.youtube.com/vi/${c.id}/hqdefault.jpg`;
        enlaceYT.href = `https://www.youtube.com/watch?v=${c.id}`;
        pista.textContent = "Toca el play para escucharla en YouTube";
    } else {
        portada.src = PORTADA_VACIA;
        enlaceYT.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(c.titulo + " " + c.artista);
        pista.textContent = "Toca el play para buscarla en YouTube";
    }
}
function pintarMusica(e) {
    listaMusica.innerHTML = "";
    const vis = canciones.filter(c => pasa(c, c.titulo, e, favs.musica));
    if (!vis.length) listaMusica.innerHTML = '<p class="vacio">No hay canciones con ese filtro.</p>';
    vis.forEach((c, i) => {
        const btn = document.createElement("div");
        btn.className = "cancion" + (c.titulo === cancionActual ? " activa" : "");
        btn.setAttribute("role", "button");
        btn.tabIndex = 0;
        const esFav = favs.musica.has(c.titulo);
        btn.innerHTML = `
            <span class="numero-cancion">${String(i + 1).padStart(2, "0")}</span>
            <span class="datos-cancion"><strong></strong><small></small><em class="etiqueta-cat"></em></span>
            <button type="button" class="corazon ${esFav ? "on" : ""}" aria-label="Favorito" aria-pressed="${esFav}">
                <i class="bi ${esFav ? "bi-heart-fill" : "bi-heart"}"></i></button>`;
        /* textContent evita inyectar HTML (seguridad) */
        btn.querySelector("strong").textContent = c.titulo;
        btn.querySelector("small").textContent = c.artista;
        btn.querySelector("em").textContent = `${c.cat} · ${c.sub}`;
        btn.dataset.cancion = c.titulo;
        /* Selecciona la canción sin reconstruir la lista. Se conserva el
           desplazamiento y el resto de canciones permanece en el mismo lugar. */
        const elegir = () => {
            seleccionar(c);
            listaMusica.querySelectorAll(".cancion").forEach(fila => {
                fila.classList.toggle("activa", fila.dataset.cancion === c.titulo);
            });
        };
        btn.addEventListener("click", ev => {
            if (ev.target.closest(".corazon")) {
                favs.musica.has(c.titulo) ? favs.musica.delete(c.titulo) : favs.musica.add(c.titulo);
                guardarFavs();
                actualizarBotonFavorito(btn.querySelector(".corazon"), favs.musica.has(c.titulo));
                if (e.soloFavs && !favs.musica.has(c.titulo)) {
                    retirarFavoritoVisible(btn, listaMusica, "No hay canciones con ese filtro.");
                    listaMusica.querySelectorAll(".numero-cancion").forEach((numero, indice) => {
                        numero.textContent = String(indice + 1).padStart(2, "0");
                    });
                }
            } else elegir();
        });
        /* Enter y Espacio seleccionan la fila enfocada. Los eventos del
           corazón conservan su clic nativo y no seleccionan otra canción. */
        btn.addEventListener("keydown", ev => {
            if (ev.target !== btn || !["Enter", " "].includes(ev.key)) return;
            ev.preventDefault();
            elegir();
        });
        listaMusica.appendChild(btn);
    });
}
crearFiltros(document.getElementById("filtros-musica"), canciones, pintarMusica);

/* ---------- 8. JUEGOS (con nivel de experiencia y año) ---------- */
const gridJuegos = document.getElementById("grid-juegos");
function pintarJuegos(e) {
    gridJuegos.innerHTML = "";
    const vis = juegos.filter(j => pasa(j, j.nombre, e, favs.juegos));
    if (!vis.length) gridJuegos.innerHTML = '<p class="vacio">No hay juegos con ese filtro.</p>';
    vis.forEach((j, i) => gridJuegos.appendChild(tarjetaFlip({
        titulo: j.nombre, img: j.img, insignia: j.cat, desc: j.desc,
        fav: {
            set: favs.juegos,
            clave: j.nombre,
            /* Al desmarcar, solo se retira esta tarjeta si la vista está
               limitada a favoritos. Girar y marcar dejan la rejilla estable. */
            alCambiar: col => {
                if (e.soloFavs && !favs.juegos.has(j.nombre)) {
                    retirarFavoritoVisible(col, gridJuegos, "No hay juegos con ese filtro.");
                }
            }
        },
        extra: div => {                        /* dorso: barra de nivel + años jugando */
            const anios = new Date().getFullYear() - j.desde;
            div.innerHTML = `
                <div class="dato"><span class="n-txt"></span><b class="n-lbl"></b></div>
                <div class="nivel-barra"><i></i></div>
                <div class="dato"><i class="bi bi-calendar-event"></i> <span class="n-anio"></span></div>
                <span class="sub"></span>`;
            div.querySelector(".n-txt").textContent = "Nivel: ";
            div.querySelector(".n-lbl").textContent = `${NIVELES[j.nivel - 1]} (${j.nivel}/5)`;
            div.querySelector(".nivel-barra i").style.width = (j.nivel / 5 * 100) + "%";
            div.querySelector(".n-anio").textContent =
                `Lo conocí en ${j.desde} · ${anios > 0 ? anios + (anios === 1 ? " año" : " años") : "recién"} jugando`;
            div.querySelector(".sub").textContent = "Subcategoría: " + j.sub;
        }
    }, i)));
}
crearFiltros(document.getElementById("filtros-juegos"), juegos, pintarJuegos);

/* ---------- 9. FORMULARIO CON VALIDACIÓN PASO A PASO ----------
   Cada campo: id, aviso (alerta al lado) y ok() que devuelve ""
   si es válido o el texto del error. */
const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const validarNombre = v => v.length < 2 ? "Mínimo 2 letras"
    : !soloLetras.test(v) ? "Solo letras (sin números ni símbolos)" : "";

const campos = [
    { id: "nombre1", aviso: "Llene su primer nombre", ok: validarNombre },
    { id: "nombre2", aviso: "Ahora llene su segundo nombre", ok: validarNombre },
    { id: "apPaterno", aviso: "Ahora llene su apellido paterno", ok: validarNombre },
    { id: "apMaterno", aviso: "Ahora llene su apellido materno", ok: validarNombre },
    { id: "correo", aviso: "Ahora escriba su correo electrónico",
      ok: v => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) ? "" : "Correo no válido (ej: nombre@correo.com)" },
    { id: "fecha", aviso: "Ahora elija su fecha de nacimiento",
      ok: v => {
          if (!v) return "Elija una fecha";
          const [a, m, d] = v.split("-").map(Number);
          const f = new Date(a, m - 1, d);
          /* Verifica que la fecha exista de verdad (ej: no 31 de febrero) */
          if (f.getFullYear() !== a || f.getMonth() !== m - 1 || f.getDate() !== d) return "Esa fecha no existe";
          const hoy = new Date();
          if (f > hoy) return "La fecha no puede ser futura";
          let edad = hoy.getFullYear() - a;
          if (hoy < new Date(hoy.getFullYear(), m - 1, d)) edad--;
          if (edad < 5) return "Edad mínima: 5 años";
          if (edad > 120) return "Edad no realista (máx. 120)";
          document.getElementById("edad-calculada").textContent = `Tienes ${edad} años`;
          return "";
      } },
    { id: "comentario", aviso: "Cuéntenos qué parte le gustó de la página",
      ok: v => v.length < 10 ? `Escriba al menos 10 caracteres (${v.length}/10)` : "" },
    { id: "calificacion", aviso: "Por último, califique la página",
      ok: v => Number(v) >= 1 ? "" : "Elija de 1 a 5 estrellas" }
];

const form = document.getElementById("form-opinion");
const btnEnviar = document.getElementById("btn-enviar");
const barra = document.getElementById("progreso-form");
const hecho = new Array(campos.length).fill(false);

function actualizarForm() {
    const activo = hecho.indexOf(false);          /* primer campo aún no válido */
    campos.forEach((c, i) => {
        const caja = document.getElementById("g-" + c.id);
        const aviso = caja.querySelector(".aviso");
        const input = document.getElementById(c.id);
        const bloqueado = i > activo && activo !== -1;
        caja.classList.toggle("bloqueado", bloqueado);
        input.disabled = bloqueado;
        caja.classList.toggle("completo", hecho[i]);
        if (i === activo) {                       /* la alerta solo se ve en el campo activo */
            const err = c.ok(input.value.trim());
            const tocado = input.dataset.tocado === "1";
            aviso.textContent = tocado && err ? err : c.aviso;
            aviso.className = "aviso visible " + (tocado && err ? "error" : "info");
        } else aviso.className = "aviso";         /* campo listo o bloqueado: sin alerta */
    });
    const n = hecho.filter(Boolean).length;
    barra.style.width = (n / campos.length * 100) + "%";
    btnEnviar.disabled = n !== campos.length;
}
campos.forEach((c, i) => {
    const input = document.getElementById(c.id);
    const revisar = () => {
        input.dataset.tocado = "1";
        hecho[i] = c.ok(input.value.trim()) === "";
        /* Si cambia un campo anterior, los siguientes se vuelven a validar */
        campos.forEach((c2, j) => { if (j > i) hecho[j] = hecho[j] && c2.ok(document.getElementById(c2.id).value.trim()) === ""; });
        actualizarForm();
    };
    if (c.id !== "calificacion") input.addEventListener("input", revisar);
    input.revisar = revisar;
});
document.getElementById("fecha").max = new Date().toISOString().split("T")[0]; /* sin fechas futuras */

/* Estrellas de calificación */
const estrellas = document.querySelectorAll("#estrellas button");
const inputCal = document.getElementById("calificacion");
inputCal.value = 0;
estrellas.forEach(b => b.addEventListener("click", () => {
    inputCal.value = b.dataset.v;
    estrellas.forEach(s => s.classList.toggle("on", Number(s.dataset.v) <= Number(b.dataset.v)));
    inputCal.revisar();
}));

form.addEventListener("submit", e => {
    e.preventDefault();
    if (hecho.includes(false)) return;           /* seguridad extra: revalida */
    const nombre = document.getElementById("nombre1").value.trim();
    const m = document.createElement("div");
    m.className = "alert alert-success mt-3";
    m.textContent = `¡Gracias, ${nombre}! Tu opinión (${inputCal.value}/5 ⭐) fue enviada.`;
    const exito = document.getElementById("exito");
    exito.innerHTML = ""; exito.appendChild(m);
    form.reset();
    estrellas.forEach(s => s.classList.remove("on"));
    inputCal.value = 0;
    hecho.fill(false);
    campos.forEach(c => delete document.getElementById(c.id).dataset.tocado);
    document.getElementById("edad-calculada").textContent = "";
    actualizarForm();
});
actualizarForm();