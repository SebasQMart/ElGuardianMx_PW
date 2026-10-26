
"use client";

import { useMemo, useState } from "react";
import styles from "./Audiencias.module.css";

type EstadoAudiencia =
    | "Programada"
    | "En proceso"
    | "Celebrada"
    | "Reprogramada"
    | "Cancelada";

type Audiencia = {
    id: number;
    expediente: string;
    titulo: string;
    tipo: string;
    fecha: string;
    hora: string;
    juzgado: string;
    sala: string;
    juez: string;
    sede: string;
    direccion: string;
    mapa: string;
    estado: EstadoAudiencia;
    observaciones: string;
};

const audienciasIniciales: Audiencia[] = [
    {
        id: 1,
        expediente: "DEMO-001/2026",
        titulo: "Audiencia inicial",
        tipo: "Penal",
        fecha: "2026-11-03",
        hora: "09:30",
        juzgado: "Juzgado de ejemplo 1",
        sala: "Sala 2",
        juez: "Nombre ilustrativo del juez",
        sede: "Sede judicial de ejemplo",
        direccion: "Dirección ilustrativa, México",
        mapa: "",
        estado: "Programada",
        observaciones: "Registro de demostración; no corresponde a una audiencia real.",
    },
    {
        id: 2,
        expediente: "DEMO-002/2026",
        titulo: "Audiencia de revisión",
        tipo: "Familiar",
        fecha: "2026-11-04",
        hora: "11:00",
        juzgado: "Juzgado de ejemplo 2",
        sala: "Sala 1",
        juez: "Nombre ilustrativo de la jueza",
        sede: "Sede judicial de ejemplo",
        direccion: "Dirección ilustrativa, México",
        mapa: "",
        estado: "Programada",
        observaciones: "Registro de demostración; no corresponde a una audiencia real.",
    },
    {
        id: 3,
        expediente: "DEMO-003/2026",
        titulo: "Audiencia de seguimiento",
        tipo: "Civil",
        fecha: "2026-10-20",
        hora: "10:00",
        juzgado: "Juzgado de ejemplo 1",
        sala: "Sala 3",
        juez: "Nombre ilustrativo del juez",
        sede: "Sede judicial de ejemplo",
        direccion: "Dirección ilustrativa, México",
        mapa: "",
        estado: "Celebrada",
        observaciones: "Registro histórico de demostración.",
    },
];

const estados: EstadoAudiencia[] = [
    "Programada",
    "En proceso",
    "Celebrada",
    "Reprogramada",
    "Cancelada",
];

function formatearFecha(fecha: string) {
    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${fecha}T12:00:00`));
}

function obtenerClaseEstado(estado: EstadoAudiencia) {
    switch (estado) {
        case "Programada":
            return styles.estadoProgramada;
        case "En proceso":
            return styles.estadoProceso;
        case "Celebrada":
            return styles.estadoCelebrada;
        case "Reprogramada":
            return styles.estadoReprogramada;
        case "Cancelada":
            return styles.estadoCancelada;
    }
}

export default function Audiencias() {
    const [audiencias] = useState(audienciasIniciales);
    const [busqueda, setBusqueda] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [tipo, setTipo] = useState("");
    const [juzgado, setJuzgado] = useState("");
    const [estado, setEstado] = useState("");
    const [audienciaSeleccionada, setAudienciaSeleccionada] =
        useState<Audiencia | null>(null);

    const tipos = useMemo(
        () => [...new Set(audiencias.map((a) => a.tipo))].sort(),
        [audiencias],
    );

    const juzgados = useMemo(
        () => [...new Set(audiencias.map((a) => a.juzgado))].sort(),
        [audiencias],
    );

    const resultados = useMemo(() => {
        const termino = busqueda.trim().toLocaleLowerCase("es-MX");

        return [...audiencias]
            .filter((a) => {
                const coincideTexto =
                    !termino ||
                    [
                        a.expediente,
                        a.titulo,
                        a.juez,
                        a.juzgado,
                        a.tipo,
                    ].some((valor) =>
                        valor.toLocaleLowerCase("es-MX").includes(termino),
                    );

                return (
                    coincideTexto &&
                    (!fechaDesde || a.fecha >= fechaDesde) &&
                    (!fechaHasta || a.fecha <= fechaHasta) &&
                    (!tipo || a.tipo === tipo) &&
                    (!juzgado || a.juzgado === juzgado) &&
                    (!estado || a.estado === estado)
                );
            })
            .sort(
                (a, b) =>
                    a.fecha.localeCompare(b.fecha) ||
                    a.hora.localeCompare(b.hora),
            );
    }, [audiencias, busqueda, fechaDesde, fechaHasta, tipo, juzgado, estado]);

    function limpiarFiltros() {
        setBusqueda("");
        setFechaDesde("");
        setFechaHasta("");
        setTipo("");
        setJuzgado("");
        setEstado("");
    }

    return (
        <main className={styles.pagina}>
            <section className={styles.portada}>
                <div className={styles.portadaContenido}>
                    <span className={styles.iconoPortada} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M7 2v6M17 2v6M3 10h18M8 14h2M14 14h2M8 17h2" />
                        </svg>
                    </span>
                    <div>
                        <p className={styles.eyebrow}>AGENDA JUDICIAL</p>
                        <h1>Audiencias</h1>
                        <p className={styles.descripcionPortada}>
                            Consulta las audiencias, sus horarios, ubicación y
                            demás información pública disponible.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.contenido}>
                <div className={styles.encabezadoListado}>
                    <div>
                        <h2>Consulta de audiencias</h2>
                        <p>
                            Busca y filtra los registros disponibles.
                        </p>
                    </div>
                    <span className={styles.contador}>
                        {resultados.length}{" "}
                        {resultados.length === 1 ? "resultado" : "resultados"}
                    </span>
                </div>

                <div className={styles.panelFiltros}>
                    <div className={styles.campoBusqueda}>
                        <label htmlFor="busqueda-audiencias">
                            Buscar audiencia
                        </label>
                        <input
                            id="busqueda-audiencias"
                            type="search"
                            placeholder="Expediente, juez o palabra clave..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className={styles.filtrosGrid}>
                        <div className={styles.campo}>
                            <label htmlFor="fecha-desde">Desde</label>
                            <input
                                id="fecha-desde"
                                type="date"
                                value={fechaDesde}
                                max={fechaHasta || undefined}
                                onChange={(e) => setFechaDesde(e.target.value)}
                            />
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="fecha-hasta">Hasta</label>
                            <input
                                id="fecha-hasta"
                                type="date"
                                value={fechaHasta}
                                min={fechaDesde || undefined}
                                onChange={(e) => setFechaHasta(e.target.value)}
                            />
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="tipo-audiencia">Tipo</label>
                            <select
                                id="tipo-audiencia"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                {tipos.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="juzgado-audiencia">Juzgado</label>
                            <select
                                id="juzgado-audiencia"
                                value={juzgado}
                                onChange={(e) => setJuzgado(e.target.value)}
                            >
                                <option value="">Todos los juzgados</option>
                                {juzgados.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="estado-audiencia">Estado</label>
                            <select
                                id="estado-audiencia"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                {estados.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.accionesFiltros}>
                        <button
                            type="button"
                            className={styles.botonSecundario}
                            onClick={limpiarFiltros}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>

                <div className={styles.listaAudiencias}>
                    {resultados.map((audiencia) => (
                        <article
                            className={styles.tarjeta}
                            key={audiencia.id}
                        >
                            <div className={styles.fechaTarjeta}>
                                <span>
                                    {new Intl.DateTimeFormat("es-MX", {
                                        month: "short",
                                    })
                                        .format(
                                            new Date(`${audiencia.fecha}T12:00:00`),
                                        )
                                        .replace(".", "")
                                        .toUpperCase()}
                                </span>
                                <strong>
                                    {audiencia.fecha.slice(8, 10)}
                                </strong>
                                <span>{audiencia.fecha.slice(0, 4)}</span>
                            </div>

                            <div className={styles.datosTarjeta}>
                                <div className={styles.tituloFila}>
                                    <h3>{audiencia.titulo}</h3>
                                    <span
                                        className={`${styles.estado} ${obtenerClaseEstado(audiencia.estado)}`}
                                    >
                                        {audiencia.estado}
                                    </span>
                                </div>

                                <p className={styles.expediente}>
                                    Expediente: {audiencia.expediente}
                                </p>

                                <div className={styles.detallesRapidos}>
                                    <span>
                                        <strong>Hora:</strong> {audiencia.hora}
                                    </span>
                                    <span>
                                        <strong>Tipo:</strong> {audiencia.tipo}
                                    </span>
                                    <span>
                                        <strong>Juzgado:</strong> {audiencia.juzgado}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className={styles.botonDetalles}
                                    onClick={() =>
                                        setAudienciaSeleccionada(audiencia)
                                    }
                                >
                                    Ver detalles <span aria-hidden="true">→</span>
                                </button>
                            </div>
                        </article>
                    ))}

                    {resultados.length === 0 && (
                        <div className={styles.sinResultados}>
                            <h3>No se encontraron audiencias</h3>
                            <p>
                                Prueba con otros términos o cambia los filtros.
                            </p>
                            <button
                                type="button"
                                className={styles.botonSecundario}
                                onClick={limpiarFiltros}
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )}
                </div>

                <p className={styles.avisoDemo}>
                    Los registros actuales son ejemplos ficticios y no
                    representan audiencias judiciales reales.
                </p>
            </section>

            {audienciaSeleccionada && (
                <div
                    className={styles.fondoModal}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setAudienciaSeleccionada(null);
                        }
                    }}
                >
                    <section
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal-audiencia"
                    >
                        <header className={styles.encabezadoModal}>
                            <div>
                                <p className={styles.eyebrow}>AGENDA JUDICIAL</p>
                                <h2 id="titulo-modal-audiencia">
                                    Detalles de la audiencia
                                </h2>
                            </div>
                            <button
                                type="button"
                                className={styles.cerrarModal}
                                aria-label="Cerrar detalles"
                                onClick={() => setAudienciaSeleccionada(null)}
                            >
                                ×
                            </button>
                        </header>

                        <div className={styles.contenidoModal}>
                            <div className={styles.tituloModalFila}>
                                <h3>{audienciaSeleccionada.titulo}</h3>
                                <span
                                    className={`${styles.estado} ${obtenerClaseEstado(audienciaSeleccionada.estado)}`}
                                >
                                    {audienciaSeleccionada.estado}
                                </span>
                            </div>

                            <p className={styles.expediente}>
                                Expediente: {audienciaSeleccionada.expediente}
                            </p>

                            <div className={styles.detallesModalGrid}>
                                <div>
                                    <span>Tipo de audiencia</span>
                                    <strong>{audienciaSeleccionada.tipo}</strong>
                                </div>
                                <div>
                                    <span>Fecha</span>
                                    <strong>
                                        {formatearFecha(audienciaSeleccionada.fecha)}
                                    </strong>
                                </div>
                                <div>
                                    <span>Horario</span>
                                    <strong>{audienciaSeleccionada.hora}</strong>
                                </div>
                                <div>
                                    <span>Juzgado</span>
                                    <strong>{audienciaSeleccionada.juzgado}</strong>
                                </div>
                                <div>
                                    <span>Sala</span>
                                    <strong>{audienciaSeleccionada.sala}</strong>
                                </div>
                                <div>
                                    <span>Juez o jueza</span>
                                    <strong>{audienciaSeleccionada.juez}</strong>
                                </div>
                                <div>
                                    <span>Sede judicial</span>
                                    <strong>{audienciaSeleccionada.sede}</strong>
                                </div>
                                <div>
                                    <span>Dirección</span>
                                    <strong>{audienciaSeleccionada.direccion}</strong>
                                </div>
                            </div>

                            {audienciaSeleccionada.mapa && (
                                <a
                                    className={styles.enlaceMapa}
                                    href={audienciaSeleccionada.mapa}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Abrir ubicación en el mapa ↗
                                </a>
                            )}

                            <div className={styles.observaciones}>
                                <h4>Observaciones</h4>
                                <p>{audienciaSeleccionada.observaciones}</p>
                            </div>
                        </div>

                        <footer className={styles.pieModal}>
                            <button
                                type="button"
                                className={styles.botonPrincipal}
                                onClick={() => setAudienciaSeleccionada(null)}
                            >
                                Cerrar
                            </button>
                        </footer>
                    </section>
                </div>
            )}
        </main>
    );
}
