"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type TipoNotificacion = "exito" | "error" | "advertencia" | "informacion";

type Notificacion = {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
  duracion: number;
};

type ContextoNotificaciones = {
  mostrarNotificacion: (
    mensaje: string,
    tipo?: TipoNotificacion,
    duracion?: number,
  ) => void;
  ocultarNotificacion: () => void;
};

const NotificacionesContext = createContext<ContextoNotificaciones | null>(
  null,
);

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);

  const mostrarNotificacion = useCallback(
    (mensaje: string, tipo: TipoNotificacion = "exito", duracion = 4000) => {
      setNotificacion({
        id: Date.now(),
        mensaje,
        tipo,
        duracion,
      });
    },
    [],
  );

  const ocultarNotificacion = useCallback(() => {
    setNotificacion(null);
  }, []);

  useEffect(() => {
    if (!notificacion) return;

    const temporizador = setTimeout(() => {
      setNotificacion(null);
    }, notificacion.duracion);

    return () => clearTimeout(temporizador);
  }, [notificacion]);

  const estilos = {
    exito: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    advertencia: "border-yellow-200 bg-yellow-50 text-yellow-800",
    informacion: "border-blue-200 bg-blue-50 text-blue-800",
  };

  const iconos = {
    exito: "✓",
    error: "✕",
    advertencia: "!",
    informacion: "i",
  };

  return (
    <NotificacionesContext.Provider
      value={{ mostrarNotificacion, ocultarNotificacion }}
    >
      {children}

      {notificacion && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg ${estilos[notificacion.tipo]}`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current font-bold">
            {iconos[notificacion.tipo]}
          </span>

          <p className="flex-1 text-sm font-medium">{notificacion.mensaje}</p>

          <button
            type="button"
            onClick={ocultarNotificacion}
            aria-label="Cerrar notificación"
            className="rounded p-1 text-current opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const contexto = useContext(NotificacionesContext);

  if (!contexto) {
    throw new Error(
      "useNotificaciones debe utilizarse dentro de NotificacionesProvider.",
    );
  }

  return contexto;
}
