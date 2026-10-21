
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Datos.module.css";

type TemaDato = "Presupuesto" | "Transparencia" | "Participación";
type FiltroTema = "Todos" | TemaDato;

type Dato = {
    id: number;
    nombre: string;
    tema: TemaDato;
    periodo: string;
    valor: string;
    descripcion: string;
    unidad: string;
};

const datosEjemplo: Dato[] = [
    {
        id: 1,
        nombre: "Presupuesto ejercido",
        tema: "Presupuesto",
        periodo: "2026",
        valor: "68%",
        descripcion:
            "Porcentaje ilustrativo del presupuesto que se ha ejercido durante el periodo.",
        unidad: "Porcentaje",
    },
    {
        id: 2,
        nombre: "Inversión pública",
        tema: "Presupuesto",
        periodo: "2025",
        valor: "$42.5 M",
        descripcion:
            "Monto ilustrativo destinado a proyectos de inversión pública.",
        unidad: "Millones de pesos",
    },
    {
        id: 3,
        nombre: "Gasto por habitante",
        tema: "Presupuesto",
        periodo: "2024",
        valor: "$1,240",
        descripcion:
            "Ejemplo de un indicador de gasto público por habitante.",
        unidad: "Pesos por habitante",
    },
    {
        id: 4,
        nombre: "Solicitudes atendidas",
        tema: "Transparencia",
        periodo: "2026",
        valor: "87%",
        descripcion:
            "Proporción ilustrativa de solicitudes de información atendidas.",
        unidad: "Porcentaje",
    },
    {
        id: 5,
        nombre: "Respuestas en plazo",
        tema: "Transparencia",
        periodo: "2025",
        valor: "91%",
        descripcion:
            "Ejemplo de respuestas entregadas dentro del plazo correspondiente.",
        unidad: "Porcentaje",
    },
    {
        id: 6,
        nombre: "Información disponible",
        tema: "Transparencia",
        periodo: "2024",
        valor: "76%",
        descripcion:
            "Indicador ilustrativo de disponibilidad de información pública.",
        unidad: "Porcentaje",
    },
    {
        id: 7,
        nombre: "Participación ciudadana",
        tema: "Participación",
        periodo: "2026",
        valor: "4,820",
        descripcion:
            "Ejemplo de personas participantes en ejercicios ciudadanos.",
        unidad: "Personas",
    },
    {
        id: 8,
        nombre: "Audiencias registradas",
        tema: "Participación",
        periodo: "2025",
        valor: "128",
        descripcion:
            "Número ilustrativo de audiencias registradas en un periodo.",
        unidad: "Audiencias",
    },
    {
        id: 9,
        nombre: "Compromisos con seguimiento",
        tema: "Participación",
        periodo: "2024",
        valor: "64",
        descripcion:
            "Ejemplo de compromisos ciudadanos con seguimiento documentado.",
        unidad: "Compromisos",
    },
];

const consultasPorPeriodo = [
    { periodo: "2024", valor: 24 },
    { periodo: "2025", valor: 41 },
    { periodo: "2026", valor: 67 },
];

export default function DatosPage() {
    const [temaSeleccionado, setTemaSeleccionado] =
        useState<FiltroTema>("Todos");

    const [periodoSeleccionado, setPeriodoSeleccionado] =
        useState("Todos");

    const datosFiltrados = datosEjemplo.filter((dato) => {
        const coincideTema =
            temaSeleccionado === "Todos" ||
            dato.tema === temaSeleccionado;

        const coincidePeriodo =
            periodoSeleccionado === "Todos" ||
            dato.periodo === periodoSeleccionado;

        return coincideTema && coincidePeriodo;
    });

    return (
        <main className={styles.pagina}>
            <section className={styles.hero}>
                <div className={styles.contenedor}>
                    <p className={styles.migas}>
                        <Link href="/">Inicio</Link>
                        <span aria-hidden="true"> / </span>
                        Datos
                    </p>

                    <p className={styles.eyebrow}>DATOS ABIERTOS · INFORMACIÓN PÚBLICA</p>

                    <h1>
                        La información pública,
                        <br />
                        <span>al alcance de todos.</span>
                    </h1>

                    <p className={styles.descripcionHero}>
                        Explora indicadores, consulta información y descubre los datos
                        que ayudan a comprender mejor los asuntos públicos de México.
                    </p>

                    <div className={styles.accionesHero}>
                        <a href="#explorador" className={styles.botonPrincipal}>
                            Explorar indicadores <span aria-hidden="true">↓</span>
                        </a>

                        <a href="#metodologia" className={styles.botonSecundario}>
                            Cómo utilizamos los datos
                        </a>
                    </div>

                    <div className={styles.avisoDemo} role="note">
                        <span className={styles.puntoAviso} aria-hidden="true" />
                        <p>
                            <strong>Versión de demostración.</strong> Las cifras y
                            gráficas de esta página son ficticias; no representan datos
                            oficiales.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.resumen}>
                <div className={styles.contenedor}>
                    <div className={styles.resumenGrid}>
                        <article className={styles.tarjetaResumen}>
                            <span className={styles.iconoResumen} aria-hidden="true">
                                ◈
                            </span>
                            <div>
                                <p className={styles.etiquetaResumen}>Temas de ejemplo</p>
                                <p className={styles.valorResumen}>03</p>
                                <p className={styles.detalleResumen}>
                                    Información organizada por tema
                                </p>
                            </div>
                        </article>

                        <article className={styles.tarjetaResumen}>
                            <span className={styles.iconoResumen} aria-hidden="true">
                                ▤
                            </span>
                            <div>
                                <p className={styles.etiquetaResumen}>Indicadores de muestra</p>
                                <p className={styles.valorResumen}>09</p>
                                <p className={styles.detalleResumen}>
                                    Ejemplos para probar el diseño
                                </p>
                            </div>
                        </article>

                        <article className={styles.tarjetaResumen}>
                            <span className={styles.iconoResumen} aria-hidden="true">
                                ◷
                            </span>
                            <div>
                                <p className={styles.etiquetaResumen}>Periodo ilustrativo</p>
                                <p className={styles.valorResumen}>2024–2026</p>
                                <p className={styles.detalleResumen}>
                                    Años utilizados en esta demostración
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className={styles.seccionPanorama}>
                <div className={styles.contenedor}>
                    <div className={styles.encabezadoSeccion}>
                        <p className={styles.eyebrowSeccion}>PANORAMA GENERAL</p>
                        <h2>Los datos cuentan una historia.</h2>
                        <p>
                            Las visualizaciones nos ayudan a identificar tendencias y
                            entender la información más allá de las cifras.
                        </p>
                    </div>

                    <article className={styles.tarjetaGrafica}>
                        <div className={styles.encabezadoGrafica}>
                            <div>
                                <h3>Consultas a conjuntos de datos</h3>
                                <p>Ejemplo ilustrativo de actividad por año</p>
                            </div>
                            <span className={styles.etiquetaGrafica}>DATOS DE PRUEBA</span>
                        </div>

                        <div
                            className={styles.grafica}
                            role="img"
                            aria-label="Gráfica ilustrativa: 24 consultas en 2024, 41 en 2025 y 67 en 2026."
                        >
                            {consultasPorPeriodo.map((item) => (
                                <div className={styles.grupoBarra} key={item.periodo}>
                                    <span className={styles.valorBarra}>{item.valor}</span>
                                    <div className={styles.areaBarra}>
                                        <div
                                            className={styles.barra}
                                            style={{
                                                height: `${(item.valor / 80) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className={styles.etiquetaBarra}>
                                        {item.periodo}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.pieGrafica}>
                            <span>
                                <span className={styles.muestraLeyenda} aria-hidden="true" />
                                Consultas de demostración
                            </span>
                            <p>
                                Serie ficticia para mostrar cómo se visualizarán los datos.
                            </p>
                        </div>
                    </article>
                </div>
            </section>

            <section className={styles.seccionExplorador} id="explorador">
                <div className={styles.contenedor}>
                    <div className={styles.encabezadoSeccion}>
                        <p className={styles.eyebrowSeccion}>EXPLORA LA INFORMACIÓN</p>
                        <h2>Indicadores públicos</h2>
                        <p>
                            Filtra los indicadores por tema y periodo para encontrar la
                            información que te interesa.
                        </p>
                    </div>

                    <div className={styles.panelFiltros}>
                        <div className={styles.campoFiltro}>
                            <label htmlFor="filtro-tema">Tema</label>
                            <select
                                id="filtro-tema"
                                value={temaSeleccionado}
                                onChange={(event) =>
                                    setTemaSeleccionado(event.target.value as FiltroTema)
                                }
                            >
                                <option value="Todos">Todos los temas</option>
                                <option value="Presupuesto">Presupuesto</option>
                                <option value="Transparencia">Transparencia</option>
                                <option value="Participación">Participación</option>
                            </select>
                        </div>

                        <div className={styles.campoFiltro}>
                            <label htmlFor="filtro-periodo">Periodo</label>
                            <select
                                id="filtro-periodo"
                                value={periodoSeleccionado}
                                onChange={(event) =>
                                    setPeriodoSeleccionado(event.target.value)
                                }
                            >
                                <option value="Todos">Todos los periodos</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className={styles.botonLimpiar}
                            onClick={() => {
                                setTemaSeleccionado("Todos");
                                setPeriodoSeleccionado("Todos");
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    <div className={styles.resultadosCabecera} aria-live="polite">
                        <p>
                            <strong>{datosFiltrados.length}</strong>{" "}
                            {datosFiltrados.length === 1
                                ? "indicador encontrado"
                                : "indicadores encontrados"}
                        </p>
                        <span>Cifras exclusivamente demostrativas</span>
                    </div>

                    {datosFiltrados.length > 0 ? (
                        <div className={styles.indicadoresGrid}>
                            {datosFiltrados.map((dato) => (
                                <article className={styles.tarjetaIndicador} key={dato.id}>
                                    <div className={styles.cabeceraTarjeta}>
                                        <span className={styles.etiquetaTema}>{dato.tema}</span>
                                        <span className={styles.periodo}>{dato.periodo}</span>
                                    </div>

                                    <h3>{dato.nombre}</h3>

                                    <p className={styles.valorIndicador}>{dato.valor}</p>

                                    <p className={styles.unidad}>{dato.unidad}</p>

                                    <p className={styles.descripcionIndicador}>
                                        {dato.descripcion}
                                    </p>

                                    <div className={styles.fuenteIndicador}>
                                        <span>Fuente</span>
                                        <strong>Ejemplo ilustrativo</strong>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.estadoVacio}>
                            <h3>No encontramos indicadores</h3>
                            <p>
                                Prueba con otro tema o selecciona un periodo diferente.
                            </p>
                            <button
                                type="button"
                                className={styles.botonPrincipal}
                                onClick={() => {
                                    setTemaSeleccionado("Todos");
                                    setPeriodoSeleccionado("Todos");
                                }}
                            >
                                Mostrar todos los indicadores
                            </button>
                        </div>
                    )}

                    <p className={styles.notaDatos}>
                        Antes de publicar información real, cada indicador deberá contar
                        con una fuente verificable, un periodo definido y una fecha de
                        actualización confirmada.
                    </p>
                </div>
            </section>

            <section
                className={styles.seccionMetodologia}
                id="metodologia"
            >
                <div className={styles.contenedor}>
                    <div className={styles.encabezadoSeccion}>
                        <p className={styles.eyebrowSeccion}>NUESTRO COMPROMISO</p>
                        <h2>Información con contexto y transparencia.</h2>
                        <p>
                            Los datos son más útiles cuando podemos conocer su origen,
                            entender qué significan y verificar cómo se presentan.
                        </p>
                    </div>

                    <div className={styles.metodologiaGrid}>
                        <article className={styles.tarjetaMetodo}>
                            <span aria-hidden="true">01</span>
                            <h3>Fuentes verificables</h3>
                            <p>
                                Identificaremos los documentos, instituciones o bases de
                                datos de los que proviene cada indicador.
                            </p>
                        </article>

                        <article className={styles.tarjetaMetodo}>
                            <span aria-hidden="true">02</span>
                            <h3>Contexto comprensible</h3>
                            <p>
                                Acompañaremos las cifras con explicaciones sobre su
                                significado, periodo y limitaciones.
                            </p>
                        </article>

                        <article className={styles.tarjetaMetodo}>
                            <span aria-hidden="true">03</span>
                            <h3>Actualización responsable</h3>
                            <p>
                                Mostraremos las fechas de actualización cuando la fuente y
                                la periodicidad de los datos estén confirmadas.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}
