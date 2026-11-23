"use client";

import { useEffect, useRef, useState } from "react";
import type { Aliado } from "@/lib/aliados";
import styles from "./Conocenos.module.css";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Conocenos() {
  const carruselRef = useRef<HTMLDivElement>(null);
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [aliadoSeleccionado, setAliadoSeleccionado] = useState<Aliado | null>(
    null,
  );

  useEffect(() => {
    async function cargarAliados() {
      try {
        const respuesta = await fetch(`${API_URL}/aliados`, {
          method: "GET",
          cache: "no-store",
        });

        if (!respuesta.ok) {
          throw new Error("No fue posible cargar los aliados.");
        }

        const datos: Aliado[] = await respuesta.json();

        setAliados(datos);
      } catch (error) {
        console.error("Error al cargar aliados:", error);
      }
    }

    cargarAliados();
  }, []);

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
            Somos un medio que busca analizar, verificar y hacer accesible la
            información pública para contribuir a una ciudadanía mejor informada
            en México.
          </p>
        </div>
      </section>

      <section className={styles.institucional}>
        <article className={styles.bloqueInstitucional}>
          <div className={styles.icono}>◎</div>
          <div>
            <h2>Nuestra misión</h2>
            <p>
              Informar con rigor, claridad y contexto sobre los asuntos públicos
              que impactan en la vida de las personas.
            </p>
          </div>
        </article>

        <article className={styles.bloqueInstitucional}>
          <div className={styles.icono}>◉</div>
          <div>
            <h2>Nuestra visión</h2>
            <p>
              Ser un referente de información e investigación, reconocido por su
              independencia, credibilidad y compromiso con la transparencia.
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
              Combinamos análisis de datos, revisión documental y verificación
              para presentar información comprensible, útil y contextualizada.
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
              Instituciones, organizaciones y personas que pueden contribuir a
              la transparencia, la rendición de cuentas y el acceso a la
              información.
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
                key={aliado.id}
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
                  {aliado.imagen ? (
                    <Image
                      src={aliado.imagen}
                      alt={`Imagen de ${aliado.nombre}`}
                      width={120}
                      height={80}
                      unoptimized
                      className={
                        aliado.tipo === "PERSONA"
                          ? styles.fotoAliado
                          : styles.logoAliado
                      }
                    />
                  ) : (
                    <div className={styles.logoAliado}>◇</div>
                  )}
                </div>

                <div className={styles.datosAliado}>
                  <h3>{aliado.nombre}</h3>
                  <p>{aliado.descripcion}</p>
                  <span className={styles.etiqueta}>
                    {aliado.tipo === "PERSONA" ? "Persona" : "Organización"}
                  </span>
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
              {aliadoSeleccionado.imagen ? (
                <Image
                  src={aliadoSeleccionado.imagen}
                  alt={`Imagen de ${aliadoSeleccionado.nombre}`}
                  width={180}
                  height={140}
                  unoptimized
                  className={
                    aliadoSeleccionado.tipo === "PERSONA"
                      ? styles.fotoModal
                      : styles.logoModal
                  }
                />
              ) : (
                <div className={styles.logoModal}>◇</div>
              )}
            </div>

            <div className={styles.contenidoModal}>
              <span className={styles.etiqueta}>{aliadoSeleccionado.tipo}</span>

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
