"use client";

import styles from "./AlertaEliminacion.module.css";

interface AlertaEliminacionProps {
  abierto: boolean;
  titulo?: string;
  mensaje: string;
  textoCancelar?: string;
  textoConfirmar?: string;
  cargando?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function AlertaEliminacion({
  abierto,
  titulo = "Confirmar eliminación",
  mensaje,
  textoCancelar = "Cancelar",
  textoConfirmar = "Eliminar",
  cargando = false,
  onCancelar,
  onConfirmar,
}: AlertaEliminacionProps) {
  if (!abierto) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !cargando) {
          onCancelar();
        }
      }}
    >
      <section
        className={styles.dialogo}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-alerta"
        aria-describedby="mensaje-alerta"
      >
        <div className={styles.icono}>!</div>

        <h2 id="titulo-alerta" className={styles.titulo}>
          {titulo}
        </h2>

        <p id="mensaje-alerta" className={styles.mensaje}>
          {mensaje}
        </p>

        <div className={styles.botones}>
          <button
            type="button"
            className={styles.botonCancelar}
            onClick={onCancelar}
            disabled={cargando}
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            className={styles.botonConfirmar}
            onClick={onConfirmar}
            disabled={cargando}
          >
            {cargando ? "Eliminando..." : textoConfirmar}
          </button>
        </div>
      </section>
    </div>
  );
}
