"use client";

import { useMemo, useState } from "react";
import styles from "./publicaciones.module.css";
import { publicaciones } from "@/lib/publicaciones";

// Ejemplos de tipos de publicaciones
const tipos = [
    "Todos los tipos",
    "Investigación",
    "Análisis",
    "Datos",
    "Reporte",
    "Guía",
];

// Ejemplos de categorías de publicaciones
const categorias = [
    "Todas las categorías",
    "Justicia",
    "Presupuesto",
    "Ciudadanía",
    "Transparencia",
];

const ordenP = [
    "recientes",
    "antiguas",
]

// Ejemplo de número de publicaciones por página
const porPagina = 6;

function formatearFecha(fecha: string) {
    return new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${fecha}T12:00:00Z`));
}

export default function Publicaciones() {
    const [busqueda, setBusqueda] = useState("");
    const [tipo, setTipo] = useState(tipos[0]); /// "Todos los tipos"
    const [categoria, setCategoria] = useState(categorias[0]); /// "Todas las categorías"
    const [orden, setOrden] = useState(ordenP[0]); /// "recientes"
    const [pagina, setPagina] = useState(1);

    /// Filtrar y ordenar las publicaciones según los criterios seleccionados
    const resultados = useMemo(() => {
        const consulta = busqueda.trim().toLocaleLowerCase("es-MX");

        return publicaciones.filter((publicacion) => {
            const coincideTexto =
                !consulta ||
                `${publicacion.titulo} ${publicacion.resumen} ${publicacion.tipo} ${publicacion.categoria}`.toLocaleLowerCase("es-MX").includes(consulta);

            const coincideTipo = tipo === tipos[0] || publicacion.tipo === tipo;

            const coincideCategoria = categoria === categorias[0] || publicacion.categoria === categoria;

            return coincideTexto && coincideTipo && coincideCategoria;
        }).sort((a, b) =>
            orden === ordenP[1]
                ? a.fecha.localeCompare(b.fecha)
                : b.fecha.localeCompare(a.fecha)
        );
    }, [busqueda, tipo, categoria, orden]);

    const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
    const paginaActual = Math.min(pagina, totalPaginas);
    const inicio = (paginaActual - 1) * porPagina;
    const visibles = resultados.slice(inicio, inicio + porPagina);

    function reiniciarPagina() {
        setPagina(1);
    }

    return (
        <main className={styles.publicaciones}>
            <section className={styles.hero}>
                <div className={styles.heroFondo} aria-hidden="true" />

                <div className={styles.heroContenido}>
                    <div className={styles.heroTexto}>
                        <span className={styles.eyebrow}>EL GUARDIÁN MX / ARCHIVO</span>

                        <h1>Publicaciones</h1>

                        <p>
                            Investigaciones, análisis y notas para entender la realidad.
                            Explora información pública, datos y documentos para comprender
                            mejor el sistema de justicia en México.
                        </p>

                        <span className={styles.avisoDemo}>
                            CONTENIDO DE DEMOSTRACIÓN
                        </span>
                    </div>

                    <a
                        className={styles.destacada}
                        href={`/publicaciones/${publicaciones[0].slug}`}
                    >
                        <div
                            className={styles.destacadaImagen}
                            style={{ backgroundImage: `url("${publicaciones[0].imagen}")` }}
                            role="img"
                            aria-label="Imagen ilustrativa de edificios institucionales"
                        />

                        <div className={styles.destacadaContenido}>
                            <span className={styles.etiquetaDestacada}>
                                {publicaciones[0].tipo} destacada · Ejemplo
                            </span>

                            <h2>{publicaciones[0].titulo}</h2>

                            <p>{publicaciones[0].resumen}</p>

                            <span className={styles.botonDestacado}>
                                Leer publicación <span aria-hidden="true">→</span>
                            </span>
                        </div>
                    </a>
                </div>
            </section>

            <section className={styles.archivo} aria-labelledby="archivo-titulo">
                <div className={styles.encabezadoArchivo}>
                    <div>
                        <span className={styles.eyebrowOscuro}>EXPLORA Y CONSULTA</span>
                        <h2 id="archivo-titulo">Archivo de publicaciones</h2>
                        <p>
                            Encuentra investigaciones, reportes y herramientas de análisis.
                        </p>
                    </div>

                    <span className={styles.total}>
                        {resultados.length}{" "}
                        {resultados.length === 1 ? "resultado" : "resultados"}
                    </span>
                </div>

                <div className={styles.panelFiltros}>
                    <form
                        className={styles.busqueda}
                        role="search"
                        onSubmit={(evento) => {
                            evento.preventDefault();
                            reiniciarPagina();
                        }}
                    >
                        <label className={styles.soloLectores} htmlFor="buscar-publicaciones">
                            Buscar publicaciones
                        </label>

                        <input
                            id="buscar-publicaciones"
                            type="search"
                            placeholder="Buscar por título, tema o palabra clave..."
                            value={busqueda}
                            onChange={(evento) => {
                                setBusqueda(evento.target.value);
                                reiniciarPagina();
                            }}
                        />

                        <button type="submit" aria-label="Buscar publicaciones">
                            <span aria-hidden="true">⌕</span>
                        </button>
                    </form>

                    <div className={styles.filtros}>
                        <label>
                            <span>Tipo de contenido</span>
                            <select
                                value={tipo}
                                onChange={(evento) => {
                                    setTipo(evento.target.value);
                                    reiniciarPagina();
                                }}
                            >
                                {tipos.map((opcion) => (
                                    <option key={opcion} value={opcion}>
                                        {opcion}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>Categoría</span>
                            <select
                                value={categoria}
                                onChange={(evento) => {
                                    setCategoria(evento.target.value);
                                    reiniciarPagina();
                                }}
                            >
                                {categorias.map((opcion) => (
                                    <option key={opcion} value={opcion}>
                                        {opcion}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>Ordenar por</span>
                            <select
                                value={orden}
                                onChange={(evento) => {
                                    setOrden(evento.target.value);
                                    reiniciarPagina();
                                }}
                            >
                                <option value={ordenP[0]}>Más recientes</option>
                                <option value={ordenP[1]}>Más antiguas</option>
                            </select>
                        </label>
                    </div>
                </div>

                {visibles.length > 0 ? (
                    <div className={styles.grid}>
                        {visibles.map((publicacion) => (
                            <article className={styles.tarjeta} key={publicacion.id}>
                                <a
                                    className={styles.imagenEnlace}
                                    href={`/publicaciones/${publicacion.slug}`}
                                    aria-label={`Leer ${publicacion.titulo}`}
                                >
                                    <div
                                        className={styles.imagen}
                                        style={{
                                            backgroundImage: `url("${publicacion.imagen}")`,
                                        }}
                                        role="img"
                                        aria-label={`Imagen ilustrativa: ${publicacion.categoria}`}
                                    />

                                    <span className={styles.etiqueta}>
                                        {publicacion.tipo}
                                    </span>
                                </a>

                                <div className={styles.tarjetaContenido}>
                                    <div className={styles.metadatos}>
                                        <span>{publicacion.categoria}</span>
                                        <span>{formatearFecha(publicacion.fecha)}</span>
                                    </div>

                                    <h3>
                                        <a href={`/publicaciones/${publicacion.slug}`}>
                                            {publicacion.titulo}
                                        </a>
                                    </h3>

                                    <p>{publicacion.resumen}</p>

                                    <div className={styles.tarjetaPie}>
                                        <span>{publicacion.lectura} min de lectura</span>

                                        <a href={`/publicaciones/${publicacion.slug}`}>
                                            Leer más <span aria-hidden="true">→</span>
                                        </a>
                                    </div>

                                    {publicacion.demo && (
                                        <span className={styles.marcaDemo}>
                                            Ejemplo ilustrativo
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={styles.sinResultados}>
                        <span aria-hidden="true">⌕</span>
                        <h3>No encontramos publicaciones</h3>
                        <p>
                            Prueba con otras palabras o cambia los filtros seleccionados.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setBusqueda("");
                                setTipo("Todos los tipos");
                                setCategoria("Todas las categorías");
                                setOrden("recientes");
                                setPagina(1);
                            }}
                        >
                            Limpiar búsqueda y filtros
                        </button>
                    </div>
                )}

                {resultados.length > 0 && (
                    <nav className={styles.paginacion} aria-label="Paginación">
                        <button
                            className={styles.flechaPagina}
                            type="button"
                            aria-label="Página anterior"
                            disabled={paginaActual === 1}
                            onClick={() => setPagina((actual) => actual - 1)}
                        >
                            ←
                        </button>

                        <div className={styles.numerosPagina}>
                            {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
                                (numero) => (
                                    <button
                                        key={numero}
                                        type="button"
                                        className={`${styles.numeroPagina} ${paginaActual === numero ? styles.paginaActiva : ""
                                            }`}
                                        aria-label={`Página ${numero}`}
                                        aria-current={paginaActual === numero ? "page" : undefined}
                                        onClick={() => setPagina(numero)}
                                    >
                                        {numero}
                                    </button>
                                ),
                            )}
                        </div>

                        <button
                            className={styles.flechaPagina}
                            type="button"
                            aria-label="Página siguiente"
                            disabled={paginaActual === totalPaginas}
                            onClick={() => setPagina((actual) => actual + 1)}
                        >
                            →
                        </button>
                    </nav>
                )}
            </section>
        </main>
    );

};