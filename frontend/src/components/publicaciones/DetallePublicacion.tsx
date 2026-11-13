import type { Publicacion } from "@/lib/publicaciones";
import styles from "./DetallePublicacion.module.css";
import Link from "next/link";
import ContenidoPublicacion from "@/components/publicaciones/ContenidoPublicacion";

type DetallePublicacionProps = {
  publicacion: Publicacion;
};

export default function DetallePublicacion({
  publicacion,
}: DetallePublicacionProps) {
  const fechaFormateada = publicacion.fecha
    ? new Date(publicacion.fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Fecha no disponible";

  return (
    <article className={styles.articulo}>
      <header className={styles.encabezado}>
        <Link className={styles.volver} href="/publicaciones">
          ← Volver a publicaciones
        </Link>

        <p className={styles.categoria}>
          {(publicacion.categoria ?? "Sin categoría").toUpperCase()} ·{" "}
          {(publicacion.tipo ?? "Sin tipo").toUpperCase()}
        </p>

        <h1 className={styles.titulo}>{publicacion.titulo}</h1>

        <p className={styles.resumen}>
          {publicacion.resumen ?? "Descripción no disponible."}
        </p>

        <div className={styles.metadatos}>
          <span>Por Redacción</span>
          <span>{fechaFormateada}</span>
          <span>{publicacion.lectura} min de lectura</span>
        </div>
      </header>

      {publicacion.imagen && (
        <figure className={styles.portada}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.imagenPortada}
            src={publicacion.imagen}
            alt={`Imagen ilustrativa de: ${publicacion.titulo}`}
          />
          
        </figure>
      )}

      <div className={styles.contenido}>
        

        <ContenidoPublicacion contenido={publicacion.contenido} />

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
