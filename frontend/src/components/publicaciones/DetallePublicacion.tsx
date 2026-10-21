
import type { Publicacion } from "@/lib/publicaciones";
import styles from "./DetallePublicacion.module.css";

type DetallePublicacionProps = {
    publicacion: Publicacion;
};

export default function DetallePublicacion({
    publicacion,
}: DetallePublicacionProps) {
    const fechaFormateada = new Date(
        `${publicacion.fecha}T12:00:00`,
    ).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <article className={styles.articulo}>
            <header className={styles.encabezado}>
                <a className={styles.volver} href="/publicaciones">
                    ← Volver a publicaciones
                </a>

                <p className={styles.categoria}>
                    {publicacion.categoria.toUpperCase()} · {publicacion.tipo.toUpperCase()}
                </p>

                <h1 className={styles.titulo}>{publicacion.titulo}</h1>

                <p className={styles.resumen}>{publicacion.resumen}</p>

                <div className={styles.metadatos}>
                    <span>Por Redacción</span>
                    <span>{fechaFormateada}</span>
                    <span>{publicacion.lectura} min de lectura</span>
                </div>
            </header>

            <figure className={styles.portada}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles.imagenPortada}
                    src={publicacion.imagen}
                    alt={`Imagen ilustrativa de: ${publicacion.titulo}`}
                />
                <figcaption className={styles.pieImagen}>
                    {publicacion.titulo}
                </figcaption>
            </figure>

            <div className={styles.contenido}>
                <p className={styles.entradilla}>{publicacion.resumen}</p>

                <h2>Contexto</h2>

                <p>
                    En esta sección desarrollaremos los antecedentes de la publicación,
                    explicando el tema, los actores involucrados y su relevancia para
                    la ciudadanía.
                </p>

                <blockquote>
                    La información pública debe presentarse con claridad, contexto
                    y fuentes que permitan verificar los hechos.
                </blockquote>

                <h2>Los datos detrás de la historia</h2>

                <p>
                    Aquí se incorporarán los hallazgos, cifras, documentos y
                    explicaciones correspondientes a esta publicación.
                </p>

                <section className={styles.fuentes}>
                    <h2>Fuentes y referencias</h2>
                    <p>
                        Las fuentes documentales y referencias verificables se agregarán
                        cuando se integre el contenido definitivo.
                    </p>
                </section>

                {publicacion.demo && (
                    <p className={styles.nota}>
                        Contenido de demostración. Este texto no representa una
                        investigación real.
                    </p>
                )}

                <p className={styles.identificador}>
                    Identificador: {publicacion.slug}
                </p>
            </div>
        </article>
    );
}
