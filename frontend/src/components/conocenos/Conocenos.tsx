
"use client";

import { useRef, useState } from "react";
import styles from "./Conocenos.module.css";
import Image from "next/image";
//import Link from "next/link";

const aliados = [
    {
        nombre: "UAEM",
        descripcion: "Universidad Autónoma del Estado de México",
        tipo: "Institución",
        ubicacion: "Estado de México, México",
        sitioOficial: "https://www.uaemex.mx/",
        imagen: "/aliados/erenchan.jpg",
        alt: "Logotipo de UAEM"
    },
    {
        nombre: "Carlos Quintero Juan",
        descripcion: "Investigador en políticas públicas y transparencia",
        tipo: "Persona",
        ubicacion: "Plaza Arcangel, Cuernavaca Centro",
        sitioOficial: "https://www.facebook.com/profile.php?id=61573475333950",
        imagen: "/aliados/carlos-quintero-juan.png",
        alt: "Fotografía de Carlos Quintero Juan"
    },
    {
        nombre: "Transparencia Mexicana",
        descripcion: "Organización de la sociedad civil por la transparencia",
        tipo: "Organización",
        ubicacion: "Cuernavaca, Morelos, México",
        sitioOficial: "",
        imagen: "/aliados/sebastian-quintero.jpg",
        alt: "Fotografía de Sebastian Quintero"
    },
    {
        nombre: "IMCO",
        descripcion: "Instituto Mexicano para la Competitividad",
        tipo: "Institución",
        ubicacion: "Cuernavaca, Morelos, México",
        sitioOficial: "",
        imagen: "/aliados/jennsanli.png",
        alt: "Fotografía de Jennsanli"
    },
    {
        nombre: "Red por la Rendición de Cuentas",
        descripcion: "Alianza enfocada en rendición de cuentas",
        tipo: "Organización",
        ubicacion: "Cuernavaca, Morelos, México",
        sitioOficial: "",
        imagen: "/aliados/erenchan.jpg",
        alt: "Logotipo de Red por la Rendición de Cuentas"
    },
];

export default function Conocenos() {
    const carruselRef = useRef<HTMLDivElement>(null);
    const [aliadoSeleccionado, setAliadoSeleccionado] = useState<(typeof aliados)[number] | null>(null);

    const moverCarrusel = (direccion: "izquierda" | "derecha") => {
        const carrusel = carruselRef.current;
        if (!carrusel) return;

        const tarjeta = carrusel.querySelector("article");
        const distancia = tarjeta
            ? tarjeta.getBoundingClientRect().width + 16
            : 260;

        carrusel.scrollBy({
            left: direccion === "derecha" ? distancia : -distancia,
            behavior: "smooth",
        });
    };

    return (
        <main className={styles.pagina}>
            <section className={styles.hero}>
                <div className={styles.heroContenido}>
                    <p className={styles.migas}>Inicio / Conócenos</p>
                    <h1>Conócenos</h1>
                    <span className={styles.lineaDorada} />
                    <p className={styles.heroTexto}>
                        Somos un medio que busca analizar, verificar y hacer accesible
                        la información pública para contribuir a una ciudadanía mejor
                        informada en México.
                    </p>
                </div>
            </section>

            <section className={styles.institucional}>
                <article className={styles.bloqueInstitucional}>
                    <div className={styles.icono}>◎</div>
                    <div>
                        <h2>Nuestra misión</h2>
                        <p>
                            Informar con rigor, claridad y contexto sobre los asuntos
                            públicos que impactan en la vida de las personas.
                        </p>
                    </div>
                </article>

                <article className={styles.bloqueInstitucional}>
                    <div className={styles.icono}>◉</div>
                    <div>
                        <h2>Nuestra visión</h2>
                        <p>
                            Ser un referente de información e investigación, reconocido
                            por su independencia, credibilidad y compromiso con la
                            transparencia.
                        </p>
                    </div>
                </article>

                <article className={styles.bloqueInstitucional}>
                    <div className={styles.icono}>◇</div>
                    <div>
                        <h2>Nuestros principios</h2>
                        <ul>
                            <li>Independencia</li>
                            <li>Rigor</li>
                            <li>Transparencia</li>
                            <li>Compromiso social</li>
                        </ul>
                    </div>
                </article>

                <article className={styles.bloqueInstitucional}>
                    <div className={styles.icono}>▤</div>
                    <div>
                        <h2>Nuestra metodología</h2>
                        <p>
                            Combinamos análisis de datos, revisión documental y
                            verificación para presentar información comprensible,
                            útil y contextualizada.
                        </p>
                    </div>
                </article>
            </section>

            <section className={styles.seccionAliados} id="aliados">
                <div className={styles.encabezadoAliados}>
                    <div>
                        <h2>Nuestros Aliados</h2>
                        <span className={styles.lineaDorada} />
                        <p>
                            Instituciones, organizaciones y personas que pueden
                            contribuir a la transparencia, la rendición de cuentas
                            y el acceso a la información.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.botonAliados}
                        onClick={() => moverCarrusel("derecha")}
                    >
                        Conoce a nuestros aliados <span aria-hidden="true">→</span>
                    </button>
                </div>

                <div className={styles.contenedorCarrusel}>
                    <button
                        type="button"
                        className={`${styles.flecha} ${styles.flechaIzquierda}`}
                        aria-label="Ver aliados anteriores"
                        onClick={() => moverCarrusel("izquierda")}
                    >
                        ‹
                    </button>

                    <div className={styles.carrusel} ref={carruselRef}>
                        {aliados.map((aliado) => (
                            <article
                                className={styles.tarjetaAliado}
                                key={aliado.nombre}
                                role="button"
                                tabIndex={0}
                                aria-label={`Ver información de ${aliado.nombre}`}
                                onClick={() => setAliadoSeleccionado(aliado)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        setAliadoSeleccionado(aliado);
                                    }
                                }}
                            >
                                <div className={styles.marcaAliado}>
                                    <Image
                                        src={aliado.imagen}
                                        alt={aliado.alt}
                                        width={120}
                                        height={80}
                                        className={
                                            aliado.tipo === "Persona"
                                                ? styles.fotoAliado
                                                : styles.logoAliado
                                        }
                                    />
                                </div>

                                <div className={styles.datosAliado}>
                                    <h3>{aliado.nombre}</h3>
                                    <p>{aliado.descripcion}</p>
                                    <span className={styles.etiqueta}>{aliado.tipo}</span>
                                </div>
                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        className={`${styles.flecha} ${styles.flechaDerecha}`}
                        aria-label="Ver siguientes aliados"
                        onClick={() => moverCarrusel("derecha")}
                    >
                        ›
                    </button>
                </div>

                <p className={styles.avisoDemo}>
                    Aliados de ejemplo para el diseño. Los nombres y las relaciones
                    deberán validarse antes de publicar.
                </p>
            </section>

            {aliadoSeleccionado && (
                <div
                    className={styles.fondoModal}
                    onClick={() => setAliadoSeleccionado(null)}
                >
                    <section
                        className={styles.modalAliado}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="nombreAliado"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.cerrarModal}
                            aria-label="Cerrar ficha del aliado"
                            onClick={() => setAliadoSeleccionado(null)}
                        >
                            ×
                        </button>

                        <div className={styles.imagenModal}>
                            <Image
                                src={aliadoSeleccionado.imagen}
                                alt={aliadoSeleccionado.alt}
                                width={180}
                                height={140}
                                className={
                                    aliadoSeleccionado.tipo === "Persona"
                                        ? styles.fotoModal
                                        : styles.logoModal
                                }
                            />
                        </div>

                        <div className={styles.contenidoModal}>
                            <span className={styles.etiqueta}>
                                {aliadoSeleccionado.tipo}
                            </span>

                            <h2 id="nombreAliado">{aliadoSeleccionado.nombre}</h2>

                            <p className={styles.descripcionModal}>
                                {aliadoSeleccionado.descripcion}
                            </p>

                            <div className={styles.datoModal}>
                                <strong>Ubicación</strong>
                                <p>{aliadoSeleccionado.ubicacion || "Por confirmar"}</p>
                            </div>

                            {aliadoSeleccionado.sitioOficial ? (
                                <a
                                    href={aliadoSeleccionado.sitioOficial}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.enlaceOficial}
                                >
                                    Visitar sitio oficial
                                    <span aria-hidden="true"> ↗</span>
                                </a>
                            ) : (
                                <p className={styles.enlacePendiente}>
                                    Sitio oficial o perfil social pendiente de verificar.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            )}

            <section className={styles.llamadoAccion}>
                <div>
                    <p className={styles.etiquetaAccion}>UN PROYECTO DE TODOS</p>
                    <h2>
                        La información pública también
                        <br className={styles.saltoEscritorio} /> se construye en comunidad.
                    </h2>
                </div>

                <a href="publicaciones" className={styles.botonAccion}>
                    Explora nuestras publicaciones <span aria-hidden="true">→</span>
                </a>
            </section>
        </main>
    );
}

/*
<Link href="/publicaciones" className={styles.botonAccion}>
  Explora nuestras publicaciones <span aria-hidden="true">→</span>
</Link>
*/